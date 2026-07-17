#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW_VIDEO="${1:?Pass the Playwright WebM recording path as the first argument}"
TRIM_START="${2:-$(tr -d '[:space:]' < /private/tmp/rewindcup-launch-recording-start.txt)}"
OUTPUT_DIR="$ROOT_DIR/public/videos"
OUTPUT_FILE="$OUTPUT_DIR/rewindcup-launch-recorded.mp4"

mkdir -p "$OUTPUT_DIR"

ffmpeg -hide_banner -y \
  -ss "$TRIM_START" \
  -i "$RAW_VIDEO" \
  -vf "ass='$ROOT_DIR/scripts/rewindcup-recorded-launch.ass':fontsdir='/System/Library/Fonts',tpad=stop_mode=clone:stop_duration=0.2,format=yuv420p" \
  -r 30 \
  -frames:v 720 \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -profile:v high \
  -level 4.0 \
  -movflags +faststart \
  -an \
  "$OUTPUT_FILE"

printf '%s\n' "$OUTPUT_FILE"
