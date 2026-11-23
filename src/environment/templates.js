import * as THREE from 'three';
import {
  buildRoomShell,
  buildWindow,
  buildDoor,
  buildPottedPlant,
  buildDeskWithMonitor,
  buildSofa,
  buildBed,
  buildBookshelf,
  buildLamp,
  buildTree,
  buildCloud,
  buildSportsCar,
  buildPrivateJet,
  buildCityBuilding,
  buildTableSet,
  buildPendantLamp,
} from './props/primitives.js';
import { CartoonSmartphoneAsset } from './props/smartphone.js';

export const ENVIRONMENT_CATEGORIES = [
  { id: 'home', label: 'Home & Interior', count: 8 },
  { id: 'business', label: 'Business & Work', count: 7 },
  { id: 'outdoor', label: 'City & Outdoor', count: 8 },
  { id: 'finance', label: 'Finance & Tech', count: 6 },
  { id: 'luxury', label: 'Luxury & Aspirational', count: 8 },
];

export const ENVIRONMENT_TEMPLATES = {
  // ── 1. Home & Interior (8) ─────────────────────────────────────────────
  bedroom_cozy: {
    id: 'bedroom_cozy',
    name: 'Cozy Bedroom',
    category: 'home',
    defaultPalette: 'warmEditorial',
    description: 'Sunlit bedroom with framed window, curtained sill, bed, lamp, and shelf.',
    recommendedComposition: 'left_anchored',
  },
  living_room_warm: {
    id: 'living_room_warm',
    name: 'Warm Living Room',
    category: 'home',
    defaultPalette: 'warmEditorial',
    description: 'Editorial cartoon lounge with wide sofa, framed art, lamp, rug, and plants.',
    recommendedComposition: 'center',
  },
  kitchen_modern: {
    id: 'kitchen_modern',
    name: 'Modern Kitchen',
    category: 'home',
    defaultPalette: 'sunlitDay',
    description: 'Clean counter island, upper cabinets, tiled backsplash, and pendant lamps.',
    recommendedComposition: 'left_anchored',
  },
  home_office: {
    id: 'home_office',
    name: 'Home Office Desk',
    category: 'home',
    defaultPalette: 'mintStudio',
    description: 'Creator desk with dual monitors, bookcase, warm desk lamp, and sunlit window.',
    recommendedComposition: 'left_anchored',
  },
  apartment_balcony: {
    id: 'apartment_balcony',
    name: 'Apartment Balcony',
    category: 'home',
    defaultPalette: 'sunsetGold',
    description: 'High-rise terrace railing, city skyline silhouette, bistro table, and drifting clouds.',
    recommendedComposition: 'left_anchored',
  },
  study_library: {
    id: 'study_library',
    name: 'Study Library',
    category: 'home',
    defaultPalette: 'warmEditorial',
    description: 'Twin tall wooden bookcases, banker lamp, armchair, and framed study desk.',
    recommendedComposition: 'center',
  },
  minimalist_studio: {
    id: 'minimalist_studio',
    name: 'Minimalist Studio',
    category: 'home',
    defaultPalette: 'mintStudio',
    description: 'Clean architectural studio backdrop with soft cove wall, plant, and plinth.',
    recommendedComposition: 'center',
  },
  hallway_entry: {
    id: 'hallway_entry',
    name: 'Apartment Entryway',
    category: 'home',
    defaultPalette: 'warmEditorial',
    description: 'Front door with framed mirror, console bench, coat hooks, and warm floor runner.',
    recommendedComposition: 'right_anchored',
  },

  // ── 2. Business & Work (7) ─────────────────────────────────────────────
  modern_office: {
    id: 'modern_office',
    name: 'Modern Office',
    category: 'business',
    defaultPalette: 'sunlitDay',
    description: 'Bright open-plan office with glass partition, skyline windows, and workstation.',
    recommendedComposition: 'left_anchored',
  },
  startup_workspace: {
    id: 'startup_workspace',
    name: 'Startup Workspace',
    category: 'business',
    defaultPalette: 'mintStudio',
    description: 'Energetic founder loft with dual-screen desk, whiteboard KPIs, and hanging pendants.',
    recommendedComposition: 'left_anchored',
  },
  conference_room: {
    id: 'conference_room',
    name: 'Conference Room',
    category: 'business',
    defaultPalette: 'sunlitDay',
    description: 'Boardroom table, presentation display wall, and architectural window frames.',
    recommendedComposition: 'right_anchored',
  },
  ceo_executive_office: {
    id: 'ceo_executive_office',
    name: 'CEO Corner Office',
    category: 'business',
    defaultPalette: 'twilightLuxury',
    description: 'Panoramic corner windows, executive walnut desk, cityscape view, and gold accents.',
    recommendedComposition: 'left_anchored',
  },
  coworking_lounge: {
    id: 'coworking_lounge',
    name: 'Coworking Lounge',
    category: 'business',
    defaultPalette: 'warmEditorial',
    description: 'Collaborative café-style tables, indoor trees, warm pendants, and laptop bar.',
    recommendedComposition: 'center',
  },
  podcast_studio: {
    id: 'podcast_studio',
    name: 'Podcast & Creator Studio',
    category: 'business',
    defaultPalette: 'sunsetGold',
    description: 'Acoustic wall panels, boom mic desk, neon on-air accent, and soft studio lamp.',
    recommendedComposition: 'left_anchored',
  },
  coffee_shop_work: {
    id: 'coffee_shop_work',
    name: 'Coffee Shop Table',
    category: 'business',
    defaultPalette: 'warmEditorial',
    description: 'Espresso counter backdrop, chalkboard menu, window street view, and bistro table.',
    recommendedComposition: 'right_anchored',
  },

  // ── 3. City & Outdoor (8) ──────────────────────────────────────────────
  city_street_day: {
    id: 'city_street_day',
    name: 'City Street Day',
    category: 'outdoor',
    defaultPalette: 'sunlitDay',
    description: 'Bustling cartoon boulevard with colorful storefronts, lampposts, trees, and clouds.',
    recommendedComposition: 'left_anchored',
  },
  downtown_skyline: {
    id: 'downtown_skyline',
    name: 'Downtown Skyline',
    category: 'outdoor',
    defaultPalette: 'sunlitDay',
    description: 'Layered metropolitan towers, promenade railing, and crisp sunlit clouds.',
    recommendedComposition: 'wide_establishing',
  },
  park_walkway: {
    id: 'park_walkway',
    name: 'City Park Walkway',
    category: 'outdoor',
    defaultPalette: 'sunlitDay',
    description: 'Curved park path, cartoon shade trees, wooden bench, lampposts, and skyline beyond.',
    recommendedComposition: 'center',
  },
  suburban_neighborhood: {
    id: 'suburban_neighborhood',
    name: 'Suburban Street',
    category: 'outdoor',
    defaultPalette: 'warmEditorial',
    description: 'Cozy gabled cartoon houses, white picket fence, front lawn trees, and sidewalk.',
    recommendedComposition: 'left_anchored',
  },
  rooftop_terrace: {
    id: 'rooftop_terrace',
    name: 'Rooftop Terrace',
    category: 'outdoor',
    defaultPalette: 'sunsetGold',
    description: 'Golden-hour skyline overlook, string-lit parapet, lounge seating, and planters.',
    recommendedComposition: 'wide_establishing',
  },
  beach_boardwalk: {
    id: 'beach_boardwalk',
    name: 'Beach Boardwalk',
    category: 'outdoor',
    defaultPalette: 'sunlitDay',
    description: 'Timber boardwalk, turquoise ocean horizon, swaying palm silhouettes, and bright sun.',
    recommendedComposition: 'center',
  },
  night_city_avenue: {
    id: 'night_city_avenue',
    name: 'Night City Avenue',
    category: 'outdoor',
    defaultPalette: 'twilightLuxury',
    description: 'Lit skyscraper windows, warm glowing streetlamps, twilight sky, and passing cars.',
    recommendedComposition: 'left_anchored',
  },
  campus_plaza: {
    id: 'campus_plaza',
    name: 'University Plaza',
    category: 'outdoor',
    defaultPalette: 'warmEditorial',
    description: 'Clocktower facade, stepped stone plaza, leafy trees, and academic archways.',
    recommendedComposition: 'wide_establishing',
  },

  // ── 4. Finance & Tech (6) ──────────────────────────────────────────────
  trading_desk: {
    id: 'trading_desk',
    name: 'Trading & Analytics Desk',
    category: 'finance',
    defaultPalette: 'emeraldFinance',
    description: 'Multi-monitor chart workstation, live ticker strip, and emerald glass wall.',
    recommendedComposition: 'left_anchored',
  },
  bank_lobby: {
    id: 'bank_lobby',
    name: 'Private Bank Lobby',
    category: 'finance',
    defaultPalette: 'emeraldFinance',
    description: 'Fluted stone columns, marble counter, brass accents, and grand arched window.',
    recommendedComposition: 'wide_establishing',
  },
  vault_wealth_room: {
    id: 'vault_wealth_room',
    name: 'Wealth Vault Room',
    category: 'finance',
    defaultPalette: 'emeraldFinance',
    description: 'Stylized steel bank vault door, stacked gold plinths, and dramatic key lighting.',
    recommendedComposition: 'object_focus',
  },
  fintech_hub: {
    id: 'fintech_hub',
    name: 'Fintech Command Hub',
    category: 'finance',
    defaultPalette: 'mintStudio',
    description: 'Large live wall dashboard, sleek architectural ribs, and modern analytics island.',
    recommendedComposition: 'left_anchored',
  },
  smartphone_hero_stage: {
    id: 'smartphone_hero_stage',
    name: 'Smartphone Hero Stage',
    category: 'finance',
    defaultPalette: 'twilightLuxury',
    description: 'Editorial showcase stage featuring the 2.5D Cartoon Smartphone with Dynamic Island.',
    recommendedComposition: 'over_the_shoulder',
  },
  data_presentation_stage: {
    id: 'data_presentation_stage',
    name: 'Keynote Data Stage',
    category: 'finance',
    defaultPalette: 'emeraldFinance',
    description: 'Wide keynote screen with rising 3D bar podiums and warm editorial stage lights.',
    recommendedComposition: 'left_anchored',
  },

  // ── 5. Luxury & Aspirational (8) ───────────────────────────────────────
  luxury_driveway: {
    id: 'luxury_driveway',
    name: 'Luxury Villa Driveway',
    category: 'luxury',
    defaultPalette: 'sunsetGold',
    description: 'Modern villa columns, palm hedges, and a hero red 2.5D cartoon sports car.',
    recommendedComposition: 'object_focus',
  },
  airport_hangar: {
    id: 'airport_hangar',
    name: 'Private Jet Hangar',
    category: 'luxury',
    defaultPalette: 'sunlitDay',
    description: 'Open aviation tarmac, arched hangar bays, distant control tower, and private jet.',
    recommendedComposition: 'wide_establishing',
  },
  penthouse_interior: {
    id: 'penthouse_interior',
    name: 'Skyline Penthouse',
    category: 'luxury',
    defaultPalette: 'twilightLuxury',
    description: 'Floor-to-ceiling twilight glass wall, designer sofa, chandelier pendant, and city glow.',
    recommendedComposition: 'left_anchored',
  },
  luxury_mansion_exterior: {
    id: 'luxury_mansion_exterior',
    name: 'Hillside Mansion Estate',
    category: 'luxury',
    defaultPalette: 'warmEditorial',
    description: 'Grand pillared villa facade, manicured cypress hedges, reflection pool, and sky.',
    recommendedComposition: 'wide_establishing',
  },
  yacht_marina: {
    id: 'yacht_marina',
    name: 'Yacht Marina Deck',
    category: 'luxury',
    defaultPalette: 'sunlitDay',
    description: 'Sunlit marina pier, sleek white 2.5D motor yacht, ocean ripples, and coastal hills.',
    recommendedComposition: 'object_focus',
  },
  private_garage: {
    id: 'private_garage',
    name: 'Collector Showroom Garage',
    category: 'luxury',
    defaultPalette: 'twilightLuxury',
    description: 'Polished checkered gallery floor, overhead light bays, and twin-stripe supercar.',
    recommendedComposition: 'object_focus',
  },
  first_class_lounge: {
    id: 'first_class_lounge',
    name: 'First-Class Airport Lounge',
    category: 'luxury',
    defaultPalette: 'twilightLuxury',
    description: 'Runway panorama window, brass dividers, leather lounge seating, and champagne bar.',
    recommendedComposition: 'left_anchored',
  },
  resort_infinity_pool: {
    id: 'resort_infinity_pool',
    name: 'Resort Infinity Pool',
    category: 'luxury',
    defaultPalette: 'sunsetGold',
    description: 'Warm sunset infinity pool edge, cabanas, stylized palm trees, and ocean horizon.',
    recommendedComposition: 'wide_establishing',
  },
};

export const ENVIRONMENT_TEMPLATE_LIST = Object.values(ENVIRONMENT_TEMPLATES);

function createLayerRig() {
  const group = new THREE.Group();
  group.name = 'EnvironmentInstance';
  const layers = {
    background: new THREE.Group(),
    midground: new THREE.Group(),
    interaction: new THREE.Group(),
    foreground: new THREE.Group(),
  };
  layers.background.name = 'Layer_Background';
  layers.midground.name = 'Layer_Midground';
  layers.interaction.name = 'Layer_Interaction';
  layers.foreground.name = 'Layer_Foreground';
  group.add(layers.background, layers.midground, layers.interaction, layers.foreground);
  return { group, layers, animables: [], anchors: {}, smartphone: null };
}

function addFramedArt(style, parent, { x = 0, y = 1.85, z = -2.85, w = 0.9, h = 0.65, color = style.palette.accent } = {}) {
  const g = new THREE.Group();
  const frame = style.box(w + 0.1, h + 0.1, 0.05, style.palette.dark, { outline: 'edges' });
  const canvas = style.box(w, h, 0.02, style.palette.trim, { unlit: true, outline: 'none' });
  canvas.position.z = 0.03;
  const motif = style.box(w * 0.52, h * 0.45, 0.02, color, { unlit: true, outline: 'edges' });
  motif.position.set(-w * 0.1, 0.03, 0.045);
  const dot = style.sphere(Math.min(w, h) * 0.16, 10, 8, style.palette.secondary, { unlit: true, outline: 'none' });
  dot.position.set(w * 0.2, 0.1, 0.05);
  g.add(frame, canvas, motif, dot);
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}

function addOutdoorGround(style, layers, {
  groundColor = '#70a862',
  roadColor = '#464d5c',
  withRoad = false,
  withSky = true,
  clouds = 3,
  animables = null,
} = {}) {
  if (withSky) {
    layers.background.add(style.skyBackdrop(28, 13, style.palette.skyTop, style.palette.skyBottom, -11.5));
    const sun = style.sphere(0.65, 14, 12, '#fff0b3', { unlit: true, outline: 'none' });
    sun.position.set(3.2, 3.3, -10.8);
    layers.background.add(sun);
    for (let i = 0; i < clouds; i++) {
      const cloud = buildCloud(style, {
        scale: 0.75 + (i % 2) * 0.35,
        startX: -4.2 + i * 3.5,
        y: 2.6 + (i % 2) * 0.55,
        z: -9.5 - i * 0.4,
        speed: 0.06 + i * 0.025,
        animables,
      });
      layers.background.add(cloud);
    }
  }

  const ground = style.box(24, 0.16, 14, groundColor, { outline: 'edges' });
  ground.position.set(0, -0.08, -3.4);
  layers.midground.add(ground);

  if (withRoad) {
    const road = style.box(24, 0.03, 3.2, roadColor, { outline: 'edges', polygonOffset: true });
    road.position.set(0, 0.01, -1.8);
    layers.midground.add(road);
    for (let x = -7; x <= 7; x += 1.6) {
      const dash = style.box(0.7, 0.015, 0.12, '#f5d26b', { unlit: true, outline: 'none', polygonOffset: true });
      dash.position.set(x, 0.03, -1.8);
      layers.midground.add(dash);
    }
    const curb = style.box(24, 0.08, 0.25, style.palette.trim, { bottomPivot: true, outline: 'edges' });
    curb.position.set(0, 0, -0.15);
    layers.midground.add(curb);
  }
}

function addSkylineSilhouette(style, parent, { z = -7.8, y = 0, count = 9, night = false } = {}) {
  const bColors = night
    ? ['#1e2742', '#263154', '#1a2036']
    : [style.palette.wallShade, style.palette.metal, style.palette.secondary];
  const winColor = night ? '#ffd978' : style.palette.glass;
  for (let i = 0; i < count; i++) {
    const h = 2.4 + ((i * 7 + 3) % 5) * 0.65;
    const w = 1.1 + (i % 3) * 0.35;
    const b = buildCityBuilding(style, {
      width: w,
      height: h,
      depth: 0.9,
      color: bColors[i % bColors.length],
      windowColor: winColor,
      accentColor: style.palette.dark,
      rows: Math.min(5, Math.max(2, Math.floor(h))),
      cols: 2 + (i % 2),
    });
    b.position.set(-6.4 + i * (12.8 / Math.max(1, count - 1)), y, z - (i % 2) * 1.1);
    parent.add(b);
  }
}

function addForegroundFrame(style, layers, detailLevel, { leftPlant = true, rightPlant = false, animables = null } = {}) {
  if (detailLevel === 'low') return;
  if (leftPlant) {
    const p = buildPottedPlant(style, { scale: 1.05, animables, phase: 0.4 });
    p.position.set(-2.65, 0, 1.05);
    layers.foreground.add(p);
  }
  if (rightPlant) {
    const p = buildPottedPlant(style, { scale: 0.95, potColor: style.palette.secondary, animables, phase: 1.6 });
    p.position.set(2.68, 0, 1.05);
    layers.foreground.add(p);
  }
}

function addChartWall(style, parent, animables, { x = 0.85, y = 1.68, z = -2.4, w = 2.4, h = 1.25 } = {}) {
  const board = new THREE.Group();
  const bezel = style.box(w, h, 0.08, style.palette.dark, { outline: 'edges' });
  const screen = style.box(w - 0.12, h - 0.12, 0.02, '#132030', { unlit: true, outline: 'none' });
  screen.position.z = 0.045;
  board.add(bezel, screen);

  const heights = [0.24, 0.38, 0.5, 0.68, 0.88];
  const cols = ['#38bdf8', '#34d399', '#22c55e', '#f59e0b', '#f2b84b'];
  for (let i = 0; i < heights.length; i++) {
    const bar = style.box(0.24, heights[i], 0.02, cols[i], { bottomPivot: true, unlit: true, outline: 'edges' });
    bar.position.set(-w * 0.34 + i * (w * 0.17), -h * 0.4, 0.065);
    board.add(bar);
    animables.push({ type: 'screenBar', object: bar, baseY: -h * 0.4, phase: i * 0.85 });
  }
  const ticker = style.box(0.65, 0.09, 0.02, '#10b981', { unlit: true, outline: 'none' });
  ticker.position.set(0, h * 0.36, 0.065);
  board.add(ticker);
  animables.push({ type: 'ticker', object: ticker, baseX: 0, span: w - 0.85, speed: 0.55, phase: 0.2 });

  board.position.set(x, y, z);
  parent.add(board);
  return board;
}

function buildYachtProp(style) {
  const g = new THREE.Group();
  g.name = 'LuxuryYacht';
  const hull = style.box(3.4, 0.52, 1.1, '#ffffff', { bottomPivot: true, outline: 'edges' });
  const stripe = style.box(3.45, 0.09, 1.12, style.palette.primary, { outline: 'none' });
  stripe.position.y = 0.28;
  const bow = style.cylinder(0.06, 0.52, 0.85, 4, '#ffffff', { outline: 'edges' });
  bow.rotation.z = -Math.PI / 2;
  bow.position.set(2.02, 0.26, 0);
  const deck1 = style.box(2.05, 0.42, 0.9, '#f1f5f9', { bottomPivot: true, outline: 'edges' });
  deck1.position.set(-0.22, 0.52, 0);
  const glass = style.box(1.55, 0.2, 0.94, style.palette.dark, { outline: 'edges' });
  glass.position.set(-0.08, 0.72, 0);
  const bridge = style.box(1.15, 0.34, 0.72, '#ffffff', { bottomPivot: true, outline: 'edges' });
  bridge.position.set(-0.35, 0.94, 0);
  const mast = style.box(0.08, 0.55, 0.08, style.palette.accent, { bottomPivot: true, outline: 'edges' });
  mast.position.set(-0.5, 1.28, 0);
  g.add(hull, stripe, bow, deck1, glass, bridge, mast);
  return g;
}

function buildVaultDoor(style) {
  const g = new THREE.Group();
  g.name = 'BankVaultDoor';
  const frame = style.box(2.1, 2.2, 0.35, style.palette.dark, { bottomPivot: true, outline: 'edges' });
  const ring = style.cylinder(0.84, 0.84, 0.26, 20, style.palette.metal, { outline: 'hull', hullScale: 1.04 });
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 1.1, 0.16);
  const inner = style.cylinder(0.64, 0.64, 0.29, 20, style.palette.trim, { outline: 'none' });
  inner.rotation.x = Math.PI / 2;
  inner.position.set(0, 1.1, 0.16);
  const wheel = style.cylinder(0.22, 0.22, 0.38, 12, style.palette.secondary, { outline: 'hull', hullScale: 1.08 });
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0, 1.1, 0.2);
  for (let i = 0; i < 4; i++) {
    const spoke = style.box(0.75, 0.07, 0.06, style.palette.secondary, { outline: 'edges' });
    spoke.position.set(0, 1.1, 0.34);
    spoke.rotation.z = (i * Math.PI) / 4;
    g.add(spoke);
  }
  g.add(frame, ring, inner, wheel);
  return g;
}

/**
 * Build a complete layered 2.5D Three.js environment for any of the 37 template IDs.
 */
export function buildEnvironmentTemplate(
  templateId,
  style,
  { detailLevel = 'high', includeSmartphone = false, smartphoneState = null } = {}
) {
  const rig = createLayerRig();
  const { layers, animables, anchors } = rig;
  const high = detailLevel === 'high';
  const med = detailLevel !== 'low';

  const setupInterior = (opts = {}) => {
    const shell = buildRoomShell(style, opts);
    layers.background.add(shell.group);
    return shell;
  };

  switch (templateId) {
    // ── HOME & INTERIOR (8) ──────────────────────────────────────────────
    case 'bedroom_cozy': {
      const { backZ } = setupInterior();
      const win = buildWindow(style, { width: 1.65, height: 1.35, animables });
      win.position.set(-1.35, 1.95, backZ + 0.1);
      layers.background.add(win);
      addFramedArt(style, layers.background, { x: 1.35, y: 2.0, z: backZ + 0.1 });

      const bed = buildBed(style, { width: 2.15 });
      bed.position.set(1.05, 0, -1.65);
      const lamp = buildLamp(style, { height: 1.55 });
      lamp.position.set(-0.35, 0, -2.0);
      const rug = style.box(3.1, 0.02, 1.8, style.palette.secondary, { outline: 'edges', polygonOffset: true });
      rug.position.set(0.2, 0.012, -0.55);
      layers.midground.add(bed, lamp, rug);

      if (med) {
        const shelf = buildBookshelf(style, { width: 0.95, height: 1.75 });
        shelf.position.set(-2.25, 0, -2.0);
        layers.midground.add(shelf);
      }
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: high, animables });
      anchors.hero = { x: 1.05, y: 0.72, z: -1.65 };
      break;
    }

    case 'living_room_warm': {
      const { backZ } = setupInterior();
      const win = buildWindow(style, { width: 2.1, height: 1.45, animables });
      win.position.set(0, 2.0, backZ + 0.1);
      layers.background.add(win);
      addFramedArt(style, layers.background, { x: -2.15, y: 1.95, z: backZ + 0.1, color: style.palette.primary });
      addFramedArt(style, layers.background, { x: 2.15, y: 1.95, z: backZ + 0.1, color: style.palette.accent });

      const sofa = buildSofa(style, { width: 2.35 });
      sofa.position.set(0, 0, -1.85);
      const coffeeTable = style.box(1.35, 0.34, 0.62, style.palette.floorAlt, { bottomPivot: true, outline: 'edges' });
      coffeeTable.position.set(0, 0, -0.82);
      const rug = style.box(3.6, 0.02, 2.1, style.palette.accent, { outline: 'edges', polygonOffset: true });
      rug.position.set(0, 0.012, -1.1);
      const lamp = buildLamp(style, { height: 1.65 });
      lamp.position.set(1.65, 0, -1.8);
      layers.midground.add(sofa, coffeeTable, rug, lamp);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 0, y: 0.75, z: -1.85 };
      break;
    }

    case 'kitchen_modern': {
      const { backZ } = setupInterior({ floorColor: style.palette.wallShade, floorAltColor: style.palette.trim });
      const counter = style.box(4.8, 0.92, 0.78, style.palette.trim, { bottomPivot: true, outline: 'edges' });
      counter.position.set(0.3, 0, backZ + 0.52);
      const counterTop = style.box(4.9, 0.08, 0.85, style.palette.dark, { bottomPivot: true, outline: 'edges' });
      counterTop.position.set(0.3, 0.92, backZ + 0.52);
      const upperCab = style.box(3.8, 0.78, 0.45, style.palette.secondary, { bottomPivot: true, outline: 'edges' });
      upperCab.position.set(0.55, 1.85, backZ + 0.32);
      const fridge = style.box(0.95, 2.15, 0.82, style.palette.metal, { bottomPivot: true, outline: 'edges' });
      fridge.position.set(-2.35, 0, backZ + 0.56);
      layers.midground.add(counter, counterTop, upperCab, fridge);

      const island = style.box(2.3, 0.88, 0.75, style.palette.primary, { bottomPivot: true, outline: 'edges' });
      island.position.set(0.55, 0, -0.95);
      const islandTop = style.box(2.42, 0.07, 0.86, style.palette.trim, { bottomPivot: true, outline: 'edges' });
      islandTop.position.set(0.55, 0.88, -0.95);
      layers.interaction.add(island, islandTop);
      if (med) {
        layers.foreground.add(buildPendantLamp(style, { y: 3.1, drop: 0.65, color: style.palette.accent }));
        const p2 = buildPendantLamp(style, { y: 3.1, drop: 0.65, color: style.palette.accent });
        p2.position.x = 1.1;
        layers.foreground.add(p2);
      }
      anchors.hero = { x: 0.55, y: 0.98, z: -0.95 };
      break;
    }

    case 'home_office': {
      const { backZ } = setupInterior();
      const win = buildWindow(style, { width: 1.55, height: 1.35, animables });
      win.position.set(-1.35, 1.95, backZ + 0.1);
      layers.background.add(win);

      const desk = buildDeskWithMonitor(style, { width: 1.85, dualMonitor: true, animables });
      desk.position.set(0.75, 0, -1.35);
      const shelf = buildBookshelf(style, { width: 1.0, height: 1.9 });
      shelf.position.set(2.35, 0, -2.0);
      const lamp = buildLamp(style, { height: 1.6 });
      lamp.position.set(-2.2, 0, -1.85);
      layers.midground.add(desk, shelf, lamp);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: false, animables });
      anchors.desk = { x: 0.75, y: 1.08, z: -1.35 };
      anchors.hero = anchors.desk;
      break;
    }

    case 'apartment_balcony': {
      addOutdoorGround(style, layers, { groundColor: style.palette.floor, withSky: true, clouds: 3, animables });
      addSkylineSilhouette(style, layers.background, { z: -7.5, y: -0.9, count: 8 });
      const deck = style.box(7.8, 0.16, 3.6, style.palette.floor, { outline: 'edges' });
      deck.position.set(0, -0.06, -0.7);
      const railTop = style.box(7.8, 0.08, 0.1, style.palette.dark, { outline: 'edges' });
      railTop.position.set(0, 1.02, -2.35);
      const railGlass = style.box(7.6, 0.92, 0.04, style.palette.glass, { unlit: true, opacity: 0.32, outline: 'none' });
      railGlass.position.set(0, 0.52, -2.35);
      layers.midground.add(deck, railTop, railGlass);
      for (let x = -3.6; x <= 3.6; x += 1.2) {
        const post = style.box(0.07, 1.04, 0.07, style.palette.dark, { bottomPivot: true, outline: 'edges' });
        post.position.set(x, 0, -2.35);
        layers.midground.add(post);
      }
      const bistro = buildTableSet(style, { width: 1.15, depth: 0.7, chairCount: 2 });
      bistro.position.set(1.25, 0, -1.15);
      layers.interaction.add(bistro);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 1.25, y: 0.8, z: -1.15 };
      break;
    }

    case 'study_library': {
      const { backZ } = setupInterior({ wallColor: style.palette.wallShade });
      for (const sx of [-2.15, -0.85, 0.85, 2.15]) {
        const s = buildBookshelf(style, { width: 1.1, height: 2.2 });
        s.position.set(sx, 0, backZ + 0.35);
        layers.background.add(s);
      }
      const desk = buildDeskWithMonitor(style, { width: 1.65, dualMonitor: false, animables });
      desk.position.set(0.9, 0, -1.25);
      const lamp = buildLamp(style, { height: 1.65, shadeColor: '#1b8a5a' });
      lamp.position.set(-1.65, 0, -1.35);
      layers.midground.add(desk, lamp);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: false, animables });
      anchors.hero = { x: 0.9, y: 1.0, z: -1.25 };
      break;
    }

    case 'minimalist_studio': {
      const { backZ } = setupInterior({ showSideWalls: false, planks: 4 });
      const arch = style.box(2.8, 2.4, 0.12, style.palette.wallShade, { bottomPivot: true, outline: 'edges' });
      arch.position.set(0, 0, backZ + 0.14);
      const plinth = style.cylinder(0.38, 0.42, 0.72, 16, style.palette.trim, { bottomPivot: true, outline: 'hull' });
      plinth.position.set(1.45, 0, -1.35);
      const orb = style.sphere(0.24, 14, 12, style.palette.accent, { outline: 'hull', hullScale: 1.05 });
      orb.position.set(1.45, 0.98, -1.35);
      animables.push({ type: 'float', object: orb, baseY: 0.98, amp: 0.04, phase: 0.3 });
      layers.midground.add(arch, plinth, orb);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: false, animables });
      anchors.hero = { x: 1.45, y: 1.0, z: -1.35 };
      break;
    }

    case 'hallway_entry': {
      const { backZ } = setupInterior();
      const door = buildDoor(style, { width: 0.96, height: 2.15 });
      door.position.set(-1.1, 0, backZ + 0.1);
      const mirror = style.box(0.75, 1.35, 0.06, style.palette.glass, { outline: 'edges' });
      mirror.position.set(1.05, 1.55, backZ + 0.12);
      const bench = style.box(1.35, 0.46, 0.48, style.palette.primary, { bottomPivot: true, outline: 'edges' });
      bench.position.set(1.05, 0, -1.85);
      const runner = style.box(4.6, 0.02, 0.95, style.palette.secondary, { outline: 'edges', polygonOffset: true });
      runner.position.set(0, 0.012, -0.55);
      layers.midground.add(door, mirror, bench, runner);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: false, rightPlant: true, animables });
      anchors.hero = { x: -1.1, y: 1.2, z: backZ + 0.2 };
      break;
    }

    // ── BUSINESS & WORK (7) ──────────────────────────────────────────────
    case 'modern_office': {
      const { backZ } = setupInterior();
      layers.background.add(style.skyBackdrop(20, 10, style.palette.skyTop, style.palette.skyBottom, backZ - 2.5));
      for (const wx of [-1.6, 0.4, 2.2]) {
        const win = buildWindow(style, { width: 1.45, height: 1.85, withCurtains: false });
        win.position.set(wx, 1.75, backZ + 0.1);
        layers.background.add(win);
      }
      const desk = buildDeskWithMonitor(style, { width: 1.9, dualMonitor: true, animables });
      desk.position.set(0.85, 0, -1.25);
      layers.midground.add(desk);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.desk = { x: 0.85, y: 1.05, z: -1.25 };
      anchors.hero = anchors.desk;
      break;
    }

    case 'startup_workspace': {
      const { backZ } = setupInterior({ wallColor: style.palette.wall });
      addChartWall(style, layers.background, animables, { x: -0.95, y: 1.78, z: backZ + 0.14, w: 2.3, h: 1.15 });
      const desk = buildDeskWithMonitor(style, { width: 1.85, dualMonitor: true, animables });
      desk.position.set(1.15, 0, -1.25);
      layers.midground.add(desk);
      if (med) {
        layers.foreground.add(buildPendantLamp(style, { y: 3.15, drop: 0.65, color: style.palette.primary }));
      }
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: false, animables });
      anchors.hero = { x: 1.15, y: 1.05, z: -1.25 };
      break;
    }

    case 'conference_room': {
      const { backZ } = setupInterior();
      addChartWall(style, layers.background, animables, { x: 0, y: 1.82, z: backZ + 0.12, w: 2.8, h: 1.35 });
      const table = buildTableSet(style, { width: 2.75, depth: 1.05, chairCount: 4, chairColor: style.palette.secondary });
      table.position.set(-0.35, 0, -1.15);
      layers.midground.add(table);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 0, y: 1.75, z: backZ + 0.2 };
      break;
    }

    case 'ceo_executive_office': {
      const { backZ } = setupInterior({ wallColor: style.palette.dark, sideWallColor: style.palette.dark });
      addSkylineSilhouette(style, layers.background, { z: backZ - 2.4, y: -0.2, count: 7, night: true });
      const glassWall = style.box(5.6, 2.7, 0.06, style.palette.glass, { unlit: true, opacity: 0.25, outline: 'edges' });
      glassWall.position.set(0, 1.5, backZ + 0.12);
      layers.background.add(glassWall);

      const execDesk = buildDeskWithMonitor(style, {
        width: 2.25,
        woodColor: '#4c3224',
        dualMonitor: false,
        screenColor: style.palette.primary,
        animables,
      });
      execDesk.position.set(0.85, 0, -1.25);
      const credenza = buildBookshelf(style, { width: 1.25, height: 1.65, woodColor: '#4c3224' });
      credenza.position.set(-2.2, 0, -1.85);
      layers.midground.add(execDesk, credenza);
      if (med) {
        layers.foreground.add(buildPendantLamp(style, { y: 3.15, drop: 0.65, color: style.palette.primary, wide: true }));
      }
      anchors.hero = { x: 0.85, y: 1.0, z: -1.25 };
      break;
    }

    case 'coworking_lounge': {
      const { backZ } = setupInterior();
      const win = buildWindow(style, { width: 2.8, height: 1.6, withCurtains: false });
      win.position.set(0, 1.9, backZ + 0.1);
      layers.background.add(win);
      const t1 = buildTableSet(style, { width: 1.55, depth: 0.8, chairCount: 2, chairColor: style.palette.primary });
      t1.position.set(-1.35, 0, -1.45);
      const t2 = buildTableSet(style, { width: 1.55, depth: 0.8, chairCount: 2, chairColor: style.palette.secondary });
      t2.position.set(1.35, 0, -1.45);
      layers.midground.add(t1, t2);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 1.35, y: 0.8, z: -1.45 };
      break;
    }

    case 'podcast_studio': {
      const { backZ } = setupInterior({ wallColor: '#2a2638', sideWallColor: '#1f1c2b' });
      for (let i = -3; i <= 3; i++) {
        const panel = style.box(0.58, 1.5, 0.08, i % 2 === 0 ? style.palette.primary : style.palette.secondary, { outline: 'edges' });
        panel.position.set(i * 0.72, 1.7, backZ + 0.12);
        layers.background.add(panel);
      }
      const desk = buildTableSet(style, { width: 2.1, depth: 0.82, chairCount: 2, chairColor: style.palette.accent });
      desk.position.set(0.65, 0, -1.2);
      const micStand = style.cylinder(0.025, 0.025, 0.45, 8, style.palette.dark, { bottomPivot: true, outline: 'none' });
      micStand.position.set(0.65, 0.75, -1.1);
      const micHead = style.sphere(0.085, 10, 8, style.palette.accent, { outline: 'hull' });
      micHead.position.set(0.65, 1.24, -1.1);
      layers.midground.add(desk, micStand, micHead);
      anchors.hero = { x: 0.65, y: 1.24, z: -1.1 };
      break;
    }

    case 'coffee_shop_work': {
      const { backZ } = setupInterior({ wallColor: style.palette.wall });
      const menu = style.box(2.2, 1.05, 0.06, '#1f2937', { outline: 'edges' });
      menu.position.set(-0.6, 2.05, backZ + 0.12);
      const bar = style.box(3.8, 1.02, 0.72, style.palette.floorAlt, { bottomPivot: true, outline: 'edges' });
      bar.position.set(-0.6, 0, backZ + 0.65);
      const espresso = style.box(0.55, 0.44, 0.42, style.palette.primary, { bottomPivot: true, outline: 'edges' });
      espresso.position.set(-1.35, 1.02, backZ + 0.65);
      layers.midground.add(menu, bar, espresso);

      const cafeTable = buildTableSet(style, { width: 1.25, depth: 0.75, chairCount: 2 });
      cafeTable.position.set(1.25, 0, -1.1);
      layers.interaction.add(cafeTable);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: false, animables });
      anchors.hero = { x: 1.25, y: 0.85, z: -1.1 };
      break;
    }

    // ── CITY & OUTDOOR (8) ───────────────────────────────────────────────
    case 'city_street_day': {
      addOutdoorGround(style, layers, { groundColor: '#cbd5e1', withRoad: true, clouds: 3, animables });
      const shops = [
        [-3.4, 2.8, style.palette.primary],
        [-1.3, 3.4, style.palette.wall],
        [1.1, 2.9, style.palette.secondary],
        [3.4, 3.6, style.palette.accent],
      ];
      for (const [bx, bh, col] of shops) {
        const b = buildCityBuilding(style, { width: 1.95, height: bh, depth: 1.4, color: col });
        b.position.set(bx, 0, -4.6);
        layers.background.add(b);
      }
      const treeL = buildTree(style, { scale: 0.95, animables, phase: 0.2 });
      treeL.position.set(-2.35, 0, -0.6);
      const treeR = buildTree(style, { scale: 0.9, animables, phase: 1.5 });
      treeR.position.set(2.45, 0, -0.65);
      layers.midground.add(treeL, treeR);
      if (med) {
        const passing = buildSportsCar(style, { bodyColor: style.palette.accent, scale: 0.65 });
        passing.position.set(0, 0, -2.05);
        layers.midground.add(passing);
        animables.push({ type: 'carPass', object: passing, span: 12, speed: 1.4, dir: 1, phase: 2.2 });
      }
      anchors.hero = { x: 1.1, y: 1.1, z: -2.0 };
      break;
    }

    case 'downtown_skyline': {
      addOutdoorGround(style, layers, { groundColor: '#94a3b8', withSky: true, clouds: 4, animables });
      addSkylineSilhouette(style, layers.background, { z: -6.8, y: 0, count: 10 });
      const rail = style.box(10, 0.1, 0.12, style.palette.dark, { outline: 'edges' });
      rail.position.set(0, 0.92, -2.2);
      layers.midground.add(rail);
      for (let x = -4; x <= 4; x += 2) {
        const p = style.box(0.1, 0.94, 0.1, style.palette.dark, { bottomPivot: true, outline: 'edges' });
        p.position.set(x, 0, -2.2);
        layers.midground.add(p);
      }
      anchors.hero = { x: 0.5, y: 1.6, z: -5.5 };
      break;
    }

    case 'park_walkway': {
      addOutdoorGround(style, layers, { groundColor: style.palette.foliage, withSky: true, clouds: 3, animables });
      addSkylineSilhouette(style, layers.background, { z: -8.6, y: 0, count: 7 });
      const path = style.box(14, 0.03, 1.9, '#e7dcc8', { outline: 'edges', polygonOffset: true });
      path.position.set(0, 0.015, -0.65);
      layers.midground.add(path);
      for (const [tx, tz, sc, ph] of [[-2.5, -2.1, 1.1, 0.1], [-0.4, -3.2, 1.25, 1.1], [2.2, -2.0, 1.05, 2.2]]) {
        const tree = buildTree(style, { scale: sc, animables, phase: ph });
        tree.position.set(tx, 0, tz);
        layers.midground.add(tree);
      }
      const bench = style.box(1.5, 0.45, 0.52, style.palette.floorAlt, { bottomPivot: true, outline: 'edges' });
      bench.position.set(1.25, 0, -1.45);
      layers.interaction.add(bench);
      anchors.hero = { x: 1.25, y: 0.55, z: -1.45 };
      break;
    }

    case 'suburban_neighborhood': {
      addOutdoorGround(style, layers, { groundColor: style.palette.foliage, withRoad: true, clouds: 3, animables });
      for (const [hx, col] of [[-2.4, style.palette.wall], [0.8, style.palette.accent], [3.6, style.palette.secondary]]) {
        const house = new THREE.Group();
        const body = style.box(2.1, 1.6, 1.5, col, { bottomPivot: true, outline: 'edges' });
        const roof = style.cylinder(0.08, 1.65, 0.95, 4, style.palette.primary, { bottomPivot: true, outline: 'edges' });
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 1.6;
        const door = style.box(0.42, 0.82, 0.08, style.palette.dark, { bottomPivot: true, outline: 'edges' });
        door.position.set(0, 0, 0.76);
        house.add(body, roof, door);
        house.position.set(hx, 0, -4.6);
        layers.background.add(house);
      }
      const tree = buildTree(style, { scale: 1.05, animables, phase: 0.6 });
      tree.position.set(-1.7, 0, -2.8);
      layers.midground.add(tree);
      anchors.hero = { x: 0.8, y: 1.1, z: -4.2 };
      break;
    }

    case 'rooftop_terrace': {
      addOutdoorGround(style, layers, { groundColor: style.palette.floor, withSky: true, clouds: 3, animables });
      addSkylineSilhouette(style, layers.background, { z: -7.5, y: -0.7, count: 9 });
      const parapet = style.box(9.5, 0.72, 0.22, style.palette.wallShade, { bottomPivot: true, outline: 'edges' });
      parapet.position.set(0, 0, -2.55);
      const sofa = buildSofa(style, { width: 2.1, color: style.palette.primary });
      sofa.position.set(1.2, 0, -1.55);
      layers.midground.add(parapet, sofa);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 1.2, y: 0.75, z: -1.55 };
      break;
    }

    case 'beach_boardwalk': {
      addOutdoorGround(style, layers, { groundColor: '#f2d399', withSky: true, clouds: 3, animables });
      const ocean = style.box(26, 0.08, 7.5, '#2b9cd4', { unlit: true, outline: 'none' });
      ocean.position.set(0, 0.02, -6.2);
      layers.background.add(ocean);
      animables.push({ type: 'water', object: ocean, baseY: 0.02, phase: 0.4 });
      const deck = style.box(16, 0.14, 2.8, style.palette.floor, { bottomPivot: true, outline: 'edges' });
      deck.position.set(0, -0.02, -0.6);
      layers.midground.add(deck);
      for (const tx of [-2.4, 2.5]) {
        const palm = buildTree(style, { scale: 1.15, animables, phase: tx });
        palm.position.set(tx, 0, -2.5);
        layers.midground.add(palm);
      }
      anchors.hero = { x: 0, y: 0.65, z: -2.5 };
      break;
    }

    case 'night_city_avenue': {
      addOutdoorGround(style, layers, { groundColor: '#252a3d', withRoad: true, clouds: 2, animables });
      addSkylineSilhouette(style, layers.background, { z: -6.2, y: 0, count: 9, night: true });
      for (const lx of [-2.5, 2.5]) {
        const lamp = buildLamp(style, { height: 2.35, shadeColor: '#ffd978' });
        lamp.position.set(lx, 0, -0.85);
        layers.midground.add(lamp);
      }
      const car = buildSportsCar(style, { bodyColor: '#f2b84b', scale: 0.72 });
      car.position.set(0, 0, -2.0);
      layers.midground.add(car);
      animables.push({ type: 'carPass', object: car, span: 11, speed: 1.65, dir: -1, phase: 0.5 });
      anchors.hero = { x: 0.8, y: 0.7, z: -2.0 };
      break;
    }

    case 'campus_plaza': {
      addOutdoorGround(style, layers, { groundColor: '#d9d2c5', withSky: true, clouds: 3, animables });
      const hall = buildCityBuilding(style, { width: 4.8, height: 2.8, depth: 1.5, color: style.palette.primary, rows: 3, cols: 5 });
      hall.position.set(0, 0, -5.2);
      const tower = buildCityBuilding(style, { width: 1.1, height: 4.1, depth: 1.1, color: style.palette.wall, rows: 2, cols: 1 });
      tower.position.set(0, 0, -5.4);
      layers.background.add(hall, tower);
      const tL = buildTree(style, { scale: 1.1, animables, phase: 0.3 });
      tL.position.set(-2.6, 0, -2.2);
      const tR = buildTree(style, { scale: 1.1, animables, phase: 1.9 });
      tR.position.set(2.6, 0, -2.2);
      layers.midground.add(tL, tR);
      anchors.hero = { x: 0, y: 2.4, z: -5.2 };
      break;
    }

    // ── FINANCE & TECH (6) ───────────────────────────────────────────────
    case 'trading_desk': {
      const { backZ } = setupInterior({ wallColor: '#1b2836', sideWallColor: '#15202b' });
      addChartWall(style, layers.background, animables, { x: 0.65, y: 1.78, z: backZ + 0.14, w: 3.1, h: 1.4 });
      const desk = buildDeskWithMonitor(style, { width: 2.0, dualMonitor: true, screenColor: '#10b981', animables });
      desk.position.set(0.85, 0, -1.2);
      layers.midground.add(desk);
      anchors.chart = { x: 0.65, y: 1.78, z: backZ + 0.25 };
      anchors.hero = anchors.chart;
      break;
    }

    case 'bank_lobby': {
      const { backZ } = setupInterior({ wallColor: style.palette.wall, floorColor: style.palette.wallShade });
      for (const cx of [-2.8, -1.2, 1.2, 2.8]) {
        const col = style.cylinder(0.24, 0.28, 3.2, 12, style.palette.trim, { bottomPivot: true, outline: 'hull' });
        col.position.set(cx, 0, backZ + 0.45);
        layers.background.add(col);
      }
      const counter = style.box(3.8, 1.02, 0.82, style.palette.dark, { bottomPivot: true, outline: 'edges' });
      counter.position.set(0.45, 0, -1.65);
      const trim = style.box(3.85, 0.08, 0.86, style.palette.secondary, { bottomPivot: true, outline: 'edges' });
      trim.position.set(0.45, 1.02, -1.65);
      layers.midground.add(counter, trim);
      anchors.hero = { x: 0.45, y: 1.15, z: -1.65 };
      break;
    }

    case 'vault_wealth_room': {
      const { backZ } = setupInterior({ wallColor: '#222c38', sideWallColor: '#1a222c', floorColor: '#374151' });
      const vault = buildVaultDoor(style);
      vault.position.set(0.85, 0, backZ + 0.22);
      layers.background.add(vault);
      for (let i = 0; i < 3; i++) {
        const stack = style.box(0.44, 0.16 * (i + 1), 0.28, '#f2b84b', { bottomPivot: true, outline: 'edges' });
        stack.position.set(0.65 + i * 0.52, 0, -1.15);
        layers.midground.add(stack);
      }
      anchors.vault = { x: 0.85, y: 1.15, z: backZ + 0.4 };
      anchors.hero = anchors.vault;
      break;
    }

    case 'fintech_hub': {
      const { backZ } = setupInterior({ wallColor: style.palette.wall });
      addChartWall(style, layers.background, animables, { x: 0.45, y: 1.72, z: backZ + 0.12, w: 3.3, h: 1.45 });
      const island = style.box(2.2, 0.86, 0.72, style.palette.primary, { bottomPivot: true, outline: 'edges' });
      island.position.set(0.75, 0, -1.25);
      layers.midground.add(island);
      addForegroundFrame(style, layers, detailLevel, { leftPlant: true, rightPlant: true, animables });
      anchors.hero = { x: 0.45, y: 1.72, z: backZ + 0.2 };
      break;
    }

    case 'smartphone_hero_stage': {
      const { backZ } = setupInterior({
        wallColor: '#1b2236',
        sideWallColor: '#141929',
        floorColor: '#242b42',
        floorAltColor: '#1e2438',
        showSideWalls: false,
      });
      const halo = style.cylinder(1.55, 1.55, 0.04, 28, style.palette.primary, { unlit: true, opacity: 0.22, outline: 'none' });
      halo.rotation.x = Math.PI / 2;
      halo.position.set(0.72, 1.22, backZ + 0.25);
      layers.background.add(halo);
      animables.push({ type: 'lampGlow', object: halo, phase: 0 });

      const pedestal = style.cylinder(0.68, 0.78, 0.22, 20, style.palette.dark, { bottomPivot: true, outline: 'hull' });
      pedestal.position.set(0.72, 0, -0.55);
      layers.midground.add(pedestal);

      const phone = new CartoonSmartphoneAsset(style, {
        width: 0.72,
        height: 1.48,
        initialState: smartphoneState?.islandState || 'financial_alert',
      });
      if (smartphoneState) phone.setState(smartphoneState);
      phone.group.position.set(0.72, 1.04, -0.42);
      phone.group.rotation.y = -0.16;
      layers.interaction.add(phone.group);
      rig.smartphone = phone;
      animables.push({ type: 'smartphone', object: phone.group, smartphone: phone, baseY: 1.04, floatAmp: 0.03, phase: 0 });
      anchors.phone = { x: 0.72, y: 1.15, z: -0.35 };
      anchors.hero = anchors.phone;
      break;
    }

    case 'data_presentation_stage': {
      const { backZ } = setupInterior({ wallColor: '#182430', floorColor: '#2c3a47', showSideWalls: false });
      addChartWall(style, layers.background, animables, { x: 0.5, y: 1.85, z: backZ + 0.14, w: 3.6, h: 1.55 });
      const podium = style.box(0.55, 0.95, 0.45, style.palette.secondary, { bottomPivot: true, outline: 'edges' });
      podium.position.set(-1.35, 0, -0.75);
      layers.interaction.add(podium);
      anchors.hero = { x: 0.5, y: 1.85, z: backZ + 0.2 };
      break;
    }

    // ── LUXURY & ASPIRATIONAL (8) ────────────────────────────────────────
    case 'luxury_driveway': {
      addOutdoorGround(style, layers, { groundColor: '#d9d3c7', withSky: true, clouds: 3, animables });
      // Modern villa backdrop with architectural columns and mullioned glass
      const villa = style.box(5.8, 2.55, 1.8, style.palette.wall, { bottomPivot: true, outline: 'edges' });
      villa.position.set(0.3, 0, -4.8);
      const overhang = style.box(6.3, 0.24, 2.35, style.palette.trim, { bottomPivot: true, outline: 'edges' });
      overhang.position.set(0.3, 2.55, -4.6);
      const villaGlass = style.box(3.4, 1.55, 0.08, '#4c6582', { unlit: true, outline: 'edges' });
      villaGlass.position.set(0.3, 1.25, -3.86);
      const glassHighlight = style.box(0.55, 1.48, 0.03, style.palette.glass, { unlit: true, opacity: 0.45, outline: 'none' });
      glassHighlight.position.set(-0.55, 1.25, -3.8);
      layers.background.add(villa, overhang, villaGlass, glassHighlight);

      for (const mx of [-0.55, 0.3, 1.15]) {
        const mullion = style.box(0.07, 1.56, 0.12, style.palette.dark, { outline: 'edges' });
        mullion.position.set(mx, 1.25, -3.82);
        layers.background.add(mullion);
      }
      for (const cx of [-2.25, 2.85]) {
        const col = style.box(0.28, 2.55, 0.32, style.palette.trim, { bottomPivot: true, outline: 'edges' });
        col.position.set(cx, 0, -3.72);
        layers.background.add(col);
      }

      for (const [tx, tz] of [[-2.95, -2.7], [3.35, -2.7]]) {
        const tree = buildTree(style, { scale: 1.12, animables, phase: tx });
        tree.position.set(tx, 0, tz);
        layers.midground.add(tree);
      }

      const car = buildSportsCar(style, { bodyColor: '#e63946', scale: 0.92 });
      car.position.set(0.72, 0, -1.15);
      car.rotation.y = -0.2;
      layers.interaction.add(car);
      anchors.car = { x: 0.72, y: 0.62, z: -1.05 };
      anchors.hero = anchors.car;
      break;
    }

    case 'airport_hangar': {
      addOutdoorGround(style, layers, { groundColor: '#9aa3b2', withSky: true, clouds: 4, animables });
      // Hangar arch shell behind tarmac
      const hangarWall = style.box(7.8, 2.9, 1.4, style.palette.wallShade, { bottomPivot: true, outline: 'edges' });
      hangarWall.position.set(-0.2, 0, -5.6);
      const bayOpening = style.box(4.8, 2.2, 0.14, style.palette.dark, { bottomPivot: true, outline: 'edges' });
      bayOpening.position.set(-0.2, 0, -4.86);
      const tower = buildCityBuilding(style, { width: 0.9, height: 3.4, depth: 0.9, color: style.palette.trim, rows: 1, cols: 2 });
      tower.position.set(-4.3, 0, -6.2);
      layers.background.add(hangarWall, bayOpening, tower);

      // Runway stripe
      const stripe = style.box(14, 0.02, 0.16, '#f5c84b', { unlit: true, outline: 'none', polygonOffset: true });
      stripe.position.set(0, 0.015, -1.0);
      layers.midground.add(stripe);

      const jet = buildPrivateJet(style, { hullColor: '#f8fafc', stripeColor: style.palette.primary, scale: 0.96 });
      jet.position.set(0.95, 0, -1.85);
      jet.rotation.y = -0.24;
      layers.interaction.add(jet);
      anchors.jet = { x: 0.95, y: 0.98, z: -1.75 };
      anchors.hero = anchors.jet;
      break;
    }

    case 'penthouse_interior': {
      const { backZ } = setupInterior({ wallColor: '#1f2538', sideWallColor: '#1a1f30', floorColor: '#3c3445' });
      addSkylineSilhouette(style, layers.background, { z: backZ - 2.2, y: -0.3, count: 9, night: true });
      const sofa = buildSofa(style, { width: 2.4, color: style.palette.trim, pillowColor: style.palette.primary });
      sofa.position.set(0.85, 0, -1.55);
      layers.midground.add(sofa);
      layers.foreground.add(buildPendantLamp(style, { y: 3.25, drop: 0.72, color: style.palette.primary, wide: true }));
      anchors.hero = { x: 0.85, y: 0.8, z: -1.55 };
      break;
    }

    case 'luxury_mansion_exterior': {
      addOutdoorGround(style, layers, { groundColor: '#569c5d', withSky: true, clouds: 4, animables });
      const mainWing = style.box(5.8, 2.75, 1.9, style.palette.wall, { bottomPivot: true, outline: 'edges' });
      mainWing.position.set(0.4, 0, -5.0);
      const pediment = style.box(2.4, 0.34, 2.1, style.palette.trim, { bottomPivot: true, outline: 'edges' });
      pediment.position.set(0.4, 2.75, -4.85);
      layers.background.add(mainWing, pediment);
      for (const px of [-0.45, 0.12, 0.68, 1.25]) {
        const col = style.cylinder(0.12, 0.14, 2.7, 10, style.palette.trim, { bottomPivot: true, outline: 'hull' });
        col.position.set(px, 0, -3.95);
        layers.background.add(col);
      }
      const pool = style.box(3.4, 0.04, 1.15, '#4fc3e8', { unlit: true, outline: 'edges', polygonOffset: true });
      pool.position.set(0.55, 0.02, -1.65);
      layers.midground.add(pool);
      animables.push({ type: 'water', object: pool, baseY: 0.02, phase: 0.7 });
      anchors.mansion = { x: 0.4, y: 1.65, z: -4.2 };
      anchors.hero = anchors.mansion;
      break;
    }

    case 'yacht_marina': {
      addOutdoorGround(style, layers, { groundColor: '#2587bd', withSky: true, clouds: 3, animables });
      const pier = style.box(12, 0.18, 2.2, style.palette.floor, { bottomPivot: true, outline: 'edges' });
      pier.position.set(0, -0.02, -0.2);
      layers.midground.add(pier);
      const yacht = buildYachtProp(style);
      yacht.position.set(0.85, 0.02, -2.25);
      yacht.rotation.y = -0.15;
      layers.interaction.add(yacht);
      animables.push({ type: 'water', object: yacht, baseY: 0.02, phase: 0.2 });
      anchors.yacht = { x: 0.85, y: 0.85, z: -2.1 };
      anchors.hero = anchors.yacht;
      break;
    }

    case 'private_garage': {
      const { backZ } = setupInterior({ wallColor: '#242936', floorColor: '#373e50', floorAltColor: '#262b38', planks: 8 });
      for (let x = -2.0; x <= 2.0; x += 2.0) {
        const lightBar = style.box(1.3, 0.08, 0.25, '#ffffff', { unlit: true, outline: 'edges' });
        lightBar.position.set(x, 2.95, -1.2);
        layers.background.add(lightBar);
      }
      const car = buildSportsCar(style, { bodyColor: style.palette.primary, scale: 1.05 });
      car.position.set(0.82, 0, -1.15);
      car.rotation.y = -0.25;
      layers.interaction.add(car);
      anchors.car = { x: 0.82, y: 0.65, z: -1.05 };
      anchors.hero = anchors.car;
      break;
    }

    case 'first_class_lounge': {
      const { backZ } = setupInterior({ wallColor: '#23283b', floorColor: '#3f3848' });
      const win = buildWindow(style, { width: 4.4, height: 1.85, withCurtains: false, skyColor: style.palette.skyBottom });
      win.position.set(0, 1.85, backZ + 0.1);
      layers.background.add(win);
      const jetFar = buildPrivateJet(style, { scale: 0.45 });
      jetFar.position.set(0.8, 0.4, backZ - 1.2);
      layers.background.add(jetFar);
      const sofa = buildSofa(style, { width: 2.1, color: style.palette.secondary });
      sofa.position.set(0.95, 0, -1.4);
      layers.midground.add(sofa);
      anchors.hero = { x: 0.95, y: 0.8, z: -1.4 };
      break;
    }

    case 'resort_infinity_pool': {
      addOutdoorGround(style, layers, { groundColor: '#eadbc8', withSky: true, clouds: 3, animables });
      const pool = style.box(14, 0.06, 4.6, '#2da8d8', { unlit: true, outline: 'edges', polygonOffset: true });
      pool.position.set(0, 0.02, -3.4);
      layers.midground.add(pool);
      animables.push({ type: 'water', object: pool, baseY: 0.02, phase: 0.1 });
      const cabana = style.box(1.9, 1.85, 1.4, style.palette.trim, { bottomPivot: true, outline: 'edges' });
      cabana.position.set(1.8, 0, -1.6);
      const tree = buildTree(style, { scale: 1.15, animables, phase: 0.9 });
      tree.position.set(-2.3, 0, -2.0);
      layers.midground.add(cabana, tree);
      anchors.hero = { x: 1.8, y: 0.95, z: -1.6 };
      break;
    }

    default:
      throw new Error(`Unhandled environment template builder: "${templateId}"`);
  }

  // Optional reusable 2.5D Cartoon Smartphone prop inside any environment
  if (includeSmartphone && !rig.smartphone) {
    const phone = new CartoonSmartphoneAsset(style, {
      width: 0.64,
      height: 1.32,
      initialState: smartphoneState?.islandState || 'financial_alert',
    });
    if (smartphoneState) phone.setState(smartphoneState);
    phone.group.position.set(0.85, 1.02, -0.35);
    phone.group.rotation.y = -0.18;
    layers.interaction.add(phone.group);
    rig.smartphone = phone;
    animables.push({ type: 'smartphone', object: phone.group, smartphone: phone, baseY: 1.02, floatAmp: 0.025, phase: 0.5 });
    anchors.phone = { x: 0.85, y: 1.12, z: -0.3 };
  }

  return rig;
}
