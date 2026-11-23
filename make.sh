#!/usr/bin/env bash
# make.sh <char> [stills|full|preview] [frames] [fps] [WxH]
#   bash make.sh heroine stills          -> stills/ + determinism check
#   bash make.sh heroine full 300 30     -> frames/ + out/clip.mp4 (540x960)
# Starts Vite if it is not already listening, then captures with headless chromium.
set -euo pipefail
cd "$(dirname "$0")"

CHAR=${1:-heroine}
MODE=${2:-stills}
FRAMES=${3:-300}
FPS=${4:-30}
SIZE=${5:-540x960}
W=${SIZE%x*}
H=${SIZE#*x}
PORT=${PORT:-5173}

if curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/"; then
  # Something is serving this port: only reuse it if it is this toolkit, not a stale project.
  if ! curl -sf "http://127.0.0.1:$PORT/render/frame.js" | grep '__meta' > /dev/null; then
    echo "port $PORT is served by another project; stop it or run with PORT=<free port>" >&2
    exit 1
  fi
else
  nohup npx vite --host 127.0.0.1 --port "$PORT" --strictPort > vite.log 2>&1 &
  for _ in $(seq 1 40); do
    curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/?char=$CHAR" && break
    sleep 0.5
  done
fi

node render/capture.mjs "$MODE" --char "$CHAR" --frames "$FRAMES" --fps "$FPS" --w "$W" --h "$H" \
  --url "http://127.0.0.1:$PORT"

if [ "$MODE" = "full" ]; then
  mkdir -p out
  ffmpeg -y -v error -framerate "$FPS" -i frames/f%04d.png \
    -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -movflags +faststart out/clip.mp4
  ffprobe -v error -select_streams v:0 -count_frames \
    -show_entries stream=width,height,r_frame_rate,nb_read_frames,duration -of default=nw=1 out/clip.mp4
fi

