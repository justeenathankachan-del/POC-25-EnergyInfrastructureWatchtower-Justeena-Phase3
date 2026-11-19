from pathlib import Path
import json
import pandas as pd

DATA_DIR = Path("data")
SAMPLE = DATA_DIR / "source-sample" / "source_sample.csv"
CANONICAL = DATA_DIR / "canonical" / "intelligence_data.csv"
PUBLISHED = DATA_DIR / "published" / "intelligence_data.json"
PUBLIC_PUBLISHED = Path("public/data/intelligence_data.json")
MANIFEST = DATA_DIR / "manifest.json"
SCHEMA = DATA_DIR / "schema.json"
PROFILE = DATA_DIR / "quality" / "data_profile.json"
REPORT = DATA_DIR / "quality" / "validation_report.json"

MAX_DATA_MB = 10
MAX_FILE_MB = 5
MAX_ROWS = 10_000
MAX_COLS = 50

MANDATORY_COLUMNS = [
    "record_id", "record_type", "observed_at", "entity_id",
    "related_entity_id", "entity_name", "category", "subcategory",
    "status", "stage", "metric_name", "metric_value", "metric_unit",
    "text_value", "latitude", "longitude", "source_name",
    "source_record_id", "is_synthetic", "data_version",
]


def main():
    errors = []
    for path in [DATA_DIR / "README.md", MANIFEST, SCHEMA, SAMPLE, CANONICAL, PUBLISHED]:
        if not path.exists():
            errors.append(f"Missing required path: {path}")

    committed_files = [
        p for p in DATA_DIR.rglob("*")
        if p.is_file() and p.name != "raw_combined_extract.csv"
    ]
    total_bytes = sum(p.stat().st_size for p in committed_files)
    if total_bytes > MAX_DATA_MB * 1024 * 1024:
        errors.append(f"Total committed /data size ({total_bytes / 1024 / 1024:.2f} MB) exceeds 10 MB")

    df = None
    if CANONICAL.exists():
        if CANONICAL.stat().st_size > MAX_FILE_MB * 1024 * 1024:
            errors.append("Canonical CSV exceeds 5 MB")

        df = pd.read_csv(CANONICAL)
        if len(df) > MAX_ROWS:
            errors.append(f"Canonical row count ({len(df)}) exceeds {MAX_ROWS}")
        if len(df.columns) > MAX_COLS:
            errors.append(f"Canonical column count ({len(df.columns)}) exceeds {MAX_COLS}")
        if list(df.columns[:len(MANDATORY_COLUMNS)]) != MANDATORY_COLUMNS:
            errors.append("Mandatory columns are missing or out of order")
        if df["record_id"].isna().any() or df["record_id"].duplicated().any():
            errors.append("record_id must be non-null and unique")

        for req in ["record_type", "source_name", "is_synthetic", "data_version"]:
            if df[req].isna().any():
                errors.append(f"{req} contains missing values")

        parsed_dates = pd.to_datetime(df["observed_at"], format="%Y-%m-%dT%H:%M:%SZ", errors="coerce")
        if parsed_dates.isna().any():
            errors.append("observed_at contains invalid ISO-8601 UTC timestamps")

        if not pd.api.types.is_numeric_dtype(df["metric_value"]):
            errors.append("metric_value must be numeric")

        if not set(df["is_synthetic"].dropna().unique()).issubset({True, False}):
            errors.append("is_synthetic must contain only boolean true/false values")

        if df["text_value"].dropna().astype(str).str.len().max() > 500:
            errors.append("text_value exceeds 500 characters")

        # Schema enum consistency check
        if SCHEMA.exists():
            schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
            if list(schema.keys()) != list(df.columns):
                errors.append("schema.json keys do not match canonical CSV columns")
            for col, rules in schema.items():
                if "allowed_values" in rules and col in df.columns:
                    invalid_vals = set(df[col].dropna().astype(str).unique()) - set(rules["allowed_values"])
                    if invalid_vals:
                        errors.append(f"Column {col} has values outside schema allowed_values: {invalid_vals}")

        # Published JSON consistency & stale output check
        if PUBLISHED.exists():
            if PUBLISHED.stat().st_size > MAX_FILE_MB * 1024 * 1024:
                errors.append("Published JSON exceeds 5 MB")
            if PUBLISHED.stat().st_mtime < CANONICAL.stat().st_mtime:
                errors.append("Stale output: published/intelligence_data.json is older than canonical CSV")
            pub_records = json.loads(PUBLISHED.read_text(encoding="utf-8"))
            if len(pub_records) != len(df):
                errors.append(f"Published JSON count ({len(pub_records)}) != canonical CSV ({len(df)})")
            if pub_records and list(pub_records[0].keys()) != list(df.columns):
                errors.append("Published JSON keys do not match canonical CSV columns")
            if PUBLIC_PUBLISHED.exists():
                public_records = json.loads(PUBLIC_PUBLISHED.read_text(encoding="utf-8"))
                if len(public_records) != len(pub_records):
                    errors.append("public/data/intelligence_data.json is out of sync with data/published/intelligence_data.json")

        # Manifest consistency check
        if MANIFEST.exists():
            manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
            if manifest.get("canonical_record_count") != len(df):
                errors.append(
                    f"manifest.json canonical_record_count ({manifest.get('canonical_record_count')}) != CSV ({len(df)})"
                )
            if manifest.get("data_version") != str(df["data_version"].iloc[0]):
                errors.append("manifest.json data_version does not match CSV")

        profile_data = {
            "row_count": int(len(df)),
            "column_count": int(len(df.columns)),
            "data_version": str(df["data_version"].iloc[0]),
            "null_counts": {col: int(df[col].isna().sum()) for col in df.columns},
            "record_type_distribution": df["record_type"].value_counts().to_dict(),
            "source_distribution": df["source_name"].value_counts().to_dict(),
            "category_distribution": df["category"].value_counts().to_dict(),
            "status_distribution": df["status"].value_counts().to_dict(),
            "observed_at_range": {
                "min": str(df["observed_at"].min()),
                "max": str(df["observed_at"].max()),
            },
            "metric_value_summary": {
                "min": float(df["metric_value"].min()),
                "max": float(df["metric_value"].max()),
                "mean": round(float(df["metric_value"].mean()), 2),
                "median": float(df["metric_value"].median()),
            },
        }
        PROFILE.parent.mkdir(parents=True, exist_ok=True)
        PROFILE.write_text(json.dumps(profile_data, indent=2), encoding="utf-8")

    result = {
        "status": "PASS" if not errors else "FAIL",
        "errors": errors,
        "data_version": str(df["data_version"].iloc[0]) if df is not None else "unknown",
        "total_data_size_mb": round(total_bytes / 1024 / 1024, 3),
        "canonical_rows": int(len(df)) if df is not None else 0,
        "canonical_columns": int(len(df.columns)) if df is not None else 0,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(result, indent=2), encoding="utf-8")

    if errors:
        raise SystemExit("\n".join(errors))
    print("Canonical data validation passed: PASS (v1.0.1)")


if __name__ == "__main__":
    main()