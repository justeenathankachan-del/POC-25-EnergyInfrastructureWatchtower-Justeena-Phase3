from pathlib import Path
import numpy as np
import pandas as pd

MIN_GROUP_SIZE = 5
METHOD_VERSION = "1.0.0"


def compute_baseline(df: pd.DataFrame) -> dict:
    """Simple baseline: unpartitioned category-level totals and averages across all records."""
    grouped = (
        df.dropna(subset=["category", "metric_value"])
        .groupby("category", as_index=False)
        .agg(
            record_count=("record_id", "count"),
            mean_metric_value=("metric_value", "mean"),
            total_metric_value=("metric_value", "sum"),
        )
    )
    grouped["baseline_rank"] = grouped["total_metric_value"].rank(method="dense", ascending=False).astype(int)
    grouped = grouped.sort_values(["baseline_rank", "category"])
    return {
        "baseline_name": "Unstratified Category Total & Mean Ranking",
        "warning": "Baseline mixes MW capacity and thousand_MWh generation on the same scale, demonstrating why record_type partitioning is required.",
        "categories": grouped.round(3).to_dict(orient="records"),
    }


def compute_comparative_intelligence(df: pd.DataFrame) -> dict:
    """
    Track A — Comparative Intelligence (v1.0.0)
    Strictly separates:
      1) Global Power Plant Entities (record_type == 'entity', nameplate_capacity in MW)
      2) U.S. Annual Utility Generation Measurements (record_type == 'measurement', net_generation in thousand_MWh)
    """
    entities = df[df["record_type"] == "entity"].copy()
    measurements = df[df["record_type"] == "measurement"].copy()
    measurements["year"] = pd.to_datetime(measurements["observed_at"], utc=True).dt.year

    # --- Dimension 1: Global Power Plant Capacity by Grid Region (MW) ---
    total_global_mw = float(entities["metric_value"].sum())
    region_comp = (
        entities.groupby("subcategory", as_index=False)
        .agg(
            plant_count=("record_id", "count"),
            total_capacity_mw=("metric_value", "sum"),
            mean_capacity_mw=("metric_value", "mean"),
            median_capacity_mw=("metric_value", "median"),
            max_capacity_mw=("metric_value", "max"),
            maintenance_plants=("status", lambda s: int((s == "maintenance").sum())),
            maintenance_mw=("metric_value", lambda s: float(s[entities.loc[s.index, "status"] == "maintenance"].sum())),
        )
    )
    region_comp["capacity_share_pct"] = (region_comp["total_capacity_mw"] / total_global_mw * 100).round(2)
    region_comp["maintenance_share_pct"] = np.where(
        region_comp["total_capacity_mw"] > 0,
        (region_comp["maintenance_mw"] / region_comp["total_capacity_mw"] * 100).round(2),
        0.0,
    )
    region_comp["meets_min_group_size"] = region_comp["plant_count"] >= MIN_GROUP_SIZE
    region_comp["rank"] = region_comp["total_capacity_mw"].rank(method="dense", ascending=False).astype(int)
    region_comp = region_comp.sort_values(["rank", "subcategory"])
    region_hhi = round(float(((region_comp["capacity_share_pct"]) ** 2).sum()), 2)

    # --- Dimension 2: Global Power Plant Capacity by Fuel Category (MW) ---
    plant_fuel_comp = (
        entities.groupby("category", as_index=False)
        .agg(
            plant_count=("record_id", "count"),
            total_capacity_mw=("metric_value", "sum"),
            mean_capacity_mw=("metric_value", "mean"),
            median_capacity_mw=("metric_value", "median"),
        )
    )
    plant_fuel_comp["capacity_share_pct"] = (plant_fuel_comp["total_capacity_mw"] / total_global_mw * 100).round(2)
    plant_fuel_comp["meets_min_group_size"] = plant_fuel_comp["plant_count"] >= MIN_GROUP_SIZE
    plant_fuel_comp["rank"] = plant_fuel_comp["total_capacity_mw"].rank(method="dense", ascending=False).astype(int)
    plant_fuel_comp = plant_fuel_comp.sort_values(["rank", "category"])

    # --- Dimension 3: U.S. Annual Net Generation by Fuel Category (thousand_MWh) ---
    total_us_gen = float(measurements["metric_value"].sum())
    us_fuel_comp = (
        measurements.groupby("category", as_index=False)
        .agg(
            record_count=("record_id", "count"),
            total_generation_thousand_mwh=("metric_value", "sum"),
            mean_generation_thousand_mwh=("metric_value", "mean"),
            median_generation_thousand_mwh=("metric_value", "median"),
            active_series_count=("status", lambda s: int((s == "active").sum())),
            offline_or_negative_count=("status", lambda s: int((s == "offline").sum())),
        )
    )
    us_fuel_comp["generation_share_pct"] = (us_fuel_comp["total_generation_thousand_mwh"] / total_us_gen * 100).round(2)
    us_fuel_comp["meets_min_group_size"] = us_fuel_comp["record_count"] >= MIN_GROUP_SIZE
    us_fuel_comp["rank"] = us_fuel_comp["total_generation_thousand_mwh"].rank(method="dense", ascending=False).astype(int)
    us_fuel_comp = us_fuel_comp.sort_values(["rank", "category"])
    us_fuel_hhi = round(float(((us_fuel_comp["generation_share_pct"]) ** 2).sum()), 2)

    # --- Dimension 4: U.S. 2024 Single-Year Benchmark (Latest Complete Reporting Year, n=1,449) ---
    m_2024 = measurements[measurements["year"] == 2024]
    total_2024_gen = float(m_2024["metric_value"].sum())
    us_2024_comp = (
        m_2024.groupby("category", as_index=False)
        .agg(
            record_count=("record_id", "count"),
            total_2024_thousand_mwh=("metric_value", "sum"),
            mean_2024_thousand_mwh=("metric_value", "mean"),
            median_2024_thousand_mwh=("metric_value", "median"),
        )
    )
    us_2024_comp["share_2024_pct"] = (us_2024_comp["total_2024_thousand_mwh"] / total_2024_gen * 100).round(2)
    us_2024_comp["meets_min_group_size"] = us_2024_comp["record_count"] >= MIN_GROUP_SIZE
    us_2024_comp["rank"] = us_2024_comp["total_2024_thousand_mwh"].rank(method="dense", ascending=False).astype(int)
    us_2024_comp = us_2024_comp.sort_values(["rank", "category"])

    # --- Dimension 5: Curated Baseline Maintenance Exposure Ranking (Global Entities, MW) ---
    maint_plants = entities[entities["status"] == "maintenance"].copy()
    maint_plants["rank"] = maint_plants["metric_value"].rank(method="dense", ascending=False).astype(int)
    maint_plants = maint_plants.sort_values(["rank", "entity_id"])

    return {
        "min_group_size": MIN_GROUP_SIZE,
        "global_entity_summary": {
            "total_plants": int(len(entities)),
            "total_capacity_mw": round(total_global_mw, 2),
            "region_hhi": region_hhi,
            "by_region": region_comp.round(2).to_dict(orient="records"),
            "by_fuel": plant_fuel_comp.round(2).to_dict(orient="records"),
            "maintenance_baseline_queue": maint_plants[
                ["record_id", "entity_id", "entity_name", "category", "subcategory", "metric_value", "rank"]
            ].rename(columns={"metric_value": "capacity_mw", "subcategory": "region"}).to_dict(orient="records"),
        },
        "us_generation_summary": {
            "total_records": int(len(measurements)),
            "total_generation_thousand_mwh": round(total_us_gen, 3),
            "fuel_hhi": us_fuel_hhi,
            "by_fuel_all_years": us_fuel_comp.round(3).to_dict(orient="records"),
            "by_fuel_2024_benchmark": us_2024_comp.round(3).to_dict(orient="records"),
        },
    }