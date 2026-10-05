#!/usr/bin/env bash
#
# Builds the browser / PWA version of the client into server/public/play/:
#
#   bymr.swf   the game client, compiled with the Apache Flex SDK
#   ruffle/    Ruffle (the Flash Player emulator) with the patches in pwa/ruffle/
#
# Both are build output and are not committed. Usage:
#
#   pwa/build.sh            build both
#   pwa/build.sh swf        only the client
#   pwa/build.sh ruffle     only Ruffle
#
# Requirements (see pwa/README.md):
#   swf:    Java, and the Apache Flex SDK in $FLEX_HOME (default /opt/flex)
#   ruffle: git, Rust with the wasm32-unknown-unknown target, wasm-bindgen-cli matching
#           Ruffle's Cargo.toml, Node.js; optionally wasm-opt (binaryen) for a faster build
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/server/public/play"
FLEX_HOME="${FLEX_HOME:-/opt/flex}"

# The Ruffle commit the patch applies to. Bump together with pwa/ruffle/bymr-ruffle.patch.
RUFFLE_REPO="${RUFFLE_REPO:-https://github.com/ruffle-rs/ruffle}"
RUFFLE_COMMIT="ed55e72394d21d7784b0a914fd4525608c6a5661"
RUFFLE_SRC="${RUFFLE_SRC:-$ROOT/pwa/.ruffle-src}"

build_swf() {
  echo "==> Compiling bymr.swf"
  # The Flex SDK looks for playerglobal.swc under {playerglobalHome}/<major>.<minor>/.
  local playerglobal="$ROOT/pwa/.playerglobal"
  mkdir -p "$playerglobal/11.0"
  cp "$ROOT/playerglobal.swc" "$playerglobal/11.0/playerglobal.swc"

  # The server and CDN URLs compiled in here are only defaults: the PWA shell passes the
  # page's own host as flashvars, so one build works on any server.
  PLAYERGLOBAL_HOME="$playerglobal" "$FLEX_HOME/bin/mxmlc" \
    -source-path="$ROOT/client/scripts" \
    -target-player=11.0 -swf-version=13 \
    -default-frame-rate=40 -default-background-color=#FFFFFF -default-size 760 670 \
    -optimize=true -strict=true -warnings=false -use-network=true \
    -static-link-runtime-shared-libraries=true \
    "-define=CONFIG::SERVER_URL,'http://localhost:3001/'" \
    "-define=CONFIG::CDN_URL,'http://localhost:3001/'" \
    -output="$OUT/bymr.swf" \
    "$ROOT/client/scripts/GAME.as"
}

build_ruffle() {
  echo "==> Building Ruffle $RUFFLE_COMMIT with pwa/ruffle/bymr-ruffle.patch"
  if [ ! -d "$RUFFLE_SRC/.git" ]; then
    git init -q "$RUFFLE_SRC"
    git -C "$RUFFLE_SRC" remote add origin "$RUFFLE_REPO"
  fi
  git -C "$RUFFLE_SRC" fetch -q --depth 1 origin "$RUFFLE_COMMIT"
  git -C "$RUFFLE_SRC" checkout -q --force FETCH_HEAD
  git -C "$RUFFLE_SRC" clean -qfd -e node_modules -e target
  git -C "$RUFFLE_SRC" apply "$ROOT/pwa/ruffle/bymr-ruffle.patch"

  (
    cd "$RUFFLE_SRC/web"
    npm install --no-audit --no-fund
    npm run build -w ruffle-core -w ruffle-selfhosted
  )

  rm -rf "$OUT/ruffle"
  mkdir -p "$OUT/ruffle"
  cp "$RUFFLE_SRC"/web/packages/selfhosted/dist/{ruffle.js,core.ruffle.*.js,*.wasm,LICENSE_*} "$OUT/ruffle/"
}

# Pre-compressed copies, served automatically by koa-static to browsers that accept them.
# (The SWF is zlib-compressed already.)
compress() {
  echo "==> Compressing"
  node -e '
    const fs = require("fs"), zlib = require("zlib"), path = require("path");
    for (const file of process.argv.slice(1)) {
      const data = fs.readFileSync(file);
      fs.writeFileSync(file + ".br", zlib.brotliCompressSync(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length } }));
      fs.writeFileSync(file + ".gz", zlib.gzipSync(data, { level: 9 }));
      console.log(path.relative(process.cwd(), file), data.length, "->", fs.statSync(file + ".br").size, "(br)");
    }
  ' "$@"
}

mkdir -p "$OUT"
case "${1:-all}" in
  swf) build_swf ;;
  ruffle) build_ruffle; compress "$OUT"/ruffle/*.wasm "$OUT"/ruffle/*.js ;;
  all) build_swf; build_ruffle; compress "$OUT"/ruffle/*.wasm "$OUT"/ruffle/*.js ;;
  *) echo "usage: $0 [all|swf|ruffle]" >&2; exit 1 ;;
esac
echo "==> Done: $OUT"
