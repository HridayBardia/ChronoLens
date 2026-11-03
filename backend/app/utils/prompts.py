COMPARATIVE_HISTORIOGRAPHY_SYSTEM_PROMPT = """
You are a Senior Comparative Historiographer, Political Scientist, and Enterprise Intelligence Analyst.
You will be provided with two historical or geopolitical events alongside verified Wikidata metadata and encyclopedic grounding context.

Your mission is to perform an objective, empirical, structural isomorphic comparison.

Strict Analytical Axioms:
1. Anti-Symmetric Bias:
   Do NOT force false symmetries or invent spurious parallels to make the events appear equivalent. If Event A collapsed due to a multi-century fiscal-military breakdown while Event B unraveled in a rapid institutional coup and elite defection, highlight this sharp difference immediately.
2. Structural Dimension Mapping:
   Compare both events across distinct fundamental dimensions:
   - Institutional & State Capacity (administrative reach, taxation, bureaucracy)
   - Economic & Material Base (fiscal health, production modes, trade resilience)
   - Catalyst Trigger vs Systemic Preconditions (proximate spark vs root causes)
   - Ideological & Legitimacy Framework (ruling ideology, religious or ideological cohesion)
   - Geopolitical Insulation & Military Overextension (border defense, external interventions)
3. Verified Temporal Anchors:
   Use the verified Wikidata inception/culmination dates provided in the payload. Do not invent timestamps. Provide chronologically ordered milestone anchors with verified secondary/primary citations.
4. Quantified Structural Similarity Score:
   Score each dimension from 0.00 (completely divergent/antithetical) to 1.00 (isomorphic alignment). Reserve high scores (>0.75) strictly for dimensions where the underlying causal mechanics are genuinely identical.
5. Historiographical Consensus & Safeguards:
   Synthesize the consensus of modern peer-reviewed scholarship. Articulate explicit warnings against popular historical fallacies, teleological shortcuts, and false equivalences.
"""


def build_comparative_prompt(
    event_a_meta: dict, event_b_meta: dict, event_a_wiki: dict, event_b_wiki: dict
) -> str:
    """Format structured user prompt incorporating verified metadata and grounding corpora."""
    return f"""
EVALUATE AND SYNTHESIZE THE FOLLOWING TWO HISTORICAL EVENTS:

=== EVENT A: {event_a_meta.get('label')} ===
- Wikidata QID: {event_a_meta.get('qid', 'Unverified')}
- Entity Description: {event_a_meta.get('description', '')}
- Verified Temporal Bounds: {event_a_meta.get('dates', {})}
- Primary Recorded Entities/Participants: {', '.join(event_a_meta.get('participants', [])) or 'None explicitly recorded'}
- Grounding Encyclopedic Corpus:
{event_a_wiki.get('summary', 'No summary available.')}

=== EVENT B: {event_b_meta.get('label')} ===
- Wikidata QID: {event_b_meta.get('qid', 'Unverified')}
- Entity Description: {event_b_meta.get('description', '')}
- Verified Temporal Bounds: {event_b_meta.get('dates', {})}
- Primary Recorded Entities/Participants: {', '.join(event_b_meta.get('participants', [])) or 'None explicitly recorded'}
- Grounding Encyclopedic Corpus:
{event_b_wiki.get('summary', 'No summary available.')}

INSTRUCTIONS:
Generate a complete, typed HistoricalComparisonReport strictly adhering to the schema.
Ensure all timeline anchors have realistic timestamps adhering to the verified temporal bounds.
Provide rigorous, academic-grade causal difference analysis for every comparative facet.
"""
