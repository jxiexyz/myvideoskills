# PuppetKit Master Template Handbook — Cara Pakai & Cara Improve Sendiri Semua Sistem

Dokumen ini adalah **panduan induk (master guide)** untuk seluruh template **PuppetKit Studio**. Semua sistem di proyek ini dirancang modular, deterministik, dan reusable supaya kamu bisa langsung pakai untuk produksi video, **sekaligus** bebas menambah karakter, gerakan, ekspresi, background 2.5D, motion graphics, preset kamera, aturan narasi, dan preset SFX kamu sendiri tanpa merusak engine utama.

---

## 1. Peta Lengkap Dokumentasi Markdown di `/docs/`

Selain panduan induk ini, setiap subsistem sudah memiliki dokumentasi teknis mendalam di folder `docs/`:

| File Dokumentasi | Isi & Kapan Harus Dibaca |
|---|---|
| `docs/MASTER_TEMPLATE_GUIDE.md` | **(File ini)** Peta menyeluruh, cara pakai 7 workspace, dan resep praktis cara bikin/upgrade sendiri semua template. |
| `docs/RIGGING.md` | Spesifikasi tulang (skeleton), hierarki parent-child, pivot, polygon mask, dan konvensi layer SVG karakter. |
| `docs/CHARACTER_LAB.md` | Cara kerja Character Lab, 5 channel animasi independen, dan kontrol live stage. |
| `docs/ANIMATION_CATALOG.md` | Daftar lengkap 45 motion bawaan (base, locomotion, head, gesture, reactions) + 7 combined presets. |
| `docs/EXPRESSION_CATALOG.md` | Daftar lengkap 16 ekspresi wajah, blinking non-destruktif, dan talking/viseme overlay. |
| `docs/MULTI_VIEW_SYSTEM.md` | Arsitektur 4 arah pandang (`front`, `back`, `top`, `bottom`) yang sinkron fase animasinya di tengah gerakan. |
| `docs/GAZE_PRESET.md` | Cara kerja pupil/eyelid dynamic gaze (`lookAt`) dan integrasinya dengan ekspresi. |
| `docs/WALK_PRESET.md` & `docs/SEATED_TEMPLATE.md` | Detail pose jalan dan duduk. |
| `docs/GENERIC_ASSET_PACK.md` | Cara pakai `minimal-starter` untuk prototyping karakter baru dari nol. |
| `docs/PRODUCTION_TOOLKIT.md` | Panduan 37 2.5D Environments, 52 Motion Graphics Popups, Effects, Transitions, dan Story Visual Director. |
| `docs/CINEMATIC_CAMERA_SYSTEM.md` | Panduan 66 Cinematic Camera Presets, 14 Transitions, 5 Multi-Layer Combinations, Subject Tracking, dan 9:16 Safe Frame. |
| `docs/NARRATIVE_ENGINE_AND_SFX_SYSTEM.md` | Arsitektur detail Narrative-Driven Video Logic Engine & 77 SFX Preset + Intelligent Sound Director. |
| `docs/ROADMAP.md` | Ide ekspansi jangka panjang (phoneme lip-sync, video render pipeline, pack tambahan). |

---

## 2. Cara Pakai Semua 7 Workspace di PuppetKit Studio

Jalankan dev server (`npm run dev`, port `3000`) lalu pilih tab di navigasi atas:

1. **`Character`** — Uji rig karakter (`Main Character` atau `Minimal Starter`), ganti 4 arah pandang (`Front / Back / Top / Bottom`) sambil animasi berjalan, gabungkan 5 channel animasi sekaligus (misal `Walk` + `Wave` + `Happy` + `Talk`), buka `4-View Sync`, `16-Expr Sheet`, dan `Rig Debug`.
2. **`Environments`** — Jelajahi 37 scene 2.5D (5 kategori), ubah color palette, lighting mood (`day / evening / dramatic / studio`), toggle 4 depth layers (`background / midground / interaction / foreground`), dan atur parallax.
3. **`Graphics`** — Uji 52 template motion graphics (kartu gaji, milestone `$1,000,000`, smartphone balance, spek mobil/jet, grafik pertumbuhan, stamp verdict, dll.), ubah teks/angka, warna tema, efek masuk/tahan/keluar, dan transisi.
4. **`Camera`** — Uji 66 preset kamera sinematik, 14 transisi, 5 kombinasi multi-tahap, subject targeting (`character`, `character_face`, `smartphone`, `sports_car`, `private_jet`, `mansion`, `financial_popup`), compare Static vs Cinematic, dan 9:16 Safe Frame.
5. **`Story`** — Preview timeline demo klasik untuk uji sinkronisasi environment + karakter + popup.
6. **`Narrative Lab`** — Tulis atau paste skrip narasi bebas (atau klik salah satu dari 6 preset uji kontras semantik seperti `Made $1M` vs `Lost $1M` vs `Owe $1M` vs `Wish for $1M` atau `Full 8-Beat Story`) lalu klik **`Generate Storyboard`**.
   - Klik beat mana saja di tab **`Storyboard`** untuk melompat ke momen emphasis-nya.
   - Klik tombol **`Edit`** pada beat mana saja untuk override ekspresi, gesture, gaze target, preset kamera, environment, atau isi popup secara manual.
   - Buka **`Timeline & Rules`** untuk melihat 5 jalur sinkron (`Narration`, `Acting`, `Popups`, `Camera`, `SFX`) beserta daftar aturan resolusi konflik yang otomatis dijalankan.
   - Buka **`Active Beat`** untuk inspeksi attention hierarchy (`Primary / Secondary / Supporting / Environment`).
   - Toggle 6 layer debug (`Character`, `Gaze`, `Popups`, `Camera`, `Backdrop`, `SFX`) atau klik **`PNG`** untuk ekspor frame komposit.
7. **`SFX Studio`** — Lihat hasil kurasi otomatis `SFXDirector` yang sudah tersinkron dengan storyboard aktif:
   - **`Timeline & Edit`**: Klik event SFX mana saja di 5 jalur timeline untuk edit preset, audio bus, start time, volume, pitch, playback rate, mute/solo, duplicate, atau delete. Cek **`Sound Design Audit & Restraint Log`** untuk melihat keputusan *intentional silence* dan suara yang sengaja dihilangkan demi anti-clutter.
   - **`Library (77)`**: Cari dari 77 preset di 8 kategori, preview waveform + bunyinya, klik `+` untuk masukkan ke timeline pada playhead aktif, atau buat dan simpan **Custom Preset** baru lewat form di bagian bawah.
   - **`Mixer & Combos`**: Atur volume/mute/solo 6 bus (`Voice / Narration`, `Music Bed`, `Primary SFX`, `Secondary & UI`, `Ambience`, `Transitions`), aktifkan **`Voice Duck: Auto`**, preview/edit/tambah 7 **Reusable SFX Combinations**, dan pantau laporan jujur 4 file WAV eksternal yang masih `missing_file`.
   - Klik **`Export WAV`** untuk merender seluruh mix timeline ke file audio `.wav` Stereo 16-bit PCM deterministik (lengkap dengan master soft limiter anti-clipping).

### Cara Pakai Lewat Kode (Programmatic API)

Semua modul inti diekspor bersih dari `src/index.js`:

```js
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator,
  SFXPresetRegistry,
  SFXDirector,
  SFXBusManager,
  renderSFXTimelineToWav,
} from './src/index.js';

// 1. Generate storyboard dari skrip teks atau array cue bertimestamp
const storyboard = NarrativeToVisualDirector.generateStoryboard(
  'Imagine making just $2,000 a month, but dreaming of becoming a millionaire.'
);

// 2. Override manual pada beat tertentu (immutable + auto conflict-check ulang)
const edited = NarrativeToVisualDirector.applyStoryboardOverride(storyboard, storyboard.events[0].id, {
  expression: 'determined',
  cameraTarget: 'financial_popup',
});

// 3. Evaluasi deterministik di timestamp t (detik)
const frame = NarrativeTimelineEvaluator.evaluateAt(edited, 2.4);

// 4. Generate rencana SFX & render WAV deterministik
const registry = new SFXPresetRegistry();
const sfxDirector = new SFXDirector(registry);
const sfxPlan = sfxDirector.directFromStoryboard(edited, { storyStyle: 'cinematic' });

const wav = renderSFXTimelineToWav({
  events: sfxPlan.events,
  ambienceTracks: sfxPlan.ambienceTracks,
  silenceCues: sfxPlan.silenceCues,
  totalDuration: sfxPlan.totalDuration,
  registry,
  busManager: new SFXBusManager(),
  sampleRate: 22050,
});
```

---

## 3. Cara Improve & Tambah Sendiri Semua Template (Step-by-Step)

Bagian ini berisi resep lengkap untuk memodifikasi atau menambahkan template baru pada **setiap** pilar PuppetKit.

---

### A. Menambah Karakter Baru & 4-View Artwork (`Front / Back / Top / Bottom`)

**Lokasi file:**
- Asset pack: `assets/characters/<id-karakter-baru>/`
- Referensi terdekat: duplikat `assets/characters/main-character/` (lengkap 4-view + 16 ekspresi) atau `assets/characters/minimal-starter/` (ringan untuk prototipe).
- Daftar pack di UI: `CHARACTER_PACKS` di `src/App.tsx`.

**Langkah-langkah:**
1. Salin folder `assets/characters/main-character/` menjadi `assets/characters/my-hero/`.
2. Pertahankan **nama part ID** di `manifest.json` agar 100% dari 45 motion & 16 ekspresi langsung bekerja tanpa ubah kode animasi:
   - Badan & anggota gerak: `body`, `torso`, `head`, `leftUpperArm`, `leftForearm`, `leftHand`, `rightUpperArm`, `rightForearm`, `rightHand`, `leftThigh`, `leftShin`, `leftFoot`, `rightThigh`, `rightShin`, `rightFoot`, `hairBack`, `hairFront`, `braidL`, `braidR`.
   - Layer ekspresi wajah: `eyes`, `eyes_happy`, `eyes_closed`, `eyes_surprised`, `eyes_scared`, `eyes_angry`, `eyes_sad`, `brows`, `brows_happy`, `brows_angry`, `brows_sad`, `brows_surprised`, `brows_worried`, `mouth`, `mouth_neutral`, `mouth_smile`, `mouth_open`, `mouth_small_o`, `mouth_frown`, `mouth_teeth`, `mouth_determined`, `blush`.
3. Ganti file `.svg` (atau `.png` transparan) untuk setiap part di folder `parts/` dan arah lain di `views/back/`, `views/top/`, `views/bottom/`.
4. Sesuaikan titik sendi (`pivot: [px, py]` dalam koordinat normalized `0..1` atau pixel sesuai manifest) dan `zIndex` di `manifest.json`.
5. Daftarkan pack baru di `CHARACTER_PACKS` pada `src/App.tsx`:
   ```ts
   'my-hero': {
     id: 'my-hero',
     label: 'My Hero Character',
     manifest: '/assets/characters/my-hero/manifest.json',
   }
   ```
6. Nyalakan **`Rig Debug`** di Character Lab untuk memverifikasi posisi pivot sendi dan pastikan semua 4 view sinkron saat `Walk` / `Wave`.

---

### B. Menambah Motion (Gerakan) Baru & Ekspresi Wajah Baru

#### 1. Tambah Motion Baru
**Lokasi file:**
- Channel definitions:
  - `src/animation/channels/body-motions.js` (channel `base` & reaksi seluruh tubuh seperti `recoil`, `surprisedReaction`, `laugh`, `bow`)
  - `src/animation/channels/locomotion-motions.js` (channel `locomotion`: `walk`, `run`, `jump`, `crouch`, dll.)
  - `src/animation/channels/head-motions.js` (channel `head`: `nod`, `shake`, `tiltLeft`, `lookRight`, dll.)
  - `src/animation/channels/gesture-motions.js` (channel `gesture`: `wave`, `pointRight`, `shrug`, `explain`, dll.)
- Registrasi katalog: `src/animation/catalog.js`
- Adaptasi multi-view (`back`, `top`, `bottom`): `src/animation/view-adapter.js`

**Contoh menambah gesture baru (`doubleThumbsPresent` atau `chestTap`) di `src/animation/channels/gesture-motions.js`:**
```js
chestTap: {
  id: 'chestTap',
  label: 'Chest Tap',
  channel: 'gesture',
  category: 'gesture',
  defaultLoop: false,
  duration: 0.9,
  description: 'Subtle confident tap toward chest for personal storytelling beats.',
  evaluate(t, duration) {
    const u = clamp(t / duration, 0, 1);
    const wave = Math.sin(u * Math.PI); // mulai 0 dan kembali tepat ke 0 (zero drift!)
    return {
      parts: {
        rightUpperArm: { rot: -26 * wave },
        rightForearm: { rot: -58 * wave },
        rightHand: { rot: -10 * wave },
        torso: { rot: -1.8 * wave },
      },
    };
  },
},
```
> **Penting:** Untuk motion looping, pastikan nilai di `u = 0` dan `u = 1` **identik** agar transisi loop mulus tanpa patah. Untuk motion one-shot, akhiri di `0` agar tidak menyisakan drift pada rest pose.

#### 2. Tambah Ekspresi Wajah Baru
**Lokasi file:**
- `src/animation/expression/expression-presets.js` (definisi preset `eyes`, `brows`, `mouth`, `blush`, `gazeProfile`, dan parameter `procedural`)
- `src/animation/expression/expression-controller.js` (logika talking mouth & viseme — jika ekspresi barumu bernuansa serius/negatif, tambahkan ID-nya ke `seriousExprs` di `_resolveActiveMouth` agar tidak memunculkan `mouth_smile` saat bicara!)
- `src/narrative/acting-popup-camera-directors.js` (mapping nada emosi narasi di `NARRATIVE_EXPRESSION_MAP`).

---

### C. Menambah 2.5D Environment Backdrop & Props Baru

**Lokasi file:**
- Katalog & spesifikasi 37 scene: `src/environment/templates.js`
- Builder props reusable (gedung, meja, mobil, pesawat, smartphone, pohon, dll.): `src/environment/props/`
- Palette & lighting mood: `src/environment/style-system.js`
- Composer 4-layer parallax: `src/environment/environment-composer.js`

**Arsitektur 4 Depth Layer (wajib dijaga agar parallax kamera terasa 2.5D):**
- `background` (`z ≈ -3.6` s/d `-2.2`): langit, jendela jauh, skyline, pegunungan.
- `midground` (`z ≈ -1.6` s/d `-0.8`): dinding ruangan, rak buku, mobil/jet hero, pepohonan menengah.
- `interaction` (`z ≈ -0.45` s/d `+0.1`): lantai, meja kerja, smartphone, titik berdiri karakter.
- `foreground` (`z ≈ +0.45` s/d `+0.9`): framing dedaunan/lampu/debu halus di tepi layar.

**Cara menambah environment baru (misal `podcast_studio`):**
1. Tambahkan entry baru di `ENVIRONMENT_TEMPLATES` (`src/environment/templates.js`) dengan `id`, `name`, `category`, `defaultPalette`, `defaultMood`, `description`, dan fungsi `build(ctx)`.
2. Di dalam `build(ctx)`, letakkan mesh ke `ctx.layers.background`, `ctx.layers.midground`, `ctx.layers.interaction`, `ctx.layers.foreground`.
3. Daftarkan anchor posisi objek penting ke `ctx.anchors` (misal `ctx.anchors.hero = { x: -0.7, y: 0, z: 0 }` dan `ctx.anchors.microphone = { x: 0.45, y: 0.12, z: -0.2 }`) supaya kamera (`SubjectTargetRegistry`) dan popup callout bisa menargetkannya secara otomatis!

---

### D. Menambah Motion Graphics Popup, Efek, & Color Theme Baru

**Lokasi file:**
- Daftar 52 template & theme warna: `src/motion-graphics/templates.js` (`MOTION_GRAPHIC_TEMPLATES`, `COLOR_THEMES`)
- Efek entrance/continuous/emphasis/exit & transisi: `src/motion-graphics/effects.js`
- Canvas 2D renderer: `src/motion-graphics/renderer.js`

**Cara menambah popup template baru:**
1. Tambahkan definisi template di `MOTION_GRAPHIC_TEMPLATES` (`src/motion-graphics/templates.js`):
   ```js
   {
     id: 'roi_multiplier_card',
     name: 'ROI Multiplier Card',
     category: 'money',
     layout: 'metricCard', // pakai layout renderer yang sudah ada atau buat layout baru di renderer.js
     defaultContent: '10X ROI',
     defaultSubtitle: 'COMPOUNDING RETURN',
     defaultTheme: 'emeraldWealth',
     defaultPosition: 'top_right',
     defaultEntrance: 'popScale',
     defaultContinuous: 'subtleFloat',
     defaultEmphasis: 'pulseGlow',
     defaultExit: 'fadeDown',
     duration: 3.8,
   }
   ```
2. Jika kamu ingin gaya gambar kartu yang benar-benar baru, tambahkan `case 'myCustomLayout':` di `src/motion-graphics/renderer.js` dengan tetap menghormati parameter `alpha`, `scale`, `offsetX/Y`, dan safe-zone margin agar tidak menabrak kepala karakter atau caption bawah.

---

### E. Menambah Cinematic Camera Preset, Transisi, & Kombinasi Baru

**Lokasi file:**
- 66 Camera presets: `src/camera/presets.js` (`CAMERA_PRESETS`, `evaluateCameraPreset`)
- 16 Camera effects & composition rules: `src/camera/compositions-and-effects.js`
- 14 Transitions & 5 Multi-layer combinations: `src/camera/transitions-and-combos.js`
- Target registry & framing solver: `src/camera/subject-tracker.js` (`SubjectTargetRegistry`)

**Cara menambah preset kamera baru di `src/camera/presets.js`:**
1. Tambahkan objek preset baru ke `CAMERA_PRESETS` (tentukan `id`, `name`, `category`, `defaultDuration`, `framing`, `motionProfile`, `effects`, `pacing`).
2. Pastikan rumus `evaluateCameraPreset` selalu **murni deterministik** (hanya bergantung pada `time`, `duration`, `intensity`, `startFrame`, `targetFrame`, tanpa state acak) dan semua angka keluaran (`x`, `y`, `viewHeight`, `fov`, `roll`, `orbitYaw`) selalu finite (`Number.isFinite`).
3. Jika menambah objek hero baru di scene (misal `yacht`), daftarkan default bounds & framing-nya di `SubjectTargetRegistry` (`src/camera/subject-tracker.js`) agar `SmartCameraHighlightDirector` dan `CharacterActingDirector` (gaze) langsung mengenalinya.

---

### F. Meng-improve Narrative-Driven Video Logic Engine

**Lokasi file:**
- Semantic analyzer & clause splitter: `src/narrative/beat-analyzer.js`
- 4 Coordinated directors (Acting, Popup, Camera, Background) + Hierarchy: `src/narrative/acting-popup-camera-directors.js`
- Conflict resolver, demo presets, storyboard generator & evaluator: `src/narrative/narrative-director.js`

**Cara menambah pemahaman skrip / intent baru (misal `crypto_crash` atau `real_estate_deal`):**
1. Tambahkan nama intent di `SEMANTIC_INTENTS` dan pola klasifikasi kontekstual (pakai word boundary `\b` agar tidak false-match substring!) di `classifyNarrativeSemantics()` pada `src/narrative/beat-analyzer.js`.
   - Selalu bedakan **konteks/polaritas** (misal untung vs rugi vs utang vs impian), bukan sekadar kata kunci angka.
2. Tambahkan `case '<intent_baru>':` di 4 director pada `src/narrative/acting-popup-camera-directors.js`:
   - `CharacterActingDirector.selectActing()` (ekspresi, kategori gesture, gaze target)
   - `SemanticPopupDirector.selectPopup()` (template popup, tema warna, durasi hold)
   - `SmartCameraHighlightDirector.selectCamera()` (preset kamera, transisi, priority)
   - `BackgroundResponseDirector.selectBackground()` (environment, palette, mood, ambienceContext)
3. Jika aturan baru punya potensi tabrakan (misal grafik berat pada beat sedih), tambahkan penjagaannya di `resolveStoryConflicts()` pada `src/narrative/narrative-director.js`.
4. Tambahkan 1-click test script di `SEMANTIC_CONTRAST_PRESETS` (`src/narrative/narrative-director.js`) agar bisa langsung diuji di UI **Narrative Lab**.

---

### G. Meng-improve SFX Preset Library, Sound Director, & Mengisi 4 File WAV Asli

**Lokasi file:**
- 77 Preset & 7 Kombinasi & Registry: `src/audio/sfx-presets.js`
- Procedural synth, 6-Bus Mixer, Seek-safe Scheduler & WAV Exporter: `src/audio/sfx-engine.js`
- Intelligent SFX Director & Validator: `src/audio/sfx-director.js`
- Manifest file audio eksternal: `assets/audio/sfx-manifest.json`

#### 1. Tambah Preset Procedural SFX Baru
1. Tambahkan entry di `BUILTIN_SFX_PRESETS` (`src/audio/sfx-presets.js`) dengan metadata lengkap (`id`, `name`, `category`, `bus`, `duration`, `defaultVolume`, `volumeRange`, `cooldown`, `intensity`, `tags`, `assetStatus: 'ready_procedural'`, dan `synth: { recipe: '...', ... }`).
2. Jika ingin karakter suara sintetis baru, tambahkan `case 'nama_resep_baru':` di `synthesizePresetSamples()` pada `src/audio/sfx-engine.js`. Fungsi ini bekerja di **both** live Web Audio playback **dan** offline Stereo 16-bit PCM WAV export!

#### 2. Mengisi 4 File WAV Eksternal yang Saat Ini `missing_file`
Saat ini 4 preset foley akustik jujur ditandai `missing_file` karena belum ada rekaman WAV asli di repo:
- `assets/audio/character/paper_rustle.wav` (`char_paper_rustle`)
- `assets/audio/objects/car_door_close.wav` (`obj_car_door_close`)
- `assets/audio/objects/engine_idle_rev.wav` (`obj_engine_idle_rev`)
- `assets/audio/environment/crowd_soft_loop.wav` (`env_crowd_soft`)

**Cara mengaktifkannya dengan file rekaman WAV milikmu:**
1. Letakkan file `.wav` (disarankan 44.1kHz/48kHz, normalized -3dB peak) di path persis sesuai daftar di atas (di bawah `public/assets/audio/...` atau `assets/audio/...` sesuai static serving Vite).
2. Di `assets/audio/sfx-manifest.json` dan `src/audio/sfx-presets.js`, ubah `assetStatus` dari `'missing_file'` menjadi `'ready_file'`.
3. Di `SFXPreviewController` & `renderSFXTimelineToWav` (`src/audio/sfx-engine.js`), tambahkan loader `fetch(preset.asset.path)` -> `audioCtx.decodeAudioData(arrayBuffer)` untuk preset bertipe `'ready_file'`, sehingga file rekaman aslimu langsung ikut terputar dan ikut ter-render saat `Export WAV`.

#### 3. Atur Selera Sound Design (`SFXDirector`)
- Ubah `importanceThreshold` (default `54`) atau bobot `scoreSoundCandidate()` di `src/audio/sfx-director.js` jika ingin gaya audio lebih minimalis (naikkan threshold ke `62–68`) atau lebih padat (turunkan ke `46–50`).
- Untuk cerita bergaya komedi ringan, panggil `director.directFromStoryboard(sb, { storyStyle: 'comedy' })` agar preset kategori `comedy` diizinkan masuk secara terkontrol.

---

## 4. Golden Rules & Checklist Verifikasi Setiap Kali Kamu Edit Template

Agar template tetap stabil, cepat, dan siap produksi setelah kamu modifikasi:

1. **Wajib Deterministik**: Jangan pernah pakai `Math.random()` atau `Date.now()` di dalam evaluator motion, camera, motion graphics, narrative director, maupun WAV renderer. Frame di detik `t` harus selalu identik saat di-scrub maju/mundur.
2. **Jangan Ganggu Backward Compatibility**: Pertahankan nama part rig standar dan struktur 5 channel animasi (`base`, `locomotion`, `head`, `gesture`, `face`).
3. **Jalankan Semua Unit Test (37 Tests)** setelah setiap perubahan logika:
   ```bash
   npx --yes tsx --test \
     tests/puppetkit.test.mjs \
     tests/multi-view.test.mjs \
     tests/production-toolkit.test.mjs \
     tests/camera-system.test.mjs \
     tests/narrative-and-sfx.test.mjs
   ```
4. **Jalankan Typecheck & Production Build**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Tambah Unit Test untuk Template Barumu**: Setiap kali menambah intent narasi baru, preset SFX, motion, atau environment, tambahkan 1 test kecil di file `tests/*.test.mjs` terkait agar regresi langsung ketahuan dalam < 1 detik.
