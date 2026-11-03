"use client";

import React, { useState } from "react";
import { Layers, Info, X, Search, Filter, AlertCircle } from "lucide-react";
import { ComparativeFacet } from "@/types/comparison";

interface DimensionMatrixProps {
  facets: ComparativeFacet[];
  nameA: string;
  nameB: string;
}

export const DimensionMatrix: React.FC<DimensionMatrixProps> = ({
  facets,
  nameA,
  nameB,
}) => {
  const [selectedFacet, setSelectedFacet] = useState<ComparativeFacet | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "divergent" | "moderate" | "aligned">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getScoreBadgeClass = (score: number) => {
    if (score < 0.35) return "text-red-400 bg-red-950/40 border-red-900/60";
    if (score < 0.70) return "text-amber-400 bg-amber-950/40 border-amber-900/60";
    return "text-emerald-400 bg-emerald-950/40 border-emerald-900/60";
  };

  const getScoreLabel = (score: number) => {
    if (score < 0.35) return "SHARP DIVERGENCE";
    if (score < 0.70) return "PARTIAL ANALOGY";
    return "STRONG ISOMORPHISM";
  };

  const filteredFacets = facets.filter((facet) => {
    // Mode filter
    if (filterMode === "divergent" && facet.structural_similarity_score >= 0.35) return false;
    if (filterMode === "moderate" && (facet.structural_similarity_score < 0.35 || facet.structural_similarity_score >= 0.70)) return false;
    if (filterMode === "aligned" && facet.structural_similarity_score < 0.70) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        facet.dimension.toLowerCase().includes(q) ||
        facet.event_a_manifestation.toLowerCase().includes(q) ||
        facet.event_b_manifestation.toLowerCase().includes(q) ||
        facet.causal_difference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="border border-neutral-800 rounded bg-neutral-900/20 overflow-hidden relative">
      {/* Table Header & Interactive Filter Bar */}
      <div className="bg-neutral-900/70 p-4 border-b border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-neutral-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100">
            Structural Dimension Comparative Matrix
          </h3>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 ml-1">
            {facets.length} Total
          </span>
        </div>

        {/* Filter Chips & Search Input */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800 text-[10px] font-mono">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2 py-1 rounded transition-colors ${
                filterMode === "all" ? "bg-neutral-800 text-neutral-100 font-semibold" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterMode("divergent")}
              className={`px-2 py-1 rounded transition-colors ${
                filterMode === "divergent" ? "bg-red-950 text-red-300 font-semibold border border-red-900/60" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              DIVERGENT
            </button>
            <button
              onClick={() => setFilterMode("moderate")}
              className={`px-2 py-1 rounded transition-colors ${
                filterMode === "moderate" ? "bg-amber-950 text-amber-300 font-semibold border border-amber-900/60" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              ANALOGOUS
            </button>
            <button
              onClick={() => setFilterMode("aligned")}
              className={`px-2 py-1 rounded transition-colors ${
                filterMode === "aligned" ? "bg-emerald-950 text-emerald-300 font-semibold border border-emerald-900/60" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              ISOMORPHIC
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-44">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Filter dimensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded pl-7 pr-2.5 py-1 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Rows */}
      {filteredFacets.length === 0 ? (
        <div className="p-8 text-center text-xs font-mono text-neutral-500 space-y-1">
          <AlertCircle size={18} className="mx-auto text-neutral-600" />
          <p>No comparative facets match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800/80">
          {filteredFacets.map((facet, idx) => {
            const pct = Math.round(facet.structural_similarity_score * 100);
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 text-sm hover:bg-neutral-900/30 transition-colors"
              >
                {/* Dimension & Alignment Meter */}
                <div className="md:col-span-3 space-y-2">
                  <span className="font-semibold text-neutral-100 text-sm block">
                    {facet.dimension}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-400">ALIGNMENT:</span>
                      <span className="text-neutral-200 font-bold">{pct}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-neutral-950 border border-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pct < 35
                            ? "bg-red-400"
                            : pct < 70
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span
                      className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded border mt-1 ${getScoreBadgeClass(
                        facet.structural_similarity_score
                      )}`}
                    >
                      {getScoreLabel(facet.structural_similarity_score)}
                    </span>
                  </div>
                </div>

                {/* Event A Manifestation */}
                <div className="md:col-span-4 bg-neutral-950/60 p-3.5 rounded border border-neutral-800/70 text-xs text-neutral-300 leading-relaxed flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider font-semibold">
                      {nameA}
                    </span>
                    <p>{facet.event_a_manifestation}</p>
                  </div>
                </div>

                {/* Event B Manifestation */}
                <div className="md:col-span-4 bg-neutral-950/60 p-3.5 rounded border border-neutral-800/70 text-xs text-neutral-300 leading-relaxed flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider font-semibold">
                      {nameB}
                    </span>
                    <p>{facet.event_b_manifestation}</p>
                  </div>
                </div>

                {/* Causal Divergence Trigger */}
                <div className="md:col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedFacet(facet)}
                    title="Inspect detailed causal divergence analysis"
                    className="w-full md:w-auto h-auto py-2 px-3 md:p-2 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800/80 text-[10px] font-mono text-neutral-300 hover:text-neutral-100 transition-colors flex md:flex-col items-center justify-center gap-1"
                  >
                    <Info size={13} className="text-neutral-400" />
                    <span className="whitespace-nowrap">RATIONALE</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Divergence Detail Modal / Drawer */}
      {selectedFacet && (
        <div 
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFacet(null)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  CAUSAL DIVERGENCE RATIONALE
                </span>
                <h4 className="text-base font-semibold text-neutral-100 mt-0.5">
                  {selectedFacet.dimension}
                </h4>
              </div>
              <button
                onClick={() => setSelectedFacet(null)}
                className="text-neutral-400 hover:text-neutral-100 p-1.5 rounded hover:bg-neutral-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-neutral-950 p-3.5 rounded border border-neutral-800">
                <span className="text-[10px] font-mono text-amber-400/90 block mb-1 uppercase font-semibold">
                  HISTORIOGRAPHICAL EXPLANATION:
                </span>
                <p className="text-neutral-200 leading-relaxed font-sans text-xs sm:text-sm">
                  {selectedFacet.causal_difference}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded">
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase font-semibold">
                    {nameA}
                  </span>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {selectedFacet.event_a_manifestation}
                  </p>
                </div>
                <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded">
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase font-semibold">
                    {nameB}
                  </span>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {selectedFacet.event_b_manifestation}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedFacet(null)}
                className="px-4 py-2 bg-neutral-100 text-neutral-950 font-mono text-xs font-bold rounded hover:bg-neutral-300 transition-colors"
              >
                CLOSE RATIONALE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
