import logging
import re
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger("chronolens.wikidata")


def parse_year_number(val: str | None) -> int | None:
    """Extract signed integer year from human/ISO string (negative for BCE)."""
    if not val:
        return None
    val = val.strip()
    bce = re.search(r"(\d+)\s*(?:BCE|BC)", val, re.IGNORECASE)
    if bce:
        return -int(bce.group(1))
    ce = re.search(r"(\d+)\s*(?:CE|AD)", val, re.IGNORECASE)
    if ce:
        return int(ce.group(1))
    iso = re.search(r"^-?(\d{1,4})", val)
    if iso:
        is_neg = val.startswith("-")
        y = int(iso.group(1))
        return -y if is_neg else y
    return None


def compute_historical_duration(
    start_str: str | None, end_str: str | None
) -> str | None:
    """Calculate human-readable duration between historical milestones."""
    if not start_str or not end_str:
        return None

    # Check for identical exact date
    if start_str == end_str:
        return "1 day (acute trigger)"

    y_start = parse_year_number(start_str)
    y_end = parse_year_number(end_str)

    if y_start is not None and y_end is not None:
        diff = y_end - y_start
        if diff < 0:
            return None
        if diff == 0:
            # Check for day level strings
            try:
                # e.g., 1967-06-05 to 1967-06-10
                parts_s = [int(p) for p in re.findall(r"\d+", start_str)]
                parts_e = [int(p) for p in re.findall(r"\d+", end_str)]
                if len(parts_s) == 3 and len(parts_e) == 3 and parts_s[1] == parts_e[1]:
                    days = parts_e[2] - parts_s[2] + 1
                    if days > 0:
                        return f"{days} days"
            except Exception:
                pass
            return "< 1 year"
        if diff == 1:
            return "1 year"
        return f"{diff} years"
    return None


def format_wikidata_date(raw_val: str | None) -> str | None:
    """
    Format Wikidata xsd:dateTime string into standardized human/ISO format.
    Handles BCE/CE, year-only, and day-precision timestamps.
    Examples:
      '+0476-09-04T00:00:00Z' -> '476 CE'
      '-0044-03-15T00:00:00Z' -> '44 BCE'
      '+1991-12-26T00:00:00Z' -> '1991-12-26'
    """
    if not raw_val:
        return None

    # Check for negative year (BCE)
    bce_match = re.match(r"^-0*(\d+)", raw_val)
    if bce_match:
        year = int(bce_match.group(1))
        return f"{year} BCE"

    # Check for positive year
    ce_match = re.match(r"^\+?0*(\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?", raw_val)
    if ce_match:
        year_str = ce_match.group(1)
        month_str = ce_match.group(2)
        day_str = ce_match.group(3)
        year = int(year_str)

        if year < 1000:
            return f"{year} CE"
        if (
            month_str
            and day_str
            and month_str not in ("00", "01")
            and day_str not in ("00", "01")
        ):
            return f"{year}-{month_str}-{day_str}"
        return str(year)

    return raw_val


async def fetch_wikidata_event_meta(query_term: str) -> dict[str, Any]:
    """
    Query Wikidata API and SPARQL endpoint to resolve canonical entity metadata,
    exact temporal anchors, empirical causes, effects, and primary actors.
    """
    headers = {"User-Agent": settings.USER_AGENT}
    search_params = {
        "action": "wbsearchentities",
        "search": query_term,
        "language": "en",
        "format": "json",
        "limit": 8,
    }

    qid: str | None = None
    label: str = query_term
    description: str = ""
    aliases: list[str] = []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            search_res = await client.get(
                settings.WIKIDATA_SEARCH_URL, params=search_params, headers=headers
            )
            if search_res.status_code == 200:
                data = search_res.json()
                results = data.get("search", [])
                if results:
                    # Score and rank hits: prioritize historical events, wars, conflicts, pandemics, revolutions
                    best_hit = results[0]
                    for hit in results:
                        desc_lower = (hit.get("description") or "").lower()
                        label_lower = (hit.get("label") or "").lower()
                        # Prefer explicit historical events
                        if any(
                            kw in desc_lower
                            for kw in [
                                "event",
                                "war",
                                "revolution",
                                "collapse",
                                "fall",
                                "pandemic",
                                "epidemic",
                                "period",
                                "treaty",
                                "conflict",
                                "empire",
                                "state",
                            ]
                        ):
                            best_hit = hit
                            break
                        if query_term.lower() == label_lower:
                            best_hit = hit
                            break

                    qid = best_hit.get("id")
                    label = best_hit.get("label", query_term)
                    description = best_hit.get("description", "")
                    aliases = best_hit.get("aliases", [])
    except Exception as exc:
        logger.warning(f"Wikidata entity search error for '{query_term}': {exc}")

    if not qid:
        return {
            "qid": None,
            "label": query_term,
            "description": description or "Historical geopolitical entity or epoch",
            "aliases": aliases,
            "dates": {"start": None, "end": None, "point": None},
            "duration": None,
            "participants": [],
            "causes": [],
            "effects": [],
            "instances": [],
            "locations": [],
            "source": "Unresolved Search Entity",
        }

    # Enhanced SPARQL Query pulling temporal boundaries, causes, effects, locations, and participants
    sparql_query = f"""
    SELECT ?startTime ?endTime ?pointInTime ?inception ?dissolved ?participantLabel ?causeLabel ?effectLabel ?instanceLabel ?locationLabel WHERE {{
      OPTIONAL {{ wd:{qid} wdt:P580 ?startTime. }}
      OPTIONAL {{ wd:{qid} wdt:P582 ?endTime. }}
      OPTIONAL {{ wd:{qid} wdt:P585 ?pointInTime. }}
      OPTIONAL {{ wd:{qid} wdt:P571 ?inception. }}
      OPTIONAL {{ wd:{qid} wdt:P576 ?dissolved. }}
      OPTIONAL {{
        wd:{qid} wdt:P710 ?participant.
        ?participant rdfs:label ?participantLabel.
        FILTER(LANG(?participantLabel) = "en")
      }}
      OPTIONAL {{
        wd:{qid} wdt:P828 ?cause.
        ?cause rdfs:label ?causeLabel.
        FILTER(LANG(?causeLabel) = "en")
      }}
      OPTIONAL {{
        wd:{qid} wdt:P1542 ?effect.
        ?effect rdfs:label ?effectLabel.
        FILTER(LANG(?effectLabel) = "en")
      }}
      OPTIONAL {{
        wd:{qid} wdt:P31 ?instance.
        ?instance rdfs:label ?instanceLabel.
        FILTER(LANG(?instanceLabel) = "en")
      }}
      OPTIONAL {{
        wd:{qid} (wdt:P276|wdt:P17) ?loc.
        ?loc rdfs:label ?locationLabel.
        FILTER(LANG(?locationLabel) = "en")
      }}
    }} LIMIT 15
    """

    dates: dict[str, str | None] = {
        "start": None,
        "end": None,
        "point": None,
    }
    participants: list[str] = []
    causes: list[str] = []
    effects: list[str] = []
    instances: list[str] = []
    locations: list[str] = []

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            sparql_res = await client.get(
                settings.WIKIDATA_SPARQL_URL,
                params={"query": sparql_query, "format": "json"},
                headers=headers,
            )
            if sparql_res.status_code == 200:
                bindings = sparql_res.json().get("results", {}).get("bindings", [])
                for b in bindings:
                    raw_start = b.get("startTime", {}).get("value") or b.get(
                        "inception", {}
                    ).get("value")
                    raw_end = b.get("endTime", {}).get("value") or b.get(
                        "dissolved", {}
                    ).get("value")
                    raw_point = b.get("pointInTime", {}).get("value")

                    if raw_start and not dates["start"]:
                        dates["start"] = format_wikidata_date(raw_start)
                    if raw_end and not dates["end"]:
                        dates["end"] = format_wikidata_date(raw_end)
                    if raw_point and not dates["point"]:
                        dates["point"] = format_wikidata_date(raw_point)

                    p_label = b.get("participantLabel", {}).get("value")
                    if p_label and p_label not in participants:
                        participants.append(p_label)

                    c_label = b.get("causeLabel", {}).get("value")
                    if c_label and c_label not in causes:
                        causes.append(c_label)

                    e_label = b.get("effectLabel", {}).get("value")
                    if e_label and e_label not in effects:
                        effects.append(e_label)

                    i_label = b.get("instanceLabel", {}).get("value")
                    if i_label and i_label not in instances:
                        instances.append(i_label)

                    l_label = b.get("locationLabel", {}).get("value")
                    if l_label and l_label not in locations:
                        locations.append(l_label)

    except Exception as exc:
        logger.warning(f"SPARQL query failed for {qid}: {exc}")

    start_disp = dates["start"] or dates["point"]
    end_disp = dates["end"] or dates["point"] or dates["start"]
    duration = compute_historical_duration(start_disp, end_disp)

    return {
        "qid": qid,
        "label": label,
        "description": description,
        "aliases": aliases[:4],
        "dates": dates,
        "duration": duration,
        "participants": participants[:8],
        "causes": causes[:5],
        "effects": effects[:5],
        "instances": instances[:3],
        "locations": locations[:4],
        "source": f"Wikidata Entity {qid}",
    }
