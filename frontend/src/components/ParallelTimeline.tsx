"use client";

import React, { useState } from "react";
import { Calendar, BookOpen, Layers, Eye } from "lucide-react";
import { TimelineAnchor } from "@/types/comparison";

interface ParallelTimelineProps {
  timelineA: TimelineAnchor[];
  timelineB: TimelineAnchor[];
  nameA: string;
  nameB: string;
}

export const ParallelTimeline: React.FC<ParallelTimelineProps> = ({
  timelineA,
  timelineB,
  nameA,
  nameB,
}) => {
  const [activeTab, setActiveTab] = useState<"both" | "a" | "b">("both");

  return (
    <section className="border border-neutral-800 rounded bg-neutral-900/20 p-4 sm:p-6 space-y-5">
      {/* Header & Mobile View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800/80 gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-neutral-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100">
            Chronological Synchronization Rails
          </h3>
        </div>

        {/* View Switcher for Responsive Screens */}
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800 text-[10px] font-mono self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("both")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === "both" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            PARALLEL
          </button>
          <button
            onClick={() => setActiveTab("a")}
            className={`px-2.5 py-1 rounded transition-colors max-w-[120px] truncate ${
              activeTab === "a" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title={nameA}
          >
            EVENT A
          </button>
          <button
            onClick={() => setActiveTab("b")}
            className={`px-2.5 py-1 rounded transition-colors max-w-[120px] truncate ${
              activeTab === "b" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title={nameB}
          >
            EVENT B
          </button>
        </div>
      </div>

      {/* Dual Rails */}
      <div className={`grid gap-6 sm:gap-8 relative ${activeTab === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {/* Central Vertical Connector Line (Desktop Parallel Mode) */}
        {activeTab === "both" && (
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-800 -translate-x-1/2" />
        )}

        {/* Rail A */}
        {(activeTab === "both" || activeTab === "a") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60">
              <span className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider truncate mr-2">
                {nameA} Chronology
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 whitespace-nowrap">
                {timelineA.length} Milestones
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {timelineA.map((point, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-neutral-700 pl-4 py-2 relative group hover:border-neutral-400 transition-colors"
                >
                  {/* Node marker */}
                  <div className="absolute -left-[5px] top-3 h-2 w-2 rounded-full bg-neutral-400 group-hover:bg-neutral-100 group-hover:scale-125 transition-all" />
                  
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <span className="text-[11px] font-mono text-neutral-200 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-semibold">
                      {point.timestamp}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 max-w-[220px] truncate" title={point.entity_source}>
                      <BookOpen size={10} />
                      {point.entity_source}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-neutral-100 mt-1">
                    {point.headline}
                  </h4>
                  
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rail B */}
        {(activeTab === "both" || activeTab === "b") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60">
              <span className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider truncate mr-2">
                {nameB} Chronology
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 whitespace-nowrap">
                {timelineB.length} Milestones
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {timelineB.map((point, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-neutral-700 pl-4 py-2 relative group hover:border-neutral-400 transition-colors"
                >
                  {/* Node marker */}
                  <div className="absolute -left-[5px] top-3 h-2 w-2 rounded-full bg-neutral-400 group-hover:bg-neutral-100 group-hover:scale-125 transition-all" />
                  
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <span className="text-[11px] font-mono text-neutral-200 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-semibold">
                      {point.timestamp}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 max-w-[220px] truncate" title={point.entity_source}>
                      <BookOpen size={10} />
                      {point.entity_source}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-neutral-100 mt-1">
                    {point.headline}
                  </h4>
                  
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
