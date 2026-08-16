#!/usr/bin/env python3

import argparse
import hashlib
import json
import re
import urllib.request
from pathlib import Path
from typing import Any

API_URL = "https://api.alquran.cloud/v1/quran/quran-uthmani"
EXPECTED_SURAH_COUNT = 114
EXPECTED_AYAH_COUNT = 6236
EXPECTED_TEXT_SHA256 = "eb6894f5d72f9a2bfba537a7453047b75dc69cbf8dac0165fccfb99839aa19fa"
WORD_SEPARATOR = "\u200e"
BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
BASMALA_PREFIXES = (BASMALA, "بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
QURAN_MARKS = re.compile("[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]")


def starts_with_basmala(text: str) -> bool:
    unmarked = QURAN_MARKS.sub("", text).replace("ٱ", "ا")
    return unmarked.startswith("بسم الله الرحمن الرحيم")


def fetch_quran(timeout: int) -> dict[str, Any]:
    request = urllib.request.Request(
        API_URL,
        headers={"User-Agent": "Learn-Quran-App/1.0"},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))

    if payload.get("code") != 200 or payload.get("status") != "OK":
        raise RuntimeError("The Quran API returned an unsuccessful response")

    data = payload.get("data")
    edition = data.get("edition", {}) if isinstance(data, dict) else {}
    if edition.get("identifier") != "quran-uthmani":
        raise RuntimeError(f"Unexpected Quran edition: {edition!r}")

    return data


def validate_source(source: dict[str, Any]) -> list[dict[str, Any]]:
    surahs = source.get("surahs")
    if not isinstance(surahs, list) or len(surahs) != EXPECTED_SURAH_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_SURAH_COUNT} source surahs, got "
            f"{len(surahs) if isinstance(surahs, list) else 'invalid data'}"
        )

    total_ayahs = 0
    text_hash = hashlib.sha256()
    for expected_surah_number, surah in enumerate(surahs, start=1):
        if surah.get("number") != expected_surah_number:
            raise RuntimeError(
                f"Expected source surah {expected_surah_number}, got {surah.get('number')}"
            )

        ayahs = surah.get("ayahs")
        if not isinstance(ayahs, list) or not ayahs:
            raise RuntimeError(f"Source surah {expected_surah_number} has no ayahs")

        for expected_ayah_number, ayah in enumerate(ayahs, start=1):
            if ayah.get("numberInSurah") != expected_ayah_number:
                raise RuntimeError(
                    f"Invalid ayah sequence at {expected_surah_number}:"
                    f"{expected_ayah_number}"
                )
            if not isinstance(ayah.get("text"), str) or not ayah["text"].strip():
                raise RuntimeError(
                    f"Missing text at {expected_surah_number}:{expected_ayah_number}"
                )
            text = ayah["text"].lstrip("\ufeff")
            text_hash.update(
                f"{expected_surah_number}:{expected_ayah_number}:{text}\n".encode(
                    "utf-8"
                )
            )

        total_ayahs += len(ayahs)

    if total_ayahs != EXPECTED_AYAH_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_AYAH_COUNT} source ayahs, got {total_ayahs}"
        )
    if text_hash.hexdigest() != EXPECTED_TEXT_SHA256:
        raise RuntimeError(
            "The quran-uthmani text differs from the verified source checksum; "
            "review the upstream change before updating EXPECTED_TEXT_SHA256"
        )

    return surahs


def merge_ayah_text(
    local_suras: list[list[dict[str, Any]]],
    source_surahs: list[dict[str, Any]],
) -> list[list[dict[str, Any]]]:
    if len(local_suras) != EXPECTED_SURAH_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_SURAH_COUNT} local surahs, got {len(local_suras)}"
        )

    for surah_index, (local_ayahs, source_surah) in enumerate(
        zip(local_suras, source_surahs), start=1
    ):
        source_ayahs = source_surah["ayahs"]
        if len(local_ayahs) != len(source_ayahs):
            raise RuntimeError(
                f"Ayah count mismatch for surah {surah_index}: "
                f"local={len(local_ayahs)} source={len(source_ayahs)}"
            )

        for ayah_index, (local_ayah, source_ayah) in enumerate(
            zip(local_ayahs, source_ayahs), start=1
        ):
            if local_ayah.get("rakam") != ayah_index:
                raise RuntimeError(
                    f"Invalid local ayah number at {surah_index}:{ayah_index}"
                )
            text = source_ayah["text"].lstrip("\ufeff")
            if surah_index != 1 and ayah_index == 1:
                for prefix in BASMALA_PREFIXES:
                    if text.startswith(prefix):
                        text = text[len(prefix) :].lstrip()
                        break
            local_ayah["ayah"] = text

    if local_suras[0][0]["ayah"] != BASMALA:
        raise RuntimeError("Al-Fatiha ayah 1 must remain the standalone basmala")
    prefixed_surahs = [
        surah_number
        for surah_number, ayahs in enumerate(local_suras[1:], start=2)
        if starts_with_basmala(ayahs[0]["ayah"])
    ]
    if prefixed_surahs:
        raise RuntimeError(
            f"Non-Fatiha first ayahs still contain basmala: {prefixed_surahs}"
        )

    return local_suras


def generate_suras_by_words(
    suras: list[list[dict[str, Any]]],
    suras_list: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    if len(suras_list) != EXPECTED_SURAH_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_SURAH_COUNT} surah metadata records, got {len(suras_list)}"
        )

    generated = []
    for surah_index, ayahs in enumerate(suras):
        words: list[str] = []
        first_words: list[int] = []
        last_words: list[int] = []
        ayah_ranges: list[list[int]] = []

        for ayah in ayahs:
            ayah_words = ayah["ayah"].split()
            words.append(WORD_SEPARATOR)
            first_word = len(words)
            words.extend(ayah_words)
            last_word = len(words) - 1

            first_words.append(first_word)
            last_words.append(last_word)
            ayah_ranges.append([first_word, last_word])

        generated.append(
            {
                "name": suras_list[surah_index]["name"],
                "words": words,
                "lastWordsinAyah": last_words,
                "firstWordsinAyah": first_words,
                "ayahRanges": ayah_ranges,
            }
        )

    return generated


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=4) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Import verified Uthmani Quran text and regenerate word indexes."
    )
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--check", action="store_true", help="Validate without writing")
    args = parser.parse_args()

    quran_dir = Path(__file__).resolve().parents[1]
    suras_path = quran_dir / "suras.json"
    suras_list_path = quran_dir / "surasList.json"
    words_path = quran_dir / "surasByWords.json"

    local_suras = json.loads(suras_path.read_text(encoding="utf-8"))
    suras_list = json.loads(suras_list_path.read_text(encoding="utf-8"))
    source_surahs = validate_source(fetch_quran(args.timeout))
    merged_suras = merge_ayah_text(local_suras, source_surahs)
    generated_words = generate_suras_by_words(merged_suras, suras_list)

    if not args.check:
        write_json(suras_path, merged_suras)
        write_json(words_path, generated_words)

    print(
        f"Validated {len(merged_suras)} surahs and "
        f"{sum(len(surah) for surah in merged_suras)} ayahs "
        f"from quran-uthmani"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())