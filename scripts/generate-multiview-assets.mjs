/**
 * Reproducible layered SVG artwork generator for the Main Character's
 * Back, Top (bird's-eye), and Bottom (worm's-eye) directional views.
 *
 * Strictly matches the Heroine's exact visual identity & color palette:
 * - Hair: #382218 (base), #28160c (shadow), tie #21171c
 * - Skin: #f6cfb3 (base), #e3a989 (shadow), line #9c5d4b
 * - Off-shoulder crop top & bell sleeves: #64101d (base), #450e1b (shadow)
 * - Pleated skirt: #383947 (base), #282933 (shadow), underside shadow #1b1c25
 * - Leggings/tights: #4b4c60 (base), #373848 (shadow)
 * - Shoes: #211f29 (upper/sole), #45434c (trim/tread), #15141c (deep tread)
 * - Ink outlines: #140e10 (stroke-width 6 on 1024x2000, scaled proportionally)
 */

import fs from 'node:fs';
import path from 'node:path';

const BASE_DIR = path.resolve(process.cwd(), 'assets/characters/main-character/views');

const PALETTE = {
  ink: '#140e10',
  hair: '#382218',
  hairDark: '#28160c',
  hairHighlight: '#4c3023',
  tie: '#21171c',
  skin: '#f6cfb3',
  skinShadow: '#e3a989',
  skinLine: '#9c5d4b',
  top: '#64101d',
  topDark: '#450e1b',
  skirt: '#383947',
  skirtDark: '#282933',
  skirtUnder: '#1b1c25',
  tights: '#4b4c60',
  tightsDark: '#38394a',
  shoe: '#211f29',
  shoeTrim: '#45434c',
  shoeSole: '#181720',
};

function writeSvg(relPath, content) {
  const full = path.join(BASE_DIR, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${content.trim()}\n`, 'utf8');
}

function wrapBackSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
${inner}
  </g>
</svg>`;
}

function wrapTopSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g stroke-linejoin="round" stroke-linecap="round">
${inner}
  </g>
</svg>`;
}

function wrapBottomSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1600" viewBox="0 0 1024 1600">
  <g stroke-linejoin="round" stroke-linecap="round">
${inner}
  </g>
</svg>`;
}

/* ============================================================================
 * 1. BACK VIEW (1024 x 2000, same height & floor baseline as Front view)
 * Anatomical side convention:
 * - Character turned 180° facing away from camera.
 * - Semantic `rightUpperArm` (character's anatomical left waving arm) sits on viewer-LEFT (x ~ 137).
 * - Semantic `leftUpperArm` (character's anatomical right arm) sits on viewer-RIGHT (x ~ 373).
 * - Semantic `thighR`/`shinR`/`footR` sit on viewer-LEFT (x ~ 190); `thighL`/`shinL`/`footL` on viewer-RIGHT (x ~ 320).
 * - ZERO front eyes/brows/mouth layers exist in Back view.
 * ========================================================================== */
function generateBackView() {
  // Bare upper back & shoulders (seen from behind, shoulder blades contour)
  writeSvg('back/body.svg', wrapBackSvg(`
    <path d="M142 436 Q190 404 256 402 Q322 404 370 436 Q388 468 378 525 L344 636 L168 636 L134 525 Q124 468 142 436Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M146 446 Q172 440 198 464 Q182 496 174 528 L142 522 Q132 478 146 446Z M366 446 Q340 440 314 464 Q330 496 338 528 L370 522 Q380 478 366 446Z" fill="${PALETTE.skinShadow}" stroke="none"/>
    <path d="M256 416 Q255 462 256 500" fill="none" stroke="${PALETTE.skinLine}" stroke-width="3"/>
    <path d="M196 446 Q216 462 232 476 M316 446 Q296 462 280 476" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.8"/>
  `));

  // Bare lower back / waist midriff (from behind: gentle spine dip & waist dimples, no belly button)
  writeSvg('back/midriff.svg', wrapBackSvg(`
    <path d="M180 612 Q256 626 332 612 Q338 666 355 748 Q256 774 157 748 Q174 666 180 612Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M182 622 Q204 676 196 742 L162 744 Q176 672 182 622Z M330 622 Q308 676 316 742 L350 744 Q336 672 330 622Z" fill="${PALETTE.skinShadow}" stroke="none"/>
    <path d="M256 632 Q255 680 256 726" fill="none" stroke="${PALETTE.skinLine}" stroke-width="3"/>
    <path d="M226 716 Q230 722 234 718 M286 716 Q282 722 278 718" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.6"/>
  `));

  // Rear off-shoulder maroon crop top (even back hem + subtle seam & folds)
  writeSvg('back/top.svg', wrapBackSvg(`
    <path d="M150 492 Q256 508 362 492 Q366 534 352 574 Q342 604 338 632 Q256 648 174 632 Q170 604 160 574 Q146 534 150 492Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M154 504 Q190 520 202 564 Q212 604 222 634 L176 630 Q168 584 154 504Z M358 504 Q324 524 316 574 Q310 606 306 634 L336 630 Q348 584 358 504Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M158 506 Q256 520 354 506" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
    <path d="M256 508 L256 638" fill="none" stroke="${PALETTE.topDark}" stroke-width="4"/>
    <path d="M180 618 Q256 632 332 618" fill="none" stroke="${PALETTE.ink}" stroke-width="3"/>
  `));

  // Rear pleated skirt (symmetric rear box/knife pleats + rear waistband with hidden zipper seam)
  writeSvg('back/skirt.svg', wrapBackSvg(`
    <path d="M154 726 Q256 756 358 726 Q402 824 420 1052 Q256 1096 92 1052 Q110 824 154 726Z" fill="${PALETTE.skirt}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M156 756 L176 766 L132 1056 L104 1050 Q120 854 156 756Z M214 772 L236 774 L224 1076 L194 1072Z M276 774 L298 772 L318 1072 L288 1076Z M336 766 L356 756 Q392 854 408 1050 L380 1056Z" fill="${PALETTE.skirtDark}" stroke="none"/>
    <path d="M178 766 Q152 894 134 1058 M234 774 L224 1078 M278 774 L288 1078 M334 766 Q360 894 378 1058" fill="none" stroke="${PALETTE.ink}" stroke-width="5"/>
    <path d="M154 726 Q256 754 358 726 L368 766 Q256 794 144 766Z" fill="${PALETTE.skirt}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M148 752 Q256 778 364 752 L366 764 Q256 790 146 764Z" fill="${PALETTE.skirtDark}" stroke="none"/>
    <path d="M256 742 L256 778" fill="none" stroke="${PALETTE.ink}" stroke-width="3.5"/>
  `));

  // Rear neck & nape (visible briefly beneath rear hair when head tilts)
  writeSvg('back/neck.svg', wrapBackSvg(`
    <path d="M214 338 L298 338 L314 426 Q256 446 198 426Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M216 344 Q256 368 296 344 L302 396 Q256 410 210 396Z" fill="${PALETTE.skinShadow}" stroke="none"/>
  `));

  // Back of head cranium + visible ear backs peeking slightly at sides
  writeSvg('back/head.svg', wrapBackSvg(`
    <path d="M144 218 Q126 220 128 248 Q132 272 150 278Z M368 218 Q386 220 384 248 Q380 272 362 278Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M144 206 Q152 104 256 96 Q360 104 368 206 Q364 316 256 352 Q148 316 144 206Z" fill="${PALETTE.hairDark}" stroke="${PALETTE.ink}" stroke-width="6"/>
  `));

  // Full rear hair volume (covers back of head completely, flared dark brown silhouette matching front hairBack!)
  writeSvg('back/hairBack.svg', wrapBackSvg(`
    <path d="M110 186 Q138 66 256 58 Q374 66 402 186 L432 378 Q404 424 340 434 L172 434 Q108 424 80 378 Q72 346 92 278Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M116 202 Q148 164 166 244 Q174 332 192 428 L166 430 Q108 418 86 376 Q82 332 116 202Z M396 202 Q364 164 346 244 Q338 332 320 428 L346 430 Q404 418 426 376 Q430 332 396 202Z" fill="${PALETTE.hairDark}" stroke="none"/>
    <path d="M174 368 Q256 392 338 368 L342 430 L170 430Z" fill="${PALETTE.hairDark}" stroke="none"/>
  `));

  // Rear crown & layered hair strand lines + center part from behind
  writeSvg('back/hairUpper.svg', wrapBackSvg(`
    <path d="M126 178 Q152 64 256 58 Q360 64 386 178 Q398 258 410 342 Q350 384 256 388 Q162 384 102 342 Q114 258 126 178Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M256 60 Q254 118 256 174" fill="none" stroke="${PALETTE.ink}" stroke-width="5"/>
    <path d="M180 128 Q216 106 256 114 Q296 106 332 128" fill="none" stroke="${PALETTE.hairHighlight}" stroke-width="8"/>
    <path d="M158 190 Q170 282 186 372 M214 176 Q220 280 226 382 M298 176 Q292 280 286 382 M354 190 Q342 282 326 372" fill="none" stroke="${PALETTE.hairDark}" stroke-width="5"/>
    <path d="M152 246 Q166 320 182 370 M360 246 Q346 320 330 370" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
  `));

  // Two rear-visible braids draping over left/right back shoulders
  function makeBackBraid(cx, cy, tiltDeg, flip) {
    const sx = flip ? -1 : 1;
    const link = (dx, dy) => `
      <g transform="translate(${dx} ${dy})">
        <path d="M-26 -16 Q-14 -28 -2 -17 Q14 -26 28 -12 Q30 4 20 14 L6 33 Q-15 25 -28 4Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
        <path d="M-25 -10 Q-12 11 5 18 L16 14 L6 30 Q-11 24 -25 3Z" fill="${PALETTE.hairDark}" stroke="none"/>
        <path d="M-18 -12 Q-5 -8 3 3 Q13 1 24 -11" fill="none" stroke="${PALETTE.ink}" stroke-width="3"/>
      </g>`;
    return wrapBackSvg(`
    <g transform="translate(${cx} ${cy}) scale(${sx} 1) rotate(${tiltDeg})">
      ${link(0, 0)}
      ${link(4, 38)}
      ${link(7, 75)}
      ${link(9, 111)}
      <path d="M8 140 L27 139 Q24 162 41 182 Q24 196 1 188 Q13 168 8 140Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M6 135 Q16 140 27 134 L29 147 Q19 152 6 147Z" fill="${PALETTE.tie}" stroke="${PALETTE.ink}" stroke-width="4"/>
    </g>`);
  }
  // In back view: braidR sits on viewer-left (x=148), braidL sits on viewer-right (x=364)
  writeSvg('back/braidR.svg', makeBackBraid(148, 360, -4, false));
  writeSvg('back/braidL.svg', makeBackBraid(364, 360, -4, true));

  // Rear arms: rightUpperArm on viewer-left (anatomical left), leftUpperArm on viewer-right (anatomical right)
  // Viewer-left upper arm (rightUpperArm in back view)
  writeSvg('back/rightUpperArm.svg', wrapBackSvg(`
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M107 462 Q122 454 128 468 L118 520 L102 522Z" fill="${PALETTE.skinShadow}" stroke="none"/>
    <path d="M100 506 Q130 518 159 498 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 506Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M102 514 L118 518 Q110 568 126 614 Q112 616 102 605 Q94 566 102 514Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('back/rightForearm.svg', wrapBackSvg(`
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M99 596 Q104 585 114 583 Q104 638 106 672 Q108 698 96 722 L74 716 Q89 664 92 623Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
  `));
  writeSvg('back/rightHand.svg', wrapBackSvg(`
    <path d="M96 710 Q114 704 128 714 L132 752 Q132 786 114 794 Q98 796 86 780 Q76 764 80 742 L92 718Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M92 722 Q104 748 102 784 M112 724 Q118 752 115 788" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.6"/>
  `));

  // Viewer-right upper arm (leftUpperArm in back view)
  writeSvg('back/leftUpperArm.svg', wrapBackSvg(`
    <path d="M370 424 Q346 429 341 455 L357 519 L367 598 Q385 622 408 602 Q421 560 412 508 L406 460 Q401 431 370 424Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M405 462 Q390 454 384 468 L394 520 L410 522Z" fill="${PALETTE.skinShadow}" stroke="none"/>
    <path d="M412 506 Q382 518 353 498 Q358 548 364 579 Q363 605 379 617 Q398 625 412 607 Q424 565 412 506Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M410 514 L394 518 Q402 568 386 614 Q400 616 410 605 Q418 566 410 514Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('back/leftForearm.svg', wrapBackSvg(`
    <path d="M413 594 Q407 575 386 575 Q368 577 366 599 Q375 654 362 715 Q394 735 442 718 Q425 654 421 616 Q419 601 413 594Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M413 596 Q408 585 398 583 Q408 638 406 672 Q404 698 416 722 L438 716 Q423 664 420 623Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M435 702 Q398 718 365 701" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
  `));
  writeSvg('back/leftHand.svg', wrapBackSvg(`
    <path d="M416 710 Q398 704 384 714 L380 752 Q380 786 398 794 Q414 796 426 780 Q436 764 432 742 L420 718Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M420 722 Q408 748 410 784 M400 724 Q394 752 397 788" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.6"/>
  `));

  // Rear legs: thighR/shinR/footR on viewer-left (x=190), thighL/shinL/footL on viewer-right (x=320)
  function makeBackLeg(x, sideTag) {
    // Thigh
    writeSvg(`back/thigh${sideTag}.svg`, wrapBackSvg(`
      <path d="M${x - 44} 842 Q${x} 826 ${x + 44} 842 L${x + 34} 1138 Q${x} 1152 ${x - 34} 1138Z" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M${x - 40} 852 L${x - 24} 852 L${x - 18} 1136 L${x - 32} 1134Z" fill="${PALETTE.tightsDark}" stroke="none"/>
    `));
    // Shin with subtle rear knee crease & calf taper
    writeSvg(`back/shin${sideTag}.svg`, wrapBackSvg(`
      <path d="M${x - 33} 1118 Q${x} 1106 ${x + 33} 1118 Q${x + 38} 1236 ${x + 24} 1386 L${x + 22} 1522 Q${x} 1532 ${x - 22} 1522 L${x - 24} 1386 Q${x - 38} 1236 ${x - 33} 1118Z" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M${x - 28} 1126 Q${x - 12} 1238 ${x - 10} 1518 L${x - 20} 1518 Q${x - 34} 1244 ${x - 28} 1126Z" fill="${PALETTE.tightsDark}" stroke="none"/>
      <path d="M${x - 18} 1138 Q${x} 1146 ${x + 18} 1138" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
    `));
    // Rear shoe heel counter & sole rim (distinct from front toe box!)
    writeSvg(`back/foot${sideTag}.svg`, wrapBackSvg(`
      <path d="M${x - 26} 1502 Q${x} 1512 ${x + 26} 1502 L${x + 32} 1544 Q${x} 1554 ${x - 32} 1544Z" fill="${PALETTE.shoe}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M${x - 28} 1536 Q${x} 1544 ${x + 28} 1536" fill="none" stroke="${PALETTE.shoeTrim}" stroke-width="5"/>
      <path d="M${x} 1508 L${x} 1536" fill="none" stroke="${PALETTE.shoeTrim}" stroke-width="3.2"/>
    `));
  }
  makeBackLeg(190, 'R');
  makeBackLeg(320, 'L');
}

/* ============================================================================
 * 2. TOP VIEW (Bird's-Eye Overhead, 1024 x 1024 square canvas)
 * Convention:
 * - Character faces SCREEN-DOWN (+Y in SVG / -Y in Three.js).
 * - Viewer-LEFT = character's anatomical right (`leftUpperArm`, `footL` at x < 512).
 * - Viewer-RIGHT = character's anatomical left (`rightUpperArm`, `footR` at x > 512).
 * - Back of hair crowns the upper half (y ~ 330..500), front hairline & braids drape down (+Y ~ 560..690).
 * - Circular pleated skirt fans out underneath shoulders/torso.
 * - Feet/toes peek forward/backward out from under the skirt during walk/run/jump!
 * ========================================================================== */
function generateTopView() {
  // Overhead toes/feet peeking out below skirt hem (facing down +Y)
  writeSvg('top/thighL.svg', wrapTopSvg(`
    <ellipse cx="448" cy="532" rx="44" ry="52" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));
  writeSvg('top/footL.svg', wrapTopSvg(`
    <path d="M418 552 Q446 534 474 552 L480 622 Q448 654 414 622Z" fill="${PALETTE.shoe}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M424 606 Q447 624 470 606" fill="none" stroke="${PALETTE.shoeTrim}" stroke-width="4"/>
  `));
  writeSvg('top/thighR.svg', wrapTopSvg(`
    <ellipse cx="576" cy="532" rx="44" ry="52" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));
  writeSvg('top/footR.svg', wrapTopSvg(`
    <path d="M550 552 Q578 534 606 552 L610 622 Q576 654 544 622Z" fill="${PALETTE.shoe}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M554 606 Q577 624 600 606" fill="none" stroke="${PALETTE.shoeTrim}" stroke-width="4"/>
  `));

  // Circular pleated skirt seen from directly above (radial pleats!)
  writeSvg('top/skirt.svg', wrapTopSvg(`
    <ellipse cx="512" cy="512" rx="224" ry="188" fill="${PALETTE.skirt}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M512 512 L338 394 Q380 354 438 334Z M512 512 L586 334 Q644 354 686 394Z M512 512 L726 520 Q714 584 666 634Z M512 512 L548 698 Q476 700 416 676Z M512 512 L302 560 Q288 506 306 448Z" fill="${PALETTE.skirtDark}" stroke="none"/>
    <path d="M512 326 L512 698 M338 394 L686 630 M686 394 L338 630 M292 512 L732 512 M416 338 L608 686 M608 338 L416 686" fill="none" stroke="${PALETTE.ink}" stroke-width="3.6"/>
    <ellipse cx="512" cy="512" rx="124" ry="96" fill="${PALETTE.skirtDark}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));

  // Overhead bare shoulders & torso base (oval shoulder span)
  writeSvg('top/body.svg', wrapTopSvg(`
    <path d="M322 508 Q326 426 512 422 Q698 426 702 508 Q696 584 512 588 Q328 584 322 508Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M332 506 Q344 446 426 436 Q388 476 388 526 Q356 544 332 506Z M692 506 Q680 446 598 436 Q636 476 636 526 Q668 544 692 506Z" fill="${PALETTE.skinShadow}" stroke="none"/>
  `));

  // Overhead off-shoulder maroon collar & upper chest/back rim
  writeSvg('top/top.svg', wrapTopSvg(`
    <path d="M342 524 Q388 456 512 454 Q636 456 682 524 Q648 594 512 600 Q376 594 342 524Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M362 532 Q420 568 512 572 Q604 568 662 532 Q626 588 512 594 Q398 588 362 532Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M360 518 Q434 494 512 492 Q590 494 664 518" fill="none" stroke="${PALETTE.skin}" stroke-width="24"/>
    <path d="M358 522 Q434 498 512 496 Q590 498 666 522" fill="none" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));

  // Overhead left arm (viewer-left, extending left & slightly forward)
  writeSvg('top/leftUpperArm.svg', wrapTopSvg(`
    <path d="M346 474 Q364 504 344 544 L236 558 Q206 534 214 494 L256 474Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M306 474 L224 486 Q204 516 218 552 L296 554 Q314 516 306 474Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M300 526 L220 536 L222 550 L294 552Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('top/leftForearm.svg', wrapTopSvg(`
    <path d="M236 484 Q246 516 232 552 L134 574 Q112 530 128 480Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M230 532 L132 556 L136 572 L230 550Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M142 486 Q132 526 144 568" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
  `));
  writeSvg('top/leftHand.svg', wrapTopSvg(`
    <path d="M134 504 Q118 494 94 502 L68 516 Q56 528 68 542 L94 556 Q116 562 134 550Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M98 514 L74 522 M98 530 L72 534 M98 544 L78 548" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.5"/>
  `));

  // Overhead right arm (viewer-right, extending right & slightly forward)
  writeSvg('top/rightUpperArm.svg', wrapTopSvg(`
    <path d="M678 474 Q660 504 680 544 L788 558 Q818 534 810 494 L768 474Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M718 474 L800 486 Q820 516 806 552 L728 554 Q710 516 718 474Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M724 526 L804 536 L802 550 L730 552Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('top/rightForearm.svg', wrapTopSvg(`
    <path d="M788 484 Q778 516 792 552 L890 574 Q912 530 896 480Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M794 532 L892 556 L888 572 L794 550Z" fill="${PALETTE.topDark}" stroke="none"/>
    <path d="M882 486 Q892 526 880 568" fill="none" stroke="${PALETTE.ink}" stroke-width="3.2"/>
  `));
  writeSvg('top/rightHand.svg', wrapTopSvg(`
    <path d="M890 504 Q906 494 930 502 L956 516 Q968 528 956 542 L930 556 Q908 562 890 550Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M926 514 L950 522 M926 530 L952 534 M926 544 L946 548" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.5"/>
  `));

  // Overhead braids draping forward (+Y) over front of shoulders
  function makeTopBraid(cx, cy, tiltDeg, flip) {
    const sx = flip ? -1 : 1;
    return wrapTopSvg(`
    <g transform="translate(${cx} ${cy}) scale(${sx} 1) rotate(${tiltDeg})">
      <path d="M-22 -14 Q0 -26 24 -12 Q26 10 14 26 L-12 24 Q-26 10 -22 -14Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-18 22 Q0 12 20 24 Q22 44 10 58 L-10 58 Q-22 44 -18 22Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-15 54 Q0 46 16 56 Q16 74 8 88 L-8 88 Q-18 74 -15 54Z" fill="${PALETTE.hairDark}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-10 86 L12 86 L18 112 Q0 122 -16 112Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5"/>
      <path d="M-12 82 Q0 88 12 82 L13 92 Q0 96 -13 92Z" fill="${PALETTE.tie}" stroke="${PALETTE.ink}" stroke-width="3.5"/>
    </g>`);
  }
  writeSvg('top/braidL.svg', makeTopBraid(418, 562, 10, false));
  writeSvg('top/braidR.svg', makeTopBraid(606, 562, 10, true));

  // Overhead head base (subtle forehead curve peeking slightly at bottom edge of crown)
  writeSvg('top/head.svg', wrapTopSvg(`
    <ellipse cx="512" cy="508" rx="118" ry="112" fill="${PALETTE.hairDark}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M488 610 Q512 626 536 610 Q522 618 512 619 Q502 618 488 610Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="4"/>
  `));

  // Overhead crown of hair (sleek heroine center part, twin glossy highlight crescents, flowing strands)
  writeSvg('top/hairCrown.svg', wrapTopSvg(`
    <path d="M352 486 Q360 352 512 336 Q664 352 672 486 Q668 580 606 612 Q558 624 512 608 Q466 624 418 612 Q356 580 352 486Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M362 490 Q378 412 430 378 Q402 458 418 560 Q374 546 362 490Z M662 490 Q646 412 594 378 Q622 458 606 560 Q650 546 662 490Z" fill="${PALETTE.hairDark}" stroke="none"/>
    <path d="M430 456 Q460 422 496 428 M528 428 Q564 422 594 456" fill="none" stroke="${PALETTE.hairHighlight}" stroke-width="10"/>
    <path d="M438 518 Q466 544 494 546 M530 546 Q558 544 586 518" fill="none" stroke="${PALETTE.hairHighlight}" stroke-width="6" opacity="0.55"/>
    <path d="M512 372 L512 596" fill="none" stroke="${PALETTE.ink}" stroke-width="5"/>
    <path d="M512 446 Q442 436 382 470 M512 446 Q582 436 642 470 M512 492 Q438 496 386 542 M512 492 Q586 496 638 542 M512 536 Q464 562 430 600 M512 536 Q560 562 594 600" fill="none" stroke="${PALETTE.hairDark}" stroke-width="4.5"/>
  `));
}

/* ============================================================================
 * 3. BOTTOM VIEW (Worm's-Eye Low-Angle Underside, 1024 x 1600 canvas)
 * Composition:
 * - Camera positioned low beneath the character looking steeply UPWARD.
 * - Foreground (bottom, y ~ 1100..1510): Prominent anatomical left/right shoe soles with treads!
 * - Mid-lower (y ~ 720..1240): Foreshortened thighs & shins rising upward into the wide dark
 *   interior underside of the pleated skirt (y ~ 610..950).
 * - Mid-upper (y ~ 450..680): Foreshortened bare midriff & underside of maroon off-shoulder crop top.
 * - Sides (y ~ 360..760): Foreshortened arms & open bell-sleeve undersides.
 * - Upper (y ~ 130..450): True underside of jawline & pointed chin tilted UPWARD away from camera,
 *   with shaded submental under-chin plane & cylindrical neck, framed by hanging hair & braid ends.
 *   ZERO front eyes/brows/mouth and ZERO smiley-like horizontal arcs!
 * ========================================================================== */
function generateBottomView() {
  // Long hanging back hair framing the upper underside behind neck/jaw
  writeSvg('bottom/hairBack.svg', wrapBottomSvg(`
    <path d="M294 276 Q326 116 512 104 Q698 116 730 276 L746 446 Q652 480 512 484 Q372 480 278 446Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M312 288 Q348 164 512 150 Q676 164 712 288 L722 434 Q634 466 512 470 Q390 466 302 434Z" fill="${PALETTE.hairDark}" stroke="none"/>
    <path d="M326 232 Q314 334 302 432 M698 232 Q710 334 722 432" fill="none" stroke="${PALETTE.ink}" stroke-width="3.5"/>
  `));

  // Braid ends hanging down toward camera on either side of jaw/shoulders
  function makeBottomBraid(cx, cy, flip) {
    const sx = flip ? -1 : 1;
    return wrapBottomSvg(`
    <g transform="translate(${cx} ${cy}) scale(${sx} 1)">
      <path d="M-24 -6 Q0 -18 24 -4 Q26 18 14 34 L-12 34 Q-26 18 -24 -6Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-20 32 Q0 22 22 34 Q24 54 12 70 L-10 70 Q-24 54 -20 32Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-16 68 Q0 58 18 70 Q18 90 10 104 L-10 104 Q-18 90 -16 68Z" fill="${PALETTE.hairDark}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
      <path d="M-14 102 Q0 108 14 102 L15 114 Q0 120 -15 114Z" fill="${PALETTE.tie}" stroke="${PALETTE.ink}" stroke-width="4"/>
      <path d="M-12 114 L14 114 Q18 140 28 164 Q2 178 -22 164 Q-10 142 -12 114Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    </g>`);
  }
  writeSvg('bottom/braidL.svg', makeBottomBraid(362, 344, false));
  writeSvg('bottom/braidR.svg', makeBottomBraid(662, 344, true));

  // True underside of pointed chin & jaw (tilted upward: chin apex at top, shaded jaw underside sloping cleanly into neck!)
  writeSvg('bottom/head.svg', wrapBottomSvg(`
    <path d="M394 274 Q404 186 512 152 Q620 186 630 274 Q616 346 512 368 Q408 346 394 274Z" fill="${PALETTE.skinShadow}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M406 254 Q426 178 512 158 Q598 178 618 254 Q572 222 512 218 Q452 222 406 254Z" fill="${PALETTE.skin}" stroke="none"/>
    <path d="M416 258 Q464 212 512 208 Q560 212 608 258" fill="none" stroke="${PALETTE.skinLine}" stroke-width="3.5"/>
    <path d="M388 268 Q372 272 376 296 Q380 314 398 318Z M636 268 Q652 272 648 296 Q644 314 626 318Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="5"/>
    <path d="M396 244 Q422 156 512 146 Q602 156 628 244 Q600 182 512 174 Q424 182 396 244Z" fill="${PALETTE.hair}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));

  // Neck cylinder rising up into the shaded under-jaw shadow
  writeSvg('bottom/neck.svg', wrapBottomSvg(`
    <path d="M452 332 L572 332 L592 436 Q512 456 432 436Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M454 334 L570 334 L574 378 Q512 398 450 378Z" fill="${PALETTE.skinShadow}" stroke="none"/>
    <path d="M484 376 Q480 408 474 430 M540 376 Q544 408 550 430" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.5" opacity="0.7"/>
  `));

  // Upper chest / collarbone & shoulders from low angle
  writeSvg('bottom/body.svg', wrapBottomSvg(`
    <path d="M352 432 Q432 404 512 402 Q592 404 672 432 Q694 476 680 538 L344 538 Q330 476 352 432Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M358 456 Q436 476 512 478 Q588 476 666 456 L674 528 L350 528Z" fill="${PALETTE.skinShadow}" stroke="none"/>
  `));

  // Underside of maroon off-shoulder crop top (curved lower hem visible from below!)
  writeSvg('bottom/top.svg', wrapBottomSvg(`
    <path d="M348 472 Q512 452 676 472 Q684 538 662 598 Q512 564 362 598 Q340 538 348 472Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M362 560 Q512 528 662 560 L656 596 Q512 562 368 596Z" fill="${PALETTE.topDark}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));

  // Bare midriff foreshortened from below
  writeSvg('bottom/midriff.svg', wrapBottomSvg(`
    <path d="M372 574 Q512 548 652 574 Q672 642 686 704 Q512 664 338 704 Q352 642 372 574Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M378 576 Q512 554 646 576 L654 612 Q512 588 370 612Z" fill="${PALETTE.skinShadow}" stroke="none"/>
  `));

  // Pleated skirt seen from BELOW: wide circular pleated rim + deep shadowed interior underside!
  writeSvg('bottom/skirt.svg', wrapBottomSvg(`
    <path d="M324 668 Q512 628 700 668 Q780 756 806 880 Q512 978 218 880 Q244 756 324 668Z" fill="${PALETTE.skirt}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M226 874 Q512 968 798 874 Q756 774 512 752 Q268 774 226 874Z" fill="${PALETTE.skirtUnder}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <ellipse cx="512" cy="846" rx="236" ry="78" fill="#13141c" stroke="${PALETTE.skirtDark}" stroke-width="4"/>
    <path d="M330 678 L268 858 M412 660 L386 814 M512 652 L512 770 M612 660 L638 814 M694 678 L756 858" fill="none" stroke="${PALETTE.ink}" stroke-width="4.5"/>
  `));

  // Arms & bell sleeves seen from below (open maroon bell-sleeve cuff undersides visible!)
  writeSvg('bottom/leftUpperArm.svg', wrapBottomSvg(`
    <path d="M360 448 Q386 458 386 492 L352 612 Q324 624 294 600 L312 490 Q320 454 360 448Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M306 508 Q342 524 374 504 L354 610 Q320 624 288 602Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M294 592 Q324 612 352 602 L346 616 Q318 626 290 604Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('bottom/leftForearm.svg', wrapBottomSvg(`
    <path d="M296 594 Q326 584 348 606 L334 748 Q284 764 236 734 L274 616Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <ellipse cx="286" cy="738" rx="48" ry="22" fill="${PALETTE.topDark}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));
  writeSvg('bottom/leftHand.svg', wrapBottomSvg(`
    <path d="M266 734 Q288 724 308 736 L312 790 Q296 824 270 822 Q248 814 248 784Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M268 756 L266 804 M286 758 L286 808" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.5"/>
  `));

  writeSvg('bottom/rightUpperArm.svg', wrapBottomSvg(`
    <path d="M664 448 Q638 458 638 492 L672 612 Q700 624 730 600 L712 490 Q704 454 664 448Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M718 508 Q682 524 650 504 L670 610 Q704 624 736 602Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <path d="M730 592 Q700 612 672 602 L678 616 Q706 626 734 604Z" fill="${PALETTE.topDark}" stroke="none"/>
  `));
  writeSvg('bottom/rightForearm.svg', wrapBottomSvg(`
    <path d="M728 594 Q698 584 676 606 L690 748 Q740 764 788 734 L750 616Z" fill="${PALETTE.top}" stroke="${PALETTE.ink}" stroke-width="6"/>
    <ellipse cx="738" cy="738" rx="48" ry="22" fill="${PALETTE.topDark}" stroke="${PALETTE.ink}" stroke-width="5"/>
  `));
  writeSvg('bottom/rightHand.svg', wrapBottomSvg(`
    <path d="M758 734 Q736 724 716 736 L712 790 Q728 824 754 822 Q776 814 776 784Z" fill="${PALETTE.skin}" stroke="${PALETTE.ink}" stroke-width="5.5"/>
    <path d="M756 756 L758 804 M738 758 L738 808" fill="none" stroke="${PALETTE.skinLine}" stroke-width="2.5"/>
  `));

  // Foreshortened legs emerging from dark underside of skirt toward prominent anatomical foreground shoe soles!
  function makeBottomLeg(x, sideTag, tilt) {
    const dx = tilt;
    const isRight = sideTag === 'R';
    const sx = isRight ? -1 : 1;
    writeSvg(`bottom/thigh${sideTag}.svg`, wrapBottomSvg(`
      <path d="M${x - 52} 816 Q${x} 796 ${x + 52} 816 L${x + 48 + dx} 1024 Q${x + dx} 1044 ${x - 48 + dx} 1024Z" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M${x - 46} 822 L${x - 24} 824 L${x - 20 + dx} 1020 L${x - 44 + dx} 1018Z" fill="${PALETTE.tightsDark}" stroke="none"/>
    `));
    writeSvg(`bottom/shin${sideTag}.svg`, wrapBottomSvg(`
      <path d="M${x - 46 + dx} 1004 Q${x + dx} 988 ${x + 46 + dx} 1004 L${x + 58 + dx * 1.4} 1234 Q${x + dx * 1.4} 1260 ${x - 58 + dx * 1.4} 1234Z" fill="${PALETTE.tights}" stroke="${PALETTE.ink}" stroke-width="6"/>
      <path d="M${x - 40 + dx} 1012 L${x - 18 + dx} 1012 L${x - 24 + dx * 1.4} 1232 L${x - 52 + dx * 1.4} 1228Z" fill="${PALETTE.tightsDark}" stroke="none"/>
    `));
    // Prominent anatomical shoe SOLE seen from directly beneath (wider forefoot toe pad, sculpted inner arch, rounded heel block + grip treads!)
    const fx = x + dx * 1.5;
    writeSvg(`bottom/foot${sideTag}.svg`, wrapBottomSvg(`
    <g transform="translate(${fx} 1338) scale(${sx} 1)">
      <path d="M-74 -128 Q-12 -174 62 -130 Q84 -70 64 14 Q48 76 58 128 Q10 166 -54 134 Q-68 72 -62 12 Q-86 -58 -74 -128Z" fill="${PALETTE.shoe}" stroke="${PALETTE.ink}" stroke-width="7"/>
      <path d="M-56 -114 Q-8 -148 46 -114 Q64 -66 44 10 Q30 68 42 116 Q8 144 -38 120 Q-48 66 -44 10 Q-66 -52 -56 -114Z" fill="${PALETTE.shoeSole}" stroke="${PALETTE.shoeTrim}" stroke-width="4.5"/>
      <path d="M-48 -90 H42 M-54 -60 H48 M-48 -30 H44 M-36 0 H34 M-34 72 H36 M-38 102 H34" fill="none" stroke="${PALETTE.shoeTrim}" stroke-width="4.5"/>
      <path d="M-28 24 Q2 34 26 24 L28 54 Q2 62 -28 54Z" fill="${PALETTE.shoe}" stroke="${PALETTE.shoeTrim}" stroke-width="3"/>
    </g>
    `));
  }
  makeBottomLeg(426, 'L', -18);
  makeBottomLeg(598, 'R', 18);
}

generateBackView();
generateTopView();
generateBottomView();
console.log('Generated distinct layered SVG packs for back, top, and bottom views.');
