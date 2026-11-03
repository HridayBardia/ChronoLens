from typing import Any

from pydantic import BaseModel, Field


class TimelineAnchor(BaseModel):
    timestamp: str = Field(
        description="ISO 8601, YYYY-MM, or historical year string (e.g. '476 CE' or '1991-12-26')"
    )
    headline: str = Field(
        description="Concise, factual title of the milestone, phase, or trigger"
    )
    description: str = Field(
        description="Max 2 sentences of verified empirical details and causal context"
    )
    entity_source: str = Field(
        description="Primary primary/secondary entity citation (e.g., 'Wikidata wd:Q25345', 'Cambridge Ancient History')"
    )


class ComparativeFacet(BaseModel):
    dimension: str = Field(
        description="Structural dimension, e.g., Pre-existing Fiscal Health, Catalyst Trigger, Military Tactics, Institutional Fragility"
    )
    event_a_manifestation: str = Field(
        description="Specific empirical manifestation in Event A"
    )
    event_b_manifestation: str = Field(
        description="Specific empirical manifestation in Event B"
    )
    structural_similarity_score: float = Field(
        description="Quantified isomorphic alignment score from 0.00 to 1.00",
        ge=0.0,
        le=1.0,
    )
    causal_difference: str = Field(
        description="Explicit causal divergence rationale explaining why outcomes differed despite surface parallels"
    )


class EventAnalysis(BaseModel):
    event_name: str = Field(
        description="Canonical historical or geopolitical event title"
    )
    wikidata_id: str | None = Field(
        default=None, description="Resolved Wikidata QID identifier (e.g., 'Q42884')"
    )
    start_year: str = Field(
        description="Standardized inception date or year (e.g., '395 CE' or '1985')"
    )
    end_year: str = Field(
        description="Standardized culmination or dissolution date/year (e.g., '476 CE' or '1991')"
    )
    duration: str | None = Field(
        default=None,
        description="Computed historical duration (e.g., '81 years', '6 days', '72 months')",
    )
    instance_type: str | None = Field(
        default=None,
        description="Ontological category (e.g., 'Imperial Collapse', 'Revolutionary War', 'Pandemic')",
    )
    geographical_scope: str | None = Field(
        default=None, description="Geographical theater of operations"
    )
    root_causes: list[str] = Field(
        description="List of core systemic, socio-economic, or institutional pre-conditions"
    )
    immediate_catalyst: str = Field(
        description="The definitive trigger or precipitating event"
    )
    primary_actors: list[str] = Field(
        description="Key individuals, factions, states, or institutional coalitions"
    )
    macro_outcomes: list[str] = Field(
        description="Long-term systemic, geopolitical, or structural ramifications"
    )
    timeline: list[TimelineAnchor] = Field(
        description="Chronologically sorted sequence of verified historical anchors"
    )


class AnalyticalMetrics(BaseModel):
    overall_isomorphism_score: float = Field(
        description="Aggregate similarity index between 0.0 and 1.0", ge=0.0, le=1.0
    )
    divergence_index: float = Field(
        description="Structural divergence severity between 0.0 and 1.0", ge=0.0, le=1.0
    )
    temporal_velocity_ratio: str = Field(
        description="Ratio comparing duration velocity (e.g., '13.5x slower')"
    )
    historiographical_risk_rating: str = Field(
        description="Risk rating of false equivalence: 'LOW', 'MODERATE', or 'HIGH'"
    )


class HistoricalComparisonReport(BaseModel):
    event_a: EventAnalysis
    event_b: EventAnalysis
    comparative_facets: list[ComparativeFacet] = Field(
        description="Array of structured dimensions evaluating structural divergence and parallels"
    )
    historiographical_consensus: str = Field(
        description="Summary of prevailing peer-reviewed academic consensus on comparing these two phenomena"
    )
    hallucination_safeguard_notes: list[str] = Field(
        description="Explicit disclaimers addressing common historiographical fallacies, false symmetries, or anachronisms"
    )
    metrics: AnalyticalMetrics | None = Field(
        default=None,
        description="Quantitative comparison metrics and false equivalence risk indicators",
    )
    execution_telemetry: dict[str, Any] | None = Field(
        default=None,
        description="Analytical execution metadata including SPARQL latency, confidence scores, and RAG grounding count",
    )


class CompareRequest(BaseModel):
    event_a: str = Field(
        ...,
        min_length=2,
        max_length=150,
        json_schema_extra={"example": "Fall of the Western Roman Empire"},
    )
    event_b: str = Field(
        ...,
        min_length=2,
        max_length=150,
        json_schema_extra={"example": "Collapse of the Soviet Union"},
    )
    deep_analysis: bool | None = Field(
        default=True, description="Enable exhaustive causal matrix analysis"
    )


class EntityMetadata(BaseModel):
    qid: str | None
    label: str
    description: str
    dates: dict
    wikipedia_summary: str | None = None
    aliases: list[str] = []
