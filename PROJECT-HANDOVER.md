# TIKRAR / ceramic-bis: full project handover

Written 5 Nov 2026 (evening, Beirut) for another LLM, or a new person, who needs to review the project or pick it up. It covers the whole project, not only this repo: the website, the design rules, the printers and slicers, the Blender pipeline, the UV curing lamp, how the AI sessions are organised, and what is still open.

**Read this first, then `HANDOVER.md`.** `HANDOVER.md` in this repo is the older code-level log (function names, techniques, per-release notes). This file is the overview and says where `HANDOVER.md` is now out of date (section 12).

What is deliberately left out, because this repo is public: passwords, keys, router and printer addresses, VPN details, device serials, the previous printer owner's job names, and any of David's private code. Where a section needs those, it says where they live on the owner's machine instead.

---

## Contents

1. What the project is and who is involved
2. Current state at a glance (5 Nov 2026)
3. Design rules that must not be broken
4. The website: architecture
5. The website: features, by area
6. How to change the site safely (edit, test, ship)
7. Recent work: PRs #40 to #51
8. From design to object: STL, Blender, printing
9. Printers, resins and slicers
10. The UV curing lamp
11. How the AI sessions are organised
12. Known stale or wrong information
13. Open decisions, parked items and waiting tasks
14. Suggested review checklist for the next LLM
15. Glossary

---

## 1. What the project is and who is involved

**The object.** Small slip-cast porcelain "lantern houses" from Beirut. Each house is made of stackable modules (a ring of four walls with window and door openings), separated by flat porcelain slabs, closed by a roof. A tea-light candle sits inside each lit module, so at night the openings and the thin porcelain glow and throw light patterns on the ground. Houses are grouped into city blocks ("clusters"). The architecture comes from two books: *Houses of Beirut 1860–1925* (late Ottoman, Beirut Heritage Initiative restoration manual) and *Architectures de Beyrouth 1925–1970* (modernist). Neither PDF is in this repo or in the project files; only page references are.

**The chain.** design → plaster mould design → 3D-print resin case moulds (masters) → pour plaster moulds → slip-cast porcelain → finish and fire → assemble and light. Sizes in TIKRAR are fired sizes; masters are scaled up by 1/(1 − shrink) (at 14 % shrink, × 1.163).

**People.**

| Who | Role |
| --- | --- |
| **alihaidar** (GitHub `criticalumami`, also called "crit") | Owner of this project and of TIKRAR, the front end (design, city clusters, look). Gives short, precise feedback, often as several messages in a row. Judges results from the live site. |
| **David** ("Dav", GitHub `davidsfeir`) | Owns the production process: moulds, mould-case printing, casting, firing. Has his own private app and repo (`beit-lantern-editor`). Sends STL files of mould parts to print. |
| Gemini (another AI) | Worked on the render engine and an STL exporter on 31 Oct–1 Nov. Its render changes are kept on purpose (see 3.4). |
| Claude sessions | Do the coding, slicing, printer control and documentation (see section 11). |

**Ownership rule (alihaidar, 30 Oct):** David's repo and process are read-only for us. No commits or PRs there. Anything that needs David is an optional request to him. Casting and firing are his domain.

---

## 2. Current state at a glance (5 Nov 2026)

- **Live site:** <https://criticalumami.github.io/tikrar/> (cluster editor) and `/module-editor.html`. Version stamp on main: **v 05.11 · 20:30** (PR #51). All PRs up to #51 are merged; there are no open PRs.
- **Default module:** 72 × 72 mm footprint, 48 mm wall height (changed 4 Nov from 60 × 60 × 40).
- **Printing:** two resin printers (Phrozen Sonic XL 4K, Anycubic Photon Mono M5s) plus an Ender 3 (FDM). Bed adhesion on the XL 4K was the big problem on 2–3 Nov; on 5 Nov the XL 4K also stopped joining Wi-Fi (diagnosed, not fixed). Several of David's parts are sliced and waiting for the owner's go.
- **Slicers:** CHITUBOX 1.4.0 (profiles for both resin printers and both resins) and Lychee 7.6.7 on the owner's Mac.
- **Blender:** a full TIKRAR → Blender render and print-check pipeline is built (phases 0–4). The Blender MCP setup script was written but not run.
- **UV lamp:** being wired; wiring was corrected on 5 Nov; a wattage mismatch may still stop it striking.
- **Parked:** the "align TIKRAR with David's castable design" plan and the combined-repo ("lantern-studio") plan.

---

## 3. Design rules that must not be broken

These come from the owner and have been repeated many times. Several were the cause of frustration when broken. Treat them as hard constraints.

### 3.1 Slabs: base = floor plate = flat roof

- The base, every floor plate and the flat roof are **one identical element**: a porcelain slab with **inner locating lips, offset inward, on BOTH faces**, rounded at the corners like the walls, with a small clearance to the wall.
- Current values (see `module.html`): slab thickness `BASE_T = PLATE_T` (4 mm by default, Module editor slider), lip `LIP = {clr 0.5, w 2.5, h 3}`, edges softened, one Ø 25 vent per module (`VENT_D`).
- **Outer faces are flush**: walls, plates, base and roof line up on the outside. Nothing projects.
- The STL export merges base, plates and flat roof into one `slab-…` file when they are identical.

### 3.2 Porcelain safety and look

- Every edge and corner rounded, like matte slip-cast porcelain. **No box or sharp geometry in any ceramic piece** (this was the main complaint on the truss roof).
- Walls at most 40 % open; bars and piers at least 2.5 mm; fired sections at most 60 mm; walls 3 mm where stacked.
- **No non-porcelain accessories.** Every element must be castable in the same slip.
- Engraving pixels must never sit on top cut faces or edge faces; those stay smooth. Engraving is on the outside only and leaves 1 mm of clay (`ENG.rem`).

### 3.3 Architecture

- Openings come only from the two books (1860–1925 and Modernist). Each window is a single clean opening, flush with the wall.
- A module wall is one storey. Ottoman openings are drawn in real metres (`AS` in `openings.js`) at **one uniform scale per house** (`SC`). Never stretch them non-uniformly with the wall (see `HANDOVER.md`, "4 Nov, as-built opening proportions").
- The Swiss grid (Müller-Brockmann: 12 columns, 8 px baseline, one grotesque face, no web fonts) applies to the **web design and the city layout only**, never to wall openings.
- Naming: the app is **TIKRAR**, subtitle "Beirut Lantern Generator". Say "clusters" (not neighbourhoods or districts) and "City block" (not village).
- **Bonsai trees were removed on 4 Nov at the owner's request. Do not re-add them.** Old saves drop tree buildings on load.
- The "Christmas" wall pattern was removed (the `xmas` colour palette still exists).

### 3.4 Render engine and lighting

- Gemini rewrote parts of the render engine (commit `aa2a04c`, 1 Nov) and the owner wants it kept. Before touching render code: pull main, read those commits, and don't revert them. (On 2 Nov the owner said it is fine to modify Gemini's code when needed, just not to break it.)
- The candle light and shadows on the floor at night are the point of the lantern and must **always** show. Fast mode may lower the pixel ratio but must never turn off the shadow map (PR #48).
- Day ground is white; night is pitch black with a warm, consistent candle glow.
- The 3D view renders on demand. No automatic camera moves.

### 3.5 Process rules

- **A change only counts once it is on `main`, i.e. on the live site.** The owner checks the live site, not PRs. Bump the version stamp (`id="ver"` in `module.html`) with each release so the owner can tell which version they see.
- Change exactly what was asked and keep every existing feature.
- Updates to the owner: name what changed, where, how to see it, and what is still open.
- The owner often sends several short messages in a row; treat them as one request.

---

## 4. The website: architecture

### 4.1 Files

| File | What it is |
| --- | --- |
| `module.html` | **The source.** The whole app (HTML, CSS, one inline script) in one file, about 3,100 lines / 425 KB. |
| `index.html` | Byte-identical copy of `module.html` (the cluster editor, served at `/`). |
| `module-editor.html` | Copy of `module.html` with only line 2 (`<html lang="en" data-mode="module">`) and line 7 (`<title>TIKRAR · Module editor</title>`) changed. |
| `openings.js` | Opening catalogues for both eras, claustra blocks, the as-built table `AS`, drawn-wall helpers, dimension chains. Loaded as `openings.js?v=…`; bump the query when it changes. |
| `proposals.html` | Separate static page of design proposals. |
| `crit_proposals/*.md` | Written proposals (design language, process, porcelain elements, app roadmap, Beirut modernism landmarks, module openings). Originally written for David's app, so some refer to his `index.html`. |
| `app.html`, `module-round.html` | Old URLs that forward into TIKRAR. |
| `PixelAE-Bold.ttf` | Pixel font used by "Spell a word". |
| `HANDOVER.md` | Code-level log (see section 12 for what is stale in it). |

There is no build step and no package.json. GitHub Pages serves the repo root of `main`.

### 4.2 Runtime dependencies (all from CDNs)

- three.js **r128** (`cdnjs`), plus r128 examples from jsdelivr (OrbitControls, EffectComposer passes, SSAO, etc.). Upgrading three was considered and rejected for now because it would touch Gemini's render code.
- manifold-3d **3.2.1** (jsdelivr, loaded on first use) for watertight STL solids and for the truss roof's signed-distance meshing (`levelSet`).
- jsPDF 2.5.1 (cdnjs) for the PDF sheets.

### 4.3 Modes and storage

- `MODE` comes from `<html data-mode>`: absent = cluster editor, `module` = Module editor.
- localStorage keys: `beit-lantern-designer-v3` (cluster design), `tikrar-module-editor-v1` (module design; the cluster editor also reads its dimensions live through the `storage` event), `tikrar-panels-v1` (folded panels), `beit-proposals-theme`.
- Saving is debounced (300 ms after editing stops, plus on `pagehide`). Code that must read storage immediately calls `flushSave()` first.
- Designs can be shared as a link (`#d=` deflate-raw + base64url) or as JSON; `checkDesign()` validates outside input.
- Undo/Redo keeps only design state. View-only keys are listed in `VIEWK` and are not undoable.

### 4.4 Core pipeline (where to look in `module.html`)

| Area | Key names |
| --- | --- |
| State | `S` (not global; read localStorage in tests), `defaults()`, `KINDS`, `make()` |
| City layout | `streetGrid()`, `gridLayout()`, `fillGrid()`, `wordLayout()` / `spellWord()`, `courtyards()` |
| Geometry | `buildBuilding()`, `buildWall()`, `bld(spec,face)` + `B.setW()`, `cornerGeo()`, `rInOf()`, `lipRing()`, `soft()` (cached in `SGEO`; outputs are shared, **never mutate them**), `slantRoof()`, `modernRoof()`, `trussRoof()` / `trussField()` |
| Engraving | `ENG`, `engraveFace()`, `engWallCells()`, `engPer()`, `flatEng()`, `engWOf()` / `engROf()`, lite profiles + `fullEng()` |
| Rebuild | `rebuild()` (sliced, per-building cache `BCACHE`, 30 ms budget per frame), `rebuildNow()` (synchronous), `gSig()` (anything global that changes geometry must be in it), `mergeGroup()` |
| Render | `draw()`, `setupComposer()`, `setRender()`, `applyNight()`, `groundAO()` candle shader (`aCandle` attribute), `LPOOL` lights (night only), `setPR()` / Fast mode, `drawBit()` (1-Bit view) |
| Night ground light | `BAKE`, `startBake()`, `bakeStep()`, `GL_*` constants (analytic light map through opening masks) |
| Checks | `buildingChecks()`, `villageChecks()`, `techReview()`, `updateDebug()` (Debug button) |
| Export | `gif15()` / `gifEncode()`, `makeSheet()` (PDF), `makeCatalogue()` (all elevations), `exportSTL()` + `piecesOf()`, `exportGLB()` |
| Randomizing | `randAll()`, `randBlock()`, `randB`, `remix()` (Re-roll axes), lock chips `S.lk`, `LK()`, `lkEvery()`, `lkSync()` |

---

## 5. The website: features, by area

### 5.1 Cluster editor (`/`)

- City of buildings on a straight street grid, filled or with gaps; cluster bands and street widths; block trays (`S.blocks` hidden / lines / plots); public court trays; 3 × 3 courtyard houses.
- Landmarks at true scale (Holiday Inn, Gefinor, EDL, Saroulla, Egg, Museum).
- Building panel per building; city-wide options in the City block panel (engraving on/off for walls and roofs).
- **Randomize** (top right of the viewer), with **lock chips** under it (PR #51) and **Keep randomizing** with an interval (PR #34). **Re-roll** block with independent axes Layout / Openings / Colours ("one palette" or "mix") for selected buildings or the whole city.
- **Spell a word**: Latin or Arabic text laid out as buildings, one font pixel = one module footprint.
- Block and street dimensions on the far sides of the grid (PR #43); ruler.
- Follows the Module editor's dimensions (width, length, height, wall and slab thickness).

### 5.2 Module editor (`/module-editor.html`)

- One building. Sliders: Width / Length 45–120 mm, Height, Walls (thickness), Slabs (thickness), Openings %.
- Wall modes: catalogue walls by era and bay chips, Whole wall (the default), and **Drawn** walls (drag openings on a dimensioned drafting board).
- Always dimensioned in 3D (labels kept off the model).
- Randomize deals everything: era, roof off / flat / slanted, slanted fill, walls, palette (lock chips apply: Size, Walls, Roof, Light, Palette).
- **All elevations** export (PDF + SVG) for both eras at the current sizes (PR #44).

### 5.3 Roofs

- **Flat** = the slab (rule 3.1).
- **Slanted**, three fills (`b.fill`): **Filled** (the cast shell), **Trusses** (late Ottoman timber frame as one cast lid: round bars, one plane per slope, joints blended with a 1 mm fillet via a signed distance field, feet merged into an eave beam), **Half** (two slopes filled, two as trusses). Owner wants the truss far less bulky and fully rounded; see the truss memory in section 13.
- Pitch adjustable.

### 5.4 Surface and look

- Glazes and palettes (roofs and plates as swatches); Day/Night toggle; Render mode (SSAO, HDR, clearcoat only in Render); Sun on/off; Explode; section **Cut** with stencil caps; Side and Front views; full screen; **1-Bit** view (black on white dither with dot-size / contrast / light / outline sliders).
- **Pixel engraving** on walls, corners, slanted shell roofs and flat roofs: one continuous grid round each module; currently only on/off ("grid"); the old pattern catalogue is still in the code but unreachable.
- **Slide** mode: openings travel round the walls (and through the engraving). 3D/GIF only, never saved.
- **Debug** button: red boxes for porcelain-limit failures, floating modules, candles without plates, overlaps; amber for notes.

### 5.5 Exports

| Export | Notes |
| --- | --- |
| JPG, GIF | GIF modes: orbit, sun, explode, slide, randomizer. Since PR #50, GIFs are made only from the GIF panel's Make button, with a speed slider 0.05×–2×. |
| PDF sheets | Elevations, plan, section, wall types, BOM; numbers follow WX/WZ/H/pitch. |
| **Pieces (STL)** | Zip of watertight STLs for the selected buildings, identical pieces once with a count, README, shrink % field for masters. Runs under `fullEng()` so engraving is always complete. **This is the source of truth for printing standard pieces.** |
| **Scene (GLB)** | Whole city or selection for Blender, plus `scene.json`. Metres, Y up. Stable node and material names (see 8.2). For renders only, never print from it. |
| Copy link / Save JSON / Open JSON | Design sharing. |

### 5.6 Performance (4 Nov, PRs #40, #45, #48)

Geometry caches, per-building rebuild, lite engraving in the viewport with LOD, Fast mode (lower pixel ratio while moving), 4 night lights, Standard glaze outside Render. Deferred: Web Worker rebuild, three.js upgrade. Rule: export code must run under `fullEng()`; `engWOf` / `engROf` return nothing for far-away buildings otherwise and the STL would lose its engraving.

---

## 6. How to change the site safely (edit, test, ship)

1. Clone `criticalumami/tikrar`, branch from `main`.
2. **Edit only `module.html`.** Then regenerate the copies:
   ```sh
   cp module.html index.html
   sed -e 's|<html lang="en">|<html lang="en" data-mode="module">|' \
       -e 's|<title>TIKRAR · Beirut Lantern Generator</title>|<title>TIKRAR · Module editor</title>|' \
       module.html > module-editor.html
   ```
   Forgetting this is the easiest way to ship a stale page. Check with `cmp module.html index.html` and `diff module.html module-editor.html` (only lines 2 and 7 differ).
3. Bump the version stamp `id="ver"` (format `v DD.MM · HH:MM`, Beirut time). Bump `openings.js?v=` if that file changed.
4. Syntax-check the inline script (extract it, `node --check`).
5. Test in headless Chromium with Playwright. What has worked in cloud sessions:
   - Serve the repo with `python3 -m http.server`.
   - CDNs and github.io are often blocked from the sandbox, so route three r128 from `npm pack three@0.128.0` (and manifold-3d from its npm pack) with Playwright request routing.
   - Inject a debug hook (`window.__d = c => eval(c)`) before the script's closing `})();` to read internal state. Test hooks in the code: `window.__stl`, `window.__glb`.
   - SwiftShader is slow: capture with `renderer.domElement.toDataURL()` after `settleLight(); draw()` instead of page screenshots; heavy pages need `$eval(e => e.click())` instead of Playwright clicks; night mode may be too slow to test.
   - For refactors, compare a fingerprint of every merged buffer and the STL hash against `main`.
   - The test scripts mentioned in `HANDOVER.md` (`tikrar-tests/`) are **not** in the project files; each session rebuilt its own harness.
6. Open a PR (PR body starts with the attribution block the project uses), merge to `main` (the owner has asked for changes to go live), check the Pages deploy, and ask the owner to confirm the stamp on the live page if github.io can't be reached.
7. Commit messages: no model names.

---

## 7. Recent work: PRs #40 to #51

All merged to `main`.

| PR | Date | What |
| --- | --- | --- |
| #40 | 4 Nov | Cluster performance round 1: geometry and candle-data caches, no candle lights by day, orbit preview at lower pixel ratio. |
| #41 | 4 Nov | 1-Bit grid as one-pixel hairlines; full screen keeps the grid unless Render. |
| #42 | 4 Nov | Full screen button alone at bottom right. |
| #43 | 4 Nov | Block and street dimensions on the far sides of the grid; plan view frames them. |
| #44 | 4 Nov | Module editor: export all elevations (PDF + SVG) for both eras at the current sizes. |
| #45 | 4 Nov | Lag round 2: lite engraving, LOD, per-building sliced rebuild, fewer segments, 4 night lights, Fast mode. STL hash-identical. |
| #46, #47 | 4 Nov | Bottom bar: corner-bracket full-screen icon at far right, group separators, Side view. |
| #48 | 4 Nov | Candle light and shadows always on in Fast mode; auto Fast ends when the drag ends. |
| (direct) | 4 Nov | `5e35fd1`: Slide mode keeps the pixel engraving. |
| **#49** | 5 Nov | Toolbar "Slide GIF" button (one click makes the slide GIF). Superseded by #50. |
| **#50** | 5 Nov | GIF speed becomes a slider (0.05×–2×, default 1×, readout; `gifSpd`), so GIFs can play far slower. **The toolbar GIF and Slide GIF buttons were removed**; GIFs are made from the GIF panel's Make button. |
| **#51** | 5 Nov | Lock chips under Randomize (`#lockBar`, state `S.lk`, saved with the design). Cluster: Layout, Walls, Roof, Palette. Module: Size, Walls, Roof, Light, Palette. Lock all / Unlock all. If all are locked, Randomize says so. The Palette lock also acts like "Keep palette" for All / Block / village building randomizing. Honoured in `randB`, `rxApply` / `remix`. |

Earlier PRs: #1–#2 (smooth corners, city grid, the slab rule), #10–#14 (Re-roll axes, randomize GIF), #11 (Scene GLB), #15–#18 (bonsai, since removed), #19–#24 and #36 (truss roof), #25 and follow-ups (engraving), #26 (as-built openings), #27–#28 (section caps), #29–#39 (camera lock, dimensions, bottom bar, Randomize placement, keep randomizing, full screen). `git log` has one line per change with its version stamp.

---

## 8. From design to object: STL, Blender, printing

### 8.1 Standard pieces

TIKRAR's **Pieces (STL)** export is the source of truth for standard pieces (modules, slabs, roofs). Apply shrink exactly once (in the export's shrink % field, or in Blender's export, never both). Known issue: the default pitched (Filled) roof STL has about 72 non-manifold edges at the seat ring, so it falls back to a raw mesh.

Gemini also wrote a Node exporter and printer job packer (outside this repo, in the owner's local print folder, `gemini_redux/`). Its slabs break rule 3.1 (thin roof, lip on one face only, wrong lip sizes), so the in-browser exporter was rebuilt from it with the correct rules. Don't use Gemini's slab output.

### 8.2 Blender workflow (built 2 Nov, phases 0–4)

Files are in the project files under `blender/` and on the owner's Mac (Blender 4.5 LTS).

| Phase | What | State |
| --- | --- | --- |
| 0 | Cheat sheets for learning Blender on the site's exports | Done |
| 1 | "Scene (GLB)" button on the site + `scene.json` | Live (PR #11) |
| 2 | `TIKRAR-Studio.blend` + `tikrar_studio.py` add-on: Import button, Day/Night, 3 cameras, a tea light + point light per `candle.*` empty, materials swapped by name | Built headless with bpy; not yet confirmed in the GUI on the Mac |
| 3 | `TIKRAR-Kit.blend` (locked reference pieces from the site's STL), "New piece: print check" panel (check + STL export with shrink applied once, to `new-pieces/`), `CHECKLIST.txt`, `TIKRAR-Blender-guide.pdf` | Built |
| 4 | Blender MCP: `blender-mcp/setup_mac.sh` + `install_mcp_addon.py` (pinned add-on hash) | Written, **not run or tested**; the owner runs it. Only usable from a session on the Mac. |

Conventions: GLB is in metres (a 72 mm module = 0.072), no unit change needed in Blender; STL is in mm (import scale 0.001). GLB names are stable and must stay so: nodes `<building>` > `<piece>.<position>`, empties `candle.<position>`, materials `<body>-<glaze>` (e.g. `porcelain-cobalt`).

Decisions taken by default (from the Blender proposal doc): Blender runs on the owner's Mac; new Blender pieces don't flow back into TIKRAR automatically; no Blender shapes offered to David yet.

### 8.3 David's mould parts

David designs the mould cases in his own app and sends STLs. Files received so far:

- 2 Nov: "Beit-106" mould walls (as a pre-sliced zip; needed repacking, see 9.1).
- 3 Nov: E1/E2 keyed end plates, F facade bed, J-L/J-R joint rails.
- 5 Nov: `Base-resin`, `Front-opening-plugs-3-resin`, `C-port-formers-3-joined` (v2), `J-L-left-joint-rail` (replaces an older perimeter rail that had supports built in).

These live in the owner's local print folder (`models/beit106/`, `models/lychee/`), not in this repo.

---

## 9. Printers, resins and slicers

All printing is controlled from the owner's Mac. Cloud sessions reach it through a Remote Control session (or the owner's local Claude session, see 11.3). Detailed operating notes, tools and history are in `CLAUDE.md`, `HANDOFF.md` and `STATUS.md` in the owner's local print folder; those files contain network details and must never be copied into this repo.

### 9.1 Phrozen Sonic XL 4K (resin, MSLA)

- 3840 × 2400 px, 192 × 120 × 200 mm, 50 µm pixels and layers, accepts only `.zip` / `.phz` (Chitu format).
- Controlled over its web interface by local Python tools (`tools/printerctl.py`: find, status, list, profiles, upload, set-profile, print). Upload is a multipart POST to `/plates`. While printing, the home page shows layer progress and has Pause / Stop buttons. There is **no Z control** on the web page: raising Z is touchscreen only. In an emergency the owner should tap Stop on the touchscreen.
- **Dangerous URLs**: some plain GET requests start, delete or reboot. Never fetch them while exploring.
- **Files sliced for 3840 × 2160, or with a foreign G-code header, are rejected** ("Please Check Files!"). They must be repacked (layers padded to 3840 × 2400, G-code rebuilt). That happened with David's Beit-106 zip.
- Slicing pipeline on the Mac: `tools/slice.py` (scale, two-axis tilt, PrusaSlicer supports + pad, checks, layer preview), `orient.py`, `solidify.py`, `plate_pins.py`, `open_back_shell.py`, `stl_to_zip.py` (flat parts). Timings come from `tools/resin.py`, but **the resin profile selected on the printer overrides the zip's exposure**.
- Settled orientation rules for David's flat mould parts: tilt 20–30° plus 15° on the second axis, **pad base** (branching trees gave almost no first-layer contact), one part per job, 3 mm elevation.
- Hardware state: LCD tested OK; FEP film worn (not replaced; prefer small layer areas and slow lifts); bed leveled 2 Nov. Level test on 2 Nov: 6 of 9 squares stuck (centre, bottom-middle and bottom-right missing), pointing to one high edge plus a bowed plate or slack film. The 3 Nov E1 print did not adhere and was stopped. **Adhesion was never confirmed solved.**
- Power cuts are common; prints cannot be resumed. Prefer shorter jobs.
- **5 Nov: the printer no longer gets an address on Wi-Fi** (it associates, then drops before DHCP over a weak relay uplink) and can no longer be cabled. A fix was proposed (separate SSID with its own DHCP on the router) and waits for the owner's go.
- About 200 old jobs from the previous owner fill the disk. **Never delete them**; the owner deletes from the printer's own page if they want.

### 9.2 Anycubic Photon Mono M5s (resin)

- Leveling-free, with Auto Print Check. Files are `.pm5s` and go to the printer on a USB stick (no network control is set up).
- 5 Nov: the owner first chose to print David's Base on it, then switched to the front-opening plugs only. Sliced in CHITUBOX: `plugs_m5s.pm5s`, Trans Green, tilted 15°, Cube3D Tree 0.35 supports, 1240 layers, about 2 h 21 min, about 90 ml. **Waiting for the owner to check supports and give a go.**
- 5 Nov: C-port formers v2 set up in Lychee for the M5s (upright, raft, heavy cone supports, new "Trans Green David M5s" profile, about 2 h 29 min). **Paused until David sends his handover document.** Nothing exported yet.

### 9.3 Ender 3 (FDM, PLA)

- Plugged into the Mac by USB and streamed from the Mac (`ender/send_gcode.py`; keep the Mac awake). Sliced with PrusaSlicer (`ender/ender3.ini`, `ender3_fast.ini`).
- First print: module-A walls, started 3 Nov evening. The thread was closed on 4 Nov with "reopen to retry the print", so treat that print as not successful or not confirmed.

### 9.4 Resins

| Resin | Use | Settings |
| --- | --- | --- |
| Cube 3D **Engineering**, Dark Grey (since 1 Nov) | XL 4K | IPA wash (not water). Settled at **2.5 s per layer, first 8 layers 35 s** (profile `Cube3D_Eng_DarkGrey_v2_50um`). Test print: detail crisp, base lifted on one side because of leveling. |
| Cube 3D **Standard**, Trans Green (new 5 Nov) | Both resin printers | Label: bottom 20–30 s, layer 2.5–4.5 s. CHITUBOX profiles: XL 4K 8 × 25 s / 3 s; M5s 6 × 25 s / 2.5 s. Lychee profile for David's M5s parts: 8 × 40 s / 1.8 s. The owner wants to tune slicer settings themselves. |
| Anycubic Water-Wash Grey (until 1 Nov) | XL 4K | Retired. `HANDOFF.md` on the Mac still describes it as current in places. |

Safety reminders the sessions give: gloves, ventilation, never pour resin or used IPA down the drain.

### 9.5 Slicers on the Mac

- **CHITUBOX 1.4.0**: has printer profiles for the M5s and the Sonic XL 4K (3840 × 2400), both Cube3D resins, and a support preset **"Cube3D Tree 0.35"** (0.35 mm tips, no cross bracing; untick "Support in Cavities"; don't use Heavy). These were written straight into CHITUBOX's JSON config with the app quit; backups are next to David's STLs. CHITUBOX sometimes overwrote them; if that happens again, add them through its Material Configuration dialog.
- **Lychee 7.6.7**: installed; its profiles are encrypted and can't be written by scripts.
- **PrusaSlicer 2.9.6**: used from the command line for supports inside `slice.py`, and for the Ender.
- Remote sessions cannot click in apps on the Mac (macOS refuses computer use). Only the owner's local session can (11.3). CHITUBOX ignores `open -a` for files, so the owner opens files with Open File.
- **Why this matters:** David's own XL 4K slicing produced massive solid lattice supports that don't break off; the goal is lean tree supports and a pad.

---

## 10. The UV curing lamp

The owner is building a UV post-cure lamp:

- Two **15 W germicidal (UV-C) tubes** on a **Vossloh ELXc 236.208** electronic ballast. That ballast is rated for **2 × 18 W or 2 × 36 W T8 only**, so 15 W tubes may run hot, wear out sooner, or not strike at all. A 2 × 15 W ballast would be the right part.
- Wiring (from the diagram printed on the ballast label): mains L and N into the X1 block; terminals 1–2 to one end of lamp 1, 5–6 to one end of lamp 2 (keep 6 short); far ends: 3 to one pin of lamp 1, 4 to one pin of lamp 2, and a link wire joins the remaining far-end pin of each lamp.
- There is **no earth** in the building (Lebanon). Mains had been wired brown + green/yellow; the owner was told to use **brown (L) + blue (N)**. On 5 Nov the tube jumper wiring was found wrong (both cores in one tube's socket) and corrected on an annotated photo.
- Safety: power off while wiring, have an electrician check the mains side, fully enclose the UV-C tubes (they burn eyes and skin).
- Diagrams: project files `uv-wiring/uv-lamp-ballast-wiring.png/.svg` and `uv-wiring/wiring-annotated.png`.
- **Open:** whether it strikes after the fix.

---

## 11. How the AI sessions are organised

### 11.1 The cloud project ("ceramic-bis")

A Claude project with a coordinator in the project chat and one thread per task. Threads share a project memory (short notes per subject) and a shared files folder (renders, Blender files, elevations, wiring diagrams, printer zips). Model convention: Opus for planning and proposals, Sonnet for execution when it is enough (Sonnet is the project default), to save credits.

### 11.2 Remote Control on the owner's Mac

Work that needs the Mac (printer control, slicing, Blender, local files) runs as a Remote Control session in the owner's print folder. Rules:

- **Starting a print, pausing or stopping it, and deleting files need an explicit go typed by the owner in that same thread.** A go relayed by the coordinator or another thread is refused.
- Never post credentials, camera passwords or keys in chat.
- Show model candidates (name, source, size, licence) before downloading.
- Keep supports lean; tell the owner how long a print will take.

### 11.3 The local "FIXING_PRINT" session and `STATUS.md`

Since 5 Nov the owner also runs a **local** Claude session in the Claude desktop app on the Mac, in the print folder. Unlike remote sessions it **can click in apps** (CHITUBOX, Lychee). The cloud project can't message it directly. The bridge is **`STATUS.md` in the print folder**:

- The local session reads `STATUS.md` before each task and appends a dated 3–5 line entry after each task (what was done, files, settings, what waits on the owner). Earlier entries are never edited.
- The cloud project sends it notes by appending an entry there (via a Remote Control thread).
- When the owner says "check status", a Remote Control thread reads `STATUS.md` and reports.

`STATUS.md` as of 5 Nov 16:05 shows: plugs sliced for the M5s and for the XL 4K (both waiting for a go and for which resin is in the XL 4K vat), the XL 4K Wi-Fi diagnosis, C-port formers v2 paused for David's handover, and an unrelated iPhone calendar task blocked on a macOS permission.

### 11.4 Claude Docs and artifacts

Plans and proposals were written as Claude Docs / artifacts in the owner's claude.ai account. They are private, so a reviewer outside the account can't open them; the key content is summarised here.

| Doc | Status |
| --- | --- |
| Third app roadmap: design to firing (project topic) | Background |
| Lantern studio: combined repo plan (30 Oct) | Parked, open decisions |
| Align TIKRAR with David's castable design (31 Oct) | **Parked** by the owner (31 Oct) |
| Render realism, floor and street fix plan (31 Oct) | Done |
| Site review + books cross-reference (2 Nov) | Partly done (round 1) |
| Blender workflow proposal + cheat sheets (2 Nov) | Built |
| Truss roof proposal (3 Nov) | Built, iterated |
| Cluster lag proposal (4 Nov) | Items 1–7 built; 8–9 deferred |

---

## 12. Known stale or wrong information

A reviewer should not trust these:

- **`HANDOVER.md` "Repos and push rules"** says every change goes to two repos, including `docs/` in David's private repo. **Superseded:** since 30 Oct, David's repo is read-only for us. Push only to `criticalumami/tikrar`. Also never push site files to `criticalumami/beit-lantern-proposals` (redirect-only repo).
- `HANDOVER.md` says the app is `docs/module.html` of about 1,350 lines. In this repo it is `module.html` at the root, about 3,100 lines.
- `HANDOVER.md` describes 60 × 60 × 40 mm modules; the default is now **72 × 72 × 48**.
- `HANDOVER.md` "Recent engine updates (01.11)" lists `MAX_LIGHTS=12, SHADOW_LIGHTS=6` and a shadow-map ground bake; both were replaced (4 lights since PR #45; analytic ground light map since 2 Nov).
- `HANDOVER.md` mentions test scripts in `tikrar-tests/`; that folder doesn't exist in the project files.
- `HANDOVER.md` "Open items" (30 Oct) are old; see section 13 instead.
- In the project files, **`print/slicer-settings-for-david.md` is outdated**: it says 3840 × 2160 and a 10–15° tilt. Correct: 3840 × 2400, tilt 20–30° plus 15°, pad base, one part per job.
- `HANDOFF.md` on the Mac still treats the water-wash resin as current in places; the resin changed on 1 Nov.
- `crit_proposals/*.md` were written for David's app; their references to `index.html`, `CLAUDE.md` and `REQUIREMENTS-LOG.md` mean his files.

---

## 13. Open decisions, parked items and waiting tasks

### Waiting on the owner

- [ ] Go to print the front-opening plugs (M5s `.pm5s` ready; an XL 4K zip is also ready, but which resin is in that vat is unconfirmed).
- [ ] Go for the XL 4K Wi-Fi fix (separate printer SSID with its own DHCP), or another way to reconnect the printer.
- [ ] XL 4K adhesion: re-level and rerun the 9-square level test; scrape the vat; check the plate is flat and the film is taut. Sliced pad versions of David's E2, F, J-L, J-R exist but were never printed.
- [ ] UV lamp: does it strike after the wiring fix? If not, get a ballast rated for 15 W tubes.
- [ ] Run the Blender MCP setup script (phase 4) and confirm the Studio template works in the Blender GUI.
- [ ] Truss roof: the owner wanted it far less bulky and fully rounded; latest version is the blended one (PR #36). No sign-off recorded.
- [ ] Upload the two architecture books (PDFs) if book-based values should be checked; until then, as-built values come from page notes and usual Beirut values.

### Waiting on David

- [ ] His handover document for the C-port formers v2 (Lychee scene for the M5s is set up but not exported).
- [ ] Consent to copy any of his private code into public TIKRAR (needed before the alignment plan can be revived).

### Parked by the owner (don't start without their go)

- **Align TIKRAR with David's castable design** (31 Oct). Key facts from his app: hip roof 24 mm on a 60 module (~39°), 10 mm rounded-square top opening, 2 mm eave, flush; walls 2.5 mm; wood slabs 3 mm with Ø 20 hole; corner radius 3. Open questions: copying his code, roof rim, 2.5 vs 3 mm walls, wood vs porcelain floors, default floor height.
- **Lantern studio**, a combined private repo (30 Oct): both apps via git subtree, TIKRAR as the Design step, David's Editor/Molds/Print, new Cast/Fire. Blocked on David's consent and on hosting (claude.ai artifact vs private Netlify/Cloudflare). Also open: wood vs porcelain roofs, cast wall 2.5 vs 3 mm, the name.
- Beirut as a set of clusters, each with its own landmark (owner thinking out loud).

### Technical debt and ideas

- Pitched roof STL: 72 non-manifold edges at the seat ring (raw fallback).
- Section cut: a Z/X cut can show one thin tan line across the roof eave (open seat rings at different heights).
- Wall STL still cuts engraving pockets on walls the render leaves plain (pilotis-type walls).
- Not engraved: Trusses and Half roofs.
- Deferred performance items: Web Worker rebuild, three.js upgrade.
- Review round 2 ideas (2 Nov): self-host three with SRI, merge the three entry pages, collapse city layout controls under "Advanced".
- Module editor's future (e.g. an opening-by-opening facade editor), cheap bloom/halo for the candle: never decided.

---

## 14. Suggested review checklist for the next LLM

1. Open the live site, check the stamp is `v 05.11 · 20:30` or later, and try both editors on a phone width (390 px) and a desktop.
2. Confirm rule 3.1 in the code and in an STL export: base, plates and flat roof are the same slab with lips on both faces, flush outside.
3. Export Pieces (STL) for a few building types and check watertightness (manifold) and that engraving survives at a distance (the `fullEng()` rule).
4. Check Randomize with each lock chip (PR #51) and with Lock all; check Re-roll axes still work with locks.
5. Make a slow GIF with the speed slider (PR #50) in each GIF mode.
6. Compare night candle light and shadows with Fast mode on and off (rule 3.4).
7. Read section 12 and fix or annotate `HANDOVER.md` where it is stale.
8. Look for any credential or network detail that slipped into the public repo.

---

## 15. Glossary

| Term | Meaning |
| --- | --- |
| Module | One storey ring of four walls with rounded corners (default 72 × 72 × 48 mm fired). |
| Slab / plate / base / flat roof | The same porcelain slab with lips on both faces (rule 3.1). |
| Lip | Raised ring inset from the slab edge that locates the walls above and below. |
| Cluster / City block | A group of buildings on the street grid. |
| Filled / Trusses / Half | The three fills of a slanted roof. |
| Engrave | Outside-only pixel pockets leaving 1 mm of clay, so candlelight shows brighter. |
| Slide | View mode where openings travel round the walls. |
| 1-Bit | Black-on-white dithered view. |
| Master | Print or mould at pre-shrink size, fired size / (1 − shrink). |
| Pad | A flat raft under the supports for bed adhesion. |
| Go | The owner's explicit, typed approval for an irreversible step (print, stop, delete). |
| `STATUS.md` | Append-only log that bridges the cloud project and the owner's local Mac session. |


## Opening detail (Detail / Plain, 8 Nov)

Late Ottoman openings can carry dressings, switched per building (Building panel, "Opening detail") or city-wide ("Opening detail (city)"); stored as `b.det` ("1" or ""), carried to new buildings via `S.det`. `openings.js` `detail(spec)` returns shallow recessed grooves as simple polygons in face mm: architrave U round each opening (double moulding on arches, split at the crown for a keystone), hood over rectangular openings, sill line, a rectangular frame round groups too close for a frame each (triple arch, coupled lights, door under fanlight) and a string course. `DET` sets sizes (1.3 mm flush band, 1.0 mm groove, 0.7 mm deep). Everything stays flush outside; a groove that would touch another opening or groove is dropped. Rendered through `engraveFace` poly cells (`{poly,d}`), cut in the STL in `moduleSolid`; pixel engraving keeps clear of the grooves. Not applied in Slide mode, to modules on the ring strip, to modernist or drawn walls. The books' PDFs are not in the repo, so the vocabulary follows the page references already in `openings.js` (HoB pp. 162-173) and general late Ottoman Beirut practice.
