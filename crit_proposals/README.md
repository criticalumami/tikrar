# crit_proposals: making Beit Lantern more Lebanese, more modular, all porcelain

_Suggestions from crit (Dav's collaborator), kept apart from Dav's app. Nothing in `index.html` is changed._

Suggestions after reading *Architectures de Beyrouth 1925–1970, Manuel de restauration* (Beirut Heritage Initiative, 2022; the PDF in the repo root) and the current app (`index.html`, `HANDOVER.md`, `REQUIREMENTS-LOG.md`).

These are proposals only. Nothing in `index.html` has been changed.

**Constraint used throughout: no non-porcelain accessories.** Every new element proposed here (balconies, consoles, railings, screens, window panes, cornices, bay windows) is cast porcelain from the same slip as the modules. The wood roofs and wood slabs that already exist in the app are left as they are.

## Files

| File | What it covers |
|---|---|
| [01-design-language.md](01-design-language.md) | What the manual says about Beirut houses, turned into a scale, proportions and a vocabulary of elements |
| [02-process.md](02-process.md) | The whole making process step by step, from design to lit lantern, with improvements at each step |
| [03-porcelain-elements.md](03-porcelain-elements.md) | New porcelain elements (openwork balustrades, claustra screens, translucent panes, relief, cast balconies, bay windows) and how each one is molded |
| [04-app-roadmap.md](04-app-roadmap.md) | Concrete changes to the editor, Mold making and 3D print tabs, in priority order |
| [05-beirut-modernism.md](05-beirut-modernism.md) | Porcelain-safe landmark lanterns from photos: the Egg, EDL, Gefinor, Saroulla, Holiday Inn and the National Museum, with true proportions, sections ≤ 60 mm and walls ≤ 40 % open |

## Website and 3D studio

- `docs/index.html`: the proposals as a website, with an interactive facade explorer and a Beirut modernism section
- `docs/app.html`: **Beit Lantern Studio**, a modular 3D editor (three.js r128) that applies these proposals:
  - houses of 1–3 modules across, 1–3 deep (square central-hall plans by default) and 1–5 floors, each set to an era
  - a role for each front bay
  - all-porcelain elements: balconies with openwork, bay window, translucent panes, relief, openwork parapet; every window is one clean opening, with no bars
  - a day/night candle view with candle controls for the whole village, each house, each floor and each room, plus an explode slider
  - a production panel that counts plaster and accessory molds and runs the new feature checks (opening, bar and pin sizes, corner and scrape-edge clearance, relief, pins per set, cantilever props, tealight fit)

  It keeps the editor's project rules: one floor height and one low-balcony height, fired sizes, master = fired ÷ (1 − shrink).

Both are served from `docs/` once GitHub Pages is turned on (Settings → Pages → `main` / `/docs`).

## The five ideas that matter most

1. **Adopt a 1:75 reference scale.** The app's numbers already sit almost exactly on it. A 60 mm module is a 4.5 m room bay, a 44 mm floor is the 3.30 m ceiling of pre-1954 buildings, and the 14 mm low balcony is a 1.05 m guard-rail. Making the scale explicit lets every opening be checked against real Beirut proportions. See 01.
2. **Compose houses, not modules.** A real Beirut house has one central bay (the triple arch, or the large central opening that replaced it) flanked by plainer side rooms. Today almost every 60 mm module carries its own triple arch. A house preset three modules wide, with a central arch module between two window modules, will read as Lebanese at once. See 01 §3 and 04.
3. **Make the railings, screens and window panes from porcelain, through the insert system you already have.** An openwork balustrade or a claustra screen is just a dense pattern of openings, so the existing resin pin sets can make it. A thin porcelain pane fixed behind an opening glows like frosted *mhajjar* glass when the candle is lit. See 03.
4. **Pull the window insert sets early.** Porcelain shrinks onto rigid resin pins as it stiffens, and that is the usual cause of cracks at opening corners. Give the pins a 1–2° draft and pull the sets as soon as the drained cast loses its shine. See 02, step 6.
5. **Add era presets.** Late Ottoman (1860–1925) and modern (1945–70) each have clear rules: openings, symmetry, balconies, roof. That gives the village variety that is still historically coherent. See 01 §4 and 04.

## Where things come from in the PDF

PDF page numbers (each PDF page is a book spread):

- typologies by period: PDF pp. 10–20
- cast facade elements (columns, balustrades, frames, consoles, cantilevers, cornices, panels, bay windows): pp. 32–44
- cast-concrete balustrades: pp. 46–47
- brise-soleil and claustras: pp. 52–53
- windows and doors 1925–1970: pp. 78–93
- wrought-iron railings, used only as pattern references for porcelain openwork: pp. 94–98
- climate and opening orientation: pp. 103–105
