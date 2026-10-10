"""
Enhanced TF-IDF and lexical retriever for finding relevant chunks.

Uses sublinear TF-IDF with n-grams, query expansion for functional queries,
and lexical term matching to rank chunks by topical and semantic relevance.
"""

import logging
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .document_store import TextChunk

logger = logging.getLogger(__name__)

# Maximum number of chunks to return per query
DEFAULT_TOP_K = 5

# Minimum similarity score threshold to eliminate noise/unrelated chunks
MIN_SCORE_THRESHOLD = 0.015

# Functional synonyms for common study/engineering query intents
INTENT_EXPANSIONS: dict[str, list[str]] = {
    "working": ["how it works", "flow", "workflow", "process", "steps", "mechanism", "operation"],
    "work": ["works", "function", "flow", "operation", "architecture"],
    "function": ["functioning", "operation", "role", "mechanism"],
    "purpose": ["goal", "objective", "aim", "problem statement", "solution"],
    "architecture": ["components", "system design", "technology stack", "modules"],
    "implementation": ["code", "stack", "technology", "pipeline", "execution"],
    "features": ["capabilities", "components", "main features", "modules"],
    "overview": ["summary", "introduction", "background", "problem", "solution"],
}


def _expand_query(query: str) -> str:
    """Expand conversational query terms with domain/functional keywords."""
    tokens = re.findall(r"[a-zA-Z0-9]+", query.lower())
    expansions: list[str] = []
    for token in tokens:
        if token in INTENT_EXPANSIONS:
            expansions.extend(INTENT_EXPANSIONS[token])
    if expansions:
        return query + " " + " ".join(expansions)
    return query


def _lexical_keyword_boost(query: str, chunk_text: str) -> float:
    """
    Calculate an additional lexical coverage score based on query keywords
    present in the chunk text.
    """
    # Extract query words (excluding very short/common terms)
    query_words = set(re.findall(r"[a-zA-Z0-9]{3,}", query.lower()))
    if not query_words:
        return 0.0

    chunk_lower = chunk_text.lower()
    matched = 0
    for word in query_words:
        # Check exact word or simple stem match
        stem = word[:-1] if len(word) > 4 and word.endswith(("s", "d")) else word
        if word in chunk_lower or stem in chunk_lower:
            matched += 1

    return matched / len(query_words)


def retrieve_relevant_chunks(
    query: str,
    chunks: list[TextChunk],
    top_k: int = DEFAULT_TOP_K,
) -> list[dict]:
    """
    Given a *query* string and a list of TextChunks, return the top-K
    most relevant chunks ranked by enhanced TF-IDF and keyword matching.

    Returns a list of dicts with keys:
        text, filename, page_number, score
    """
    if not chunks:
        return []

    clean_query = query.strip()
    if not clean_query:
        return []

    # Expand query with intent synonyms (e.g. "working" -> "flow", "process", "steps")
    expanded_query = _expand_query(clean_query)

    # Build corpus: first element is the expanded query, rest are chunk texts
    corpus = [expanded_query] + [c.text for c in chunks]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=10_000,
        ngram_range=(1, 2),
        sublinear_tf=True,  # Replace tf with 1 + log(tf) to prevent dominant frequencies
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        logger.warning("TF-IDF vectorization failed; returning empty results.")
        return []

    # Cosine similarity between query (row 0) and each chunk
    cosine_sims = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    scored_chunks: list[tuple[float, int]] = []
    for idx, raw_score in enumerate(cosine_sims):
        tfidf_score = float(raw_score)
        # Require actual TF-IDF overlap with the query or its intent expansions
        if tfidf_score <= 0.005:
            continue

        # Combine TF-IDF with keyword presence boost
        lex_boost = _lexical_keyword_boost(clean_query, chunks[idx].text)
        combined_score = (0.70 * tfidf_score) + (0.30 * lex_boost)

        # Enforce minimum score threshold to eliminate noise and spurious matches
        if combined_score >= 0.035:
            scored_chunks.append((combined_score, idx))

    # Rank by descending combined score
    scored_chunks.sort(key=lambda item: item[0], reverse=True)
    top_matches = scored_chunks[:top_k]

    results: list[dict] = []
    for score, idx in top_matches:
        chunk = chunks[idx]
        results.append(
            {
                "text": chunk.text,
                "filename": chunk.filename,
                "page_number": chunk.page_number,
                "score": round(score, 4),
            }
        )

    logger.info(
        "Retrieved %d relevant chunks (top score: %.4f)",
        len(results),
        results[0]["score"] if results else 0.0,
    )
    return results

