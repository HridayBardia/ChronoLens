import pytest
import asyncio
from app.services.wikidata import fetch_wikidata_event_meta, format_wikidata_date
from app.services.wikipedia_rag import fetch_wikipedia_context
from app.services.llm_engine import generate_historical_comparison
from app.schemas.comparison import HistoricalComparisonReport

def test_date_formatting():
    assert format_wikidata_date("-0044-03-15T00:00:00Z") == "44 BCE"
    assert format_wikidata_date("+0476-09-04T00:00:00Z") == "476 CE"
    assert format_wikidata_date("+1991-12-25T00:00:00Z") == "1991-12-25"
    assert format_wikidata_date("+1789-00-00T00:00:00Z") == "1789"

@pytest.mark.asyncio
async def test_wikidata_resolution():
    meta = await fetch_wikidata_event_meta("Fall of the Western Roman Empire")
    assert meta is not None
    assert meta["qid"] is not None
    assert "Q" in meta["qid"]
    assert meta["label"] != ""

@pytest.mark.asyncio
async def test_wikipedia_rag():
    wiki = await fetch_wikipedia_context("Collapse of the Soviet Union")
    assert wiki is not None
    assert len(wiki["summary"]) > 50

@pytest.mark.asyncio
async def test_end_to_end_synthesis():
    meta_a = await fetch_wikidata_event_meta("Fall of the Western Roman Empire")
    meta_b = await fetch_wikidata_event_meta("Collapse of the Soviet Union")
    
    wiki_a = await fetch_wikipedia_context(meta_a["label"], meta_a["qid"])
    wiki_b = await fetch_wikipedia_context(meta_b["label"], meta_b["qid"])
    
    report = await generate_historical_comparison(meta_a, meta_b, wiki_a, wiki_b)
    
    assert isinstance(report, HistoricalComparisonReport)
    assert report.event_a.event_name != ""
    assert report.event_b.event_name != ""
    assert len(report.comparative_facets) >= 3
    assert len(report.event_a.timeline) >= 2
    assert len(report.event_b.timeline) >= 2
    assert len(report.hallucination_safeguard_notes) >= 1
    assert report.historiographical_consensus != ""

@pytest.mark.asyncio
async def test_asymmetric_duration_comparison():
    """Test comparing events with extreme chronological asymmetry."""
    meta_a = await fetch_wikidata_event_meta("Hundred Years' War")
    meta_b = await fetch_wikidata_event_meta("Six-Day War")
    
    wiki_a = await fetch_wikipedia_context(meta_a["label"], meta_a["qid"])
    wiki_b = await fetch_wikipedia_context(meta_b["label"], meta_b["qid"])
    
    report = await generate_historical_comparison(meta_a, meta_b, wiki_a, wiki_b)
    assert isinstance(report, HistoricalComparisonReport)
    assert len(report.comparative_facets) > 0

