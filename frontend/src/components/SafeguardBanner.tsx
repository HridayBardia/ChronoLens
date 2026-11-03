"use client";

import React from "react";
import { AlertTriangle, BookCheck, ShieldAlert } from "lucide-react";

interface SafeguardBannerProps {
  consensus: string;
  safeguards: string[];
}

export const SafeguardBanner: React.FC<SafeguardBannerProps> = ({
  consensus,
  safeguards,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Historiographical Consensus */}
      <div className="lg:col-span-7 border border-neutral-800 rounded bg-neutral-900/20 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <BookCheck size={15} className="text-neutral-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100">
              Historiographical Consensus Synthesis
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
            PEER-REVIEWED CORPUS
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
          {consensus}
        </p>
      </div>

      {/* False Equivalence & Fallacy Safeguards */}
      <div className="lg:col-span-5 border border-amber-900/40 bg-amber-950/15 p-4 sm:p-5 rounded space-y-3">
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Historiographical Pitfalls & Safeguards
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
            ANTI-SYMMETRY
          </span>
        </div>

        <ul className="space-y-2">
          {safeguards.map((note, idx) => (
            <li
              key={idx}
              className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/50 p-2.5 rounded border border-neutral-800/60"
            >
              <span className="text-amber-400 font-mono font-bold mt-0.5">•</span>
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
