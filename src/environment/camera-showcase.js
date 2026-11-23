import * as THREE from 'three';
import {
  buildTree,
  buildCloud,
  buildSportsCar,
  buildPrivateJet,
  buildPottedPlant,
} from './props/primitives.js';
import { CartoonSmartphoneAsset } from './props/smartphone.js';

/**
 * Dedicated multi-subject 2.5D Camera Showcase Demonstration Environment.
 * Places ALL cinematic demo targets in one rich 4-layer parallax set:
 *  - Main Character zone (left-center, z = 0)
 *  - Smartphone with Dynamic Island (center-right plinth, z = -0.35)
 *  - Sports Car (midground-right luxury driveway, z = -1.25)
 *  - Private Jet (mid-back runway apron, z = -3.6)
 *  - Hillside Mansion (background estate ridge, z = -6.2)
 *  - Multi-layer parallax clouds, trees, and foreground foliage frames
 */
export function buildCameraShowcaseScene(style, { smartphoneState = null } = {}) {
  const group = new THREE.Group();
  group.name = 'CameraShowcaseSet';

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

  const animables = [];
  const p = style.palette;

  // ── 1. BACKGROUND LAYER (Sky dome backdrop, rolling estate hills, Hillside Mansion, drifting clouds) ──
  const skyPlane = style.box(34, 14, 0.1, p.skyTop, { unlit: true, outline: 'none' });
  skyPlane.position.set(0, 5.2, -13.5);
  layers.background.add(skyPlane);

  const horizonBand = style.box(34, 4.4, 0.1, p.skyBottom, { unlit: true, outline: 'none' });
  horizonBand.position.set(0, 1.4, -13.2);
  layers.background.add(horizonBand);

  const sunDisc = style.sphere(0.85, 16, 12, '#fff1bf', { unlit: true, outline: 'none' });
  sunDisc.scale.set(1, 1, 0.12);
  sunDisc.position.set(-4.2, 4.4, -12.6);
  layers.background.add(sunDisc);

  // Layered rolling cartoon hills for unmistakable depth parallax
  const farHillL = style.sphere(4.8, 16, 12, p.foliageDark, { outline: 'none' });
  farHillL.scale.set(1.5, 0.42, 0.35);
  farHillL.position.set(-4.8, 0.2, -9.8);
  const farHillR = style.sphere(5.2, 16, 12, p.foliage, { outline: 'none' });
  farHillR.scale.set(1.55, 0.46, 0.35);
  farHillR.position.set(3.8, 0.3, -9.4);
  layers.background.add(farHillL, farHillR);

  // Hillside Mansion (Background Estate Landmark at x = -2.35, y = 0.25, z = -6.2)
  const mansion = new THREE.Group();
  mansion.name = 'HillsideMansionHero';
  const terrace = style.box(4.8, 0.35, 2.2, p.trim, { bottomPivot: true, outline: 'edges' });
  const mainWing = style.box(3.4, 1.55, 1.5, p.wall, { bottomPivot: true, outline: 'edges' });
  mainWing.position.set(0, 0.35, 0);
  const upperSuite = style.box(2.0, 0.95, 1.35, p.wallShade, { bottomPivot: true, outline: 'edges' });
  upperSuite.position.set(0.35, 1.9, 0.02);
  const roofLower = style.box(3.75, 0.14, 1.75, p.dark, { bottomPivot: true, outline: 'edges' });
  roofLower.position.set(0, 1.88, 0);
  const roofUpper = style.box(2.35, 0.14, 1.58, p.primary, { bottomPivot: true, outline: 'edges' });
  roofUpper.position.set(0.35, 2.84, 0.02);
  const pool = style.box(2.6, 0.08, 0.9, p.glass, { unlit: true, outline: 'edges' });
  pool.position.set(0.1, 0.36, 1.02);
  mansion.add(terrace, mainWing, upperSuite, roofLower, roofUpper, pool);

  // Panoramic mansion glass bays
  for (const wx of [-1.05, 0, 1.05]) {
    const win = style.box(0.76, 0.85, 0.05, p.glass, { unlit: true, outline: 'edges' });
    win.position.set(wx, 1.12, 0.77);
    mansion.add(win);
  }
  for (const ux of [-0.15, 0.82]) {
    const uWin = style.box(0.68, 0.52, 0.05, '#ffe8a8', { unlit: true, outline: 'edges' });
    uWin.position.set(ux, 2.38, 0.71);
    mansion.add(uWin);
  }
  mansion.position.set(-2.35, 0.18, -6.2);
  mansion.scale.setScalar(0.86);
  layers.background.add(mansion);

  // Drifting clouds
  const cloudSpecs = [
    { startX: -5.4, y: 3.9, z: -10.4, scale: 1.15, speed: 0.07 },
    { startX: 0.4, y: 4.5, z: -11.2, scale: 1.35, speed: 0.05 },
    { startX: 5.2, y: 3.7, z: -9.8, scale: 1.05, speed: 0.085 },
  ];
  for (const cs of cloudSpecs) {
    layers.background.add(buildCloud(style, { ...cs, animables, xRange: 10 }));
  }

  // ── 2. MIDGROUND LAYER (Runway tarmac, Private Jet, Luxury Driveway, Sports Car, swaying trees) ──
  const groundApron = style.box(28, 0.14, 15, p.floor, { outline: 'none' });
  groundApron.position.set(0, -0.07, -4.4);
  layers.midground.add(groundApron);

  // Runway tarmac strip behind driveway
  const runway = style.box(20, 0.03, 3.6, '#394558', { outline: 'edges' });
  runway.position.set(0.8, 0.015, -3.7);
  layers.midground.add(runway);
  for (let i = -3; i <= 4; i++) {
    const dash = style.box(0.95, 0.015, 0.14, '#f8fafc', { unlit: true, outline: 'none' });
    dash.position.set(i * 2.1, 0.035, -3.7);
    layers.midground.add(dash);
  }

  // Private Jet Hero (right-mid runway apron, clear above car roofline)
  const jet = buildPrivateJet(style, { hullColor: '#f8fafc', stripeColor: p.primary, scale: 0.92 });
  jet.position.set(2.45, 0.14, -3.55);
  jet.rotation.y = -0.26;
  layers.midground.add(jet);

  // Stone luxury driveway apron in front
  const driveway = style.box(16, 0.04, 4.2, p.floorAlt, { outline: 'edges' });
  driveway.position.set(0.4, 0.015, -0.45);
  layers.midground.add(driveway);

  // Low architectural stone balustrade separating driveway & tarmac
  const lowWall = style.box(13.5, 0.34, 0.24, p.trim, { bottomPivot: true, outline: 'edges' });
  lowWall.position.set(0.2, 0.02, -2.2);
  layers.midground.add(lowWall);

  // Sports Car Hero (midground right, clean separation from smartphone plinth)
  const car = buildSportsCar(style, { bodyColor: '#e63946', scale: 0.94, facing: -1 });
  car.position.set(1.98, 0.03, -1.18);
  car.rotation.y = -0.22;
  layers.midground.add(car);

  // Swaying trees framing estate
  const treePositions = [
    [-4.3, 0, -3.2, 1.05, 0.2],
    [-1.05, 0, -4.6, 0.88, 1.3],
    [4.7, 0, -2.7, 1.02, 2.2],
  ];
  for (const [tx, ty, tz, sc, ph] of treePositions) {
    const t = buildTree(style, { scale: sc, animables, phase: ph });
    t.position.set(tx, ty, tz);
    layers.midground.add(t);
  }

  // ── 3. INTERACTION LAYER (Heroine podium zone + sleek Smartphone with Dynamic Island) ──
  const phonePlinth = style.cylinder(0.2, 0.25, 0.48, 16, p.panel || p.dark, {
    bottomPivot: true,
    outline: 'hull',
    hullScale: 1.04,
  });
  phonePlinth.position.set(0.14, 0.02, -0.26);
  const plinthCap = style.cylinder(0.23, 0.23, 0.045, 16, p.primary, {
    bottomPivot: true,
    outline: 'hull',
  });
  plinthCap.position.set(0.14, 0.48, -0.26);
  layers.interaction.add(phonePlinth, plinthCap);

  const smartphone = new CartoonSmartphoneAsset(style, {
    scale: 0.52,
    state: smartphoneState || {
      islandState: 'financial_alert',
      balanceTarget: 1000000,
      headline: '+$1,000,000',
      subtitle: 'Account Credited',
      notifications: [
        { title: 'Wire Transfer Cleared', amount: '+$1,000,000', time: 'Just now' },
        { title: 'Portfolio Dividend', amount: '+$83,333', time: '2m ago' },
      ],
    },
  });
  smartphone.group.position.set(0.14, 0.94, -0.26);
  smartphone.group.rotation.y = -0.1;
  layers.interaction.add(smartphone.group);
  animables.push({
    type: 'smartphone',
    object: smartphone.group,
    smartphone,
    baseY: 0.94,
    floatAmp: 0.018,
    phase: 0.4,
  });

  // ── 4. FOREGROUND LAYER (Parallax framing planters on extreme edges for deep 2.5D movement) ──
  const fgLeft = buildPottedPlant(style, { scale: 1.2, potColor: p.primary, animables, phase: 0.6 });
  fgLeft.position.set(-3.1, -0.14, 1.18);
  const fgRight = buildPottedPlant(style, { scale: 1.18, potColor: p.secondary, animables, phase: 1.8 });
  fgRight.position.set(3.35, -0.14, 1.25);
  layers.foreground.add(fgLeft, fgRight);

  // Local anchors (y relative to environment floorY = -0.88)
  const anchors = {
    character: new THREE.Vector3(-1.14, 0.92, 0.0),
    character_face: new THREE.Vector3(-1.14, 1.42, 0.0),
    smartphone: new THREE.Vector3(0.14, 0.98, -0.26),
    bank_balance: new THREE.Vector3(0.14, 1.06, -0.26),
    sports_car: new THREE.Vector3(1.98, 0.58, -1.18),
    car: new THREE.Vector3(1.98, 0.58, -1.18),
    private_jet: new THREE.Vector3(2.45, 1.08, -3.55),
    jet: new THREE.Vector3(2.45, 1.08, -3.55),
    mansion: new THREE.Vector3(-2.35, 1.38, -6.2),
    financial_popup: new THREE.Vector3(0.18, 1.52, 0.0),
  };

  return {
    group,
    layers,
    anchors,
    animables,
    smartphone,
  };
}
