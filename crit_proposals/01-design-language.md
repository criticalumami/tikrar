# 01 · Design language: from the manual to a 60 mm module

## 1. What the manual says, briefly

The manual covers Beirut buildings from 1925 to 1970 and treats the older central-hall house as their starting point. The points that matter for a miniature:

- **The central bay is the heart of the facade.** The late-Ottoman house is a central hall (*dar* / *liwan*) with a large triple-arched bay on the main facade, flanked by side rooms with single tall windows. Buildings of 1925–35 keep this: the central bay stays the main element, often with a balcony or veranda in front, and the rest of the facade is "mostly solid wall pierced by openings" (PDF p. 12).
- **Openings are vertical, then become square, then horizontal.** Before 1935 the standard window is a tall wooden *Qotrani* window about 1.00 × 2.00 m (p. 83). As ceilings get lower, openings become square or horizontal (p. 12). After 1945 the facade turns horizontal: ribbon windows, continuous balconies, asymmetry (pp. 16–19, 82).
- **The triple arch simplifies over time.** It turns into a single wide segmental (*surbaissé*) arch over the whole central bay, or a straight or stepped lintel, still divided into three (p. 84).
- **Facade ornament was cast, in modules.** Columns, balustrades, window frames, consoles, cornices and decorative panels were made in concrete, in molds, often prefabricated (pp. 32–44). Balustrades were cast in repeating panels 60–100 cm long, set between column pedestals and tied by a plinth and a handrail (p. 34). Claustra screens were 20 cm cast blocks (p. 53). **The original builders were already doing modular casting**, which suits this project well.
- **Characteristic elements by period:**
  - 1925–35: central bay, cast balustrades, consoles under balconies, projecting bay windows (*kiosques*) on consoles with 2–3 bays (p. 43), framed openings
  - 1945–55: corner buildings with curved volumes, the stair tower as the sculptural element, long balconies on the street (p. 16)
  - 1955–70: pilotis, deep balconies acting as sun shades, claustra screens hiding service rooms, facades as floating planes (pp. 18–20)
- **Climate sets the openings.** Large openings face north and south, east and west windows are smaller, and rooms get cross ventilation with openings on two sides (p. 104). For a lantern this suggests: **one rich main facade, two sparse side facades, a medium back**. The app's House-from-photo rule already does this.
- **Roofs:** the red-tile hipped roof belongs to the older houses and disappears after 1925 in favour of flat roofs with parapets and cornices (p. 8). The app already offers both.

## 2. A reference scale: 1:75

The app's defaults already sit close to 1:75. Making it explicit gives a quick way to check any opening ("is this window really a window?").

| Real element (manual) | Real size | At 1:75 (fired) | In the app today |
|---|---|---|---|
| Grid step | 2.25 m | **30 mm** | 30 mm grid ✔ |
| Room bay / full module | 4.5 m | **60 mm** | full 60 × 60 ✔ |
| Floor height before 1954 | 3.30 m | **44 mm** | default 40–50 ✔ |
| Floor height after 1954 | 3.00 m | **40 mm** | |
| Older central-hall house floor | ~4.5–5 m | **60–66 mm** | worth an era preset |
| Guard-rail / low balcony | ~1.0–1.05 m | **13–14 mm** | `balH` 14 ✔ |
| Qotrani window | 1.00 × 2.00 m | **13 × 27 mm**, sill ~11 mm | windows are often smaller and squarer |
| Column shaft | 25–30 cm | 3.5–4 mm | |
| Stone wall | 25–35 cm | 3.3–4.7 mm | cast wall 2.5 mm (see §5) |
| Balustrade panel | 60–100 cm | 8–13 mm repeat | |
| Bay-window projection | ~0.6–1.0 m | 8–13 mm | |
| Claustra block | 20 cm | 2.7 mm (too small, exaggerate ×2) | |

Proposal: show a small "≈ real m" readout next to the facade editor rulers (60 mm → 4.5 m), plus a soft warning when an opening's proportions fall outside its type's range (§4).

## 2b. Plan proportions, from the floor plans

Measured on the plans and elevations in the manual (fig. 11, PDF p. 12; figs. 16–18, p. 14; figs. 10, 285 and 287, pp. 12 and 104):

- **The plan is close to square,** depth ÷ width ≈ 0.9–1.15. It is three bays across and about three deep. The central hall (*dar*) runs the full depth, from the front balcony to the back terrace, with two rooms on each side. A house one module deep (13.5 × 4.5 m) is a slice, not a house: use **3 × 3 modules (180 × 180 mm)**.
- **The central bay is slightly wider than the side rooms** (about 1.15 ×). With equal 60 mm modules, the central bay's opening and frame carry that emphasis instead.
- **Facade width ≈ 3.2–3.7 × floor-to-floor height.** A 180 mm front therefore wants **50–56 mm floors**: 56 for late-Ottoman houses and 40 for modern.
- **Side walls are sparse.** Openings sit in the front and back rooms, while the middle strip (stair or lobby) is mostly blind.
- **The hipped roof is a pyramid over the square plan,** pitched at about 21–22°.

## 3. Composing a house: central bay plus side rooms

This is the single biggest change for the "vibe".

At 1:75 one full module is 4.5 m wide. A real central-hall house front is 12–15 m, so **about three full modules wide**. In the real building the triple arch is one bay of that front, not every room.

Suggested "Beirut house" preset (front facade, GF + 1 + roof):

```
          ┌────────┬────────┬────────┐
  1st     │  ▯ ▯   │ ∩∩∩    │  ▯ ▯   │   side room · CENTRAL BAY · side room
          │        │ ▔▔▔▔   │        │   (low balcony / cast balustrade in front of the arch)
          ├────────┼────────┼────────┤
  GF      │  ▯     │  ∩     │  ▯     │   arched door in the middle
          └────────┴────────┴────────┘
             60        60       60      → 13.5 m real
```

- The central module repeats vertically: the same arch on every floor, giving the stacked loggias of the photos on p. 12.
- Side modules: one or two tall narrow windows (13 × 27 mm), on the same sill line as the central bay.
- Side facades: one or two small windows. Back: medium.
- Roof: one joined hipped roof over the three modules (the big-roof join already exists).

Generator rules this adds (sketch):

1. Each house has a main facade and a symmetry axis.
2. Openings in the main-facade modules on the same floor share a sill height and a lintel line.
3. Only the axis module gets the "rich" opening (triple, segmental arch, bay window). Off-axis modules mirror each other.
4. Openings on upper floors line up vertically with those below. Vertical axes are the main point of this facade type (p. 8).

## 4. Era presets

Each era is a bundle of defaults and allowed opening types. The village generator could pick one era per house, or one for the whole village.

| Era | Floor h | Openings | Composition | Roof | Porcelain extras |
|---|---|---|---|---|---|
| **Late Ottoman** 1860–1925 | 60 mm | triple arch (pointed or round), tall Qotrani pairs, arched door | strict symmetry, central bay | hipped, terracotta | cast balustrade in front of the arch, framed windows |
| **Modern** 1945–70 | 40 mm | horizontal ribbon, wide bays, full-height doors | asymmetric, horizontal | flat | long balconies, claustra screens, sun-shade fins |

New opening types needed (all are just new outlines in `holesOf()`):

- **segmental arch** (*arc surbaissé*): wide, low rise (rise ≈ ⅙ of span)
- **stepped lintel** (*linteau en escalier inversé*)
- **wide segmental bay**: one wide opening under a segmental arch (no mullions)
- **oculus / porthole**: round, for stairs and bathrooms (p. 87)
- **ribbon window**: long horizontal slot, with or without thin mullions
- **tall Qotrani**: one tall single opening (no transom or mullion bars)
- **balustrade** and **claustra** patterns: see 03

## 5. Wall thickness and depth

Real stone walls are 25–35 cm thick (3.3–4.7 mm at scale), but the cast wall is 2.5 mm. Openings therefore look a little paper-thin. Two porcelain-only fixes:

- **Raised frames** (*encadrements*) around openings, 0.6–1 mm proud of the facade (see 03 §4). The eye reads the frame as depth.
- **Slightly thicker cast** (3 mm) for era presets with heavy masonry. That costs drain time and weight; test first.
