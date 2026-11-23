import * as THREE from 'three';

/**
 * Reusable composite 2.5D cartoon props (3–12+ distinct outlined parts each).
 * Every prop pivots at bottom-center (y = 0) so it rests flush on any floor/ground plane.
 */

export function buildRoomShell(style, {
  width = 8.4,
  height = 3.8,
  depth = 5.4,
  wallColor = style.palette.wall,
  sideWallColor = style.palette.wallShade,
  floorColor = style.palette.floor,
  floorAltColor = style.palette.floorAlt,
  trimColor = style.palette.trim,
  planks = 6,
  showSideWalls = true,
} = {}) {
  const group = new THREE.Group();
  group.name = 'RoomShell';
  const backZ = -depth * 0.56;

  const floor = style.box(width, 0.12, depth, floorColor, { outline: 'edges' });
  floor.position.set(0, -0.06, -depth * 0.12);
  group.add(floor);

  const plankCount = Math.max(2, planks);
  const stripW = width / plankCount;
  for (let i = 0; i < plankCount; i += 2) {
    const strip = style.box(stripW * 0.96, 0.014, depth * 0.96, floorAltColor, {
      outline: 'none',
      polygonOffset: true,
    });
    strip.position.set(-width / 2 + stripW * (i + 0.5), 0.008, -depth * 0.12);
    group.add(strip);
  }

  const backWall = style.box(width, height, 0.16, wallColor, { bottomPivot: true, outline: 'edges' });
  backWall.position.set(0, 0, backZ);
  group.add(backWall);

  const baseboard = style.box(width, 0.14, 0.2, trimColor, { bottomPivot: true, outline: 'edges' });
  baseboard.position.set(0, 0, backZ + 0.05);
  group.add(baseboard);

  const crown = style.box(width, 0.12, 0.22, trimColor, { bottomPivot: true, outline: 'edges' });
  crown.position.set(0, height - 0.12, backZ + 0.05);
  group.add(crown);

  if (showSideWalls) {
    const leftWall = style.box(0.18, height, depth, sideWallColor, { bottomPivot: true, outline: 'edges' });
    leftWall.position.set(-width * 0.48, 0, -depth * 0.12);
    const rightWall = style.box(0.18, height, depth, sideWallColor, { bottomPivot: true, outline: 'edges' });
    rightWall.position.set(width * 0.48, 0, -depth * 0.12);
    group.add(leftWall, rightWall);
  }

  return { group, backZ, backWall };
}

export function buildWindow(style, {
  width = 1.6,
  height = 1.35,
  skyColor = style.palette.glass,
  frameColor = style.palette.trim,
  curtainColor = style.palette.primary,
  withCurtains = true,
  animables = null,
} = {}) {
  const g = new THREE.Group();
  g.name = 'WindowProp';

  const glass = style.box(width - 0.12, height - 0.12, 0.05, skyColor, { unlit: true, outline: 'none' });
  glass.position.z = 0.01;
  g.add(glass);

  const glint = style.box(width * 0.16, height * 0.72, 0.02, '#ffffff', { unlit: true, opacity: 0.35, outline: 'none' });
  glint.position.set(-width * 0.18, 0.04, 0.045);
  glint.rotation.z = -0.32;
  g.add(glint);

  const thick = 0.09;
  const topBar = style.box(width, thick, 0.14, frameColor, { outline: 'edges' });
  topBar.position.set(0, height / 2 - thick / 2, 0.05);
  const botSill = style.box(width + 0.14, thick * 1.15, 0.22, frameColor, { outline: 'edges' });
  botSill.position.set(0, -height / 2 + thick / 2, 0.08);
  const leftBar = style.box(thick, height, 0.14, frameColor, { outline: 'edges' });
  leftBar.position.set(-width / 2 + thick / 2, 0, 0.05);
  const rightBar = style.box(thick, height, 0.14, frameColor, { outline: 'edges' });
  rightBar.position.set(width / 2 - thick / 2, 0, 0.05);
  const mullionV = style.box(0.05, height - thick, 0.09, frameColor, { outline: 'edges' });
  mullionV.position.set(0, 0, 0.05);
  const mullionH = style.box(width - thick, 0.05, 0.09, frameColor, { outline: 'edges' });
  mullionH.position.set(0, 0.04, 0.05);
  g.add(topBar, botSill, leftBar, rightBar, mullionV, mullionH);

  if (withCurtains) {
    const rod = style.cylinder(0.024, 0.024, width + 0.5, 10, style.palette.dark, { outline: 'none' });
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, height / 2 + 0.08, 0.14);
    g.add(rod);

    for (const side of [-1, 1]) {
      const curtain = style.box(0.28, height + 0.3, 0.09, curtainColor, { outline: 'edges' });
      curtain.position.set(side * (width / 2 + 0.04), -0.05, 0.14);
      g.add(curtain);
      if (animables) {
        animables.push({ type: 'curtain', object: curtain, side, phase: side * 0.7 });
      }
    }
  }
  return g;
}

export function buildDoor(style, { width = 0.92, height = 2.05, doorColor = style.palette.floorAlt, frameColor = style.palette.trim } = {}) {
  const g = new THREE.Group();
  g.name = 'DoorProp';
  const frameL = style.box(0.08, height + 0.08, 0.14, frameColor, { bottomPivot: true, outline: 'edges' });
  frameL.position.set(-width / 2 - 0.03, 0, 0.04);
  const frameR = style.box(0.08, height + 0.08, 0.14, frameColor, { bottomPivot: true, outline: 'edges' });
  frameR.position.set(width / 2 + 0.03, 0, 0.04);
  const frameT = style.box(width + 0.18, 0.09, 0.14, frameColor, { bottomPivot: true, outline: 'edges' });
  frameT.position.set(0, height, 0.04);

  const leaf = style.box(width, height, 0.09, doorColor, { bottomPivot: true, outline: 'edges' });
  leaf.position.z = 0.04;
  const panelTop = style.box(width * 0.68, height * 0.34, 0.03, style.palette.wallShade, { outline: 'edges' });
  panelTop.position.set(0, height * 0.72, 0.09);
  const panelBot = style.box(width * 0.68, height * 0.32, 0.03, style.palette.wallShade, { outline: 'edges' });
  panelBot.position.set(0, height * 0.28, 0.09);
  const handle = style.sphere(0.045, 10, 10, style.palette.accent, { outline: 'hull', hullScale: 1.15 });
  handle.position.set(width * 0.36, height * 0.48, 0.13);

  g.add(frameL, frameR, frameT, leaf, panelTop, panelBot, handle);
  return g;
}

export function buildPottedPlant(style, { scale = 1, potColor = style.palette.primary, animables = null, phase = 0 } = {}) {
  const g = new THREE.Group();
  g.name = 'PottedPlant';
  const pot = style.cylinder(0.18, 0.13, 0.28, 12, potColor, { bottomPivot: true, outline: 'hull' });
  const rim = style.cylinder(0.2, 0.19, 0.06, 12, style.palette.trim, { bottomPivot: true, outline: 'hull' });
  rim.position.y = 0.25;
  g.add(pot, rim);

  const foliage = new THREE.Group();
  foliage.position.y = 0.28;
  const leafSpecs = [
    [0, 0.28, 0, 0.16, 0.34, 0.14, 0],
    [-0.14, 0.22, 0.04, 0.14, 0.28, 0.12, 0.42],
    [0.14, 0.24, -0.02, 0.14, 0.3, 0.12, -0.45],
    [-0.08, 0.36, -0.05, 0.13, 0.26, 0.12, 0.2],
    [0.1, 0.34, 0.06, 0.13, 0.24, 0.12, -0.22],
  ];
  for (let i = 0; i < leafSpecs.length; i++) {
    const [x, y, z, sx, sy, sz, rz] = leafSpecs[i];
    const leaf = style.sphere(1, 10, 8, i % 2 === 0 ? style.palette.foliage : style.palette.foliageDark, { outline: 'hull', hullScale: 1.07 });
    leaf.scale.set(sx, sy, sz);
    leaf.position.set(x, y, z);
    leaf.rotation.z = rz;
    foliage.add(leaf);
  }
  g.add(foliage);
  g.add(style.contactShadow(0.22, 0.16, 0.2));
  g.scale.setScalar(scale);

  if (animables) {
    animables.push({ type: 'plant', object: foliage, phase });
  }
  return g;
}

export function buildDeskWithMonitor(style, {
  width = 1.65,
  depth = 0.72,
  height = 0.74,
  woodColor = style.palette.floorAlt,
  dualMonitor = false,
  screenColor = style.palette.secondary,
  animables = null,
} = {}) {
  const g = new THREE.Group();
  g.name = 'DeskWorkspace';

  const top = style.box(width, 0.07, depth, woodColor, { outline: 'edges' });
  top.position.set(0, height, 0);
  g.add(top);

  const legGeoPositions = [
    [-width / 2 + 0.07, -depth / 2 + 0.07],
    [width / 2 - 0.07, -depth / 2 + 0.07],
    [-width / 2 + 0.07, depth / 2 - 0.07],
    [width / 2 - 0.07, depth / 2 - 0.07],
  ];
  for (const [lx, lz] of legGeoPositions) {
    const leg = style.box(0.07, height, 0.07, style.palette.dark, { bottomPivot: true, outline: 'edges' });
    leg.position.set(lx, 0, lz);
    g.add(leg);
  }

  const drawers = style.box(0.42, height - 0.08, depth * 0.86, style.palette.wallShade, { bottomPivot: true, outline: 'edges' });
  drawers.position.set(width * 0.3, 0.02, 0);
  g.add(drawers);

  const monitorOffsets = dualMonitor ? [-0.36, 0.26] : [-0.06];
  for (let i = 0; i < monitorOffsets.length; i++) {
    const mx = monitorOffsets[i];
    const mon = new THREE.Group();
    mon.position.set(mx, height + 0.035, -0.14);
    mon.rotation.y = dualMonitor ? (i === 0 ? 0.16 : -0.16) : 0;

    const standBase = style.box(0.24, 0.03, 0.16, style.palette.dark, { bottomPivot: true, outline: 'edges' });
    const neck = style.box(0.06, 0.16, 0.05, style.palette.dark, { bottomPivot: true, outline: 'edges' });
    neck.position.set(0, 0.03, -0.02);
    const bezel = style.box(0.58, 0.36, 0.045, style.palette.dark, { outline: 'edges' });
    bezel.position.set(0, 0.32, 0);
    const screen = style.box(0.52, 0.3, 0.015, screenColor, { unlit: true, outline: 'none' });
    screen.position.set(0, 0.32, 0.026);
    const bar1 = style.box(0.14, 0.08, 0.012, style.palette.accent, { unlit: true, outline: 'none' });
    bar1.position.set(-0.14, 0.26, 0.038);
    const bar2 = style.box(0.14, 0.15, 0.012, '#ffffff', { unlit: true, outline: 'none' });
    bar2.position.set(0.03, 0.295, 0.038);
    const bar3 = style.box(0.12, 0.21, 0.012, style.palette.primary, { unlit: true, outline: 'none' });
    bar3.position.set(0.18, 0.325, 0.038);

    mon.add(standBase, neck, bezel, screen, bar1, bar2, bar3);
    g.add(mon);

    if (animables) {
      animables.push({ type: 'screenBar', object: bar2, baseY: 0.295, phase: i * 1.4 });
      animables.push({ type: 'screenBar', object: bar3, baseY: 0.325, phase: i * 1.4 + 0.9 });
    }
  }

  const kb = style.box(0.36, 0.025, 0.12, style.palette.trim, { bottomPivot: true, outline: 'edges' });
  kb.position.set(-0.08, height + 0.035, 0.15);
  const mug = style.cylinder(0.042, 0.038, 0.085, 10, style.palette.accent, { bottomPivot: true, outline: 'hull' });
  mug.position.set(0.45, height + 0.035, 0.16);
  g.add(kb, mug);
  g.add(style.contactShadow(width * 0.5, depth * 0.45, 0.2));

  return g;
}

export function buildSofa(style, { width = 2.0, color = style.palette.secondary, pillowColor = style.palette.accent } = {}) {
  const g = new THREE.Group();
  g.name = 'SofaProp';

  for (const lx of [-width * 0.44, width * 0.44]) {
    for (const lz of [-0.28, 0.28]) {
      const leg = style.cylinder(0.035, 0.026, 0.14, 8, style.palette.dark, { bottomPivot: true, outline: 'none' });
      leg.position.set(lx, 0, lz);
      g.add(leg);
    }
  }
  const base = style.box(width, 0.24, 0.78, color, { bottomPivot: true, outline: 'edges' });
  base.position.y = 0.12;
  const back = style.box(width, 0.58, 0.2, color, { bottomPivot: true, outline: 'edges' });
  back.position.set(0, 0.34, -0.3);
  const armL = style.box(0.18, 0.42, 0.78, color, { bottomPivot: true, outline: 'edges' });
  armL.position.set(-width / 2 + 0.09, 0.22, 0);
  const armR = style.box(0.18, 0.42, 0.78, color, { bottomPivot: true, outline: 'edges' });
  armR.position.set(width / 2 - 0.09, 0.22, 0);
  const cushL = style.box(width * 0.4, 0.15, 0.62, style.palette.trim, { bottomPivot: true, outline: 'edges' });
  cushL.position.set(-width * 0.21, 0.34, 0.04);
  const cushR = style.box(width * 0.4, 0.15, 0.62, style.palette.trim, { bottomPivot: true, outline: 'edges' });
  cushR.position.set(width * 0.21, 0.34, 0.04);
  const pillow = style.box(0.26, 0.26, 0.12, pillowColor, { outline: 'edges' });
  pillow.position.set(-width * 0.32, 0.6, -0.14);
  pillow.rotation.z = 0.18;

  g.add(base, back, armL, armR, cushL, cushR, pillow);
  g.add(style.contactShadow(width * 0.5, 0.44, 0.22));
  return g;
}

export function buildBed(style, { width = 1.95, duvetColor = style.palette.primary, frameColor = style.palette.floorAlt } = {}) {
  const g = new THREE.Group();
  g.name = 'BedProp';
  const frame = style.box(width, 0.24, 1.25, frameColor, { bottomPivot: true, outline: 'edges' });
  frame.position.y = 0.12;
  const headboard = style.box(width + 0.1, 0.92, 0.12, frameColor, { bottomPivot: true, outline: 'edges' });
  headboard.position.set(0, 0.12, -0.58);
  const mattress = style.box(width - 0.1, 0.22, 1.15, style.palette.trim, { bottomPivot: true, outline: 'edges' });
  mattress.position.set(0, 0.35, 0);
  const duvet = style.box(width - 0.04, 0.16, 0.82, duvetColor, { bottomPivot: true, outline: 'edges' });
  duvet.position.set(0, 0.44, 0.16);
  const p1 = style.box(0.55, 0.14, 0.3, style.palette.accent, { bottomPivot: true, outline: 'edges' });
  p1.position.set(-0.36, 0.56, -0.36);
  const p2 = style.box(0.55, 0.14, 0.3, style.palette.accent, { bottomPivot: true, outline: 'edges' });
  p2.position.set(0.36, 0.56, -0.36);

  g.add(frame, headboard, mattress, duvet, p1, p2);
  g.add(style.contactShadow(width * 0.52, 0.65, 0.22));
  return g;
}

export function buildBookshelf(style, { width = 1.05, height = 1.85, woodColor = style.palette.floorAlt } = {}) {
  const g = new THREE.Group();
  g.name = 'BookshelfProp';
  const back = style.box(width, height, 0.06, style.palette.wallShade, { bottomPivot: true, outline: 'edges' });
  back.position.z = -0.15;
  const sideL = style.box(0.08, height, 0.34, woodColor, { bottomPivot: true, outline: 'edges' });
  sideL.position.x = -width / 2 + 0.04;
  const sideR = style.box(0.08, height, 0.34, woodColor, { bottomPivot: true, outline: 'edges' });
  sideR.position.x = width / 2 - 0.04;
  g.add(back, sideL, sideR);

  const bookPalette = [style.palette.primary, style.palette.secondary, style.palette.accent, style.palette.dark];
  for (let s = 0; s < 5; s++) {
    const sy = 0.08 + s * ((height - 0.14) / 4);
    const shelf = style.box(width, 0.06, 0.34, woodColor, { bottomPivot: true, outline: 'edges' });
    shelf.position.y = sy;
    g.add(shelf);
    if (s < 4) {
      for (let b = 0; b < 4; b++) {
        const bh = 0.22 + ((s + b) % 3) * 0.04;
        const book = style.box(0.11, bh, 0.22, bookPalette[(s + b) % bookPalette.length], { bottomPivot: true, outline: 'edges' });
        book.position.set(-width * 0.32 + b * 0.16, sy + 0.06, 0);
        if (b === 3 && s % 2 === 0) book.rotation.z = -0.18;
        g.add(book);
      }
    }
  }
  g.add(style.contactShadow(width * 0.5, 0.24, 0.2));
  return g;
}

export function buildLamp(style, { height = 1.55, shadeColor = style.palette.accent } = {}) {
  const g = new THREE.Group();
  g.name = 'LampProp';
  const base = style.cylinder(0.14, 0.17, 0.06, 12, style.palette.dark, { bottomPivot: true, outline: 'hull' });
  const pole = style.cylinder(0.022, 0.026, height - 0.26, 8, style.palette.metal, { bottomPivot: true, outline: 'none' });
  pole.position.y = 0.05;
  const shade = style.cylinder(0.14, 0.24, 0.3, 14, shadeColor, {
    bottomPivot: true,
    emissive: shadeColor,
    emissiveIntensity: 0.28,
    outline: 'hull',
  });
  shade.position.y = height - 0.32;
  g.add(base, pole, shade);
  g.add(style.contactShadow(0.2, 0.15, 0.18));
  return g;
}

export function buildTree(style, { scale = 1, animables = null, phase = 0 } = {}) {
  const g = new THREE.Group();
  g.name = 'CartoonTree';
  const trunk = style.cylinder(0.09, 0.15, 1.05, 10, '#6e4933', { bottomPivot: true, outline: 'hull' });
  g.add(trunk);

  const canopy = new THREE.Group();
  canopy.position.y = 1.1;
  const c1 = style.sphere(0.55, 12, 10, style.palette.foliage, { outline: 'hull', hullScale: 1.05 });
  const c2 = style.sphere(0.42, 12, 10, style.palette.foliageDark, { outline: 'hull', hullScale: 1.05 });
  c2.position.set(-0.36, -0.1, 0.08);
  const c3 = style.sphere(0.44, 12, 10, style.palette.foliage, { outline: 'hull', hullScale: 1.05 });
  c3.position.set(0.36, -0.06, -0.06);
  const c4 = style.sphere(0.36, 10, 8, style.palette.foliage, { outline: 'hull', hullScale: 1.05 });
  c4.position.set(0.05, 0.34, 0.04);
  canopy.add(c1, c2, c3, c4);
  g.add(canopy);
  g.add(style.contactShadow(0.55, 0.25, 0.2));
  g.scale.setScalar(scale);

  if (animables) {
    animables.push({ type: 'tree', object: canopy, phase });
  }
  return g;
}

export function buildCloud(style, { scale = 1, animables = null, speed = 0.08, xRange = 8, startX = 0, y = 2.6, z = -9 } = {}) {
  const g = new THREE.Group();
  g.name = 'CartoonCloud';
  const lobes = [
    [0, 0, 0, 0.44],
    [-0.38, -0.08, 0.02, 0.32],
    [0.4, -0.06, -0.02, 0.34],
    [0.14, 0.18, 0.03, 0.3],
  ];
  for (const [lx, ly, lz, r] of lobes) {
    const s = style.sphere(r, 10, 8, '#ffffff', { unlit: true, outline: 'hull', hullScale: 1.06, outlineColor: '#b7c7d8' });
    s.position.set(lx, ly, lz);
    g.add(s);
  }
  g.scale.set(scale * 1.15, scale * 0.72, scale * 0.6);
  g.position.set(startX, y, z);
  if (animables) {
    animables.push({ type: 'cloud', object: g, startX, speed, xRange });
  }
  return g;
}

export function buildSportsCar(style, { bodyColor = '#e63946', scale = 1, facing = 1 } = {}) {
  const g = new THREE.Group();
  g.name = 'SportsCarHero';

  const shape = new THREE.Shape();
  shape.moveTo(-1.18, 0.22);
  shape.lineTo(-1.16, 0.46);
  shape.lineTo(-0.72, 0.56);
  shape.lineTo(-0.28, 0.86);
  shape.lineTo(0.42, 0.88);
  shape.lineTo(0.86, 0.58);
  shape.lineTo(1.22, 0.44);
  shape.lineTo(1.2, 0.22);
  shape.closePath();

  const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.86,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  extrudeGeo.translate(0, 0, -0.43);

  const chassis = style.createOutlinedMesh(extrudeGeo, bodyColor, { outline: 'both', edgeThreshold: 28, hullScale: 1.028 });
  g.add(chassis);

  const skirt = style.box(2.34, 0.09, 0.94, style.palette.dark, { outline: 'edges' });
  skirt.position.set(0.02, 0.22, 0);
  g.add(skirt);

  const cabinGlass = style.box(0.86, 0.25, 0.98, '#1e293b', { outline: 'edges' });
  cabinGlass.position.set(0.06, 0.69, 0);
  const sideWindow = style.box(0.76, 0.19, 1.0, style.palette.glass, { unlit: true, opacity: 0.85, outline: 'edges' });
  sideWindow.position.set(0.08, 0.69, 0);
  const windshieldGlint = style.box(0.2, 0.16, 1.02, '#ffffff', { unlit: true, opacity: 0.62, outline: 'none' });
  windshieldGlint.position.set(0.22, 0.7, 0);
  windshieldGlint.rotation.z = -0.35;
  g.add(cabinGlass, sideWindow, windshieldGlint);

  const stripe = style.box(2.02, 0.045, 0.995, '#ffffff', { unlit: true, outline: 'none', polygonOffset: true });
  stripe.position.set(0.05, 0.48, 0);
  g.add(stripe);

  const wingStrutL = style.box(0.08, 0.18, 0.06, style.palette.dark, { bottomPivot: true, outline: 'edges' });
  wingStrutL.position.set(-1.02, 0.46, 0.24);
  const wingStrutR = style.box(0.08, 0.18, 0.06, style.palette.dark, { bottomPivot: true, outline: 'edges' });
  wingStrutR.position.set(-1.02, 0.46, -0.24);
  const wingBlade = style.box(0.28, 0.05, 0.98, style.palette.dark, { outline: 'edges' });
  wingBlade.position.set(-1.06, 0.65, 0);
  wingBlade.rotation.z = 0.14;
  g.add(wingStrutL, wingStrutR, wingBlade);

  for (const wz of [-0.3, 0.3]) {
    const headlight = style.box(0.14, 0.09, 0.2, '#fff6cc', { unlit: true, outline: 'edges' });
    headlight.position.set(1.18, 0.4, wz);
    const taillight = style.box(0.08, 0.09, 0.24, '#ff4d5a', { unlit: true, outline: 'edges' });
    taillight.position.set(-1.17, 0.42, wz);
    g.add(headlight, taillight);
  }

  const wheelPos = [
    [-0.72, 0.22, 0.45],
    [0.72, 0.22, 0.45],
    [-0.72, 0.22, -0.45],
    [0.72, 0.22, -0.45],
  ];
  for (const [wx, wy, wz] of wheelPos) {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, wy, wz);
    const tire = style.cylinder(0.22, 0.22, 0.15, 16, '#1f222a', { outline: 'hull', hullScale: 1.07 });
    tire.rotation.x = Math.PI / 2;
    const rim = style.cylinder(0.135, 0.135, 0.165, 12, '#dce3ec', { outline: 'none' });
    rim.rotation.x = Math.PI / 2;
    const hub = style.cylinder(0.05, 0.05, 0.18, 8, style.palette.accent, { outline: 'none' });
    hub.rotation.x = Math.PI / 2;
    wGroup.add(tire, rim, hub);
    g.add(wGroup);
  }

  g.add(style.contactShadow(1.32, 0.62, 0.28));
  g.scale.set(scale * facing, scale, scale);
  return g;
}

export function buildPrivateJet(style, { hullColor = '#f7f9fc', stripeColor = style.palette.primary, scale = 1 } = {}) {
  const g = new THREE.Group();
  g.name = 'PrivateJetHero';

  const fuselageY = 0.78;
  const body = style.cylinder(0.32, 0.32, 2.5, 16, hullColor, { outline: 'hull', hullScale: 1.045 });
  body.rotation.z = Math.PI / 2;
  body.position.set(0, fuselageY, 0);
  g.add(body);

  const nose = style.cylinder(0.05, 0.32, 0.72, 16, hullColor, { outline: 'hull', hullScale: 1.045 });
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(1.6, fuselageY - 0.02, 0);
  g.add(nose);

  const tailCone = style.cylinder(0.11, 0.32, 0.78, 16, hullColor, { outline: 'hull', hullScale: 1.045 });
  tailCone.rotation.z = Math.PI / 2;
  tailCone.position.set(-1.62, fuselageY + 0.04, 0);
  g.add(tailCone);

  const cockpit = style.box(0.42, 0.16, 0.44, style.palette.dark, { outline: 'edges' });
  cockpit.position.set(1.36, fuselageY + 0.1, 0);
  cockpit.rotation.z = -0.22;
  g.add(cockpit);

  const livery = style.box(2.55, 0.075, 0.66, stripeColor, { outline: 'none' });
  livery.position.set(0.02, fuselageY - 0.05, 0);
  g.add(livery);

  for (let i = 0; i < 6; i++) {
    const win = style.cylinder(0.055, 0.055, 0.67, 10, style.palette.dark, { outline: 'none' });
    win.rotation.x = Math.PI / 2;
    win.scale.set(1.2, 1, 0.85);
    win.position.set(-0.75 + i * 0.33, fuselageY + 0.09, 0);
    g.add(win);
  }

  for (const side of [-1, 1]) {
    const wing = style.box(0.75, 0.07, 1.55, hullColor, { outline: 'edges' });
    wing.position.set(0.08, fuselageY - 0.16, side * 0.92);
    wing.rotation.y = side * 0.38;
    const winglet = style.box(0.24, 0.24, 0.05, stripeColor, { outline: 'edges' });
    winglet.position.set(-0.22, fuselageY - 0.04, side * 1.62);
    g.add(wing, winglet);

    const eng = style.cylinder(0.14, 0.12, 0.56, 12, style.palette.metal, { outline: 'hull', hullScale: 1.07 });
    eng.rotation.z = Math.PI / 2;
    eng.position.set(-1.12, fuselageY + 0.04, side * 0.42);
    const intake = style.cylinder(0.11, 0.11, 0.05, 12, style.palette.dark, { outline: 'none' });
    intake.rotation.z = Math.PI / 2;
    intake.position.set(-0.84, fuselageY + 0.04, side * 0.42);
    g.add(eng, intake);
  }

  const vTail = style.box(0.55, 0.78, 0.08, stripeColor, { bottomPivot: true, outline: 'edges' });
  vTail.position.set(-1.68, fuselageY + 0.15, 0);
  vTail.rotation.z = 0.26;
  const hTail = style.box(0.32, 0.06, 1.05, hullColor, { outline: 'edges' });
  hTail.position.set(-1.82, fuselageY + 0.92, 0);
  g.add(vTail, hTail);

  const gearPos = [[1.12, 0], [-0.25, 0.38], [-0.25, -0.38]];
  for (const [gx, gz] of gearPos) {
    const strut = style.cylinder(0.03, 0.03, 0.45, 8, style.palette.dark, { bottomPivot: true, outline: 'none' });
    strut.position.set(gx, 0.12, gz);
    const wheel = style.cylinder(0.12, 0.12, 0.09, 12, '#1f222a', { outline: 'hull', hullScale: 1.08 });
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(gx, 0.12, gz);
    g.add(strut, wheel);
  }

  g.add(style.contactShadow(2.1, 0.95, 0.24));
  g.scale.setScalar(scale);
  return g;
}

export function buildCityBuilding(style, {
  width = 1.6,
  height = 3.2,
  depth = 1.2,
  color = style.palette.wallShade,
  windowColor = style.palette.glass,
  accentColor = style.palette.primary,
  rows = 4,
  cols = 3,
} = {}) {
  const g = new THREE.Group();
  g.name = 'CartoonBuilding';
  const body = style.box(width, height, depth, color, { bottomPivot: true, outline: 'edges' });
  const roof = style.box(width + 0.1, 0.14, depth + 0.1, accentColor, { bottomPivot: true, outline: 'edges' });
  roof.position.y = height;
  g.add(body, roof);

  const cellW = (width * 0.78) / cols;
  const cellH = (height * 0.68) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = style.box(cellW * 0.66, cellH * 0.62, 0.04, windowColor, { unlit: true, outline: 'edges' });
      win.position.set(
        -width * 0.39 + cellW * (c + 0.5),
        height * 0.24 + cellH * (r + 0.5),
        depth / 2 + 0.015
      );
      g.add(win);
    }
  }
  return g;
}

export function buildTableSet(style, {
  width = 1.8,
  depth = 0.9,
  height = 0.72,
  topColor = style.palette.floorAlt,
  chairCount = 2,
  chairColor = style.palette.primary,
} = {}) {
  const g = new THREE.Group();
  g.name = 'TableSet';
  const top = style.box(width, 0.075, depth, topColor, { outline: 'edges' });
  top.position.y = height;
  g.add(top);

  for (const lx of [-width * 0.42, width * 0.42]) {
    for (const lz of [-depth * 0.38, depth * 0.38]) {
      const leg = style.cylinder(0.032, 0.025, height, 8, style.palette.dark, { bottomPivot: true, outline: 'none' });
      leg.position.set(lx, 0, lz);
      g.add(leg);
    }
  }

  for (let i = 0; i < chairCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const chair = new THREE.Group();
    const seat = style.box(0.42, 0.06, 0.42, chairColor, { outline: 'edges' });
    seat.position.y = 0.44;
    const back = style.box(0.06, 0.46, 0.42, chairColor, { bottomPivot: true, outline: 'edges' });
    back.position.set(side * 0.19, 0.44, 0);
    for (const cx of [-0.16, 0.16]) {
      for (const cz of [-0.16, 0.16]) {
        const cl = style.cylinder(0.02, 0.018, 0.44, 6, style.palette.dark, { bottomPivot: true, outline: 'none' });
        cl.position.set(cx, 0, cz);
        chair.add(cl);
      }
    }
    chair.add(seat, back);
    chair.position.set(side * (width * 0.56), 0, (Math.floor(i / 2) - 0.25) * 0.35);
    g.add(chair);
  }
  g.add(style.contactShadow(width * 0.55, depth * 0.5, 0.2));
  return g;
}

export function buildPendantLamp(style, { y = 3.2, drop = 0.72, color = style.palette.accent, wide = false } = {}) {
  const g = new THREE.Group();
  g.name = 'PendantLamp';
  const cord = style.cylinder(0.014, 0.014, drop, 6, style.palette.dark, { outline: 'none' });
  cord.position.y = y - drop / 2;
  const dome = style.cylinder(wide ? 0.28 : 0.12, wide ? 0.48 : 0.24, 0.2, 14, color, {
    emissive: color,
    emissiveIntensity: 0.25,
    outline: 'hull',
  });
  dome.position.y = y - drop;
  const bulb = style.sphere(0.08, 10, 8, '#fff8d6', { unlit: true, outline: 'none' });
  bulb.position.y = y - drop - 0.08;
  g.add(cord, dome, bulb);
  return g;
}
