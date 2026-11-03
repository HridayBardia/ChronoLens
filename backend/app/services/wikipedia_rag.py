import logging
import re
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger("chronolens.wikipedia_rag")


def extract_thematic_excerpts(
    text: str, keywords: list[str], max_len: int = 400
) -> str:
    """Extract substantive sentences matching specific historiographical themes."""
    if not text:
        return ""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    matched = []
    for s in sentences:
        s_clean = s.strip()
        if any(kw.lower() in s_clean.lower() for kw in keywords):
            if len(s_clean) > 30 and s_clean not in matched:
                matched.append(s_clean)
                if sum(len(x) for x in matched) >= max_len:
                    break
    return " ".join(matched) if matched else ""


async def fetch_wikipedia_context(title: str, qid: str | None = None) -> dict[str, Any]:
    """
    Ingest authoritative encyclopedic context from English Wikipedia.
    Extracts canonical lead summary and substantive analytical sections
    (Causes, Background, Impact, Aftermath, Historiography).
    """
    headers = {"User-Agent": settings.USER_AGENT}

    clean_title = title.replace(" ", "_")
    summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{clean_title}"
    extract = ""
    description = ""
    canonical_url = f"https://en.wikipedia.org/wiki/{clean_title}"

    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
            res = await client.get(summary_url, headers=headers)
            if res.status_code == 200:
                data = res.json()
                extract = data.get("extract", "")
                description = data.get("description", "")
                canonical_url = (
                    data.get("content_urls", {})
                    .get("desktop", {})
                    .get("page", canonical_url)
                )
    except Exception as exc:
        logger.warning(f"REST summary fetch failed for '{title}': {exc}")

    # Full lead text via MediaWiki Action API if needed
    full_text = extract
    if len(extract) < 300:
        query_url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "explaintext": 1,
            "exintro": 1,
            "titles": title,
            "redirects": 1,
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(query_url, params=params, headers=headers)
                if res.status_code == 200:
                    pages = res.json().get("query", {}).get("pages", {})
                    for _, page_info in pages.items():
                        if "extract" in page_info:
                            full_text = page_info["extract"]
                            if len(full_text) > len(extract):
                                extract = full_text[:1200]
                            break
        except Exception as exc:
            logger.warning(f"MediaWiki fallback fetch failed for '{title}': {exc}")

    # Thematic mining for causes and outcomes
    causes_excerpt = extract_thematic_excerpts(
        full_text,
        ["cause", "began", "precondition", "crisis", "spark", "origin", "conflict"],
    )
    outcomes_excerpt = extract_thematic_excerpts(
        full_text,
        [
            "result",
            "aftermath",
            "consequence",
            "dissolution",
            "treaty",
            "outcome",
            "ended",
            "impact",
        ],
    )

    return {
        "title": title,
        "summary": extract[:1400] if extract else f"Historical context for {title}.",
        "short_description": description,
        "causes_corpus": causes_excerpt or "Documented historical preconditions.",
        "outcomes_corpus": outcomes_excerpt or "Documented historical ramifications.",
        "url": canonical_url,
    }
