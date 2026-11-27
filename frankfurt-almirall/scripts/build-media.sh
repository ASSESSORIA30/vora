#!/usr/bin/env bash
# Generates optimized responsive stills from the skill's interior reference.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="../.agents/skills/frankfurt-almirall/assets/bar-reference.jpg"
OUT="public/media"
mkdir -p "$OUT"
for w in 720 1080 1448; do
  ffmpeg -loglevel error -y -i "$SRC" -vf "scale=${w}:-2:flags=lanczos" -c:v libwebp -quality 78 "$OUT/bar-${w}.webp"
  ffmpeg -loglevel error -y -i "$SRC" -vf "scale=${w}:-2:flags=lanczos" -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 6 "$OUT/bar-${w}.avif"
  ffmpeg -loglevel error -y -i "$SRC" -vf "scale=${w}:-2:flags=lanczos" -q:v 4 "$OUT/bar-${w}.jpg"
done
# Open Graph image (1200x630 crop around the counter perspective)
ffmpeg -loglevel error -y -i "$SRC" -vf "crop=1448:760:0:180,scale=1200:630" -q:v 4 "$OUT/og.jpg"
# Tiny blurred placeholder
ffmpeg -loglevel error -y -i "$SRC" -vf "scale=24:-2" -q:v 8 "$OUT/bar-lqip.jpg"
