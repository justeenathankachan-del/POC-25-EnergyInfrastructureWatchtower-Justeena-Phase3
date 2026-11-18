from pathlib import Path
import pandas as pd

RANDOM_SEED = 42
MAX_ROWS = 2500

RAW_INPUT = Path("data/source-sample/raw_combined_extract.csv")
SAMPLE_OUTPUT = Path("data/source-sample/source_sample.csv")


def main():
    df = pd.read_csv(RAW_INPUT, dtype=str)
    df = df.drop_duplicates().reset_index(drop=True)

    plants = df[df["origin_source"] == "PLANTS_DATA_TS"].copy()
    eia = df[df["origin_source"] == "EIA_API_v2"].copy()

    target_eia = max(1, MAX_ROWS - len(plants))
    strata = [c for c in ["location", "fueltypeid"] if c in eia.columns]

    if len(eia) <= target_eia:
        eia_sample = eia
    elif strata:
        eia_sample = (
            eia.groupby(strata, dropna=False, group_keys=False)
            .apply(
                lambda g: g.sample(
                    n=max(1, round(len(g) / len(eia) * target_eia)),
                    random_state=RANDOM_SEED,
                )
            )
            .head(target_eia)
            .reset_index(drop=True)
        )
    else:
        eia_sample = eia.sample(n=target_eia, random_state=RANDOM_SEED).reset_index(drop=True)

    sample = pd.concat([plants, eia_sample], ignore_index=True)
    SAMPLE_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sample.to_csv(SAMPLE_OUTPUT, index=False, encoding="utf-8")
    print(f"Saved {len(sample)} representative rows ({len(plants)} plants + {len(eia_sample)} EIA) to {SAMPLE_OUTPUT}")


if __name__ == "__main__":
    main()