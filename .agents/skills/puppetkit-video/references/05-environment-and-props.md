# 05 — 2.5D Environments, Props & Custom Background Creation

PuppetKit includes **37 stylized cartoon environments** built with a 4-layer parallax architecture and 2.5D Three.js cel-shading. This is designed as a foundational template: you can create completely new custom backgrounds using either **2.5D layered Three.js geometry** or **custom 2D SVG/PNG backdrops**.

---

## 4-Layer Depth Architecture

Layers are maintained by `EnvironmentComposer` to ensure realistic camera parallax without geometry clipping:

| Layer | Z-Depth Range | Purpose & Typical Contents |
|---|---|---|
| `background` | `z ≈ -3.6` to `-2.2` | Sky, distant city skyline, mountains, clouds, deep windows |
| `midground` | `z ≈ -1.6` to `-0.8` | Interior walls, bookcases, hero vehicles, midground furniture |
| `interaction`| `z ≈ -0.45` to `+0.1` | Floor line, desks, hero props, character standing spot (`z = 0`) |
| `foreground` | `z ≈ +0.45` to `+0.9` | Framing foliage, side lamp, curtains, edge ambient dust |

---

## Method 1: Creating a Custom 2.5D Background (Three.js Cel-Shaded)

Use this method when you want rich camera parallax, cel-shading, and dynamic lighting.

### 1. In `src/environment/templates.js`, add a template entry:
```javascript
my_custom_studio: {
  id: 'my_custom_studio',
  name: 'My Custom Studio',
  category: 'business',
  defaultPalette: 'mintStudio', // 'warmEditorial' | 'sunlitDay' | 'mintStudio' | 'sunsetGold' | 'emeraldFinance' | 'twilightLuxury'
  defaultMood: 'day',           // 'day' | 'evening' | 'dramatic' | 'studio'
  description: 'A custom broadcast desk with city window.',
  recommendedComposition: 'left_anchored',
  build(ctx) {
    const { style, layers, animables, detailLevel } = ctx;

    // 1. Background layer (z ≈ -3.0): Sky & Distant skyline
    const sky = style.box(24, 14, 0.1, style.palette.bg, { unlit: true });
    sky.position.set(0, 4.5, -4.5);
    layers.background.add(sky);

    // 2. Midground layer (z ≈ -1.5): Room shell, back wall, window
    const room = buildRoomShell(style, {
      width: 10, height: 5.5, depth: 3.5,
      wallColor: style.palette.wall,
      floorColor: style.palette.floor
    });
    layers.midground.add(room);

    // 3. Interaction layer (z ≈ 0): Desk, chair, props
    const desk = buildDeskWithMonitor(style, {
      width: 2.2, height: 0.9,
      deskColor: style.palette.secondary
    });
    desk.position.set(0.6, 0, -0.3);
    layers.interaction.add(desk);

    // 4. Foreground layer (z ≈ +0.8): Framing plant on the edge
    const plant = buildPottedPlant(style, { scale: 1.1 });
    plant.position.set(-2.8, 0, 0.8);
    layers.foreground.add(plant);

    // 5. Register camera focus anchors for auto-targeting:
    ctx.anchors.hero = { x: -0.5, y: 0, z: 0 };
    ctx.anchors.desk = { x: 0.6, y: 0.9, z: -0.3 };
  }
}
```

### 2. Available Primitives in `src/environment/props/primitives.js`:
- `buildRoomShell(style, opts)`: Walls, ceiling, floor enclosure.
- `buildWindow(style, opts)`: Framed glass window with optional outdoor scenery.
- `buildDeskWithMonitor(style, opts)`: Table + workstation monitors.
- `buildSportsCar(style, opts)`: Hero sports vehicle.
- `buildPrivateJet(style, opts)`: Private jet fuselage & wings.
- `buildCityBuilding(style, opts)`: Extruded building with illuminated window grids.
- `buildTree(style, opts)`, `buildPottedPlant(style, opts)`, `buildCloud(style, opts)`.
- `style.box(w, h, d, color, opts)` & `style.cylinder(r, h, color, opts)`: Create custom outlined toon meshes directly.

---

## Method 2: Creating a Custom 2D Flat Backdrop (SVG/PNG)

Use this method for fast, lightweight illustrative scenes:

1. Save an SVG/PNG background illustration in `assets/<your-character-or-project>/room.svg`.
2. Reference it in your `story.js` scene definition:
   ```javascript
   export const scene = {
     bg: 0xf4eee7,            // Hex background fill color
     worldHeight: 3.2,        // Camera vertical framing height
     room: 'room.svg'         // Stretches flat over camera frustum behind character
   };
   ```
3. The engine automatically composites the character standing on the stage plane against this flat backdrop.

---

## 37 Built-in Environment Templates by Category

- **Home & Interior (8)**: `bedroom_cozy`, `living_room_warm`, `kitchen_modern`, `home_office`, `apartment_balcony`, `study_library`, `minimalist_studio`, `hallway_entry`.
- **Business & Work (7)**: `modern_office`, `startup_workspace`, `conference_room`, `ceo_executive_office`, `coworking_lounge`, `podcast_studio`, `coffee_shop_work`.
- **City & Outdoor (8)**: `city_street_day`, `downtown_skyline`, `park_walkway`, `suburban_neighborhood`, `rooftop_terrace`, `beach_boardwalk`, `night_city_avenue`, `campus_plaza`.
- **Finance & Tech (6)**: `trading_desk`, `bank_lobby`, `vault_wealth_room`, `fintech_hub`, `smartphone_hero_stage`, `data_presentation_stage`.
- **Luxury & Aspirational (8)**: `luxury_driveway`, `airport_hangar`, `penthouse_interior`, `luxury_mansion_exterior`, `yacht_marina`, `private_garage`, `first_class_lounge`, `resort_infinity_pool`.

---

## Key Files
- Template Definitions: `src/environment/templates.js`
- Style & Shading: `src/environment/style-system.js`
- Primitive Props: `src/environment/props/primitives.js`
- Smartphone Prop: `src/environment/props/smartphone.js`
- Composer & Parallax: `src/environment/environment-composer.js`
- Doc: `docs/PRODUCTION_TOOLKIT.md`
