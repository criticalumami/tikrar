# 04 · App roadmap

Concrete changes to `index.html`, in priority order. Each respects `CLAUDE.md` and `REQUIREMENTS-LOG.md`: one file, compact collapsible UI, no automatic camera moves, explicit buttons, global heights, the 30 mm grid, and the fit check kept green.

## Priority 1: make it physically produceable

1. **STL export per printable part** (handover item 1). Without it nothing can leave the app. Use manifold-3d from jsdelivr (pinned version) to fuse sub-meshes and cut sockets and ports; one "Download STL" per tile in the 3D print tab, plus "All parts (.zip)".
2. **Pin draft.** A 1–2° taper on insert pins and matching ports, plus a fit-check line "pins drafted ≥ 1°". It makes the early pull from 02 step 6 clean.
3. **Minimum-feature check** in `fitCheck()`: smallest opening, smallest porcelain bar between openings (fired), smallest resin pin (master). Mark offenders in red in 3D, like collisions.
4. **Clips / strap grooves** on case parts (handover item 2).

## Priority 2: Lebanese composition

5. **New opening types** in `TYPES` and `holesOf()`: segmental arch, stepped lintel, wide segmental bay, oculus, ribbon, tall Qotrani; all single clean openings with no bars (01 §4).
6. **Era presets.** A selector next to "Start from" with Late Ottoman / Modern. Each era sets defaults (floor height, roof type), its allowed opening types (it filters the facade preset row), and its composition rule (symmetric or asymmetric). The generator picks an era per house or per village.
7. **"Beirut house" house preset**: three full modules wide, central-bay module on the axis, side-room modules mirrored, one joined hipped roof (01 §3).
8. **Generator: main facade + axis.** Choose a main facade per house. Openings on one floor share sill and lintel lines, the rich opening goes only on the axis module, side modules mirror each other, and upper floors align with lower ones. Keep the existing rules: no lone half or quarter, no quarter on a full module, no facade repeated on more than 2 faces.
9. **Scale readout** (1:75): a small "≈ 4.5 m" next to the facade-editor rulers, and a soft amber outline when an opening's proportions fall outside its type (e.g. a Qotrani window wider than tall).
10. **House from photo:** give the reading step this vocabulary (central bay, Qotrani, segmental arch, balustrade, kiosque, claustra, era). The model can then name what it sees and the deterministic grid can place the right types.

## Priority 3: porcelain elements

11. **Balustrade and claustra patterns** as opening types (03 A1, A2). They are opening arrays, so they reuse the insert-set code. Add pull-force awareness: above N pins, split the set or add a second pull.
12. **Relief layer** on facades (03 A3): frames, cornice band, sill line, panel, grooves, cartouche. In the editor it is a second layer drawn in a lighter tone. In molds it is a raised feature on the case facade plate (with draft), a recess in the plaster, and nothing in the inserts. Fit check: "relief drafted ≥ 3°, no undercut, ≥ 1 mm below scrape chamfer".
13. **Pane flag on an opening** (03 B1): a checkbox "porcelain pane behind". The editor's night view shows a soft glow instead of a hole. The 3D print tab lists one pane mold per size.
14. **Accessory molds** in the 3D print tab, as a fourth group "Porcelain extras": balcony slab + consoles (B2), kiosk box (B3), columns (B4), each a small 2-part plaster mold with its printed case. Mark firing props in the parts list.

## Priority 4: production helpers

15. **Mold count / reuse panel** in the editor: "this village needs 5 module molds; 3 houses share mold GFA". It nudges designs toward fewer molds.
16. **Facade swapping** (handover item 5): one frame mold, interchangeable facade wall pieces. With eras, this is where the variety comes from cheaply.
17. **Batch log** (collapsible): per firing, slip SG, cast time, measured shrink %, measured wall thickness. "Use measured shrink" updates `S.shrink`.
18. **Printable process sheet** for a mold: parts list, plaster grams, cast time, pull-inserts reminder, firing props. Generated from the loaded mold.

## Tests to add (in `tests/`, same pattern as the existing ones)

- `opening-types.js`: each new type produces a closed outline inside its bounds.
- `era-generator.js`: a generated village respects axis symmetry for symmetric eras and still never leaves a lone half or quarter.
- `min-feature-check.js`: a balustrade with too-thin bars turns the fit check red.
- `relief-draft-check.js`: relief without draft turns the fit check red.
- `stl-export.js`: every exported part is manifold (manifold-3d status OK) and fits the bed.
