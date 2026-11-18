from pathlib import Path
import pandas as pd

INPUT = Path("data/source-sample/source_sample.csv")
OUTPUT = Path("data/canonical/intelligence_data.csv")
DATA_VERSION = "1.0.0"

MANDATORY_COLUMNS = [
    "record_id", "record_type", "observed_at", "entity_id",
    "related_entity_id", "entity_name", "category", "subcategory",
    "status", "stage", "metric_name", "metric_value", "metric_unit",
    "text_value", "latitude", "longitude", "source_name",
    "source_record_id", "is_synthetic", "data_version",
]

STATE_COORDS = {
    "US": (39.8283, -98.5795), "AL": (32.3182, -86.9023), "AK": (64.2008, -149.4937),
    "AZ": (34.0489, -111.0937), "AR": (35.2010, -91.8318), "CA": (36.7783, -119.4179),
    "CO": (39.5501, -105.7821), "CT": (41.6032, -73.0877), "DE": (38.9108, -75.5277),
    "FL": (27.6648, -81.5158), "GA": (32.1656, -82.9001), "HI": (19.8968, -155.5828),
    "ID": (44.0682, -114.7420), "IL": (40.6331, -89.3985), "IN": (40.2672, -86.1349),
    "IA": (41.8780, -93.0977), "KS": (39.0119, -98.4842), "KY": (37.8393, -84.2700),
    "LA": (30.9843, -91.9623), "ME": (45.2538, -69.4455), "MD": (39.0458, -76.6413),
    "MA": (42.4072, -71.3824), "MI": (44.3148, -85.6024), "MN": (46.7296, -94.6859),
    "MS": (32.3547, -89.3985), "MO": (37.9643, -91.8318), "MT": (46.8797, -110.3626),
    "NE": (41.4925, -99.9018), "NV": (38.8026, -116.4194), "NH": (43.1939, -71.5724),
    "NJ": (40.0583, -74.4057), "NM": (34.5199, -105.8701), "NY": (43.2994, -74.2179),
    "NC": (35.7596, -79.0193), "ND": (47.5515, -101.0020), "OH": (40.4173, -82.9071),
    "OK": (35.0078, -97.0929), "OR": (43.8041, -120.5542), "PA": (41.2033, -77.1945),
    "RI": (41.5801, -71.4774), "SC": (33.8361, -81.1637), "SD": (43.9695, -99.9018),
    "TN": (35.5175, -86.5804), "TX": (31.9686, -99.9018), "UT": (39.3210, -111.0937),
    "VT": (44.5588, -72.5778), "VA": (37.4316, -78.6569), "WA": (47.7511, -120.7401),
    "WV": (38.5976, -80.4549), "WI": (43.7844, -88.7879), "WY": (43.0760, -107.2903),
}


def normalize_fuel(raw_fuel: str) -> str:
    if not raw_fuel or pd.isna(raw_fuel):
        return "other"
    val = str(raw_fuel).strip().lower()
    if "nuclear" in val or val == "nuc":
        return "nuclear"
    if "hydro" in val or val in {"wat", "hyc", "hps"}:
        return "hydro"
    if "natural gas" in val or val == "ng":
        return "natural_gas"
    if "solar" in val or val in {"sun", "spv", "sth"}:
        return "solar"
    if "wind" in val or val == "wnd":
        return "wind"
    if "coal" in val or val == "col":
        return "coal"
    if "geothermal" in val or val == "geo":
        return "geothermal"
    if "petroleum" in val or val in {"pel", "pc", "oil"}:
        return "petroleum"
    if "biomass" in val or "wood" in val or val in {"www", "was", "bio"}:
        return "biomass"
    return "other"


def main():
    src = pd.read_csv(INPUT, dtype=str)
    rows = []

    for idx, r in src.iterrows():
        origin = r.get("origin_source", "")
        if origin == "PLANTS_DATA_TS":
            fuel_raw = r.get("fuel", "")
            cap = pd.to_numeric(r.get("capacityMW"), errors="coerce")
            region_slug = str(r.get("region", "")).strip().lower().replace(" / ", "_").replace(" ", "_").replace("-", "_")
            rows.append({
                "record_id": f"PLANT-{int(r['id']):04d}",
                "record_type": "entity",
                "observed_at": "2026-01-01T00:00:00Z",
                "entity_id": f"PLANT-{r['id']}",
                "related_entity_id": region_slug,
                "entity_name": str(r.get("name", "")).strip(),
                "category": normalize_fuel(fuel_raw),
                "subcategory": region_slug,
                "status": str(r.get("status", "unknown")).strip().lower(),
                "stage": "operational",
                "metric_name": "nameplate_capacity",
                "metric_value": cap,
                "metric_unit": "MW",
                "text_value": f"{r.get('name')} ({r.get('region')}): {cap} MW {fuel_raw} facility"[:500],
                "latitude": pd.to_numeric(r.get("lat"), errors="coerce"),
                "longitude": pd.to_numeric(r.get("lng"), errors="coerce"),
                "source_name": "PLANTS_DATA_TS",
                "source_record_id": str(r.get("id", "")),
                "is_synthetic": False,
                "data_version": DATA_VERSION,
            })
        else:
            period = str(r.get("period", "2023")).strip()
            observed_at = f"{period[:4]}-01-01T00:00:00Z" if len(period) >= 4 else ""
            loc = str(r.get("location", "US")).strip().upper()
            loc_desc = str(r.get("stateDescription", loc)).strip()
            fuel_code = str(r.get("fueltypeid", "ALL")).strip().upper()
            fuel_desc = str(r.get("fuelTypeDescription", fuel_code)).strip()
            gen_val = pd.to_numeric(r.get("generation"), errors="coerce")
            gen_unit = str(r.get("generation-units", "thousand megawatthours")).strip()
            lat, lon = STATE_COORDS.get(loc, (None, None))
            status = "unknown" if pd.isna(gen_val) else ("active" if gen_val > 0 else "offline")

            rows.append({
                "record_id": f"EIA-{idx+1:05d}",
                "record_type": "measurement",
                "observed_at": observed_at,
                "entity_id": f"US-{loc}" if loc != "US" else "US",
                "related_entity_id": "" if loc == "US" else "US",
                "entity_name": loc_desc,
                "category": normalize_fuel(fuel_desc if fuel_desc else fuel_code),
                "subcategory": fuel_code.lower(),
                "status": status,
                "stage": "annual",
                "metric_name": "net_generation",
                "metric_value": gen_val,
                "metric_unit": "thousand_MWh" if "thousand" in gen_unit.lower() else "MWh",
                "text_value": f"{loc_desc} ({period}) {fuel_desc}: {gen_val} {gen_unit}"[:500],
                "latitude": lat,
                "longitude": lon,
                "source_name": "EIA_API_v2",
                "source_record_id": f"{period}_{loc}_{fuel_code}",
                "is_synthetic": False,
                "data_version": DATA_VERSION,
            })

    canonical = pd.DataFrame(rows).reindex(columns=MANDATORY_COLUMNS)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canonical.to_csv(OUTPUT, index=False, encoding="utf-8")
    print(f"Standardized {len(canonical)} rows into {OUTPUT}")


if __name__ == "__main__":
    main()