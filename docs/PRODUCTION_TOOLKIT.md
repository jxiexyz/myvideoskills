# PuppetKit Production Toolkit — 2.5D Environments, Motion Graphics & Story Director

PuppetKit now extends the multi-view 2D cutout character rig into a deterministic 2.5D storytelling toolkit with four integrated workspaces: **Character Lab**, **Environments**, **Motion Graphics**, and **Story Director**.

## 1. 2.5D Cartoon Environment & Background Library (37 Templates)

Located under `src/environment/`:

- **`style-system.js`** — `ENVIRONMENT_PALETTES` (6 coordinated cartoon palettes: `warmEditorial`, `sunlitDay`, `mintStudio`, `sunsetGold`, `emeraldFinance`, `twilightLuxury`), 3-step cel-shaded `MeshToonMaterial` + `#140e10` dark ink outline generator (`OutlineStyleSystem`), and 3-point stylized lighting (`StylizedLightingController`).
- **`props/primitives.js`** — Reusable multi-part outlined 2.5D cartoon assets (`buildRoomShell`, `buildWindow`, `buildDoor`, `buildPottedPlant`, `buildDeskWithMonitor`, `buildSofa`, `buildBed`, `buildBookshelf`, `buildLamp`, `buildTree`, `buildCloud`, `buildSportsCar`, `buildPrivateJet`, `buildCityBuilding`, `buildTableSet`, `buildPendantLamp`).
- **`props/smartphone.js`** — `CartoonSmartphoneAsset` featuring a rounded beveled chassis, side buttons, triple-lens rear camera island, and live deterministic `CanvasTexture` UI with an integrated **Dynamic Island** supporting 7 states (`compact`, `incoming_message`, `incoming_call`, `music_playback`, `payment_confirmation`, `financial_alert`, `notification_collapse`).
- **`templates.js`** — All **37 environments** across 5 categories:
  1. **Home & Interior (8)**: `bedroom_cozy`, `living_room_warm`, `kitchen_modern`, `home_office`, `apartment_balcony`, `study_library`, `minimalist_studio`, `hallway_entry`
  2. **Business & Work (7)**: `modern_office`, `startup_workspace`, `conference_room`, `ceo_executive_office`, `coworking_lounge`, `podcast_studio`, `coffee_shop_work`
  3. **City & Outdoor (8)**: `city_street_day`, `downtown_skyline`, `park_walkway`, `suburban_neighborhood`, `rooftop_terrace`, `beach_boardwalk`, `night_city_avenue`, `campus_plaza`
  4. **Finance & Tech (6)**: `trading_desk`, `bank_lobby`, `vault_wealth_room`, `fintech_hub`, `smartphone_hero_stage`, `data_presentation_stage`
  5. **Luxury & Aspirational (8)**: `luxury_driveway`, `airport_hangar`, `penthouse_interior`, `luxury_mansion_exterior`, `yacht_marina`, `private_garage`, `first_class_lounge`, `resort_infinity_pool`
- **`environment-composer.js`** — `EnvironmentComposer` (manages 4 depth layers: `background`, `midground`, `interaction`, `foreground`, anchors, disposal), `EnvironmentAnimationController` (pure `timeSec` evaluation), and `SceneCompositionDirector` (8 composition presets).

## 2. Deterministic Motion Graphics & Effects System (52 Templates)

Located under `src/motion-graphics/` and `src/audio/`:

- **`effects.js`** — Pure timestamp evaluators for **12 Entrance**, **10 Impact**, **10 Continuous**, and **8 Exit** effects plus **10 Graphic Transitions**.
- **`templates.js`** — **52 templates** across Typography (12), Info Graphics & Lists (12), Financial & Money (12), Object-Connected Callouts (6), and Smartphone & Dynamic Island Alerts (10), with 6 curated themes and `createMotionGraphicConfig(templateId, overrides)`.
- **`renderer.js`** — High-DPI `MotionGraphicsRenderer` composited cleanly over the Three.js stage and linked via `PuppetEngine.worldToScreen(anchor)` for 3D-tracked callout pointers.
- **`sound-events.js`** — Procedural Web Audio `SoundEventController` supporting 10 storytelling cue categories (`soft_pop`, `deep_impact`, `whoosh`, `swipe`, `mechanical_click`, `cash_counter`, `notification_chime`, `digital_confirm`, `subtle_sparkle`, `cinematic_hit`).

## 3. Story Visual Director & Camera Choreography

Located in `src/director/story-director.js`:

- **`CameraChoreographyController`** — Deterministic pan, dolly, 2.5D perspective parallax, and brief impact shake driven purely by `localTime`.
- **`NarrationVisualMapper`** — Semantic sentence mapper translating narration beats (`$2,000/month`, `$1,000,000`, `$83,333/month`, sports car, private jet, nine zeros smartphone bank account) into coordinated environments, character acting, camera moves, motion graphics, and sound cues.
- **`StoryVisualDirector`** — Drives the 6-beat deterministic demonstration story (*"From $2,000/mo to Nine Zeros"*) and supports arbitrary timestamp seeking and composite PNG frame export.
