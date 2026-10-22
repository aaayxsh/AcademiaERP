import unittest
from analyzer import analyze_stylometry, calculate_shannon_entropy

class TestAIAnalyzer(unittest.TestCase):
    def test_short_text_insufficient_evidence(self):
        text = "This is a very short text with only ten words total."
        result = analyze_stylometry(text)
        self.assertEqual(result["status"], "INSUFFICIENT_EVIDENCE")
        self.assertFalse(result["signals"]["sampleSufficiency"])

    def test_human_like_text(self):
        text = (
            "Algorithms are fundamental to modern computer science! They solve problems step-by-step. "
            "Yesterday, while debugging our quicksort implementation on a large 10,000 integer array, "
            "we encountered unexpected stack overflows caused by worst-case quadratic pivot selections. "
            "To fix it, we swapped in median-of-three partitioning. Boom! Performance skyrocketed. "
            "The execution latency plummeted from nearly 800 milliseconds down to just 14 milliseconds. "
            "What a thrilling breakthrough! Our team cheered in the lab room."
        )
        result = analyze_stylometry(text)
        self.assertEqual(result["status"], "COMPLETED")
        self.assertIn("aiLikelihoodScore", result)
        self.assertLess(result["aiLikelihoodScore"], 0.65)

    def test_formulaic_text(self):
        text = (
            "In conclusion, it is crucial to understand that artificial intelligence plays a pivotal role "
            "in today's digital landscape. Furthermore, by leveraging machine learning algorithms, organizations "
            "can foster a multifaceted ecosystem of innovation. Moreover, it is important to note that the holistic "
            "approach delves into complex data structures. Harnessing the power of neural networks serves as a beacon "
            "of technological advancement. In summary, this paradigm not only optimizes workflow efficiencies but also "
            "presents a testament to the ever-evolving nature of computational systems."
        )
        result = analyze_stylometry(text)
        self.assertEqual(result["status"], "COMPLETED")
        self.assertGreater(result["signals"]["markerDensityPer100Words"], 0.0)

    def test_entropy_calculation(self):
        tokens = ["apple", "banana", "apple", "cherry"]
        entropy = calculate_shannon_entropy(tokens)
        self.assertGreater(entropy, 0.0)

if __name__ == "__main__":
    unittest.main()
