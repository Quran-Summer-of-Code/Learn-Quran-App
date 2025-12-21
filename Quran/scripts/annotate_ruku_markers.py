#!/usr/bin/env python3

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

API_BASE = "https://api.alquran.cloud/v1"


def _fetch_surah_from_api(surah_number: int, *, timeout_s: int = 30) -> Dict[str, Any]:
    url = f"{API_BASE}/surah/{surah_number}"
    req = urllib.request.Request(url, headers={"User-Agent": "Learn-Quran-App/1.0"})
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if payload.get("status") != "OK" or "data" not in payload:
        raise RuntimeError(
            f"Unexpected API response for surah {surah_number}: {payload!r}"
        )
    return payload["data"]


def _load_or_fetch_surah(
    surah_number: int,
    *,
    cache_dir: Optional[Path],
    timeout_s: int,
    max_retries: int,
    retry_backoff_s: float,
    sleep_between_calls_s: float,
) -> Dict[str, Any]:
    cache_path: Optional[Path] = None
    if cache_dir is not None:
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_path = cache_dir / f"surah-{surah_number}.json"
        if cache_path.exists():
            return json.loads(cache_path.read_text(encoding="utf-8"))

    last_err: Optional[BaseException] = None
    for attempt in range(1, max_retries + 1):
        try:
            data = _fetch_surah_from_api(surah_number, timeout_s=timeout_s)
            if cache_path is not None:
                cache_path.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
                )
            if sleep_between_calls_s > 0:
                time.sleep(sleep_between_calls_s)
            return data
        except (
            urllib.error.HTTPError,
            urllib.error.URLError,
            TimeoutError,
            RuntimeError,
        ) as e:
            last_err = e
            if attempt < max_retries:
                time.sleep(retry_backoff_s * attempt)

    raise RuntimeError(
        f"Failed to fetch surah {surah_number} after {max_retries} retries: {last_err}"
    )


def _compute_ruku_markers(api_ayahs: List[Dict[str, Any]]) -> Dict[int, Dict[str, Any]]:
    """Return markers keyed by api ayah numberInSurah.

    Each marker has shape:
      {"id": <global_ruku_id:int>, "start": <bool>, "end": <bool>}
    """
    markers: Dict[int, Dict[str, Any]] = {}
    prev_ruku: Optional[int] = None
    prev_num: Optional[int] = None

    for idx, ayah in enumerate(api_ayahs):
        num = int(ayah["numberInSurah"])
        ruku_id = int(ayah["ruku"])
        if num not in markers:
            markers[num] = {"id": ruku_id, "start": False, "end": False}

        # Start of a new ruku (or the first ayah)
        if idx == 0 or ruku_id != prev_ruku:
            markers[num]["start"] = True
            # Previous ayah is the end of the previous ruku
            if prev_num is not None:
                markers[prev_num]["end"] = True

        prev_ruku = ruku_id
        prev_num = num

    # Last ayah always ends its ruku
    if prev_num is not None:
        markers[prev_num]["end"] = True

    return markers


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Annotate Quran/Suras.json ayahs with ruku boundaries using api.alquran.cloud. "
            "Adds field: ruku: {id, start, end}."
        )
    )
    parser.add_argument(
        "--input",
        default="Quran/Suras.json",
        help="Path to Suras.json (default: Quran/Suras.json)",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output path (default: overwrite input)",
    )
    parser.add_argument(
        "--cache-dir",
        default=".cache/alquran_cloud",
        help="Cache directory for API responses (default: .cache/alquran_cloud)",
    )
    parser.add_argument(
        "--no-cache",
        action="store_true",
        help="Disable caching API responses",
    )
    parser.add_argument("--timeout", type=int, default=30, help="HTTP timeout seconds")
    parser.add_argument("--retries", type=int, default=5, help="Max HTTP retries")
    parser.add_argument(
        "--retry-backoff",
        type=float,
        default=1.0,
        help="Retry backoff base seconds (multiplied by attempt)",
    )
    parser.add_argument(
        "--sleep",
        type=float,
        default=0.1,
        help="Sleep seconds between successful API calls",
    )

    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else input_path

    suras: List[List[Dict[str, Any]]] = json.loads(
        input_path.read_text(encoding="utf-8")
    )
    if not isinstance(suras, list) or len(suras) != 114:
        raise RuntimeError(
            f"Unexpected Suras.json shape: expected list of 114 surahs, got {type(suras)} len={len(suras) if isinstance(suras, list) else 'n/a'}"
        )

    cache_dir = None if args.no_cache else Path(args.cache_dir)

    for surah_number in range(1, 115):
        local_ayahs = suras[surah_number - 1]
        if not isinstance(local_ayahs, list):
            raise RuntimeError(f"Surah {surah_number} is not a list")

        api_data = _load_or_fetch_surah(
            surah_number,
            cache_dir=cache_dir,
            timeout_s=args.timeout,
            max_retries=args.retries,
            retry_backoff_s=args.retry_backoff,
            sleep_between_calls_s=args.sleep,
        )
        api_ayahs = api_data.get("ayahs")
        if not isinstance(api_ayahs, list) or not api_ayahs:
            raise RuntimeError(f"API returned no ayahs for surah {surah_number}")

        markers_by_api_num = _compute_ruku_markers(api_ayahs)

        # In this repo's Suras.json, Al-Fatiha is missing the standalone basmala ayah.
        # api.alquran.cloud returns 7 ayahs for surah 1, with basmala as ayah 1.
        # So we shift local rakam by +1 only for surah 1.
        offset = (
            1 if (surah_number == 1 and len(local_ayahs) == len(api_ayahs) - 1) else 0
        )

        for obj in local_ayahs:
            if "rakam" not in obj:
                raise RuntimeError(
                    f"Surah {surah_number} ayah object missing 'rakam': {obj}"
                )
            local_num = int(obj["rakam"])
            api_num = local_num + offset
            marker = markers_by_api_num.get(api_num)
            if marker is None:
                raise RuntimeError(
                    f"No ruku marker for surah {surah_number} local ayah {local_num} (api_num={api_num}). "
                    f"Local len={len(local_ayahs)} API len={len(api_ayahs)} offset={offset}"
                )
            obj["ruku"] = marker

        # If we had to offset Al-Fatiha because the local file omits the standalone basmala ayah,
        # then the *first* local ayah should still be treated as the start of the first ruku.
        if offset == 1 and local_ayahs:
            local_ayahs[0]["ruku"]["start"] = True

        expected_local_len = len(api_ayahs) - offset
        if len(local_ayahs) != expected_local_len:
            raise RuntimeError(
                f"Surah {surah_number} length mismatch: local={len(local_ayahs)} api={len(api_ayahs)} offset={offset}"
            )

    output_path.write_text(
        json.dumps(suras, ensure_ascii=False, indent=4), encoding="utf-8"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
