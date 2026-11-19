from pathlib import Path
import json
import pandas as pd

SOURCE = Path("data/canonical/intelligence_data.csv")
OUTPUT = Path("data-science/outputs/canonical_profile.json")


def main():
    df = pd.read_csv(SOURCE)
    dates = pd.to_datetime(df["observed_at"], errors="coerce", utc=True)
    metrics = pd.to_numeric(df["metric_value"], errors="coerce")
    lats = pd.to_numeric(df["latitude"], errors="coerce")
    lons = pd.to_numeric(df["longitude"], errors="coerce")
    texts = df["text_value"].dropna().astype(str)

    metric_breakdown = {}
    for m_name, grp in df.groupby("metric_name"):
        vals = pd.to_numeric(grp["metric_value"], errors="coerce").dropna()
        metric_breakdown[str(m_name)] = {
            "count": int(len(vals)),
            "units": sorted(grp["metric_unit"].dropna().astype(str).unique().tolist()),
            "min": float(vals.min()),
            "max": float(vals.max()),
            "mean": round(float(vals.mean()), 2),
            "median": float(vals.median()),
            "std": round(float(vals.std()), 2),
        }

    profile = {
        "dataset_structure": {
            "record_count": int(len(df)),
            "column_count": int(len(df.columns)),
            "file_size_mb": round(SOURCE.stat().st_size / 1048576, 3),
            "data_version": str(df["data_version"].iloc[0]),
            "record_type_distribution": df["record_type"].value_counts(dropna=False).to_dict(),
            "unique_entity_count": int(df["entity_id"].nunique(dropna=True)),
            "unique_related_entity_count": int(df["related_entity_id"].nunique(dropna=True)),
            "source_distribution": df["source_name"].value_counts(dropna=False).to_dict(),
            "synthetic_count": int((df["is_synthetic"] == True).sum()),
            "non_synthetic_count": int((df["is_synthetic"] == False).sum()),
        },
        "field_completeness": {
            col: {
                "dtype": str(df[col].dtype),
                "non_null_count": int(df[col].notna().sum()),
                "null_count": int(df[col].isna().sum()),
                "null_percentage": round(float(df[col].isna().mean() * 100), 2),
                "unique_count": int(df[col].nunique(dropna=True)),
                "examples": df[col].dropna().astype(str).head(3).tolist(),
            }
            for col in df.columns
        },
        "numerical_coverage": {
            "non_null_count": int(metrics.notna().sum()),
            "invalid_or_infinite_count": int((~metrics.map(pd.notna)).sum()),
            "overall_min": float(metrics.min()),
            "overall_max": float(metrics.max()),
            "overall_mean": round(float(metrics.mean()), 2),
            "overall_median": float(metrics.median()),
            "overall_std": round(float(metrics.std()), 2),
            "by_metric_name": metric_breakdown,
        },
        "temporal_coverage": {
            "parse_success_rate_pct": round(float(dates.notna().mean() * 100), 2),
            "earliest": dates.min().isoformat(),
            "latest": dates.max().isoformat(),
            "unique_dates": int(dates.dt.date.nunique()),
            "unique_years": sorted(dates.dt.year.unique().tolist()),
            "records_by_year": dates.dt.year.value_counts().sort_index().to_dict(),
            "records_by_year_and_record_type": {
                rt: dates[df["record_type"] == rt].dt.year.value_counts().sort_index().to_dict()
                for rt in df["record_type"].unique()
            },
        },
        "category_and_status_coverage": {
            "category_distribution": df["category"].value_counts().to_dict(),
            "subcategory_top_15": df["subcategory"].value_counts().head(15).to_dict(),
            "status_distribution": df["status"].value_counts().to_dict(),
            "stage_distribution": df["stage"].value_counts().to_dict(),
        },
        "geographic_coverage": {
            "valid_coordinate_count": int((lats.between(-90, 90) & lons.between(-180, 180)).sum()),
            "null_coordinate_count": int((lats.isna() | lons.isna()).sum()),
            "latitude_range": [float(lats.min()), float(lats.max())],
            "longitude_range": [float(lons.min()), float(lons.max())],
            "unique_coordinate_pairs": int(df.dropna(subset=["latitude", "longitude"])[["latitude", "longitude"]].drop_duplicates().shape[0]),
        },
        "text_coverage": {
            "non_null_count": int(len(texts)),
            "avg_length": round(float(texts.str.len().mean()), 2),
            "max_length": int(texts.str.len().max()),
            "empty_or_whitespace_count": int((texts.str.strip() == "").sum()),
            "truncated_at_500_count": int((texts.str.len() == 500).sum()),
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(profile, indent=2), encoding="utf-8")
    print(f"Canonical profile written to {OUTPUT}")


if __name__ == "__main__":
    main()