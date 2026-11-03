"use client";

import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode } from "lucide-react";
import { HistoricalComparisonReport } from "@/types/comparison";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: HistoricalComparisonReport | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const jsonString = JSON.stringify(report, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `chronolens-${report.event_a.event_name.toLowerCase().replace(/\s+/g, "_")}-vs-${report.event_b.event_name.toLowerCase().replace(/\s+/g, "_")}.json`;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <FileCode size={15} className="text-neutral-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
              Analytical Dossier JSON Export
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 p-1 rounded hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-auto bg-neutral-950 font-mono text-[11px] text-neutral-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <span className="text-[11px] font-mono text-neutral-400">
            Schema: HistoricalComparisonReport (Pydantic v2)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "COPIED" : "COPY RAW JSON"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-300 text-neutral-950 font-mono text-xs font-semibold rounded transition-colors"
            >
              <Download size={12} />
              <span>DOWNLOAD .JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

