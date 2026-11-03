import asyncio
import logging

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas.comparison import (
    CompareRequest,
    EntityMetadata,
    HistoricalComparisonReport,
)
from app.services.llm_engine import generate_historical_comparison
from app.services.wikidata import fetch_wikidata_event_meta
from app.services.wikipedia_rag import fetch_wikipedia_context

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("chronolens.api")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Enterprise Historiographical Analytical Platform powered by Wikidata SPARQL, Wikipedia RAG, and Constrained Pydantic Synthesis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "engine": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "endpoints": {
            "health": "/api/v1/health",
            "compare": "/api/v1/compare",
            "lookup": "/api/v1/lookup",
        },
    }


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "engine_version": settings.VERSION,
        "wikidata_sparql": "REACHABLE",
        "has_openai_key": bool(
            settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10
        ),
        "model": settings.MODEL_NAME,
    }


@app.get("/api/v1/lookup", response_model=EntityMetadata)
async def lookup_entity(
    q: str = Query(..., min_length=2, description="Historical entity query")
):
    """Lookup and resolve Wikidata QID and Wikipedia summary for an entity."""
    try:
        wikidata_meta = await fetch_wikidata_event_meta(q)
        wiki_ctx = await fetch_wikipedia_context(
            wikidata_meta.get("label", q), wikidata_meta.get("qid")
        )
        return EntityMetadata(
            qid=wikidata_meta.get("qid"),
            label=wikidata_meta.get("label", q),
            description=wikidata_meta.get("description", ""),
            dates=wikidata_meta.get("dates", {}),
            wikipedia_summary=wiki_ctx.get("summary"),
            aliases=wikidata_meta.get("aliases", []),
        )
    except Exception as exc:
        logger.error(f"Entity lookup error for '{q}': {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/v1/compare", response_model=HistoricalComparisonReport)
async def compare_events(payload: CompareRequest):
    """
    Execute deterministic, hybrid comparative synthesis:
    1. Query Wikidata SPARQL concurrently for indisputable temporal anchors & actors.
    2. Query authoritative Wikipedia corpus for lead contextual extraction.
    3. Synthesize structural comparative report with typed Pydantic schema validation.
    """
    logger.info(
        f"Initiating comparative analysis: '{payload.event_a}' vs '{payload.event_b}'"
    )

    try:
        # Step 1: Concurrently resolve Wikidata anchors
        meta_a_task = fetch_wikidata_event_meta(payload.event_a)
        meta_b_task = fetch_wikidata_event_meta(payload.event_b)
        meta_a, meta_b = await asyncio.gather(meta_a_task, meta_b_task)

        # Step 2: Concurrently pull encyclopedic grounding context
        label_a = meta_a.get("label") or payload.event_a
        label_b = meta_b.get("label") or payload.event_b

        wiki_a_task = fetch_wikipedia_context(label_a, meta_a.get("qid"))
        wiki_b_task = fetch_wikipedia_context(label_b, meta_b.get("qid"))
        wiki_a, wiki_b = await asyncio.gather(wiki_a_task, wiki_b_task)

        # Step 3: Enforce structured synthesis
        report = await generate_historical_comparison(meta_a, meta_b, wiki_a, wiki_b)

        return report

    except Exception as exc:
        logger.error(f"Comparative synthesis pipeline failure: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Historiographical synthesis failure: {exc!s}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
