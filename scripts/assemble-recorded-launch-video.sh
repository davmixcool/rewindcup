#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW_VIDEO="${1:?Pass the Playwright WebM recording path as the first argument}"
TRIM_START="${2:-$(tr -d '[:space:]' < /private/tmp/rewindcup-launch-recording-start.txt)}"
MUSIC_FILE="${3:-}"
MUSIC_START="${4:-0}"
FORMAT="${5:-desktop}"
OUTPUT_DIR="$ROOT_DIR/public/videos"

if [[ "$FORMAT" == "mobile" ]]; then
  OUTPUT_FILE="$OUTPUT_DIR/rewindcup-launch-recorded-mobile.mp4"
  VIDEO_FILTER="scale=1080:1920:flags=lanczos,ass='$ROOT_DIR/scripts/rewindcup-recorded-launch-mobile.ass':fontsdir='/System/Library/Fonts',tpad=stop_mode=clone:stop_duration=0.2,format=yuv420p"
  H264_LEVEL="4.1"
elif [[ "$FORMAT" == "desktop" ]]; then
  OUTPUT_FILE="$OUTPUT_DIR/rewindcup-launch-recorded.mp4"
  VIDEO_FILTER="ass='$ROOT_DIR/scripts/rewindcup-recorded-launch.ass':fontsdir='/System/Library/Fonts',tpad=stop_mode=clone:stop_duration=0.2,format=yuv420p"
  H264_LEVEL="4.0"
else
  printf 'Unknown output format: %s (expected desktop or mobile)\n' "$FORMAT" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

if [[ -n "$MUSIC_FILE" ]]; then
  if [[ ! -f "$MUSIC_FILE" ]]; then
    printf 'Music file not found: %s\n' "$MUSIC_FILE" >&2
    exit 1
  fi

  ffmpeg -hide_banner -y \
    -ss "$TRIM_START" \
    -i "$RAW_VIDEO" \
    -stream_loop -1 \
    -ss "$MUSIC_START" \
    -i "$MUSIC_FILE" \
    -filter_complex "[0:v]$VIDEO_FILTER[v];[1:a]atrim=duration=24,asetpts=N/SR/TB,volume=0.72,afade=t=in:st=0:d=0.25,afade=t=out:st=23:d=1[a]" \
    -map "[v]" \
    -map "[a]" \
    -r 30 \
    -frames:v 720 \
    -c:v libx264 \
    -preset slow \
    -crf 18 \
    -profile:v high \
    -level "$H264_LEVEL" \
    -c:a aac \
    -b:a 192k \
    -movflags +faststart \
    -shortest \
    "$OUTPUT_FILE"
else
  ffmpeg -hide_banner -y \
    -ss "$TRIM_START" \
    -i "$RAW_VIDEO" \
    -vf "$VIDEO_FILTER" \
    -r 30 \
    -frames:v 720 \
    -c:v libx264 \
    -preset slow \
    -crf 18 \
    -profile:v high \
    -level "$H264_LEVEL" \
    -movflags +faststart \
    -an \
    "$OUTPUT_FILE"
fi

printf '%s\n' "$OUTPUT_FILE"
