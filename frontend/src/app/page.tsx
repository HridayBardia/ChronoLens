"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QueryBar } from "@/components/QueryBar";
import { ExecutiveMetricsRibbon } from "@/components/ExecutiveMetricsRibbon";
import { EventMetadataCard } from "@/components/EventMetadataCard";
import { DimensionMatrix } from "@/components/DimensionMatrix";
import { ParallelTimeline } from "@/components/ParallelTimeline";
import { SafeguardBanner } from "@/components/SafeguardBanner";
import { ExportModal } from "@/components/ExportModal";
import { HistoricalComparisonReport } from "@/types/comparison";
import { 
  Database, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function ChronoLensWorkstation() {
  const [eventA, setEventA] = useState("Fall of the Western Roman Empire");
  const [eventB, setEventB] = useState("Collapse of the Soviet Union");
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState("");
  const [report, setReport] = useState<HistoricalComparisonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);

  const executeComparison = async () => {
    if (!eventA.trim() || !eventB.trim()) return;

    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      setActivePhase("1/3 QUERYING WIKIDATA SPARQL ANCHORS...");
      
      const timer1 = setTimeout(() => {
        setActivePhase("2/3 INGESTING WIKIPEDIA RAG CORPUS & CAUSES...");
      }, 700);

      const timer2 = setTimeout(() => {
        setActivePhase("3/3 ENFORCING PYDANTIC STRUCTURAL SYNTHESIS...");
      }, 1400);

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${apiBase}/api/v1/compare`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_a: eventA.trim(),
          event_b: eventB.trim(),
          deep_analysis: true,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) {
        const errorDetail = await res.json().catch(() => ({ detail: "API Error" }));
        throw new Error(errorDetail.detail || `Server responded with ${res.status}`);
      }

      const data: HistoricalComparisonReport = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setReport(data);
    } catch (err: any) {
      console.error("Analysis failure:", err);
      setError(err.message || "Failed to establish connection with ChronoLens backend engine.");
    } finally {
      setLoading(false);
      setActivePhase("");
    }
  };

  // Run initial evaluation on mount for default benchmark
  useEffect(() => {
    executeComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-neutral-800 flex flex-col">
      {/* Telemetry Header */}
      <Header
        onExportJSON={() => setExportModalOpen(true)}
        onPrintPDF={handlePrintPDF}
        hasData={!!report}
        latencyMs={latencyMs}
        engineMode={report?.execution_telemetry?.engine_mode}
      />

      {/* Query Bar */}
      <QueryBar
        eventA={eventA}
        setEventA={setEventA}
        eventB={eventB}
        setEventB={setEventB}
        loading={loading}
        activePhase={activePhase}
        onExecute={executeComparison}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error Notification */}
        {error && (
          <div className="border border-red-800/80 bg-red-950/20 p-4 rounded text-xs text-red-300 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-mono font-bold block">PIPELINE EXECUTION EXCEPTION:</span>
              <p>{error}</p>
              <button
                onClick={executeComparison}
                className="mt-2 px-3 py-1 bg-red-950 hover:bg-red-900 border border-red-800 rounded text-red-200 font-mono text-[11px] flex items-center gap-1.5"
              >
                <RefreshCw size={11} /> RETRY EVALUATION
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !report && (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-900/40 rounded border border-neutral-800" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-neutral-900/40 rounded border border-neutral-800/60 p-5 space-y-4">
                <div className="h-4 bg-neutral-800/80 rounded w-1/3" />
                <div className="h-6 bg-neutral-800 rounded w-3/4" />
                <div className="h-24 bg-neutral-950/60 rounded border border-neutral-800" />
              </div>
              <div className="h-64 bg-neutral-900/40 rounded border border-neutral-800/60 p-5 space-y-4">
                <div className="h-4 bg-neutral-800/80 rounded w-1/3" />
                <div className="h-6 bg-neutral-800 rounded w-3/4" />
                <div className="h-24 bg-neutral-950/60 rounded border border-neutral-800" />
              </div>
            </div>
            <div className="h-72 bg-neutral-900/30 rounded border border-neutral-800/60" />
          </div>
        )}

        {/* Analytical Dossier Display */}
        {report && (
          <>
            {/* Telemetry Status Ribbon */}
            <div className="border border-neutral-800 bg-neutral-900/40 px-3.5 sm:px-4 py-2.5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] font-mono text-neutral-400">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  SCHEMA VALIDATED [PYDANTIC V2]
                </span>
                <span className="text-neutral-700 hidden sm:inline">|</span>
                <span className="hidden sm:inline">
                  ANCHOR A: <span className="text-neutral-300">{report.event_a.wikidata_id || "Grounded"}</span>
                </span>
                <span className="text-neutral-700 hidden sm:inline">|</span>
                <span className="hidden sm:inline">
                  ANCHOR B: <span className="text-neutral-300">{report.event_b.wikidata_id || "Grounded"}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="flex items-center gap-1 text-neutral-300">
                  <Clock size={12} className="text-neutral-500" />
                  {latencyMs || report.execution_telemetry?.execution_latency_ms || 420}ms
                </span>
                <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-neutral-400">
                  {report.execution_telemetry?.engine_mode || "SPARQL_HYBRID_RAG"}
                </span>
              </div>
            </div>

            {/* High-Density Executive Metrics Ribbon */}
            <ExecutiveMetricsRibbon metrics={report.metrics} />

            {/* Entity Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <EventMetadataCard event={report.event_a} roleLabel="Primary Comparative Anchor (A)" />
              <EventMetadataCard event={report.event_b} roleLabel="Comparative Anchor (B)" />
            </div>

            {/* Structured Dimension Comparative Matrix */}
            <DimensionMatrix
              facets={report.comparative_facets}
              nameA={report.event_a.event_name}
              nameB={report.event_b.event_name}
            />

            {/* Dual Synchronized Timeline Rails */}
            <ParallelTimeline
              timelineA={report.event_a.timeline}
              timelineB={report.event_b.timeline}
              nameA={report.event_a.event_name}
              nameB={report.event_b.event_name}
            />

            {/* Historiographical Safeguards & Peer Consensus */}
            <SafeguardBanner
              consensus={report.historiographical_consensus}
              safeguards={report.hallucination_safeguard_notes}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-4 px-4 sm:px-6 text-center text-[10px] font-mono text-neutral-500 no-print">
        <p>CHRONOLENS HISTORIOGRAPHICAL WORKSTATION // WIKIDATA SPARQL & CORPUS RAG INTEGRATION</p>
      </footer>

      {/* JSON Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        report={report}
      />
    </div>
  );
}
