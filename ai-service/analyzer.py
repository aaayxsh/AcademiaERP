import math
import re
from typing import Dict, Any, List

# Characteristic formulaic phrases often over-indexed in typical AI generation
AI_FORMULAIC_MARKERS = [
    "in conclusion", "moreover", "furthermore", "it is crucial to", "it is important to note",
    "delves into", "multifaceted", "pivotal role", "testament to", "harnessing the power",
    "plays a vital role", "a wide range of", "in today's digital landscape",
    "by leveraging", "serves as a", "not only", "in summary", "fosters a",
    "demystify", "embark on", "tapestry", "holistic approach", "beacon of"
]

def tokenize_sentences(text: str) -> List[str]:
    """Split text into sentences using punctuation boundaries."""
    raw_sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip()) > 3]
    return sentences

def tokenize_words(text: str) -> List[str]:
    """Tokenize words and convert to lowercase."""
    return re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())

def calculate_shannon_entropy(tokens: List[str]) -> float:
    """Calculate Shannon entropy (in bits) of the token frequency distribution."""
    if not tokens:
        return 0.0
    freq_map: Dict[str, int] = {}
    for t in tokens:
        freq_map[t] = freq_map.get(t, 0) + 1
    total = len(tokens)
    entropy = 0.0
    for count in freq_map.values():
        p = count / total
        entropy -= p * math.log2(p)
    return round(entropy, 3)

def analyze_stylometry(text: str) -> Dict[str, Any]:
    """
    Performs CPU-friendly stylometric and statistical analysis on text.
    Returns structured signals, AI-likelihood estimate, and explicit disclaimers.
    """
    words = tokenize_words(text)
    sentences = tokenize_sentences(text)
    word_count = len(words)
    sentence_count = len(sentences)

    # Sample sufficiency check
    if word_count < 60:
        return {
            "status": "INSUFFICIENT_EVIDENCE",
            "aiLikelihoodScore": 0.0,
            "confidence": "LOW",
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "signals": {
                "sampleSufficiency": False,
                "reason": "Sample contains fewer than 60 words. Reliable stylometric profiling requires longer text samples to avoid false positives."
            },
            "disclaimer": "Sample insufficient for automated evaluation. Faculty review is mandatory.",
            "limitations": [
                "Short submissions (under 60 words) produce unreliable variance metrics.",
                "Short responses, formulas, or code snippets cannot be reliably classified."
            ]
        }

    # 1. Lexical Diversity
    unique_words = set(words)
    type_token_ratio = round(len(unique_words) / word_count, 3)
    # Root Type-Token Ratio reduces sample size bias
    root_ttr = round(len(unique_words) / math.sqrt(word_count), 2)
    hapax_legomena = sum(1 for w in unique_words if words.count(w) == 1)
    hapax_ratio = round(hapax_legomena / len(unique_words), 3)

    # 2. Shannon Entropy
    entropy = calculate_shannon_entropy(words)

    # 3. Sentence Length Statistics & Variance
    sentence_lengths = [len(tokenize_words(s)) for s in sentences if len(tokenize_words(s)) > 0]
    if sentence_lengths:
        mean_sentence_len = round(sum(sentence_lengths) / len(sentence_lengths), 2)
        variance = sum((l - mean_sentence_len) ** 2 for l in sentence_lengths) / len(sentence_lengths)
        sentence_len_std = round(math.sqrt(variance), 2)
    else:
        mean_sentence_len = 0.0
        sentence_len_std = 0.0

    # 4. Formulaic / Over-Indexed Transition Density
    text_lower = text.lower()
    marker_hits = []
    for marker in AI_FORMULAIC_MARKERS:
        count = len(re.findall(r'\b' + re.escape(marker) + r'\b', text_lower))
        if count > 0:
            marker_hits.append({"marker": marker, "count": count})
    
    total_marker_count = sum(m["count"] for m in marker_hits)
    marker_density_per_100w = round((total_marker_count / word_count) * 100, 2)

    # 5. Synthesize Heuristic AI-Likelihood Score (0.00 - 1.00)
    # Calibrated indicators:
    # A) Sentence uniformity: AI text standard deviation is typically narrow (3.0 - 5.5). Human text has high variance (> 7.0).
    uniformity_score = 0.0
    if sentence_len_std < 4.0:
        uniformity_score = 0.40
    elif sentence_len_std < 6.0:
        uniformity_score = 0.25
    elif sentence_len_std < 8.0:
        uniformity_score = 0.10
    else:
        uniformity_score = 0.00

    # B) Formulaic transition marker density
    marker_score = min(0.35, marker_density_per_100w * 0.15)

    # C) Entropy & vocabulary regularity
    # Extreme uniformity in entropy (narrow 6.5 - 7.5 range) + moderate TTR
    entropy_score = 0.0
    if 6.2 <= entropy <= 7.6:
        entropy_score = 0.15
    elif entropy > 8.2 or entropy < 5.0:
        entropy_score = -0.10  # Very high/low entropy is typical of technical or colloquial human writing

    # D) Hapax Legomena Ratio (human writing tends to have high one-off words > 0.55)
    hapax_score = 0.0
    if hapax_ratio < 0.45:
        hapax_score = 0.10
    elif hapax_ratio > 0.60:
        hapax_score = -0.10

    # Combined heuristic estimate
    raw_score = 0.10 + uniformity_score + marker_score + entropy_score + hapax_score
    ai_score = max(0.02, min(0.96, round(raw_score, 2)))

    # Classification confidence and label
    if ai_score >= 0.65:
        confidence = "HIGH"
        disposition_suggestion = "Requires faculty review (elevated uniformity & formulaic transition signals)."
    elif ai_score >= 0.38:
        confidence = "MODERATE"
        disposition_suggestion = "Mixed stylometric signals; faculty advisory review recommended."
    else:
        confidence = "LOW"
        disposition_suggestion = "Stylometric signals align with natural human structural variance."

    return {
        "status": "COMPLETED",
        "aiLikelihoodScore": ai_score,
        "confidence": confidence,
        "wordCount": word_count,
        "sentenceCount": sentence_count,
        "signals": {
            "typeTokenRatio": type_token_ratio,
            "rootTypeTokenRatio": root_ttr,
            "shannonEntropy": entropy,
            "meanSentenceLength": mean_sentence_len,
            "sentenceLengthStdDev": sentence_len_std,
            "hapaxLegomenaRatio": hapax_ratio,
            "markerDensityPer100Words": marker_density_per_100w,
            "detectedMarkers": marker_hits[:5]
        },
        "advisory": disposition_suggestion,
        "disclaimer": "Heuristic stylometric decision-support only. This is not proof of misconduct. Stylometric analysis can yield false positives for non-native English writers, highly structured technical summaries, or template-based reports. Faculty members retain sole authority over all academic integrity determinations.",
        "limitations": [
            "Detector does not access proprietary LLM token probabilities.",
            "Technical, mathematical, and legal documentation naturally exhibit repetitive vocabulary and uniform syntax.",
            "Paraphrasing tools and multi-author documents can distort stylometric metrics."
        ]
    }
