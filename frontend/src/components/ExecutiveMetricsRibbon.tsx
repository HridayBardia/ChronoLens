"use client";

import React from "react";
import { Gauge, Split, Hourglass, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AnalyticalMetrics } from "@/types/comparison";

interface ExecutiveMetricsRibbonProps {
  metrics?: AnalyticalMetrics;
}

export const ExecutiveMetricsRibbon: React.FC<ExecutiveMetricsRibbonProps> = ({ metrics }) => {
  if (!metrics) return null;

  const isoPct = Math.round(metrics.overall_isomorphism_score * 100);
  const divPct = Math.round(metrics.divergence_index * 100);

  const getRiskColor = (risk: string) => {
    if (risk.includes("HIGH")) return "text-red-400 border-red-900/60 bg-red-950/30";
    if (risk.includes("MODERATE")) return "text-amber-400 border-amber-900/60 bg-amber-950/30";
    return "text-emerald-400 border-emerald-900/60 bg-emerald-950/30";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Overall Isomorphism Alignment */}
      <div className="bg-neutral-900/40 border border-neutral-800 p-3.5 rounded flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Gauge size={13} className="text-neutral-400" />
            ISOMORPHIC ALIGNMENT
          </span>
          <span className="text-neutral-500">INDEX</span>
        </div>
        <div className="my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-neutral-100">{isoPct}%</span>
          <span className="text-[11px] font-mono text-neutral-400">STRUCTURAL MATCH</span>
        </div>
        <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-700 ${
              isoPct < 35 ? "bg-red-500" : isoPct < 70 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${isoPct}%` }}
          />
        </div>
      </div>

      {/* 2. Divergence Severity Index */}
      <div className="bg-neutral-900/40 border border-neutral-800 p-3.5 rounded flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Split size={13} className="text-neutral-400" />
            DIVERGENCE INDEX
          </span>
          <span className="text-neutral-500">SEVERITY</span>
        </div>
        <div className="my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-neutral-100">{divPct}%</span>
          <span className="text-[11px] font-mono text-neutral-400">MECHANISTIC VARIANCE</span>
        </div>
        <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-neutral-400 transition-all duration-700"
            style={{ width: `${divPct}%` }}
          />
        </div>
      </div>

      {/* 3. Timescale Velocity Asymmetry */}
      <div className="bg-neutral-900/40 border border-neutral-800 p-3.5 rounded flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Hourglass size={13} className="text-neutral-400" />
            TEMPORAL VELOCITY
          </span>
          <span className="text-neutral-500">SCALE</span>
        </div>
        <div className="my-2">
          <span className="text-sm font-semibold font-mono text-neutral-200 block truncate" title={metrics.temporal_velocity_ratio}>
            {metrics.temporal_velocity_ratio}
          </span>
          <span className="text-[10px] font-mono text-neutral-500 mt-0.5 block">DURATION RATIO CALIBRATION</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/60">
          <CheckCircle2 size={11} className="text-emerald-500" />
          <span>WIKIDATA CHRONOLOGY ANCHORED</span>
        </div>
      </div>

      {/* 4. Historiographical Equivalence Risk */}
      <div className="bg-neutral-900/40 border border-neutral-800 p-3.5 rounded flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={13} className="text-neutral-400" />
            EQUIVALENCE RISK
          </span>
          <span className="text-neutral-500">SAFEGUARD</span>
        </div>
        <div className="my-2">
          <span
            className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getRiskColor(
              metrics.historiographical_risk_rating
            )}`}
          >
            {metrics.historiographical_risk_rating}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 mt-1 block">ANTI-SYMMETRIC PROTOCOL</span>
        </div>
        <div className="text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/60 truncate">
          <span>PEER-REVIEWED CORPUS ALIGNED</span>
        </div>
      </div>
    </div>
  );
};

