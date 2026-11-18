from pathlib import Path
import json
import shutil
import pandas as pd

SOURCE = Path("data/canonical/intelligence_data.csv")
OUTPUT = Path("data/published/intelligence_data.json")
PUBLIC_COPY = Path("public/data/intelligence_data.json")


def main():
    df = pd.read_csv(SOURCE)
    records = df.where(pd.notna(df), None).to_dict(orient="records")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(records, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUTPUT, PUBLIC_COPY)
    print(f"Published {len(records)} records to {OUTPUT} and {PUBLIC_COPY}")


if __name__ == "__main__":
    main()