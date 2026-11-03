"use client";

import React from "react";
import { ExternalLink, Calendar, Zap, Users, Crosshair, Landmark, MapPin, Tag, Hourglass } from "lucide-react";
import { EventAnalysis } from "@/types/comparison";

interface EventMetadataCardProps {
  event: EventAnalysis;
  roleLabel: string;
}

export const EventMetadataCard: React.FC<EventMetadataCardProps> = ({ event, roleLabel }) => {
  return (
    <div className="border border-neutral-800 bg-neutral-900/30 p-4 sm:p-5 rounded space-y-4">
      {/* Top Banner & QID */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-neutral-800/80">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-0.5">
            {roleLabel}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100 tracking-tight font-sans">
            {event.event_name}
          </h2>
          
          {/* Ontological & Geographic Scope Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px] font-mono text-neutral-400">
            {event.instance_type && (
              <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 flex items-center gap-1">
                <Tag size={10} className="text-neutral-500" />
                {event.instance_type}
              </span>
            )}
            {event.geographical_scope && (
              <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 flex items-center gap-1">
                <MapPin size={10} className="text-neutral-500" />
                {event.geographical_scope}
              </span>
            )}
          </div>
        </div>

        {event.wikidata_id ? (
          <a
            href={`https://www.wikidata.org/wiki/${event.wikidata_id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Inspect Wikidata Knowledge Graph Anchor"
            className="self-start flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-neutral-100 rounded transition-colors group"
          >
            <span className="text-neutral-400 group-hover:text-neutral-200">
              wd:{event.wikidata_id}
            </span>
            <ExternalLink size={11} className="text-neutral-500 group-hover:text-neutral-300" />
          </a>
        ) : (
          <span className="self-start text-[10px] font-mono px-2 py-1 bg-neutral-950 border border-neutral-800 text-neutral-500 rounded">
            NO_QID_RESOLVED
          </span>
        )}
      </div>

      {/* Temporal Span & Catalyst Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-neutral-950/60 p-3 rounded border border-neutral-800/70 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              ERA BOUNDS
            </span>
            {event.duration && (
              <span className="text-neutral-400 flex items-center gap-0.5">
                <Hourglass size={10} />
                {event.duration}
              </span>
            )}
          </div>
          <span className="font-mono text-neutral-100 text-xs sm:text-sm font-semibold block">
            {event.start_year || "Inception"} — {event.end_year || "Resolution"}
          </span>
        </div>

        <div className="bg-neutral-950/60 p-3 rounded border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-neutral-400">
            <Zap size={11} className="text-amber-400/80" />
            <span>IMMEDIATE CATALYST TRIGGER</span>
          </div>
          <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
            {event.immediate_catalyst}
          </p>
        </div>
      </div>

      {/* Key Actors Ribbon */}
      <div className="pt-2 border-t border-neutral-800/60">
        <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-neutral-400 mb-1.5">
          <Users size={11} />
          <span>PRIMARY ACTORS & FACTIONS</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {event.primary_actors && event.primary_actors.length > 0 ? (
            event.primary_actors.map((actor, idx) => (
              <span
                key={idx}
                className="bg-neutral-950 text-neutral-300 border border-neutral-800/80 px-2 py-0.5 rounded text-[11px] font-mono"
              >
                {actor}
              </span>
            ))
          ) : (
            <span className="text-neutral-500 text-xs font-mono">None cataloged</span>
          )}
        </div>
      </div>

      {/* Root Causes & Macro Outcomes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/60 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5 flex items-center gap-1">
            <Crosshair size={10} /> ROOT PRECONDITIONS
          </span>
          <ul className="space-y-1.5">
            {event.root_causes.slice(0, 3).map((cause, idx) => (
              <li key={idx} className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                <span className="text-neutral-600 font-mono text-xs">›</span>
                <span className="leading-snug">{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5 flex items-center gap-1">
            <Landmark size={10} /> MACRO OUTCOMES
          </span>
          <ul className="space-y-1.5">
            {event.macro_outcomes.slice(0, 3).map((outcome, idx) => (
              <li key={idx} className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                <span className="text-neutral-600 font-mono text-xs">›</span>
                <span className="leading-snug">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
