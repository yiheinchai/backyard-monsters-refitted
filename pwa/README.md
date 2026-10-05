# Browser / mobile (PWA) client

The game client is a Flash SWF. Browsers no longer run Flash, so the browser build runs the
same SWF in [Ruffle](https://ruffle.rs), a Flash Player emulator written in Rust and compiled
to WebAssembly, inside a small installable web app served from `server/public/play/`.

Open `http://<server>/play/` in a phone browser and use "Add to Home screen" / "Install app"
to get a full-screen, landscape app.

## How it fits together

| Piece | Where | What it does |
|---|---|---|
| Shell page | `server/public/play/index.html`, `play.js`, `play.css` | Loads Ruffle, scales the stage to fit the screen, bridges chat to the browser's WebSocket, frame-rate counter |
| App manifest + offline cache | `manifest.webmanifest`, `sw.js`, `icons/` | Installable full-screen landscape app; caches Ruffle, the SWF and game art |
| Client changes | `client/scripts/com/monsters/configs/WebPlatform.as` and callers | Turned on by the `platform=web` flashvar; the desktop launcher build is unchanged |
| Ruffle patch | `pwa/ruffle/bymr-ruffle.patch` | Rendering options that make the game run smoothly on phones (below) |
| Build | `pwa/build.sh` | Builds `bymr.swf` and the patched Ruffle into `server/public/play/` (not committed) |

### Client changes (web build only)

- **Display-list rendering.** The client normally draws the whole map into one big BitmapData
  every frame (`BYMConfig.RENDERER_ON`). Ruffle draws on the GPU, and that mix of `draw()` and
  `copyPixels()` forced a GPU-to-CPU readback per entry per frame (0.4 fps). The web build uses
  the game's original display-list renderer instead.
- **Remembered sign-in.** There is no launcher to hold the session, so the session token is kept
  in the `bymr_data` SharedObject and used on the next visit. `?logout=1` forgets it.
- **Chat.** Ruffle can't open the raw TCP socket the ActionScript WebSocket needs, so
  `BrowserWebSocket` hands the connection to the browser's own WebSocket via ExternalInterface.
- **Server and CDN URLs** are passed in by the page (`serverUrl`, `cdnUrl` flashvars), so the same
  SWF works on any host.
- **Effect stamps.** Blood splats and settled dirt are vector art stamped into the map's effects
  bitmap. On Ruffle every stamp was a GPU-to-CPU readback (about 60 ms each in a fight).
  `StampCache` rasterises each variant once, on one sheet, while the yard loads.
- **Quest list spinners.** Each quest row has a loading spinner that keeps turning under the
  quest's icon once it has loaded; it is removed then, so the list can be cached.
- **Building overlays** (name, progress and health bars) are hidden while empty, so they cost no
  draw calls.
- **Fullscreen button.** Flash's fullscreen would only enlarge the player element, outside the
  page's scaling, and Ruffle doesn't allow it by default. The game's button asks the page
  (`bymrFullscreen` in `play.js`) to make the whole page fullscreen instead.
- **Touch placement.** Placing or moving a building and dropping monsters were built for a mouse:
  the building (or drop ring) follows the pointer each frame, and the click is checked where it
  is. A tap jumps straight there, so it was checked at the old spot and the building was
  cancelled or the drop missed. The web build moves it to the tap first; a tap on a blocked spot
  leaves the building there, shown as blocked, for another tap.

### Ruffle patch

All options are off by default in Ruffle and turned on by `play.js`:

- **`frameInterpolation`** - The game runs at 40 frames per second, and its timelines, scripts and
  simulation are tied to that rate. Instead of speeding the game up, Ruffle draws extra frames at
  the display's refresh rate (60/90/120 Hz), each one part-way between the last two game frames.
  Movement, scrolling and animation are smooth at 120 Hz with game timing unchanged. Objects that
  just appeared or jumped far snap into place instead.
- **`cacheTextAsBitmap`** - Ruffle draws every glyph as a separate mesh. Text fields (other than
  editable ones) are drawn once into a texture and redrawn only when they change.
- **`autoCache`** - Containers that have stopped changing are drawn through a bitmap cache, so a
  static panel costs one draw call. Containers that keep changing are dropped from the cache, and
  ones that would look different when cached (blend modes, editable text, video) never are.
- Invisible objects no longer invalidate the caches above them, and Ruffle reports a `panic` event
  so the page can retry with a different renderer.

The patch also has changes that are always on, because they don't change behaviour:

- **Fewer draw calls (wgpu renderer).** Repeated pipeline, bind group and buffer bindings are
  skipped, consecutive draws of the same bitmap or shape are merged into one instanced draw, and
  Add/Subtract/Screen blends of a single bitmap (and Multiply onto an opaque target) are drawn
  with fixed-function blending instead of an offscreen pass. Fully transparent objects are not
  drawn, and texture uploads no longer force a GPU submit each.
- **BitmapData on the CPU.** `draw()` of a bitmap with a translation, and `applyFilter()` with a
  colour matrix or convolution filter, run on the CPU when their source is already there, instead
  of going through the GPU and reading the result back. The game's procedural fire does this every
  frame.
- **No-op gotos.** In ActionScript 3 every `gotoAndStop()`, even to the current frame, runs frame
  construction and frame scripts over the whole stage. Ruffle now skips that walk when nothing it
  could act on has changed since the last one (no clip changed frame or gained a child or frame
  script). In a fight most gotos are no-ops, and this was about 40,000 display-object visits per
  rendered frame.
- **Render order after a rewind.** A `gotoAndStop()` to an earlier frame re-places that frame's
  timeline objects above anything ActionScript added, so the game's buttons lost their labels
  under their own backgrounds after being disabled, highlighted or deselected. Re-placed objects
  now take the positions of the ones the rewind removed. (Stock Ruffle has this bug too.)
- **`hardwareAccelerationWarning`** (new option, turned off by `play.js`): without a GPU, Ruffle
  covered the game with an explanation that swallowed the first tap.
- **Culling.** Shapes, bitmaps and text entirely outside the screen, or outside the mask or
  scroll rect they are drawn through (scrolled-away list rows), aren't drawn.
- **Hidden animations.** Moving or rotating an invisible object no longer invalidates the
  caches above it. Containers that couldn't be cached when they first settled (off screen,
  for example) are tried again later.
- **Decoded sound effects.** Sounds up to 6 seconds long are decoded and resampled the first time
  they play and replayed from memory afterwards, instead of decoding the MP3 on every play.

Ruffle's own regression suite (`cargo test -p tests`) passes with the patch.

Together these took the main thread from 99.9% busy at 0.4 fps to about 4.5 ms per frame in the
base view, and a 46-monster attack from stalls of 60 ms or more to about 14 ms per frame
(headless Chromium with software WebGL, on one server CPU core; see "Measuring" below). A phone
with a GPU does the WebGL work off the main thread.

## Building

```sh
pwa/build.sh          # bymr.swf + Ruffle
pwa/build.sh swf      # only the client (after changing ActionScript)
pwa/build.sh ruffle   # only Ruffle (after changing the patch)
```

The SWF can also be built from VS Code with `asconfig.web.json`.

Requirements:

- **SWF**: Java and the [Apache Flex SDK](https://flex.apache.org/download-binaries.html) 4.16
  (`FLEX_HOME`, default `/opt/flex`). `playerglobal.swc` comes from this repository.
- **Ruffle**: git, Node.js, Rust with `rustup target add wasm32-unknown-unknown`, and
  `cargo install wasm-bindgen-cli --version <the wasm-bindgen version in Ruffle's Cargo.toml>`.
  `wasm-opt` (binaryen) is optional but makes Ruffle faster.

The server serves the result from `public/play/`. Restart it after the first build, because the
static file list is read at startup.

### Updating Ruffle

`RUFFLE_COMMIT` in `pwa/build.sh` pins the Ruffle commit the patch applies to. To move to a newer
Ruffle, check it out, apply the patch, fix any conflicts, regenerate the patch with
`git diff <new commit> > pwa/ruffle/bymr-ruffle.patch`, and bump `RUFFLE_COMMIT`.

## Deploying

- Serve the page over **HTTPS**; service workers and installing need it.
- Chat: on an HTTPS page the browser only allows `wss://` connections, so the chat server
  (`CHAT_WS_HOST`) must be reachable over TLS, for example behind the same reverse proxy. `?chat=`
  overrides the URL for testing.
- The SWF version must match the server's API version, as with the launcher builds.

### Static hosting

The shell works from any path and doesn't need this repository's server to serve it. To host it
as a static site (for example GitHub Pages) that plays on another game server, copy
`server/public/play/` (after building) and name the servers in `index.html`, before `play.js`:

```html
<script>
  window.BYMR_CONFIG = {
    serverUrl: "https://server.example.com/",
    cdnUrl: "https://cdn.example.com/",
    chatUrl: "wss://chat.example.com/", // optional
  };
</script>
```

The server must allow cross-origin requests (the server here does) and accept the client's API
version (`GLOBAL.apiVersionSuffix`), so build the client from the release that server runs.

## Shell options

Query parameters on `/play/`:

| Parameter | Effect |
|---|---|
| `fps=1` | Frame-rate counter |
| `interp=0` | No frame interpolation (game frame rate only) |
| `textcache=0`, `autocache=0` | Turn off the caching options |
| `quality=low\|medium\|high` | Ruffle render quality (default `medium`) |
| `renderer=webgpu\|wgpu-webgl\|webgl` | Force a Ruffle renderer. `webgl` is cheaper but has no filters or bitmap caching |
| `server=`, `cdn=`, `chat=` | Point the client at another server |
| `logout=1` | Forget the saved session |

## Measuring

`?fps=1` shows the display frame rate and the worst frame time of the last second. On a phone,
open it in Chrome and use remote debugging (`chrome://inspect`) for profiles.
