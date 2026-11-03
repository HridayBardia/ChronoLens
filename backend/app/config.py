import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    APP_NAME: str = "ChronoLens Core Engine"
    VERSION: str = "1.0.4"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str | None = os.getenv("OPENAI_BASE_URL", None)
    MODEL_NAME: str = os.getenv("MODEL_NAME", "gpt-4o")
    USER_AGENT: str = (
        "ChronoLens/1.0 (Enterprise Historiographical Analytical Platform; mailto:research@chronolens.internal)"
    )
    WIKIDATA_SPARQL_URL: str = "https://query.wikidata.org/sparql"
    WIKIDATA_SEARCH_URL: str = "https://www.wikidata.org/w/api.php"
    WIKIPEDIA_API_URL: str = "https://en.wikipedia.org/w/api.php"
    ENABLE_OFFLINE_SYNTHESIS_FALLBACK: bool = True


settings = Settings()
