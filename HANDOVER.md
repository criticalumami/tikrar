# TIKRAR handover

30 Oct 2026 · alihaidar

## What TIKRAR is

TIKRAR ("Beirut Lantern Generator") is a static three.js web app for designing slip-cast porcelain Lebanese lantern houses: 60 × 60 × 40 mm modules with a candle inside, stacked up to 8 levels and arranged into clusters. alihaidar (GitHub criticalumami) builds it together with Dav (davidsfeir), who owns the mold and print app.

The site has three sections, ranked by importance:

| Section | Live URL | File |
| --- | --- | --- |
| Cluster editor | [criticalumami.github.io/tikrar/](https://criticalumami.github.io/tikrar/) | index.html (a copy of module.html) |
| Module editor | [module-editor.html](https://criticalumami.github.io/tikrar/module-editor.html) | module-editor.html (generated from module.html) |
| Proposals | [proposals.html](https://criticalumami.github.io/tikrar/proposals.html) | proposals.html |

Old URLs still work. module.html, module-round.html (now just a forward to `./`) and app.html all lead into TIKRAR. The old repo name beit-lantern-proposals forwards to /tikrar/.

## Repos and push rules

Every change goes to two repos. Never push site files to criticalumami/beit-lantern-proposals: it is now a redirect-only repo. On 30 Oct ten commits went there by mistake and the live site stayed out of date for hours.

| Repo | Role | Where TIKRAR lives |
| --- | --- | --- |
| davidsfeir/beit-lantern-editor (private) | Dav's mold/print app plus crit's work | `docs/` only: module.html, index.html, module-editor.html, proposals.html, openings.js, app.html, this file. Proposal notes go in `crit_proposals/*.md` |
| [criticalumami/tikrar](https://github.com/criticalumami/tikrar) (public, GitHub Pages) | The live site | repo root, same files |
| criticalumami/beit-lantern-proposals | Forwarding pages only (old URLs → /tikrar/) | never touch |

Steps for every push:

1. In Dav's repo, run `git pull --rebase --autostash origin main` first, because Dav's own Claude pushes to main often. Never edit Dav's root `index.html` or his app files.
2. Commit with `-c user.name=ss -c user.email=criticalumami@users.noreply.github.com`. Don't put model names in commit messages.
3. Copy the changed files into the tikrar clone. Check that `git remote -v` shows `criticalumami/tikrar`, then push to main.
4. Check that the "pages build and deployment" run finished (Actions tab), then confirm the version stamp next to the nav on the live page (currently `v 31.10 · 16:25`). Bump the stamp in module.html (`id="ver"`) with each release.

Cloud sessions can't change repo settings or reach github.io directly. When settings need changing, do it through Remote Control on the owner's Mac (gh signed in as criticalumami), and only with the owner's go-ahead.

## Code map

The whole app lives in one file, `docs/module.html` (about 1,350 lines). Three.js r128 loads from cdnjs; there's no build step. `openings.js` (about 290 lines) holds the opening catalogues: the 1860–1925 and Modernist books, plus claustra BLOCKS and the FLUSH rule.

| Area | Key functions and values | Notes |
| --- | --- | --- |
| Mode and storage | `MODE`, `KEY`, `defaults()` | `<html data-mode="module">` means Module editor. Storage keys: `tikrar-module-editor-v1` (module) and `beit-lantern-designer-v3` (cluster); theme is `beit-proposals-theme` |
| Buildings | `KINDS`, `make()`, `randomBuilding()`, `randomizeBuilding()`, `randomWall()` | Building kinds include landmarks (Holiday Inn, Gefinor, EDL, Saroulla, Egg, Museum) at true 1:75. `KINDS.court` is the public court tray |
| Layout | `streetGrid()` (column widths, street widths, cluster ends; `S.mix` = Clusters from `S.dist`), `gridLayout()` (every street straight through the city; back rows flush with the back street), `fillGrid()` (`S.full`, `S.gridCols`), `allSlabs()`, `lightAll()`, `defaultVillage()`, `autoPlace()`, `rollBlocks()` | Swiss grid applies to the layout only. Empty blocks are `S.gaps`. `S.blocks` = 0 hidden, 1 lines, 2 plots (4 mm trays, `TRAY`) |
| Geometry | `buildBuilding()`, `buildWall()` (wall ends squared off at the corner), `softExtrude()` + `bevelNormals()` (true round-bevel normals), `fillet()`, `wallBv()`, `cornerPieces()` / `cornerGeo()` (the wall section swept round the corner, cached in `CGEO`), `slantRoof()`, `modernRoof()`, `courtOf()` | Rounded look: BV 0.9, filleted openings, corner rims 1.4, plates 1.9, base 2.8. `WGEO` caches wall geometry by openings and corner radius |
| Rendering | `rebuild()` / `rebuildNow()`, `mergeGroup()`, `loop()`, `need()` | Renders on demand only. Meshes merge per material; repeated walls become `InstancedMesh`. Shared geometries are never disposed |
| Materials and light | `matOf()`, `hqMatOf()`, `groundAO()`, `applyNight()`, `litOf()`, `placeLights()`, `setRender()` | ACES tone mapping. Day: exposure 0.95, hemi 0.26, sun 2.8·k. Night: black background, hemi 0.07, emissive candle tint `0xffa24c`, glow `0xffb562`, flicker every 100 ms. No live point lights (`MAX_LIGHTS=0`). Candle light on the ground is baked by `startBake()` / `bakeStep()`: one shadow-casting point light per lit module renders onto a top-down half-float light map (`BAKE.rt`), a few candles per frame, redone only on rebuild or night toggle, so every opening throws its shape |
| Technical review | `FIT`, `techReview()`, `techDetails()`, `renderTech()` | Panel under Checks: fired fits (rims 53.4 mm, 1.6 × 1.5, 0.3 clear), glaze-free bands, plate/base span ratios, candle heat, air, stability, with four parametric SVG details |
| Courtyards | `courtyards()`, `courtOpen()` | A 3 × 3 building drops its middle module on every level (flag `auto`); upper plates open over it, roofs go per module |
| Baked candle light | `BAKE`, `startBake()`, `bakeStep()` | The shadow pass culls by the bake camera's layers, so that camera sees layers 0 and 1 and its near/far planes keep only the ground plane (at -0.5 mm) in view |
| Palettes | `applyPalette()`, `applyAccent()`, `randPal()` | Roofs vary: 65% white, otherwise a palette colour |
| UI | `renderUI()`, `renderEditor()`, `seg()`, `setCount()`, `randAll()` | Randomize All adds about 1 court per 10 buildings. The phone CSS block stays last in `<style>` |
| Checks | `buildingChecks()`, `villageChecks()`, `wallSym()` | Porcelain rules: openings at most 40% of a wall, bars at least 2.5 mm |
| Export | `gif15()`, `gifPalette()`, `gifLZW()`, `gifEncode()`, `makeSheet()` (jsPDF), JPG | GIF frames up to 1080 px with a median-cut palette |

Proposals (`proposals.html`) is a separate static page with its own nav linking to both editors.

## How to edit, test and deploy

Edit only `docs/module.html`. The other two editor files are generated from it. Forgetting to regenerate them is the easiest way to ship a stale page.

1. Edit `docs/module.html`.
2. Regenerate the copies:
    - `cp module.html index.html`
    - `sed -e 's|<html lang="en">|<html lang="en" data-mode="module">|' -e 's|<title>TIKRAR · Beirut Lantern Generator</title>|<title>TIKRAR · Module editor</title>|' module.html > module-editor.html`
3. Syntax-check the inline script: extract it and run `node --check`.
4. Serve `docs/` locally with `python3 -m http.server 8765` and test with Playwright and Chromium (headless, SwiftShader).
5. Look at screenshots of day, night and phone (390 px) before calling something fixed.
6. Commit and push both repos (see Repos and push rules), then check the Pages run and the version stamp.

The test scripts are saved in the project files under `tikrar-tests/`:

| Script | What it checks |
| --- | --- |
| `lib2.js` | Shared `open()`: serves three.js from the local `three-0.128.0.tgz`, blocks fonts and CDNs, and adds a `window.__d()` debug hook (module.html only) |
| `t25.js` | Phone audit of any page |
| `t39.js` | Feature audit (its claustra check gives a false negative) |
| `t41.js` | Night screenshot (needs a 120 s timeout) |
| `t42.js` | Performance at 120 buildings: rebuild time, triangles, draw calls |
| `t45.js` | Module editor and Cluster editor: nav highlight, storage key, console errors |

Reference numbers (30 Oct, 120 buildings): rebuild about 2.1 s, 3.6 M triangles, 7.3 M vertices. Before the instancing change it was 9.4 s, 6.7 M triangles and 20 M vertices.

## Owner preferences and rules to keep

The owner gives short, precise feedback. Change exactly what was asked and keep every existing feature.

- **Updates**: be verbose. Each update names what changed, the files and functions, the technique and why, commits and repos, how to see it, and what's still open.
- **Messages**: the owner often sends several short messages in a row. Treat them as one request.
- **Design**: Swiss grid (Müller-Brockmann) for the web design and cluster layout only: 12 columns, 8 px baseline, one grotesque typeface, no web fonts. The top bar is a slim 33 px row and the settings panel is scaled to match. Never apply the grid to wall openings.
- **Openings**: only the 1860–1925 and Modernist books. Each window is a single clean opening, flush with the wall.
- **Porcelain safety**: walls at most 40% open, fired sections at most 60 mm, 3 mm walls where stacked, bars at least 2.5 mm. No non-porcelain accessories.
- **3D view**: lean and fast. Render on demand; no automatic camera moves. Day ground is white; night is pitch black with a warm, consistent candle glow.
- **Look**: every edge and corner rounded, like matte slip-cast porcelain (based on the owner's reference photos).
- **Roofs**: follow the palette, not one colour.
- **Naming**: the generator is TIKRAR, subtitle "Beirut Lantern Generator". Use "clusters", not neighbourhoods or districts, and "City block", not village.
- **Mobile**: every page must work on a phone. The toolbar sits under the view, never over it, and the nav swipes sideways.

## Open items and parked ideas

All of the 30 Oct requests are live. The open items:

- [ ] Decide what the Module editor should become. Right now it's the full editor limited to one building; it could become, for example, an opening-by-opening facade editor.
- [ ] Research a cheap bloom or halo for the candle effect. The owner asked for online research and none has been done yet.
- [ ] Physical validation of molds and prints belongs to Dav's app (see Dav's HANDOVER.md), not TIKRAR.

Parked, do not build yet (the owner is only thinking out loud): Beirut as a set of clusters, each with its own landmark.

Living version: https://claude.ai/artifact/GkNYtneGMfWf9nK6yKJRzd
