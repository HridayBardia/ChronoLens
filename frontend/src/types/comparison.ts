export interface TimelineAnchor {
  timestamp: string;
  headline: string;
  description: string;
  entity_source: string;
}

export interface ComparativeFacet {
  dimension: string;
  event_a_manifestation: string;
  event_b_manifestation: string;
  structural_similarity_score: number;
  causal_difference: string;
}

export interface EventAnalysis {
  event_name: string;
  wikidata_id: string | null;
  start_year: string;
  end_year: string;
  duration?: string;
  instance_type?: string;
  geographical_scope?: string;
  root_causes: string[];
  immediate_catalyst: string;
  primary_actors: string[];
  macro_outcomes: string[];
  timeline: TimelineAnchor[];
}

export interface AnalyticalMetrics {
  overall_isomorphism_score: number;
  divergence_index: number;
  temporal_velocity_ratio: string;
  historiographical_risk_rating: string;
}

export interface HistoricalComparisonReport {
  event_a: EventAnalysis;
  event_b: EventAnalysis;
  comparative_facets: ComparativeFacet[];
  historiographical_consensus: string;
  hallucination_safeguard_notes: string[];
  metrics?: AnalyticalMetrics;
  execution_telemetry?: {
    engine_mode?: string;
    model?: string;
    event_a_grounded?: boolean;
    event_b_grounded?: boolean;
    execution_latency_ms?: number;
    timestamp_iso?: string;
    error?: string;
  };
}

export interface CompareRequest {
  event_a: string;
  event_b: string;
  deep_analysis?: boolean;
}
