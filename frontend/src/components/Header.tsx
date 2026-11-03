"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Activity, 
  FileJson, 
  Printer, 
  Cpu, 
  Menu, 
  X,
  Share2
} from "lucide-react";

interface HeaderProps {
  onExportJSON?: () => void;
  onPrintPDF?: () => void;
  hasData?: boolean;
  latencyMs?: number;
  engineMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onExportJSON,
  onPrintPDF,
  hasData = false,
  latencyMs,
  engineMode = "WIKIDATA_SPARQL_VERIFIED",
}) => {
  const [utcTime, setUtcTime] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + " UTC");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 px-4 sm:px-6 py-2.5 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Telemetry Identification */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="bg-neutral-100 text-neutral-950 px-2 py-0.5 rounded font-mono font-bold text-xs flex items-center gap-1.5 tracking-tight shadow-sm">
            <Terminal size={13} className="text-neutral-950 stroke-[2.5]" />
            <span>CHRONO-LENS</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-neutral-400">
            <span className="hidden sm:inline text-neutral-600">{"//"}</span>
            <span className="text-neutral-300 font-semibold hidden xs:inline">ENGINE v1.0.4</span>
            <span className="text-neutral-600 hidden md:inline">{"::"}</span>
            <span className="text-neutral-400 hidden lg:inline">ISOMORPHIC ANALYST WORKSTATION</span>
          </div>
        </div>

        {/* Desktop Telemetry & Actions */}
        <div className="hidden md:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center gap-2 border-r border-neutral-800 pr-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-400 text-[11px]">SPARQL:</span>
            <span className="text-neutral-200 text-[11px] font-medium">LIVE</span>
          </div>

          {latencyMs !== undefined && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 border-r border-neutral-800 pr-4">
              <Activity size={12} className="text-neutral-500" />
              <span>LATENCY:</span>
              <span className="text-neutral-200 font-medium">{latencyMs}ms</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Cpu size={12} className="text-neutral-500" />
            <span className="text-neutral-300">{utcTime || "00:00:00 UTC"}</span>
          </div>

          {hasData && (
            <div className="flex items-center space-x-2 pl-2">
              <button
                onClick={onExportJSON}
                title="Export complete analytical schema as formatted JSON"
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 rounded transition-colors"
              >
                <FileJson size={12} className="text-neutral-400" />
                <span>JSON</span>
              </button>
              <button
                onClick={onPrintPDF}
                title="Print analytical executive brief / Export PDF"
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 bg-neutral-100 hover:bg-neutral-300 text-neutral-950 font-semibold rounded transition-colors"
              >
                <Printer size={12} className="text-neutral-950" />
                <span>PRINT BRIEF</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions & Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {hasData && (
            <button
              onClick={onPrintPDF}
              title="Print Brief"
              className="px-2 py-1 bg-neutral-100 text-neutral-950 font-mono text-[10px] font-bold rounded flex items-center gap-1"
            >
              <Printer size={11} />
              <span>PRINT</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 bg-neutral-900 border border-neutral-800 rounded"
            aria-label="Toggle Telemetry Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-neutral-800/80 mt-2 space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              WIKIDATA SPARQL:
            </span>
            <span className="text-neutral-200 text-[11px] font-medium">LIVE CONNECTED</span>
          </div>

          {latencyMs !== undefined && (
            <div className="flex items-center justify-between px-1 text-[11px]">
              <span className="text-neutral-400">ENGINE LATENCY:</span>
              <span className="text-neutral-200">{latencyMs}ms</span>
            </div>
          )}

          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="text-neutral-400">CHRONO-CLOCK:</span>
            <span className="text-neutral-200">{utcTime}</span>
          </div>

          {hasData && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/60">
              <button
                onClick={() => {
                  onExportJSON?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded flex items-center justify-center gap-1 text-[11px]"
              >
                <FileJson size={12} />
                <span>EXPORT JSON</span>
              </button>
              <button
                onClick={() => {
                  onPrintPDF?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-1.5 bg-neutral-100 text-neutral-950 font-bold rounded flex items-center justify-center gap-1 text-[11px]"
              >
                <Printer size={12} />
                <span>PRINT BRIEF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
