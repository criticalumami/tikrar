# 06: The printed module and its openings

Two sources:
- *Houses of Beirut 1860–1925, Restoration manual* (Beirut Heritage Initiative, 2021, edited by Nathalie Chahine and Fadlallah Dagher), cited by the book's page numbers. That PDF is not in the repo.
- *Architectures de Beyrouth 1925–1970* (the PDF in the repo root), for the modernist set, cited by PDF page.

On the website: the **Pick your openings** and **Modernist patterns and elements** sections, and the **module designer** (`docs/module.html`).

## The pieces

Every piece is a separate casting. **For now everything is flush with the walls:** openings only. The relief mouldings, porcelain balconies and sun-shade slabs listed below as options are switched off (`FLUSH` in `docs/openings.js`), and the roof and base sit exactly on the 60 mm footprint.

| Piece | Spec (fired mm) |
|---|---|
| **Module** | 60 × 60 mm square, 40 mm walls, 3 mm thick, glazed white porcelain, open top and bottom |
| **Base** | independent. A flush 6 mm plinth under the whole row, carrying the tealight; or none |
| **Roof** | lifts off. **Slanted**: a truncated hipped lid at about 30° (manual p. 80) with an Ø 8 mm heat vent at the top. **Modern**: a thin flat slab, also vented. Both flush with the walls. White or terracotta glaze |
| **Layout** | modules **stack** up to 8 high on 3 mm porcelain lips, and **line up** to 3 across, wall to wall. Each module keeps its own four walls, so a wall between neighbours passes light from one to the next. Each column gets its own roof |
| **Light** | one Ø 38 mm tealight per column, on the base (54 mm clear inside) |
| **Scale** | 1:75: 60 mm is a 4.5 m bay and 40 mm a 3.0 m wall |

The reference photo (a glazed cube with tall pointed and horseshoe arches, a door with an oculus above it, and a truncated pyramid lid with a top vent) is the "Arches & keyholes" starting design.

## What the 1860–1925 manual says that matters here

- **The central-hall house** has a symmetrical plan: a covered hall (*dār*) with rooms on three sides and large arched openings on the fourth, usually facing north (pp. 22–23).
- **Early houses** had one large arch, two arches, or simple rectangular windows. The triple arch came later, and the red-tiled hipped roof only became the norm in the late 19th century (p. 22).
- **The līwān** opens through a wide arch. In its closed form the arch is replaced by a centred door flanked by two windows (pp. 20–22).
- **Roofs** have "soft slopes of approximately 30 degrees" (p. 80).
- **Pointed arches** are the most common. Semicircular, horseshoe and three-lobed arches are exceptions (p. 172).

## Porcelain checks on every wall

Every opening below is drawn for a 60 × 40 mm wall and passes all of these:
- openings ≥ 1.6 mm
- bars and columns ≥ 2.5 mm
- each wall ≤ 40 % open
- 3 mm from the 45° corners and from the scrape edge
- ≥ 2 mm above the base lip
- relief ≥ 1 mm below the top
- ≤ 40 pins per insert set (claustra columns get one set per bay)

All 4,096 three-bay combinations and all 134 whole-wall variants were checked: the most any wall reaches is 37 % open.

## 1860–1925 openings

### Elements, three to a wall (bays centred at 12, 30 and 48 mm)

| Element | Size (mm) | Manual |
|---|---|---|
| Tall pointed arch | 10 × 28, sill 6 | pp. 169–172 |
| Tall round arch | 10 × 28, sill 6 | p. 169 |
| Horseshoe arch | 9 × 28, 10.8 at the arch | p. 172 |
| Door with oculus | 8 × 20 + Ø 8 | pp. 163, 169 |
| Tall window | 9 × 20, sill 10 (the 75 cm parapet) | p. 166 |
| Small arched window | 5 × 10 | p. 169 |
| High pointed window | 5.4 × 10, sill 24 | p. 169 |
| Oculus (*qamariyeh*) | Ø 9 | p. 169 |

### Whole-wall designs

| Design | Manual | Options | Open |
|---|---|---|---|
| Triple-arch bay (centre 14 × 28, sides 10 × 22, 2.6 mm columns) | pp. 170–173 | pointed or semicircular; discharging arch; balcony | 30 % |
| Līwān arch | pp. 20–22 | semicircular, pointed or horseshoe; frame; balcony; oculus | 26 % |
| Door between two windows | p. 20 | frame; cornices; oculus | 18 % |
| Oriental door, *hilālī* arch (95 × 190 cm) | p. 162 | cut-stone frame | 13 % |
| Entrance door with fanlight | pp. 163–164 | open round, open pointed or blind tympanum; pilasters | 17 % |
| Shop front under a discharging arch | p. 165 | discharging arch | 25 % |
| Tall window with cornice | pp. 166–168 | frame; cornice; balcony; oculus | 10 % |
| Pair of tall windows | p. 166 | frame; cornices; oculus | 14 % |
| Arched window | p. 169 | semicircular, pointed or horseshoe; frame; oculus | 11 % |
| Coupled windows with a column | p. 169 | pointed or semicircular; hood moulding | 15 % |
| High windows | p. 169 | rectangular or pointed; frame | 5 % |
| Oculus, round or oval | p. 169 | frame | 5 % |

## Modernist patterns and elements

### Elements, three to a wall

| Element | Size (mm) |
|---|---|
| Tall slot | 6 × 26 |
| Twin slits | 2 × 2.6 × 26, 2.8 mm fin |
| Square window | 10 × 10 |
| Ribbon segment | 15 × 7 (three make a broken ribbon) |
| Porthole | Ø 10 |
| Porthole column | 3 × Ø 6 |
| Claustra column | 3 × 5 squares of 2.4 mm, 2.5 mm bars |

### Whole-wall patterns

| Pattern | AdB (PDF pages) | Options | Open |
|---|---|---|---|
| Ribbon window | pp. 78–93 | one or two ribbons; 6 mm sun-shade slab | 16–24 % |
| Claustra screen (8 × 5 cells, 3.4 mm at a 6 mm pitch) | pp. 52–53 | squares, circles, crosses or lozenges; frame | 12–19 % |
| Vertical fins (brise-soleil), 7 slots and 3.6 mm fins | pp. 52–53 | raised fins | 23 % |
| Egg-crate grid (recessed cells with a window at the back) | pp. 52–53 | | 19 % |
| Pilotis, open ground floor | pp. 16–20 | sun-shade slab | 35 % |
| Portholes | pp. 78–93 | in a row or up a stair tower; frame | 6–8 % |
| Wide picture window | pp. 78–93 | frame; sun-shade slab | 37 % |
| Glass-block stair light | pp. 52–53 | | 6 % |

All mouldings are 0.8 mm relief cast with the wall. Balconies and sun-shades are porcelain, with a 6 mm cantilever and no prop. No iron, glass or wood is added.

## The Beit Lantern Designer (`docs/module.html`)

The designer is the site's one design tool. Everything happens in one 3D scene, kept abstract and white: a warm off-white ground by day, a warm dusk at night.

### Village and buildings
- A **village** is a set of buildings on a 30 mm grid. Add central-hall houses, līwān houses, stair towers, modernist blocks and towers, or a random one. Buildings move, turn 90°, duplicate and may touch wall to wall, as in Beirut's dense blocks.
- A **building** is 1–3 modules across × 1–3 deep × 1–8 up. Walls between modules stay inside the building, and their openings pass light from room to room.
- **Each level** has its own switches for a porcelain **plate** (the 6 mm base at ground level, 4 mm above, Ø 8 vent per module) and **candles** (one Ø 38 tealight per module). A candle always gets a plate under it.
- **Roof**: slanted (hipped, ~30°, HoB p. 80) or modern (a flat slab), as **one piece** over the whole building or **one per module**. Both are vented and flush with the walls.
- **Single modules** can be removed (and restored) from the plan grid. Walls that now face outside become outside walls. A module must stand on the module below it or on a plate, and a one-piece roof needs a complete top level; otherwise each column gets its own lid.
- **Colours**: each module can take its own glaze (or stay unglazed). Plates and roofs have their own finishes, and seven palettes (Beirut stone, All white, Mediterranean, Celadon garden, Clay and honey, Modernist, Dusk) set walls, accent modules, plates and roof for one building or the whole village. Randomizing a building or the village also rolls plates, candles and a palette.
- **Rendering**: glazes are drawn as a glassy clear-coat over the body, with soft studio reflections. Unglazed biscuit is matte with a fine grain. At night, thin porcelain walls glow slightly from inside.
- **Material**: clay body (porcelain 14 %, stoneware 12 %, terracotta 8 % shrinkage), glazed or unglazed, and a glaze colour (clear, white, celadon, turquoise, cobalt, honey, terracotta red, oxblood, black). The roof follows the walls or takes its own finish. The checks and the sheets use the chosen clay's shrinkage.

### Walls
- Choose a level and a module on the plan grid, then a wall (or tap it in 3D). Pick three elements or a whole-wall design from either book.
- **Use this pattern on**: this module's four walls, a whole side over every level, every outside wall of a level, or every outside wall of the building.
- **Randomize** a wall, a building (the street front stays symmetric for 1860–1925 houses, and the side walls match) or the whole village.

### Checks
- **Porcelain (must pass):** every wall's limits, fired pieces ≤ 60 mm, every candle on a plate, no overlapping buildings.
- **Proportions (advice, from the two manuals):**
  - 1860–1925 houses: one to three levels (HoB p. 24), a plan close to square for the central-hall type (HoB pp. 22–23), a slanted ~30° roof (HoB p. 80), a symmetric street front (HoB p. 22).
  - Modernist buildings: a flat roof, and they may rise as towers (AdB pp. 16–20).
  - Every level should get candlelight. A level with a plate below it and no candle of its own stays dark.

### Technical sheet (PDF, A4 landscape, CAD style)
Every sheet has a border with zone references and a title block: building, material, scale, units with mould factor, shrinkage, ±0.2 mm tolerance, date, sheet number and the first-angle symbol.
1. **General arrangement**: the viewport image, overall sizes (fired, mould and at 1:75), a bill of pieces (modules, plates, roofs, wall types), checks and general notes.
2. **Elevations**: all four, at one scale, with grid-axis bubbles, centre lines, level datums, wall-type tags, chained and overall dimensions.
3. **Plan, section A–A and Detail 1**: the plan with wall thickness, tealights, vents, grid axes and the cut line; a hatched section through walls, plates and roof; and the stacking joint at 3:1, with leader notes (3.0 walls, plate with Ø 8 vent, 1.6 × 1.5 locating lip, 0.2 clearance).
4. **Wall types**, two per sheet:
   - each distinct wall drawn at 1.7:1 with the 3 mm keep-out zone, opening centre lines, tags O1… with leaders, and Ø or R annotations
   - chained x and y dimensions and an opening schedule (kind, W, H, sill, centres, mould W × H)
   - pins and insert sets, the source page, and where the wall is used
