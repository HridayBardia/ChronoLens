"use client";

import React from "react";
import { Search, Loader2, BookmarkCheck, ArrowRightLeft, Sparkles, Filter } from "lucide-react";

interface QueryBarProps {
  eventA: string;
  setEventA: (v: string) => void;
  eventB: string;
  setEventB: (v: string) => void;
  loading: boolean;
  activePhase: string;
  onExecute: () => void;
}

const BENCHMARK_PRESETS = [
  {
    label: "Rome (476 CE) vs USSR (1991)",
    a: "Fall of the Western Roman Empire",
    b: "Collapse of the Soviet Union",
  },
  {
    label: "French Rev (1789) vs Bolshevik (1917)",
    a: "French Revolution",
    b: "October Revolution",
  },
  {
    label: "Spanish Flu (1918) vs COVID-19 (2019)",
    a: "Spanish flu",
    b: "COVID-19 pandemic",
  },
  {
    label: "Constantinople (1453) vs Tenochtitlan (1521)",
    a: "Fall of Constantinople",
    b: "Fall of Tenochtitlan",
  },
  {
    label: "Hundred Years' War vs Six-Day War",
    a: "Hundred Years' War",
    b: "Six-Day War",
  },
];

export const QueryBar: React.FC<QueryBarProps> = ({
  eventA,
  setEventA,
  eventB,
  setEventB,
  loading,
  activePhase,
  onExecute,
}) => {
  const handleSwap = () => {
    const temp = eventA;
    setEventA(eventB);
    setEventB(temp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && eventA.trim() && eventB.trim()) {
      onExecute();
    }
  };

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/30 px-4 sm:px-6 py-4 query-bar-container">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Main Dual-Anchor Query Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Event A Input */}
          <div className="md:col-span-5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              <span className="font-semibold text-neutral-300">PRIMARY ANCHOR (EVENT A)</span>
              <span className="text-neutral-500 text-[9px]">WIKIDATA TARGET</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={eventA}
                onChange={(e) => setEventA(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Fall of the Western Roman Empire"
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-mono transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* Swap Button / Comparator Divider */}
          <div className="md:col-span-1 flex items-center justify-center pb-0.5">
            <button
              onClick={handleSwap}
              type="button"
              disabled={loading}
              title="Invert Anchor Order"
              className="w-full md:w-auto h-9 px-3 md:px-2 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-950 md:bg-neutral-900/80 text-neutral-400 hover:text-neutral-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowRightLeft size={13} />
              <span className="text-[11px] font-mono md:hidden">SWAP ANCHORS</span>
            </button>
          </div>

          {/* Event B Input */}
          <div className="md:col-span-5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              <span className="font-semibold text-neutral-300">COMPARATIVE ANCHOR (EVENT B)</span>
              <span className="text-neutral-500 text-[9px]">ISOMORPHIC COUNTERPART</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={eventB}
                onChange={(e) => setEventB(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Collapse of the Soviet Union"
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-mono transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* Execute Button */}
          <div className="md:col-span-1">
            <button
              onClick={onExecute}
              disabled={loading || !eventA.trim() || !eventB.trim()}
              className="w-full h-10 bg-neutral-100 hover:bg-neutral-300 text-neutral-950 font-mono font-bold text-xs rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>RUNNING</span>
                </>
              ) : (
                <>
                  <Search size={14} />
                  <span>EVALUATE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets & Pipeline Progress Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1.5 border-t border-neutral-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-neutral-500 flex items-center gap-1 mr-1">
              <BookmarkCheck size={11} /> PRESETS:
            </span>
            {BENCHMARK_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setEventA(preset.a);
                  setEventB(preset.b);
                }}
                disabled={loading}
                className="text-[11px] font-mono text-neutral-300 hover:text-neutral-100 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 px-2 py-1 rounded transition-colors whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Real-time Loading Phase Display */}
          {loading && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 animate-pulse bg-neutral-950 px-2.5 py-1 rounded border border-amber-900/40">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="truncate">{activePhase || "DISPATCHING HISTORIOGRAPHICAL PIPELINE..."}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
