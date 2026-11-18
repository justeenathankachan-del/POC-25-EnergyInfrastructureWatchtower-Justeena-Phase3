import os
import re
from pathlib import Path
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

API_KEY = os.getenv("EIA_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing EIA_API_KEY in .env.local or environment variables.")

EIA_URL = "https://api.eia.gov/v2/electricity/electric-power-operational-data/data/"
PLANTS_TS = Path("app/plantsData.ts")
RAW_OUTPUT = Path("data/source-sample/raw_combined_extract.csv")


def extract_eia_data() -> pd.DataFrame:
    params = {
        "api_key": API_KEY,
        "frequency": "annual",
        "data[0]": "generation",
        "facets[sectorid][]": "1",
        "start": "2018",
        "end": "2024",
        "sort[0][column]": "period",
        "sort[0][direction]": "desc",
        "length": 5000,
    }
    resp = requests.get(EIA_URL, params=params, timeout=30)
    resp.raise_for_status()
    rows = resp.json().get("response", {}).get("data", [])
    df = pd.DataFrame(rows)
    df["origin_source"] = "EIA_API_v2"
    return df


def extract_plants_data() -> pd.DataFrame:
    text = PLANTS_TS.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{\s*id:\s*"(?P<id>[^"]+)",\s*name:\s*"(?P<name>[^"]+)",\s*fuel:\s*"(?P<fuel>[^"]+)",\s*'
        r'capacityMW:\s*(?P<capacityMW>[0-9.]+),\s*lat:\s*(?P<lat>-?[0-9.]+),\s*lng:\s*(?P<lng>-?[0-9.]+),\s*'
        r'region:\s*"(?P<region>[^"]+)",\s*status:\s*"(?P<status>[^"]+)"\s*\}'
    )
    records = [m.groupdict() for m in pattern.finditer(text)]
    df = pd.DataFrame(records)
    df["origin_source"] = "PLANTS_DATA_TS"
    return df


def main():
    eia_df = extract_eia_data()
    plants_df = extract_plants_data()
    combined = pd.concat([plants_df, eia_df], ignore_index=True)

    RAW_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    combined.to_csv(RAW_OUTPUT, index=False, encoding="utf-8")
    print(
        f"Extracted {len(plants_df)} plant entities + {len(eia_df)} EIA records "
        f"= {len(combined)} total raw rows to {RAW_OUTPUT}"
    )


if __name__ == "__main__":
    main()