#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/public/videos"
OUTPUT_FILE="$OUTPUT_DIR/rewindcup-launch.mp4"

mkdir -p "$OUTPUT_DIR"

ffmpeg -hide_banner -y \
  -loop 1 -framerate 30 -t 4.6 -i "$ROOT_DIR/public/images/world-cup-archive-banner.webp" \
  -loop 1 -framerate 30 -t 4.6 -i "$ROOT_DIR/public/images/football-legends-mural.webp" \
  -loop 1 -framerate 30 -t 4.6 -i "$ROOT_DIR/public/images/rewindcup-social-card.jpg" \
  -loop 1 -framerate 30 -t 4.6 -i "$ROOT_DIR/public/images/world-cup-archive-banner.webp" \
  -loop 1 -framerate 30 -t 4.6 -i "$ROOT_DIR/public/images/rewindcup-social-card.jpg" \
  -filter_complex "
    [0:v]scale=1400:788:force_original_aspect_ratio=increase,crop=1400:788,
      zoompan=z='min(zoom+0.00035,1.055)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,
      drawbox=x=0:y=0:w=iw:h=ih:color=0x07111c@0.48:t=fill,fps=30,settb=1/30,setpts=N,
      fade=t=in:st=0:d=0.22,fade=t=out:st=4.35:d=0.25[s0];
    [1:v]scale=1400:788:force_original_aspect_ratio=increase,crop=1400:788,
      zoompan=z='min(zoom+0.00028,1.045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,
      drawbox=x=0:y=0:w=iw:h=ih:color=0x07111c@0.54:t=fill,fps=30,settb=1/30,setpts=N,
      fade=t=in:st=0:d=0.22,fade=t=out:st=4.35:d=0.25[s1];
    [2:v]scale=1400:788:force_original_aspect_ratio=increase,crop=1400:788,
      zoompan=z='min(zoom+0.00032,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,
      drawbox=x=0:y=0:w=iw:h=ih:color=0x07111c@0.55:t=fill,fps=30,settb=1/30,setpts=N,
      fade=t=in:st=0:d=0.22,fade=t=out:st=4.35:d=0.25[s2];
    [3:v]scale=1400:788:force_original_aspect_ratio=increase,crop=1400:788,
      zoompan=z='min(zoom+0.00038,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,
      drawbox=x=0:y=0:w=iw:h=ih:color=0x07111c@0.58:t=fill,fps=30,settb=1/30,setpts=N,
      fade=t=in:st=0:d=0.22,fade=t=out:st=4.35:d=0.25[s3];
    [4:v]scale=1400:788:force_original_aspect_ratio=increase,crop=1400:788,
      zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,
      drawbox=x=0:y=0:w=iw:h=ih:color=0x07111c@0.56:t=fill,fps=30,settb=1/30,setpts=N,
      fade=t=in:st=0:d=0.22,fade=t=out:st=4.35:d=0.25[s4];
    [s0][s1][s2][s3][s4]concat=n=5:v=1:a=0[x4];
    [x4]ass='$ROOT_DIR/scripts/rewindcup-launch.ass':fontsdir='/System/Library/Fonts',
      fade=t=in:st=0:d=0.25,fade=t=out:st=22.5:d=0.5,format=yuv420p[v]
  " \
  -map "[v]" \
  -t 23 \
  -r 30 \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -profile:v high \
  -level 4.0 \
  -movflags +faststart \
  -an \
  "$OUTPUT_FILE"

printf '%s\n' "$OUTPUT_FILE"
