"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PLANTS_DATA, PowerPlant } from "./plantsData";

const PowerPlantMap = dynamic(() => import("./PowerPlantMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-[#06110D] text-emerald-400 text-xs font-mono">
      Initializing Cinematic Grid Stage...
    </div>
  ),
});

export default function EnergyWatchtowerDashboard() {
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [eiaStatus, setEiaStatus] = useState<"Live" | "Cached">("Cached");

  useEffect(() => {
    fetch("/api/eia")
      .then((res) => {
        if (res.ok) setEiaStatus("Live");
      })
      .catch(() => setEiaStatus("Cached"));
  }, []);

  const fuelBreakdown = [
    { name: "Natural Gas", pct: 40.9, color: "#34D399" },
    { name: "Coal", pct: 23.7, color: "#F59E0B" },
    { name: "Nuclear", pct: 20.2, color: "#38BDF8" },
    { name: "Hydro", pct: 10.0, color: "#2DD4BF" },
    { name: "Wind", pct: 3.7, color: "#10B981" },
    { name: "Solar", pct: 1.0, color: "#FACC15" },
    { name: "Geothermal", pct: 0.3, color: "#A78BFA" },
    { name: "Biomass", pct: 0.2, color: "#FB7185" },
  ];

  const handleSelectPlant = (plant: PowerPlant) => {
    setSelectedPlant(plant);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedPlant(null);
  };

  const handleDownloadCSV = () => {
    const headers =
      "ID,Plant_Name,Fuel_Type,Capacity_MW,Region,Status,Latitude,Longitude\n";
    const rows = PLANTS_DATA.map(
      (p) =>
        `${p.id},"${p.name}","${p.fuel}",${p.capacityMW},"${p.region}","${p.status}",${p.lat},${p.lng}`
    ).join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "POC25_Energy_Watchtower_Global_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleCount = PLANTS_DATA.filter(
    (p) =>
      (selectedFuel === "All" || p.fuel === selectedFuel) &&
      (selectedRegion === "All" || p.region === selectedRegion)
  ).length;

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-950/95 px-4 py-2 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="font-mono text-cyan-400">POC-25 • Operational Grid &amp; Plant Watchtower</span>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded border border-cyan-500/50 bg-cyan-500/15 px-2.5 py-1 font-semibold text-cyan-300">Operational View</a>
            <a href="/data-intelligence" className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-medium text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300">Data Intelligence →</a>
          </div>
        </div>
      </div>
    <div className="relative h-screen w-screen overflow-hidden bg-[#06110D] text-emerald-50 font-sans select-none">
      {/* 100% Full-Screen Map Stage */}
      <div className="absolute inset-0 z-0">
        <PowerPlantMap
          selectedFuel={selectedFuel}
          selectedRegion={selectedRegion}
          selectedPlant={selectedPlant}
          onSelectPlant={handleSelectPlant}
        />
      </div>

      {/* Minimalist Transparent Top Header + (i) Icon */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3.5 bg-gradient-to-b from-[#06110D]/95 via-[#06110D]/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#10B981]" />
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wide text-white">
              Infocreon Internship - Energy Infrastructure Watchtower
            </h1>
            <p className="text-[11px] text-emerald-300/75 font-mono hidden sm:block">
              POC-25 • Global Grid Telemetry & EIA Generation Intelligence ({eiaStatus} Feed)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pointer-events-auto">
          {!isPanelOpen && (
            <button
              onClick={() => setIsPanelOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#0B1B15]/90 border border-[#1A332A] hover:border-emerald-400/60 text-emerald-300 text-xs font-mono tracking-wide backdrop-blur-md transition-all cursor-pointer shadow-lg"
            >
              Grid Intelligence ▸
            </button>
          )}

          <button
            onClick={() => setIsInfoOpen(true)}
            aria-label="Developer Signature & Platform Metadata"
            title="Platform & Architect Metadata"
            className="w-8 h-8 rounded-full bg-[#0B1B15]/90 border border-[#1A332A] hover:border-emerald-400 hover:text-emerald-300 text-slate-200 flex items-center justify-center text-xs font-serif italic font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg"
          >
            i
          </button>
        </div>
      </header>

      {/* Floating Filter & Status Bar */}
      <div className="absolute top-16 left-5 z-10 flex flex-wrap items-center gap-2.5 max-w-[92vw] pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0B1B15]/90 border border-[#1A332A] rounded-lg px-3 py-1.5 backdrop-blur-md shadow-lg">
          <span className="text-[10px] font-mono uppercase text-emerald-400">Fuel</span>
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0B1B15]">All Fuels</option>
            <option value="Nuclear" className="bg-[#0B1B15]">Nuclear</option>
            <option value="Hydro" className="bg-[#0B1B15]">Hydro</option>
            <option value="Natural Gas" className="bg-[#0B1B15]">Natural Gas</option>
            <option value="Solar" className="bg-[#0B1B15]">Solar</option>
            <option value="Wind" className="bg-[#0B1B15]">Wind</option>
            <option value="Coal" className="bg-[#0B1B15]">Coal</option>
            <option value="Geothermal" className="bg-[#0B1B15]">Geothermal</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#0B1B15]/90 border border-[#1A332A] rounded-lg px-3 py-1.5 backdrop-blur-md shadow-lg">
          <span className="text-[10px] font-mono uppercase text-emerald-400">Region</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0B1B15]">All Regions</option>
            <option value="West" className="bg-[#0B1B15]">U.S. West</option>
            <option value="Northwest" className="bg-[#0B1B15]">U.S. Northwest</option>
            <option value="Southwest" className="bg-[#0B1B15]">U.S. Southwest</option>
            <option value="Texas / Gulf" className="bg-[#0B1B15]">Texas / Gulf</option>
            <option value="Southeast" className="bg-[#0B1B15]">U.S. Southeast</option>
            <option value="Northeast" className="bg-[#0B1B15]">U.S. Northeast</option>
            <option value="South America" className="bg-[#0B1B15]">South America</option>
            <option value="Europe" className="bg-[#0B1B15]">Europe</option>
            <option value="Middle East & Africa" className="bg-[#0B1B15]">Middle East & Africa</option>
            <option value="Asia-Pacific" className="bg-[#0B1B15]">Asia-Pacific</option>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-[#0B1B15]/90 border border-[#1A332A] rounded-lg px-3 py-1.5 backdrop-blur-md text-[11px] shadow-lg">
          <span className="text-slate-300 font-mono">
            Active Nodes: <strong className="text-emerald-400">{visibleCount}</strong>
          </span>
          <span className="text-[#1A332A]">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Renewable
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Hydro / Nuclear
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FACC15]" /> Thermal
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Maintenance
          </span>
        </div>
      </div>

      {/* Bottom Floating KPI Strip */}
      <div className="absolute bottom-5 left-5 z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl pointer-events-auto">
        <div className="bg-[#0B1B15]/90 border border-[#1A332A] px-3.5 py-2.5 rounded-xl backdrop-blur-md shadow-xl">
          <span className="text-[9px] uppercase font-mono text-emerald-400/80 block">
            EIA U.S. Generation
          </span>
          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
            2,189.61 TWh
          </div>
        </div>

        <div className="bg-[#0B1B15]/90 border border-[#1A332A] px-3.5 py-2.5 rounded-xl backdrop-blur-md shadow-xl">
          <span className="text-[9px] uppercase font-mono text-emerald-400/80 block">
            Clean / Renewable Mix
          </span>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
            53.0% Share
          </div>
        </div>

        <div className="bg-[#0B1B15]/90 border border-[#1A332A] px-3.5 py-2.5 rounded-xl backdrop-blur-md shadow-xl">
          <span className="text-[9px] uppercase font-mono text-emerald-400/80 block">
            Grid Carbon Index
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
            420 <span className="text-[10px] font-normal text-slate-400">gCO₂/kWh</span>
          </div>
        </div>

        <div className="bg-[#0B1B15]/90 border border-[#1A332A] px-3.5 py-2.5 rounded-xl backdrop-blur-md shadow-xl">
          <span className="text-[9px] uppercase font-mono text-amber-400/90 block">
            Global Grid Hubs
          </span>
          <div className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">
            {PLANTS_DATA.length} Monitored
          </div>
        </div>
      </div>

      {/* Dynamic Slide-Over Intelligence Panel */}
      <aside
        className={`fixed top-0 right-0 z-30 h-full w-full sm:w-[400px] bg-[#0B1B15]/95 border-l border-[#1A332A] backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out flex flex-col justify-between overflow-y-auto p-6 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-[#1A332A] pb-4">
            <div>
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded">
                {selectedPlant ? "Selected Grid Asset" : "Global Grid Overview"}
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5">
                {selectedPlant
                  ? selectedPlant.name
                  : "Global Electricity Telemetry"}
              </h2>
            </div>

            <button
              onClick={handleClosePanel}
              aria-label="Close Intelligence Panel"
              className="w-8 h-8 rounded-lg bg-[#06110D] border border-[#1A332A] hover:border-emerald-400 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>

          {selectedPlant ? (
            <div className="bg-[#06110D] border border-[#1A332A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Operational Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    selectedPlant.status === "Maintenance"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {selectedPlant.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#0B1B15] p-2.5 rounded-lg border border-[#1A332A]">
                  <span className="text-[10px] text-slate-400 block">Primary Fuel</span>
                  <span className="text-sm font-bold text-emerald-300">
                    {selectedPlant.fuel}
                  </span>
                </div>
                <div className="bg-[#0B1B15] p-2.5 rounded-lg border border-[#1A332A]">
                  <span className="text-[10px] text-slate-400 block">Nameplate Capacity</span>
                  <span className="text-sm font-bold text-white">
                    {selectedPlant.capacityMW.toLocaleString()} MW
                  </span>
                </div>
                <div className="bg-[#0B1B15] p-2.5 rounded-lg border border-[#1A332A]">
                  <span className="text-[10px] text-slate-400 block">Grid Zone</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedPlant.region}
                  </span>
                </div>
                <div className="bg-[#0B1B15] p-2.5 rounded-lg border border-[#1A332A]">
                  <span className="text-[10px] text-slate-400 block">Coordinates</span>
                  <span className="text-[11px] font-mono text-slate-300">
                    {selectedPlant.lat.toFixed(2)}, {selectedPlant.lng.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-300 bg-[#06110D] border border-[#1A332A] rounded-lg p-3 leading-relaxed">
              Click any generation hub marker on the full-screen map to inspect facility nameplate capacity, fuel dispatch profile, and regional grid coordinates.
            </p>
          )}

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              EIA Electricity Fuel Mix (%)
            </h3>
            <div className="bg-[#06110D] border border-[#1A332A] rounded-xl p-3.5 space-y-2.5">
              {fuelBreakdown.map((item) => (
                <div key={item.name} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-400">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-[#1A332A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              Grid Governance & Context
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed bg-[#06110D] p-3 rounded-lg border border-[#1A332A]">
              Regional Transmission Organizations (PJM, CAISO, ERCOT, ENTSO-E) balance real-time dispatch across baseload nuclear/hydro plants and variable renewable hubs.
            </p>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-[#1A332A]">
          <button
            onClick={handleDownloadCSV}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>↓</span> Export Grid Telemetry (CSV)
          </button>
        </div>
      </aside>

      {/* Developer Signature & Metadata Modal (i) */}
      {isInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0B1B15] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1A332A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  Infocreon Internship • Platform Metadata
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Energy Infrastructure Watchtower
                </h3>
              </div>
              <button
                onClick={() => setIsInfoOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#06110D] border border-[#1A332A] hover:border-emerald-400 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs bg-[#06110D] border border-[#1A332A] rounded-xl p-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Developed by:</span>
                <span className="text-white font-semibold">Justeena Thankachan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PoC ID:</span>
                <span className="text-emerald-400 font-semibold">POC-25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GitHub:</span>
                <span className="text-emerald-300">@justeenathankachan-del</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Program:</span>
                <span className="text-slate-200">Infocreon Internship</span>
              </div>
              <div className="pt-2 border-t border-[#1A332A]">
                <span className="text-slate-400 block mb-1">Architecture Stack:</span>
                <span className="text-slate-200">
                  Next.js, React-Leaflet, Tailwind CSS, U.S. EIA Open Data API
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsInfoOpen(false)}
              className="w-full py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Metadata
            </button>
          </div>
        </div>
      )}
    </div>
      </>
  );
