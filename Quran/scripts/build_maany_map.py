#!/usr/bin/env python3

import argparse
import json
import re
import unicodedata
from pathlib import Path
from typing import Any

EXPECTED_ENTRY_COUNT = 11365
QURAN_MARKS = re.compile(
    "[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]"
)
NON_ARABIC_LETTERS = re.compile("[^\u0621-\u064a]")


def normalize(text: str) -> str:
    text = text.replace("ـ", "")
    text = unicodedata.normalize("NFD", text)
    text = QURAN_MARKS.sub("", text)
    text = unicodedata.normalize("NFC", text)
    text = text.replace("ٱ", "ا")
    text = re.sub("[أإآ]", "ا", text)
    text = text.replace("ءَ", "ا").replace("ءا", "ا")
    text = text.replace("ى", "ي").replace("ؤ", "و").replace("ئ", "ي")
    return NON_ARABIC_LETTERS.sub("", text)


def corrected_targets(
    surah_number: int,
    ayah_number: int,
    key: str,
) -> list[tuple[int, str]]:
    if surah_number == 30 and ayah_number == 49 and key == "بَعۡدَ مَوۡتِهَآ":
        return [(50, key)]

    if (
        surah_number == 53
        and ayah_number == 18
        and key == "ٱللَّٰتَ وَٱلۡعُزَّىٰ ۞ وَمَنَوٰةَ"
    ):
        return [
            (19, "ٱللَّٰتَ وَٱلۡعُزَّىٰ"),
            (20, "وَمَنَوٰةَ"),
        ]

    if (
        surah_number == 53
        and ayah_number == 18
        and key == "ٱلثَّالِثَةَ ٱلۡأُخۡرَىٰٓ"
    ):
        return [(20, key)]

    return [(ayah_number, key)]


def build_normalized_ayah(
    words: list[str], first_word: int, last_word: int
) -> tuple[str, list[int]]:
    normalized_parts = []
    character_word_indexes = []

    for word_index in range(first_word, last_word + 1):
        normalized_word = normalize(words[word_index])
        normalized_parts.append(normalized_word)
        character_word_indexes.extend([word_index] * len(normalized_word))

    return "".join(normalized_parts), character_word_indexes


def find_ranges(
    words_data: dict[str, Any], ayah_number: int, key: str
) -> list[list[int]]:
    first_word, last_word = words_data["ayahRanges"][ayah_number - 1]
    normalized_ayah, character_word_indexes = build_normalized_ayah(
        words_data["words"], first_word, last_word
    )
    normalized_key = normalize(key)

    if not normalized_key:
        raise RuntimeError(f"Meaning key has no Arabic letters: {key!r}")

    ranges = []
    search_from = 0
    while True:
        match_start = normalized_ayah.find(normalized_key, search_from)
        if match_start == -1:
            break
        match_end = match_start + len(normalized_key) - 1
        ranges.append(
            [
                character_word_indexes[match_start],
                character_word_indexes[match_end],
            ]
        )
        search_from = match_start + len(normalized_key)

    return ranges


def build_map(
    maany: list[dict[str, dict[str, str]]],
    suras_by_words: list[dict[str, Any]],
) -> dict[str, Any]:
    mapped_surahs: list[dict[str, list[dict[str, Any]]]] = [
        {} for _ in range(len(maany))
    ]
    entry_count = 0
    corrected_entry_count = 0

    for surah_index, surah_maany in enumerate(maany):
        surah_number = surah_index + 1
        for source_ayah_text, entries in surah_maany.items():
            source_ayah = int(source_ayah_text)
            for key, meaning in entries.items():
                entry_count += 1
                targets = corrected_targets(surah_number, source_ayah, key)
                if targets != [(source_ayah, key)]:
                    corrected_entry_count += 1

                segments = []
                target_ayahs = []
                for target_ayah, target_key in targets:
                    ranges = find_ranges(
                        suras_by_words[surah_index], target_ayah, target_key
                    )
                    if not ranges:
                        raise RuntimeError(
                            f"Unable to map {surah_number}:{source_ayah} "
                            f"{key!r} to ayah {target_ayah} as {target_key!r}"
                        )
                    target_ayahs.append(target_ayah)
                    segments.append(
                        {
                            "ayah": target_ayah,
                            "key": target_key,
                            "ranges": ranges,
                        }
                    )

                mapped_entry = {
                    "key": key,
                    "meaning": meaning,
                    "sourceAyah": source_ayah,
                    "segments": segments,
                }
                for target_ayah in target_ayahs:
                    mapped_surahs[surah_index].setdefault(
                        str(target_ayah), []
                    ).append(mapped_entry)

    if entry_count != EXPECTED_ENTRY_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_ENTRY_COUNT} Maany entries, got {entry_count}"
        )
    if corrected_entry_count != 3:
        raise RuntimeError(
            f"Expected 3 corrected Maany entries, got {corrected_entry_count}"
        )

    return {
        "version": 1,
        "entryCount": entry_count,
        "correctedEntryCount": corrected_entry_count,
        "surahs": mapped_surahs,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build the offline Maany-to-Quran word range map."
    )
    parser.add_argument("--check", action="store_true", help="Validate without writing")
    args = parser.parse_args()

    quran_dir = Path(__file__).resolve().parents[1]
    maany = json.loads((quran_dir / "surasMaany.json").read_text(encoding="utf-8"))
    suras_by_words = json.loads(
        (quran_dir / "surasByWords.json").read_text(encoding="utf-8")
    )
    mapped = build_map(maany, suras_by_words)

    output_path = quran_dir / "surasMaanyMapped.json"
    serialized = json.dumps(mapped, ensure_ascii=False, separators=(",", ":")) + "\n"
    if args.check:
        if not output_path.exists():
            raise RuntimeError(f"Generated map does not exist: {output_path}")
        if output_path.read_text(encoding="utf-8") != serialized:
            raise RuntimeError("Generated Maany map is stale; run npm run maany:build")
    else:
        output_path.write_text(serialized, encoding="utf-8")

    print(
        f"Mapped {mapped['entryCount']} Maany entries with "
        f"{mapped['correctedEntryCount']} corrected source records"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())