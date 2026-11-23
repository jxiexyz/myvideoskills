"""Build editable, shared-coordinate SVG cutouts from the original vector paths."""
from pathlib import Path

HERE = Path(__file__).parent
INK = '#140e10'
SKIN, SHADE, BLUSH = '#f6cfb3', '#e3a989', '#efa991'
HAIR, DEEP, GLEAM = '#382218', '#28160c', '#4b3021'
WINE, DARK = '#64101d', '#450e1b'
SKIRT, FOLD = '#383947', '#282933'


def path(d, fill='none', stroke=INK, width=6):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'


def flat(d, fill):
    return path(d, fill, 'none')


def ellipse(x, y, rx, ry, fill):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"/>'


def save(name, *art):
    shapes = '\n    '.join(art)
    (HERE / f'{name}.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">\n'
        '  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">\n'
        f'    {shapes}\n  </g>\n</svg>\n'
    )


save('body', path('M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z', SKIN),
     flat('M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z', SHADE),
     flat('M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z', SHADE),
     path('M183 462 Q208 443 232 453 M273 447 Q301 428 329 436', width=3.5))
save('neck', path('M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z', SKIN),
     flat('M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z', SHADE))
save('midriff', path('M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z', SKIN),
     flat('M190 627 L342 613 L333 649 Q267 668 193 650Z', SHADE),
     path('M249 708 Q255 700 265 698', width=4))
save('top', path('M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z', WINE),
     flat('M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z', DARK),
     path('M213 567 Q235 582 270 573 M314 609 Q322 605 333 605', DARK, INK, 3))
save('skirt', path('M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z', SKIRT),
     flat('M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z', FOLD),
     path('M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060', width=5),
     path('M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z', SKIRT),
     flat('M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z', FOLD),
     path('M194 742 L181 775 M328 740 L345 778', width=4))
save('hairBack', path('M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z', HAIR),
     flat('M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z', DEEP))
save('head', path('M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z', SKIN),
     flat('M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z', SHADE),
     path('M140 251 Q131 253 142 268 M373 246 Q383 239 376 256', 'none', '#9c5d4b', 3.5),
     ellipse(197, 286, 18, 6, BLUSH), ellipse(328, 287, 17, 6, BLUSH),
     path('M267 250 Q270 270 276 278 L269 290', width=3.8))
save('hairFront', path('M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z', HAIR),
     flat('M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z', GLEAM),
     flat('M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z', DEEP),
     path('M270 74 Q266 88 268 116', width=4))
save('eyes', flat('M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z', '#fff5e9'),
     ellipse(203, 244, 13, 11, HAIR), ellipse(318, 244, 13, 11, HAIR),
     ellipse(204, 245, 7, 9, INK), ellipse(319, 245, 7, 9, INK),
     ellipse(207, 241, 2.8, 3.2, 'white'), ellipse(322, 241, 2.8, 3.2, 'white'),
     path('M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235', width=5))
save('eyes_happy', path('M171 247 Q203 225 235 251 M288 250 Q320 226 350 246', width=5))
save('eyes_closed', path('M170 243 Q198 259 234 250 M288 251 Q326 257 350 243', width=5))
save('brows', flat('M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z', INK))
save('brows_raised', flat('M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z', INK))
save('mole', ellipse(337, 266, 3.6, 3.8, INK))
save('mouth', path('M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z', '#b63e4b', width=4),
     path('M229 307 Q262 309 296 301', width=3))
for name, d, teeth, tongue in [
    ('smile', 'M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z',
     'M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z',
     'M248 315 Q267 308 287 313 Q270 326 248 315Z'),
    ('open', 'M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z',
     'M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z',
     'M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z'),
]:
    save(f'mouth_{name}', path(d, '#d25a5d', width=5), path(d, '#33131d', '#bb4652', 2.6))
    save(f'{name}Teeth', flat(teeth, '#fff5e9'))
    save(f'{name}Tongue', flat(tongue, '#ee7781'))


def braid(name, shift, angle):
    art = []
    for x, y in [(0, 0), (5, 44), (9, 87), (11, 128)]:
        art.append(f'<g transform="translate({x} {y})">')
        art.append(path('M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z', HAIR))
        art.append(flat('M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z', DEEP))
        art.append(path('M-22 -15 Q-6 -10 3 4 Q15 1 28 -13', width=3.2))
        art.append('</g>')
    art.extend([
        # Root band is tucked into the scalp by hairFront's higher draw order.
        path('M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z', '#21171c', width=4),
        flat('M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z', DEEP),
        path('M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z', HAIR),
        flat('M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z', DEEP),
        path('M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z', '#21171c', width=4),
    ])
    save(name, f'<g transform="{shift} rotate({angle})">', *art, '</g>')


braid('braidL', 'translate(148 346)', -3)
braid('braidR', 'translate(373 345) scale(-1 1)', -7)


def arm(side, transform):
    def layer(name, *art):
        save(side + name, f'<g transform="{transform}">', *art, '</g>')

    layer('UpperArm', path('M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z', SKIN),
          flat('M107 462 Q118 450 122 457 L114 521 L101 530Z', SHADE),
          path('M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z', WINE),
          flat('M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z', DARK))
    layer('Forearm', path('M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z', WINE),
          flat('M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z', DARK),
          path('M77 702 Q114 718 147 701', width=3.2))
    layer('Hand', path('M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z', SKIN),
          flat('M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z', SHADE),
          path('M84 764 L85 768 M98 765 L98 771 M109 760 L112 767', width=2.8))


arm('left', '')
arm('right', 'translate(510 -19) scale(-1 1)')

