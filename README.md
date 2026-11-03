# ChronoLens // Enterprise Historiographical Analytical Platform

**ChronoLens** is an intelligence-grade, deterministic analytical platform for structured, isomorphic historical and geopolitical event comparison.

Unlike generic conversational wrappers that hallucinate dates and force superficial analogies, ChronoLens pairs **empirical entity normalization via Wikidata SPARQL** and **authoritative encyclopedic retrieval (RAG)** with **schema-constrained Pydantic synthesis (Instructor)**, rendered in a **Bloomberg / Palantir Gotham-inspired technical analyst workstation**.

---

## 1. System Architecture

```
User Input: [Event A, Event B]
                    │
                    ▼
       ┌─────────────────────────┐
       │   Entity Normalizer     │ ──► Resolves Wikipedia / Wikidata QIDs
       └────────────┬────────────┘
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
┌──────────────┐          ┌──────────────┐
│  Wikidata    │          │ Authoritative│
│  SPARQL      │          │ Context RAG  │
│  (Anchors &  │          │ (Wikipedia / │
│ Key Figures) │          │ Corpora)     │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    ▼
     ┌─────────────────────────────┐
     │ Instructor + Pydantic Engine│ ──► Enforces typed, causal schema
     └──────────────┬──────────────┘
                    ▼
       ┌─────────────────────────┐
       │ FastAPI Backend Service │ ──► Port 8000
       └────────────┬────────────┘
                    ▼
       ┌─────────────────────────┐
       │ Next.js 14 / Tailwind UI│ ──► Port 3000
       └─────────────────────────┘
```

---

## 2. Directory Structure

```
chronolens/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI server entry point & CORS
│   │   ├── config.py                 # Environment variables & API settings
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── comparison.py         # Complete Pydantic schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── wikidata.py           # SPARQL client & entity resolver
│   │   │   ├── wikipedia_rag.py      # Authoritative corpus ingestion
│   │   │   └── llm_engine.py         # Instructor structured synthesis & fallback
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── prompts.py            # Anti-symmetric system prompts
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_comparisons.py       # Pytest unit & integration tests
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Main workstation dashboard
│   │   │   └── globals.css           # Terminal styles & print stylesheet
│   │   ├── components/
│   │   │   ├── Header.tsx            # Technical telemetry status bar
│   │   │   ├── QueryBar.tsx          # Dual input interface & presets
│   │   │   ├── EventMetadataCard.tsx # Entity metadata & Wikidata QID badge
│   │   │   ├── DimensionMatrix.tsx   # Isomorphic comparative matrix
│   │   │   ├── ParallelTimeline.tsx  # Dual synchronized chronological rails
│   │   │   ├── SafeguardBanner.tsx   # Peer consensus & anti-fallacy flags
│   │   │   └── ExportModal.tsx       # Raw JSON dossier export modal
│   │   └── types/
│   │       └── comparison.ts         # TypeScript schema mirroring Pydantic
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 3. Core Engine Mechanics

1. **Deterministic Chronology (No Date Guessing)**:
   - Queries `https://query.wikidata.org/sparql` directly.
   - Extracts `P580` (start time), `P582` (end time), `P585` (point in time), `P571` (inception), `P576` (dissolution), and `P710` (participants).
   - Standardizes BCE/CE dates (e.g. `44 BCE`, `476 CE`, `1991-12-25`).
2. **Schema-Enforced Structural Comparison**:
   - Uses `instructor` with Pydantic v2 to strictly validate comparative facets.
   - Every facet contains quantified similarity scores ($0.00$ to $1.00$), distinct manifestations, and causal divergence analysis.
   - Anti-symmetric bias prompt prevents invented false parallels.
3. **Analyst Workstation UI Aesthetic**:
   - Dark monochrome palette (`bg-neutral-950`, `border-neutral-800`), dense monospace telemetry tags, alignment progress bars, and dual-rail milestone visualization.
   - One-click **JSON Dossier Export** and printable **Analytical Brief (PDF)** formatted with print stylesheets.

---

## 4. Quickstart Guide

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your OpenAI API key in backend/.env:
# OPENAI_API_KEY=your_key_here
# If no key is configured, ChronoLens runs in deterministic empirical synthesis mode!

# Run tests
pytest -v tests/test_comparisons.py

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The FastAPI Swagger documentation is accessible at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Or build for production
npm run build
npm start
```

Open `http://localhost:3000` in your browser.

---

## 5. API Reference

### `POST /api/v1/compare`
Executes concurrent Wikidata resolution, Wikipedia context ingestion, and Pydantic structural synthesis.

**Request Payload:**
```json
{
  "event_a": "Fall of the Western Roman Empire",
  "event_b": "Collapse of the Soviet Union",
  "deep_analysis": true
}
```

**Response Schema (`HistoricalComparisonReport`):**
```json
{
  "event_a": {
    "event_name": "Fall of the Western Roman Empire",
    "wikidata_id": "Q25345",
    "start_year": "395 CE",
    "end_year": "476 CE",
    "root_causes": ["..."],
    "immediate_catalyst": "...",
    "primary_actors": ["..."],
    "macro_outcomes": ["..."],
    "timeline": [
      {
        "timestamp": "476-09-04",
        "headline": "Deposition of Romulus Augustulus",
        "description": "...",
        "entity_source": "Wikidata wd:Q25345"
      }
    ]
  },
  "event_b": { ... },
  "comparative_facets": [
    {
      "dimension": "Institutional Velocity of Collapse",
      "event_a_manifestation": "...",
      "event_b_manifestation": "...",
      "structural_similarity_score": 0.28,
      "causal_difference": "..."
    }
  ],
  "historiographical_consensus": "...",
  "hallucination_safeguard_notes": ["..."]
}
```

