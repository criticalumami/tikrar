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
4. Check that the "pages build and deployment" run finished (Actions tab), then confirm the version stamp next to the nav on the live page (currently `v 31.10 · 18:06`). Bump the stamp in module.html (`id="ver"`) with each release.

Cloud sessions can't change repo settings or reach github.io directly. When settings need changing, do it through Remote Control on the owner's Mac (gh signed in as criticalumami), and only with the owner's go-ahead.

## Code map

The whole app lives in one file, `docs/module.html` (about 1,350 lines). Three.js r128 loads from cdnjs; there's no build step. `openings.js` (about 290 lines) holds the opening catalogues: the 1860–1925 and Modernist books, plus claustra BLOCKS and the FLUSH rule.

| Area | Key functions and values | Notes |
| --- | --- | --- |
| Mode and storage | `MODE`, `KEY`, `defaults()` | `<html data-mode="module">` means Module editor. Storage keys: `tikrar-module-editor-v1` (module) and `beit-lantern-designer-v3` (cluster); theme is `beit-proposals-theme` |
| Buildings | `KINDS`, `make()`, `randomBuilding()`, `randomizeBuilding()`, `randomWall()` | Building kinds include landmarks (Holiday Inn, Gefinor, EDL, Saroulla, Egg, Museum) at true 1:75. `KINDS.court` is the public court tray |
| Layout | `streetGrid()` (column widths, street widths, cluster ends; `S.mix` = Clusters from `S.dist`), `gridLayout()` (every street straight through the city; back rows flush with the back street), `fillGrid()` (`S.full`, `S.gridCols`), `allSlabs()`, `lightAll()`, `defaultVillage()`, `autoPlace()`, `rollBlocks()` | Swiss grid applies to the layout only. Empty blocks are `S.gaps`. `S.blocks` = 0 hidden, 1 lines, 2 plots (4 mm trays, `TRAY`) |
| Geometry | `buildBuilding()`, `buildWall()`, `softExtrude()` + `bevelNormals()` (true round-bevel normals), `fillet()`, `wallBv()`, `cornerPieces()` / `cornerGeo()` + `rInOf()` (concentric outer + inner corner sweep, `CSEG=24, KSEG=4`, cached in `CGEO`), `lipRing()`, `slantRoof()`, `modernRoof()`, `courtOf()` | Rounded look: BV 0.9, filleted openings, concentric rounded outer walls (`R 0–6 mm`, default `4.5`), concentric rounded inner walls (`rInOf(R)`), and concentric locating lips (`lipRing`). `WGEO` caches wall geometry by openings and corner radius |
| Rendering | `rebuild()` / `rebuildNow()`, `mergeGroup()`, `loop()`, `need()`, `setupComposer()` (`HalfFloatType` 16-bit HDR target) | Renders on demand only. Meshes merge per material; repeated walls become `InstancedMesh`. Shared geometries are never disposed. `EffectComposer` runs in both Day and Night when `Render` is active using a 16-bit `HalfFloatType` render target (eliminating 8-bit dark gradient banding) and continuous `SSAOPass` |
| Materials and light | `matOf()`, `hqMatOf()`, `groundAO()`, `groundAOR()`, `applyNight()`, `litOf()`, `placeLights()`, `setRender()` | Unified `sRGBEncoding` + `ACESFilmicToneMapping`. Tactile normal maps (`glazeN()`, `biscuitN()`, `roughTex()`) active on ceramic materials. **No view-blocking `GLOW_GEO` box inside lit modules** — openings are genuinely see-through across the module interior. Lit modules use `MAX_LIGHTS=12, SHADOW_LIGHTS=6` real 3D point lights plus a per-pixel module-space candle shader (`aCandle` attribute in `groundAO`) that shades the curved inner walls (`inW`), the 3 mm opening reveals/jambs (`revW`), and radial subsurface porcelain translucency (`outW`). Ground candle light is an analytic light map baked by `startBake()` / `bakeStep()` (see Baked candle light) |
| Technical review | `FIT`, `techReview()`, `techDetails()`, `renderTech()` | Panel under Checks: fired fits (rims 53.4 mm, 1.6 × 1.5, 0.3 clear), glaze-free bands, plate/base span ratios, candle heat, air, stability, with four parametric SVG details |
| Courtyards | `courtyards()`, `courtOpen()` | A 3 × 3 building drops its middle module on every level (flag `auto`); upper plates open over it, roofs go per module |
| Baked candle light | `BAKE`, `startBake()`, `bakeStep()`, `wallMask()`, `columnBoxes()`, `occOf()`, `GL_*` | Rewritten 2 Nov (no shadow maps). One job per outer wall of each lit module: a 256² mask of its openings (a light cookie) and a ground quad drawn top-down into a half-float target. Per ground pixel: `GL_N` Vogel-disc samples of the flame (5 × 10 mm) plus the glowing interior (larger, 0.3×), each ray must pass the mask at both wall faces; mask mip level follows the sample spacing (PCSS-style penumbra); irradiance I·h/d³; up to `GL_OCC` nearby module columns block rays; radial fade to `GL_R()`. Plus a glow skirt round each ground-level lit module. The overlay applies a soft shoulder then the normal ACES, so nothing clips. Brightness: `GL_GAIN` × candle slider × flicker |
| Palettes | `applyPalette()`, `applyAccent()`, `randPal()` | Roofs vary: 65% white, otherwise a palette colour |
| UI | `renderUI()`, `renderEditor()`, `seg()`, `setCount()`, `randAll()` | Randomize All adds about 1 court per 10 buildings. The phone CSS block stays last in `<style>` |
| Checks | `buildingChecks()`, `villageChecks()`, `wallSym()` | Porcelain rules: openings at most 40% of a wall, bars at least 2.5 mm |
| Export | `gif15()`, `gifPalette()`, `gifLZW()`, `gifEncode()`, `makeSheet()` (jsPDF), JPG | GIF frames up to 1080 px with a median-cut palette |
| Print pieces (STL) | `exportSTL()`, `piecesOf()`, `moduleSolid()`, `slabSolid()`, `lipSolid()`, `ventCut()`, `pitchedSolid()`, `courtSolid()`, `zipOf()` | Button "Pieces (STL)" under Checks: a zip of watertight STLs for the selected buildings, identical pieces once with a count, plus README.txt. Built with manifold-3d 3.2.1 (jsdelivr, loaded on first use) from the same constants as the view (T, `radOf`, `LIP`, `VENT_D`, `PLATE_T`). Base, plates and flat roof that come out identical share one `slab-…` file. "shrink %" scales up by 1/(1−s) for mould masters. Started from Gemini's `print/gemini_redux/tikrar_to_stl.mjs` (31 Oct), corrected to the slab rules. Test hook: `window.__stl` |
| Truss roof (3 Nov) | `TRUSS`, `isTruss()`, `trussBars()`, `barTris()`, `trussRoof()`, `pitchedRoof()`, `trussSolid()`, `seatSolids()` | Slanted roofs are Filled (the cast shell) or Trusses (`b.fill="truss"`): the late Ottoman timber frame of HoB pp. 97–98 as one cast lid. Owner: elegant, little bulk, no sharp edges. Every member is a ROUND bar (oval section, domed ends, lofted rings; STL = hull of each bar's rings). Heavy 3 mm: hips, top ring, one purlin per slope; light 2.5 mm: common rafters at 8 mm and battens; low soft eave board 2.4 mm, flush. Same seat, pitch, opening and footprint as the shell. Openings re-roll deals Filled/Trusses 50/50. |
| Drawn walls and sliders (1 Nov) | `drawBoard()`, `renderFreeTools()`, `clampHole()`, `scaleWall()`, `toFreeNow()`; openings.js `FREE`, `toFree()`, `mirrorFree()`, `lipLines()`, `setH()` | Wall mode "Drawn" = `{mode:"free",holes:[{s,x,y,w,h,p?}]}`. The big elevation is a drafting board: drag an opening to move it, a corner to size it (0.5 mm snap, kept off the corners); dragging any catalogue wall turns it into a drawn wall. X/Y/W/H sliders for the selected opening. Dashed lines in every line elevation = slab lips behind the wall. Bay chips show their own stretch of wall (left end / none / right end). Set in the Module editor (`.modonly`, `applyDims()`); the cluster editor follows them (reads `tikrar-module-editor-v1` via `modDims()`, live across tabs via the storage event, re-lays the city when they change, `S.dims`): Width (`S.mw`, front/back walls = `WX`) and Length (`S.ml`, side walls = `WZ`) 45–120 mm, base/plates/lips/both roofs and the STL follow; faces are built through `bld(spec,face)` which sets `B.setW()` (catalogue openings stretch, drawn walls are real mm); Height (`S.mh`), Walls (`S.mt`), Slabs (`S.ms`), Openings % sliders; H, T, BASE_T, PLATE_T, FLAT_T are `let` and read live everywhere, including the STL. Viewer sliders show their value (`vbarVals()`) |
| Scene (GLB) (2 Nov) | `exportGLB()`, `smoothMesh()`, `glbOf()`, `glazeRGB()`, `glzBody/glzPlate/glzRoof()`; `piecesOf(M,b,cache)` now also returns `.at` (where each copy stands) and `.gkey` | Button "Scene (GLB)" (Blender row under Print): the whole city, or only the selected buildings (tick "selected only"), as one `.glb` plus a `scene.json`. Same solids as the STL zip, placed as the 3D view places them (building at x, z, rot; modules at level heights; slabs, roofs). glTF = metres, Y up (TIKRAR Z-up turned x,z,-y). Nodes `<building>` > `<piece>.<position>`, empties `candle.<position>` at each flame (`CANDLE_Y`); materials named `<body>-<glaze>` (e.g. `porcelain-cobalt`). Normals smoothed under 40°. Also copied into the file's `extras`. For renders only; never print from it. Test hook: `window.__glb` |

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

## Recent engine & geometry updates (v 01.11 · 07:45)

1. **See-through lit modules (removed `GLOW_GEO` box):**
   - Removed the interior `THREE.BoxGeometry` (`GLOW_GEO`) from `buildBuilding()`. Lit modules are now genuinely hollow and see-through from window to window.
   - Replaced `GLOW_GEO` with per-pixel 3D candle radiance in `groundAO(sh, mat)` driven by a 4-component vertex attribute `aCandle = [modX, modY, modZ, outward]` generated on `buildWall()` and `cornerGeo()` (and preserved in `mergeGroup()`):
     - **Inner wall face (`vCandle.w < -0.1`):** Inverse-square warm candle illumination (`attIn`) centered at the flame `(0, 14, 0)`.
     - **`3 mm` opening reveals & claustra bars (`abs(vCandle.w) < 0.85`):** Grazing golden rim light (`attRev`) across the cut wall thickness.
     - **Outer wall face (`vCandle.w > 0`):** Radial subsurface porcelain translucency (`attOut * uTrans`) brightest opposite the flame and attenuating toward the top/bottom rims and corners.
   - Enabled real 3D candle lights (`MAX_LIGHTS = 12, SHADOW_LIGHTS = 6` at `1024×1024`) to illuminate the tealight cup, locating lips, plates, and neighboring walls.
   - Upgraded the tealight in `buildBuilding()` with a low cup (`TEA_CUP_GEO`), glowing melted wax pool (`TEA_WAX_GEO`), and two-layer smooth teardrop flame (`FLAME_OUT_GEO`, `FLAME_IN_GEO`, `24×18` segments — no billboard `THREE.Sprite` quad so `SSAOPass` never draws a rectangle around the flame).
2. **Concentric rounded inner walls & locating lips (`rInOf`, `cornerGeo`, `lipRing`, `lipSolid`, `moduleSolid`):**
   - Expanded the `Corners` (`#radius`) slider to `0–6 mm` (default `radOf(b) = 4.5 mm`).
   - Added `rInOf(R) = R <= 0.05 ? 0 : Math.max(1.8, R - T * 0.52)` so the interior wall corner in `cornerGeo` (`CSEG = 24, KSEG = 4`) and `buildWall` is always smoothly rounded concentrically with the exterior corner instead of collapsing to a sharp square corner.
   - Updated `lipRing()` (3D view) and `lipSolid()` / `moduleSolid()` (STL export) so locating lips concentrically follow `rInOf(R) - LIP.clr`.
3. **16-bit HDR `EffectComposer`, 16-sample floor caustics (`BAKE`), and unified `sRGBEncoding`:**
   - `setupComposer()` now initializes `EffectComposer` with a `THREE.HalfFloatType` render target at device pixel ratio (`w * pr, h * pr`), eliminating 8-bit dark gradient banding inside shaded archways.
   - `draw()` runs `composer` in both Day and Night when `Render` is active (`FINAL` preserves pure white `#ffffff` background in Day mode while keeping SSAO, bloom, and FXAA on the porcelain pieces), and `SSAOPass` stays continuously enabled in perspective mode without flashing on camera orbit.
   - Upgraded `BAKE` ground lightmap to `1024×1024` shadow maps with 16 volumetric flame samples (`BAKE_SOFT`) and hid the dark `MAT.contact` square at night.

Living version: https://claude.ai/artifact/GkNYtneGMfWf9nK6yKJRzd

- 2 Nov, Spell a word: Cluster editor, Layout area, field "Spell a word" + Spell button. `spellWord()`, `wordLayout()` (called first in `gridLayout`), 5 × 7 `FONT5` (A–Z, 0–9, - . ! &). One pixel = one module footprint; buildings are new 1–2 level, 1-row-deep, 1–3 wide, one palette, each with its cell `b.wc/b.wr`; `S.word` set. Arrange on grid, Fill grid and Randomize All clear `S.word`. Max 360 modules. Switches to Plan.
- 2 Nov: Spell also takes Arabic (shaped by the browser onto a canvas, sampled to 11 rows: `arabicCells()`); Spell now switches to Plan with Grid = Lines.
- 2 Nov: Spell uses PixelAE-Bold.ttf (repo root, loaded via FontFace; fontCells(): one font pixel = one module, Latin and Arabic). 5x7 FONT5 is only the offline fallback.

## 2 Nov review round 1 (v 02.11 · 14:25)

From the review doc https://claude.ai/artifact/1ZcYsG4tDJdifEm739Ktzw. Render engine untouched.

- **History:** Undo / Redo (buttons under Checks, Ctrl or ⌘ + Z, Shift + Z, Y). Only the design is in the history (`VIEWK` lists the view keys that are not: night, sun, explode, candle, render, ortho, lock, spin, nopanel, cut, view). One step per settled change (400 ms pause), so a slider drag is one step. Up to 60 steps or 40 MB. `applyState()` puts a snapshot back. Nothing is recorded until the first touch (`hLive`).
- **Saving:** `save()` now only schedules; localStorage is written 300 ms after editing stops and on pagehide (`flushSave`). Anything that must read localStorage right away should call `flushSave()` first.
- **Share:** "Copy link" (design in `#d=`, deflate-raw + base64url, a 17-building city is about 1.8 k characters), "Save JSON", "Open JSON". `checkDesign()` validates anything from outside before it reaches the editor; the hash is removed after opening; opening is one Undo step. A link only opens in the editor it came from (cluster vs module).
- **UI:** panel headings fold (kept per browser in `tikrar-panels-v1`); a ‹ › chevron on the viewer bar when it overflows; check failures name the wall ("Level 2 1A front") and list them in the tooltip; toast `#toast` (role=status).
- **Performance:** post-processing scripts download in parallel and run in order; candle flicker is skipped for `prefers-reduced-motion` and when the view is scrolled off screen; `openings.js?v=0211b` (bump the query with each release that changes openings.js).
- **Not done yet (round 2):** per-building rebuild cache, dynamic resolution while orbiting, self-hosting three with SRI, merging the three entry pages, collapsing the city layout controls under "Advanced".

## 2 Nov, bar and theme (v 02.11 · 15:30)
- Viewer bar now holds switches only: Day | Night, Render, Candles, Sun, Explode, Cut, Randomize (whole city; Module editor: this wall). The sliders (candle strength, time of day, explode distance) and the cut axis/position/flip moved to the new **View** panel; element ids are unchanged, so the old handlers still drive them. `barSync()` keeps the switches in step. Sun off = `S.sunOff` (sun intensity 0, no shadows).
- The site theme follows the lantern light (`siteTheme()` in `applyNight`): Day = light page, Night = dark page. The ◐ button is gone. The page always opens in Day.
- A click on empty space hides the selection highlight (yellow module box, red footprint) with `S.noSel`; picking anything, or any selection change, shows it again. The panels still edit the selected building.
- Keys in `VIEWK` (not undoable): noSel, sunOff, explodePrev, candlePrev, cutLast.

## 4 Nov, pixel engraving (v 04.11 · 01:15)
- Two separate options in the Building panel: **Wall engrave** (`b.engW`) and **Roof engrave** (`b.engR`), each Off or one of 8 pixel patterns drawn after the books: Houses of Beirut (star, diamond lattice, chevron, pear balusters) and Architectures de Beyrouth (claustra rings, claustra crosses, block checker, stepped fins). `ENG_PATS` holds the 1-bit tiles (`motif:true` ones are kept whole, never cut by an opening).
- The pattern is cut into the OUTSIDE only, so the clay under each square is `ENG.rem` = 1.0 mm thick (the wall is `T`): the candlelight shows brighter. Pockets are `ENG.px` 2.2 mm at a `ENG.pitch` of 3.4 mm, with a soft rim, a filleted floor and 12% draft; the outer face stays flush everywhere else and no pocket comes within `engClr()` of an opening or an edge.
- Code: `engCells()` picks the cells that fit a region; `engraveFace()` takes one flat face of a non-indexed geometry, removes its flat triangles, re-triangulates the outline with a hole per pocket and adds the rounded pockets (outline vertices keep their exact coordinates, so the mesh stays watertight). Walls: `buildWall` (cache key has `engW`), `engWallCells()` gives the same cells to the render and to the STL (`moduleSolid` cuts one convex hull per pocket). Roof: `slantRoof` engraves its four flat slopes (only the Filled shell; Trusses, Half and the flat slab are not engraved), so `pitchedSolid` welds them with no extra work.
- Night: pocket floors carry `aThin` (and `aCandle.x` + 1000 in the cloned geometry), and the glow shader lets 2.8x the light through there.
- Not engraved: Slide mode (the wall ring), flat roofs and plates (the lips and the Ø25 vent leave no room), truss roofs.
- 4 Nov 01:50, engraving fixes: (1) openings could vanish. The flat face's outline was read from triangle windings, and a flipped sliver (or openings so close their bevel zones merge) opened it, so earcut painted the face over an opening. `engraveFace` now reads the outline orientation-free (edges used by an odd number of the face's triangles), sorts loops by nesting depth, gives every hole and pocket to its smallest outline, and refuses a face (leaves it plain) unless the new triangles add up exactly to the old face minus the pockets. Walls whose openings run into the wall end (pilotis, some claustra, glass blocks) therefore stay plain. (2) Denser: pitch 3.2 / pocket 2.0, tighter clearances, motifs may be cut by an opening, plus a plain dense **Pixel grid** pattern (`grid`, first in the list).
- 4 Nov 02:30, engraving round 2 (v 04.11 · 02:30): (1) corners are engraved too: `engraveFace` takes any frame (`engPlane` for flat faces, `engCornerFrame(R)` for the quarter cylinder, unrolled: a = arc length, b = height), `cornerGeo(..., eng)` rebuilds `aCandle` after engraving, and `moduleSolid` cuts the same corner cells (`engCornerCells`, bent round the cylinder). A corner uses the pattern of its first wall. (2) **Random mix** (value `random`, seed `b.engS`, **Shuffle** button): every wall of every module and every roof slope gets its own pattern via `engRandId` (`engWOf`, `engROf`). (3) 9 tatreez patterns: Levantine (Najmeh star, Saru cypress, Wardeh rose, Qamar crescent, Meftah key, cross-stitch) and Armenian (partridge eye, tree of life, pomegranate).
- 4 Nov 02:55, one continuous grid (v 04.11 · 02:55): `engPer(R)` lays the pixel grid round the whole module as one unrolled band (front, corner, right, corner, back, corner, left, corner). Each flat run and each corner arc gets a whole number of columns spread evenly (about `ENG.pitch` apart, half a pitch left at each end), so no pocket straddles a seam and the pattern carries on across corners; rows are spread over the wall height the same way. `engCells(loops,pat,clr,grid)` keeps a cell only if it is inside and `clr` (square, L-infinity distance, `engClrI()`) from every outline edge, so the grid runs right up to openings and edges. The roof slopes spread their grid over each slope's bounding box.
- 4 Nov 03:35, roof grid like the walls (v 04.11 · 03:35): the roof is engraved over the WHOLE outer slope band (eave tangent line up to the top-opening chamfer), hips included, as one annulus in plan view. `slantRoof` hands `engraveFace` a custom frame: `loc` = plan (a=x, b=-z) plus the distance below the slope plane (the rings are nested, so `ru` finds a point's inset u by bisection on a rounded-rectangle distance), `nrm` from the same, and `pt(cell,x,y,dep)` projects each pocket point onto the true surface. Cells come from the same row/column idea as the walls: rows spread over the slope distance, and on every row each of the 8 segments (4 flats, 4 hip arcs) gets its own evenly spread whole number of columns; a hip arc uses the pattern of the flat before it. Pockets whose rim would poke out of the band at a hip are dropped. `engraveFace` now takes per-cell `pt` and measures pocket area from the 2D rim polygons. `engSpread` never spaces pockets closer than a pocket is wide (rims touched on short arcs and made a 3-triangle edge). The roof mesh keeps only the 72 old open edges at the seat ring.
- 4 Nov 06:10 (v 04.11 · 06:10): (1) Bonsai trees REMOVED (olive kinds, pot, Trees row, Re-roll Trees switch, pot STL); old saves drop any `b.tree` building on load. (2) Roof and Plate colour are now rows of round swatches (`roofSw`, `plateSw`: same as walls, unglazed, every glaze) like the Glaze row. (3) Engraving is a general city option: "Wall/Roof engrave (city)" in the City block panel (`engWc`, `engRc`, Shuffle) sets every building and is kept in `S.engW/S.engR/S.engS` for buildings added later; the per-building rows in the Building panel now show only in the Module editor.
- 4 Nov 06:50 (v 04.11 · 06:50): (1) the flat roof is pixel engraved too (Roof engrave applies to it): `flatEng(b,nc,nd,ep)` engraves the slab's top face (frame like a wall, depth FLAT_T-ENG.rem) with the lip rings treated as obstacles (extra even-odd loops) and the vents as holes, and caches geometry + cells; `modernRoof` uses the geometry, the STL (`piecesOf` slab) cuts the same cells as hulls. (2) **1-Bit** button in the bottom bar (after Day/Night/Render), after Return of the Obra Dinn: `drawBit()` draws the scene into a half-resolution render target, then a shader turns every pixel ink or paper (8x8 Bayer dither on brightness, outline where brightness jumps). S.bit cycles 0 off, 1 black/white, 2 green, 3 amber; it is a view key (not undoable) and is applied inside `draw()`, so JPG/GIF capture the effect.

## 4 Nov, as-built opening proportions and coherent sheets (v 04.11 · 08:40)
- **One storey, one scale.** A module wall is one storey. 1860–1925 openings are now drawn in real metres (`AS` in openings.js) and set at one uniform scale `SC` (mm per m) = min(H / 4.5 m storey, (narrower module wall − 2 × 6.5 mm corner piers) / 5.8 m widest front). They are never stretched with the wall any more (before, a 120 mm wall made every window twice as wide). All walls of a building share `SC`, so sills, heads and spring lines run level round the house; `B.setRef(min(WX,WZ))` is called in `applyDims()`. At 60 × 60 × 40: 8.10 mm/m, 1 : 123, the wall reads as a 4.94 m storey.
- **As-built values** (HoB pages where the book gives them, usual Beirut values otherwise): tall window 110 × 260 cm (1 : 2.4) on the 75 cm parapet (pp. 166–168); arched window same width and sill, crown 3.90 m (p. 169); bays 2.30 m apart (window 1.10 + pier 1.20); entrance door 105 × 215 cm + 25 cm lintel + fanlight (pp. 163–164); hilālī door 95 × 190 (p. 162); shop 280 × 320 (p. 165); triple arcade 100 · 120 · 100 cm arches on 25 cm columns (porcelain minimum 2.6 mm wins when thinner), crowns 3.60 / 3.90 m, to the floor (pp. 170–173); līwān 290 cm, crown 4.00 m (pp. 20–22); coupled lights 80 cm on a column, crown 3.75; high windows 40 × 80, sill 2.85; oculus Ø 60 (oval 90 × 60), oculus-above Ø 55 at 4.05 m. Each catalogue entry and Ottoman bay carries `asb` (the as-built text shown on the wall-type sheets).
- **Modernist** walls (AdB storeys about 3.0 m, so 40 mm = 3 m) keep their 60 × 40 drawing and are carried with `carry()`: hole centres follow the wall, outlines scale uniformly (squares stay square). Ribbon, picture window and pilotis (`stretch:true`) span the wall; claustra, fins and glass blocks (`native:true`) tile more blocks instead of fattening them.
- Every 1860–1925 wall and all 729 Ottoman bay combinations pass the porcelain checks at every module size (45–120 wide, 30–60 high, corner radius up to 6).
- **Sheets follow the sizes**: PDF elevations, plan, section A–A, wall types and the BOM use WX/WZ/H/T/PLATE_T/VENT_D (no more 60/40/3.0/Ø25 literals); roofs in elevation and section are drawn from the real shell profile (`shellProf()`, `roofOutline()`), so the slope follows the pitch, and `roofH()` for the filled shell is now the exact top height. Wall types are split by wall width (front/back vs sides); their sheets show the as-built sill/head datum lines, an "As built (cm)" column and the scale. Tech panel: new "Proportions" row; roof-seat detail drawn at the building's pitch; candle section at the real module width. Elevations (SVG): every wall at its real width with dimension chains (`dimChains()` in openings.js). The drafting board shows the sill/head lines and the scale.
- Sources: the two book PDFs are still not in the project; values come from the page notes already in this repo plus online sources (e.g. Evolution of Floor Construction System in Beirut 1840–1940: ceilings to 5.7 m, roofs 30–35°).
- 4 Nov (after 07:00): 1-Bit now a single on/off, pure black on pure white (green/amber removed at alihaidar's request).

## 4 Nov, section cut caps (stencil)
The Cut caps are now stencil caps (capMats/capGeom/applyClip in module.html): back faces +1, front faces −1 behind the plane, then a flat tan quad on the plane where the count is not 0. The old back-face copy showed ragged fills at engrave pockets and streaks at open seams. capGeom closes open boundary loops (roof seat ring, slab rings) with a fan for the stencil only. Render targets need stencilBuffer:true. Known: the roof's open seat rings are at different heights, so a Z/X cut can show one thin tan line across the roof eave.
- 4 Nov: default module is now 72 x 72 mm with 48 mm walls (fallbacks in applyDims, initial WX/WZ); roof engraving stops short of the top vent cut (smooth rim).
- 4 Nov 1-Bit settings: View panel gets 4 sliders while 1-Bit is on (dot size 1-4 px, default 1 = full resolution; contrast; light; outline), S.bitPx/bitC/bitB/bitO (view keys), both editors.
