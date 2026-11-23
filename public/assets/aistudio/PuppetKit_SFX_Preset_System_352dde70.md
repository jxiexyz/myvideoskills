# PUPPETKIT: SFX PRESET LIBRARY & INTELLIGENT SOUND DESIGN SYSTEM

## MASTER TASK FOR THE AI AGENT

Upgrade the existing PuppetKit project by building a complete, reusable
**Sound Effects (SFX) Preset System** for animated storytelling videos.

The goal is not simply to add a folder of sound files. Build a practical
sound-design workflow where the system can choose, trigger, layer, time,
mix, preview, and reuse sound effects according to the narration,
character actions, visual events, camera movement, popup behavior, and
emotional tone of each story.

**The narration and actual on-screen events are the source of truth.**
SFX must support what the audience sees and hears. Never add sounds just
because a preset exists.

------------------------------------------------------------------------

## 1. FIRST: INSPECT THE EXISTING PROJECT

Before changing code, inspect the current PuppetKit architecture and
identify:

-   Audio playback and rendering implementation.
-   Narration / voice-over loading and timeline system.
-   Character animation and gesture event system.
-   Popup, graphic, and visual event system.
-   Camera preset and camera event system.
-   Timeline, scene, and storyboard data structures.
-   Existing assets, audio formats, asset manifests, and path
    conventions.
-   Preview and final video rendering pipeline.

Read the relevant documentation and source files before implementation.
Reuse existing systems and conventions wherever possible.

Do not rebuild the renderer, timeline, or audio engine if they already
exist. Do not replace working systems with a parallel architecture.
Integrate the SFX system cleanly into the current Three.js-based
PuppetKit project.

If an expected subsystem does not exist, document the gap and implement
the smallest compatible solution.

------------------------------------------------------------------------

## 2. CORE OBJECTIVE

Create a reusable SFX library and an intelligent SFX Director that can:

1.  Detect meaningful events in narration and the visual timeline.
2.  Select suitable SFX presets based on event meaning and context.
3.  Trigger sounds at the correct moment.
4.  Synchronize SFX with character actions, object interactions, popups,
    camera movements, and transitions.
5.  Layer multiple sounds without creating audio clutter.
6.  Control volume, pitch, playback rate, fades, panning, and duration.
7.  Preview and edit SFX directly in the PuppetKit workflow.
8.  Export consistent audio in the final video render.

The system must work for different stories, not only one sample video.

------------------------------------------------------------------------

## 3. SFX PRESET CATEGORIES

Create a categorized, searchable preset library. Each preset must have a
clear purpose, suitable use cases, timing guidance, and mixing defaults.

### A. Character & Acting

For character movement and performance:

-   Light footsteps
-   Heavy footsteps
-   Running footsteps
-   Small body movement / cloth rustle
-   Hand movement / gesture accent
-   Head turn accent
-   Surprise reaction
-   Confused reaction
-   Thinking / pondering
-   Nervous movement
-   Sigh
-   Small gasp
-   Soft laugh
-   Dramatic laugh
-   Cry / emotional reaction
-   Impact reaction
-   Character entrance accent
-   Character exit accent

Avoid adding a sound to every tiny movement. Use accents only when they
improve readability or comedic/emotional timing.

### B. UI, Popup & Information Graphics

For modern visual elements:

-   Popup appear
-   Popup dismiss
-   Card slide-in
-   Card slide-out
-   Notification ping
-   Toggle on / off
-   Button click
-   Button confirm
-   Error / warning
-   Success confirmation
-   Number count-up accent
-   Chart reveal
-   Progress bar completion
-   Data highlight
-   Info reveal
-   Text emphasis

UI sounds should feel modern, clean, subtle, and premium. Avoid outdated
computer beeps, cheap arcade sounds, or excessive notification spam.

### C. Camera & Transition

For camera language:

-   Soft whoosh
-   Fast whoosh
-   Cinematic sweep
-   Whip-pan accent
-   Zoom-in accent
-   Zoom-out accent
-   Focus / attention accent
-   Scene transition
-   Impact transition
-   Subtle riser
-   Reverse swell
-   Short stinger

Camera SFX must match the speed and intensity of the movement. A gentle
camera push-in should not use an aggressive action-movie whoosh.

### D. Object & Interaction

For physical objects and visible interactions:

-   Object pickup
-   Object drop
-   Object place / set down
-   Paper movement
-   Page flip
-   Keyboard typing
-   Mouse click
-   Phone tap
-   Phone notification
-   Phone unlock
-   Door open / close
-   Drawer open / close
-   Coin drop
-   Cash handling
-   Wallet open
-   Bag movement
-   Vehicle start
-   Engine idle / rev
-   Vehicle pass-by
-   Object impact

Use sounds that match the visible object and action. Do not trigger a
cash sound merely because narration mentions money if no money-related
visual event occurs. In that case, use a subtle information accent only
if needed.

### E. Finance, Business & Numbers

For financial storytelling:

-   Cash register subtle
-   Coin sparkle
-   Money count
-   Transaction confirmation
-   Payment success
-   Payment failure
-   Chart rise accent
-   Chart drop accent
-   Profit reveal
-   Loss reveal
-   Balance reveal
-   Investment / asset reveal
-   Calculator tap
-   Market tension pulse
-   Risk warning
-   Milestone achieved

Keep financial SFX tasteful. Avoid cartoonish cash sounds unless the
visual style intentionally calls for comedy.

### F. Emotional & Storytelling

For narrative mood:

-   Curiosity cue
-   Suspense bed
-   Tension pulse
-   Dramatic reveal
-   Shock accent
-   Relief
-   Hopeful lift
-   Sad emotional accent
-   Awkward silence accent
-   Comedy sting
-   Unexpected twist
-   Achievement / triumph
-   Failure / disappointment
-   Gentle ending cue

Use emotional sounds selectively. Do not let SFX dictate the emotion
when the narration and music communicate something different.

### G. Environment & Ambience

For background atmosphere:

-   Room tone
-   Office ambience
-   City ambience
-   Street ambience
-   Cafe ambience
-   Rain ambience
-   Wind ambience
-   Indoor crowd murmur
-   Outdoor birds
-   Traffic bed
-   Vehicle cabin ambience

Ambience should be continuous only when the scene needs it. Support
seamless loops, loop crossfades, and scene-based ambience changes.

### H. Comedy & Exaggeration

For intentional comedic timing:

-   Boing
-   Pop
-   Cartoon impact
-   Record scratch
-   Tiny fail cue
-   Comedic reveal
-   Awkward pause cue
-   Spring bounce
-   Quick slide whistle
-   Exaggerated thud

Keep these in a separate style category so they are not accidentally
used in serious or cinematic stories.

------------------------------------------------------------------------

## 4. PRESET DESIGN: EVERY PRESET NEEDS METADATA

Do not create presets as unnamed audio files with hardcoded behavior.
Every preset must have structured metadata.

Each preset should define fields equivalent to:

-   `id`: stable unique identifier.
-   `name`: readable preset name.
-   `category`: main category.
-   `tags`: semantic search tags.
-   `description`: what the sound communicates.
-   `asset`: audio asset reference or supported generated-asset
    reference.
-   `duration`: actual or declared duration when known.
-   `defaultVolume`: default gain.
-   `volumeRange`: safe editable range.
-   `pitch`: default pitch multiplier or pitch setting.
-   `playbackRate`: default playback rate.
-   `fadeIn`: default fade-in duration.
-   `fadeOut`: default fade-out duration.
-   `cooldown`: minimum interval before the same accent can repeat.
-   `priority`: relative importance.
-   `intensity`: subtle, medium, strong.
-   `mood`: emotional tags.
-   `contextTags`: suitable visual or narrative contexts.
-   `avoidTags`: contexts where it should not be used.
-   `loopable`: whether looping is supported.
-   `defaultSpatialMode`: 2D or spatial / positional where supported.
-   `license/source`: provenance and usage rights.
-   `notes`: implementation or mixing notes.

Use the project's existing data conventions if they differ. The fields
above describe the required capabilities, not a demand to force a
specific schema.

Missing audio assets must be clearly marked. Never silently reference
nonexistent files.

------------------------------------------------------------------------

## 5. INTELLIGENT SFX DIRECTOR

Build an SFX Director that converts story events into sound decisions.

It should receive structured events from the existing narrative and
timeline systems, for example:

-   Character performs a surprised gesture.
-   Character starts running.
-   A popup appears with a financial balance.
-   A phone notification appears.
-   A car becomes the camera focus.
-   A chart rises.
-   A number count-up completes.
-   A scene changes from an office to a street.
-   Narration reveals a major twist.

For each event, decide:

1.  Is a sound actually needed?
2.  What is the primary sound category?
3.  Which preset best matches the event?
4.  At what exact time should it start?
5.  Should it be a one-shot, loop, or layered sound?
6.  What volume and intensity are appropriate?
7.  Does it conflict with narration or music?
8.  Should it be spatially positioned?
9.  Is there already another sound communicating the same information?
10. Should the sound be omitted?

### Semantic matching

Use event meaning, not just keyword matching.

Examples:

-   Narration: "He opened his phone and checked the balance."
    -   If the phone is visibly opened: use a subtle phone interaction
        sound.
    -   When the balance UI appears: use a clean data reveal accent.
    -   Do not automatically play cash, coin, and notification sounds
        together.
-   Narration: "Then he bought a sports car."
    -   If a car visual enters: use a suitable reveal or vehicle accent.
    -   If the camera tracks toward the car: optionally use a matching
        soft camera whoosh.
    -   Do not use an engine rev unless the vehicle visibly starts or
        accelerates.
-   Narration: "But everything disappeared."
    -   Use a restrained tension or loss accent at the reveal.
    -   Avoid stacking multiple dramatic impacts.
-   Narration: "She tapped confirm."
    -   Trigger a button confirmation only if the visual shows a tap or
        confirmation interaction.

### Importance scoring

Give each potential sound event an importance score based on:

-   Narrative importance.
-   Visual prominence.
-   Emotional relevance.
-   Action intensity.
-   Timing opportunity.
-   Audio density at that moment.

Only trigger sounds that pass the system's threshold. The system must be
comfortable with silence.

------------------------------------------------------------------------

## 6. HOW SFX SHOULD BE USED

Implement clear usage rules so the agent and editor know when to use
each sound.

### Rule 1: Sound must have a reason

Every SFX event must be linked to a meaningful visual or narrative
event. No random sound decoration.

### Rule 2: Match the visible action

If a character taps a phone, use a phone tap. If a popup appears, use a
popup accent. If a car drives past, use a vehicle pass-by. Do not
mismatch sound and visuals.

### Rule 3: Match intensity

-   Small movement: subtle sound or silence.
-   Normal interaction: light accent.
-   Important reveal: stronger accent if justified.
-   Major twist: controlled dramatic sound.
-   Emotional dialogue: preserve space for the voice.

### Rule 4: Do not overuse

-   Do not play SFX for every word.
-   Do not play a sound for every character movement.
-   Do not stack multiple presets that communicate the same thing.
-   Apply cooldowns to repetitive sounds.
-   Prefer one strong, well-timed sound over several weak, overlapping
    sounds.

### Rule 5: Protect narration clarity

Voice-over is the primary audio layer. SFX must never make narration
difficult to understand.

### Rule 6: Music and SFX must cooperate

Music establishes the emotional bed. SFX punctuate actions and story
beats. Avoid using a dramatic riser when the music already has a strong
riser at the same moment.

### Rule 7: Use silence intentionally

Silence or reduced ambience can make a reveal, pause, joke, or emotional
line more powerful. Include an explicit `silence` or `duck` action where
useful.

------------------------------------------------------------------------

## 7. TIMING & SYNCHRONIZATION

SFX must be synchronized to actual visual events, not merely placed at
arbitrary timestamps.

Support:

-   Timeline timestamp triggers.
-   Character animation event triggers.
-   Gesture start / impact / completion triggers.
-   Popup entrance and exit triggers.
-   Camera movement start / peak / completion triggers.
-   Object interaction triggers.
-   Scene transition triggers.
-   Narration phrase or word timestamp triggers when reliable timing
    data exists.
-   Delayed triggers for anticipation or comedic timing.
-   Offset and duration adjustment.

### Timing examples

-   Button tap: align with the visible contact frame.
-   Popup appear: align with the moment it becomes visible, not several
    frames later.
-   Number count-up: use a soft accent at the start or completion, not
    on every digit.
-   Camera whip-pan: align the whoosh with the main movement.
-   Dramatic reveal: place the accent at the reveal, with optional short
    pre-riser.
-   Footsteps: align to foot contact, not animation start.

If exact audio timestamps are unavailable, use the closest reliable
timeline event and expose a manual offset control.

------------------------------------------------------------------------

## 8. LAYERING & AUDIO MIXING

Create a predictable mixing system with separate logical buses:

-   `voice`: narration and dialogue.
-   `music`: background music.
-   `sfx_primary`: important one-shot effects.
-   `sfx_secondary`: small accents and UI sounds.
-   `ambience`: environmental beds.
-   `transition`: whooshes, risers, and stingers.

Use the existing audio engine where possible.

### Mixing behavior

-   Voice must remain intelligible and dominant.
-   Automatically reduce conflicting SFX when narration is active.
-   Support music ducking under important narration or SFX events.
-   Support per-bus volume.
-   Support per-event volume.
-   Support fades and crossfades.
-   Prevent clipping and unexpected gain spikes.
-   Avoid excessive low-frequency buildup from overlapping impacts.
-   Avoid harsh high-frequency notification sounds.
-   Normalize or manage source loudness consistently where possible.
-   Preserve headroom in the final mix.

Expose practical controls rather than dozens of confusing technical
sliders.

### Suggested starting hierarchy

These are starting points only. Calibrate them against the actual voice
and music assets:

-   Voice: primary reference level.
-   Music: clearly below voice.
-   Primary SFX: audible but brief, never masking words.
-   Secondary SFX: subtle accents.
-   Ambience: low and unobtrusive.
-   Transition SFX: brief, controlled peaks.

Do not hardcode one loudness value for every project. Provide sensible
defaults and let the editor adjust them.

------------------------------------------------------------------------

## 9. SFX PRESET COMBINATIONS

Support reusable combinations for common events, but do not force every
combination to play all layers.

Examples:

### Popup Reveal

-   Soft UI appear.
-   Optional tiny emphasis accent.
-   No extra sound if the popup is already part of a busy sequence.

### Major Object Reveal

-   Short cinematic whoosh.
-   Optional low-impact accent at the reveal.
-   Optional ambience shift if the scene changes.

### Character Surprise

-   Character reaction sound only if appropriate.
-   Optional subtle impact accent.
-   Avoid combining gasp, boing, and dramatic hit by default.

### Phone Interaction

-   Phone tap at contact.
-   Optional unlock sound.
-   Notification sound only if a notification is actually shown.

### Financial Balance Reveal

-   Soft data reveal.
-   Optional short count-up accent.
-   Stronger reveal accent only for a major story beat.

### Camera Whip-Pan

-   Short whoosh aligned with the movement.
-   Do not add another transition sound if the scene transition already
    has one.

### Scene Change

-   Optional transition whoosh.
-   Ambience crossfade.
-   Music continues unless the story explicitly requires a change.

Each combination must be editable, reusable, and capable of disabling
individual layers.

------------------------------------------------------------------------

## 10. SFX EDITOR / PRESET LIBRARY UI

Build a usable SFX workspace that fits the existing PuppetKit interface.

Required features:

-   Search by preset name, category, tags, and use case.
-   Filter by category, mood, intensity, and duration.
-   Preview individual sounds.
-   Preview combinations.
-   Show waveform or a clear audio duration representation if supported.
-   Add a preset to the timeline.
-   Replace an existing SFX event.
-   Adjust start time and duration.
-   Adjust volume, pitch, playback rate, fade-in, and fade-out.
-   Mute, solo, duplicate, and delete an event.
-   Assign an event to a bus.
-   Show which visual/story event triggered the sound.
-   Show warnings for overlapping or conflicting sounds.
-   Mark missing or invalid audio assets.
-   Save custom presets and combinations.
-   Reset a preset to its default values.

### Timeline visualization

Represent audio events clearly:

-   Different visual lanes for voice, music, SFX, ambience, and
    transitions.
-   Event labels with preset names.
-   Duration bars for loops and long sounds.
-   Small markers for one-shot accents.
-   Visual indication of muted and disabled events.
-   Clear overlap indication.
-   Scrubbing and playback preview synchronized with the animation.

Do not make the UI look like an outdated generic audio editor. Follow
the current PuppetKit visual design system.

------------------------------------------------------------------------

## 11. AUDIO ASSET MANAGEMENT

Create a clean asset structure consistent with the project. A possible
organization is:

``` text
assets/
  audio/
    sfx/
      character/
      ui/
      camera/
      objects/
      finance/
      emotional/
      environment/
      comedy/
    music/
    ambience/
    voice/
```

This is a suggested structure only. Reuse the project's current
conventions if they already exist.

Requirements:

-   Support the audio formats already supported by the renderer.
-   Validate file paths and asset existence.
-   Keep preset metadata separate from raw audio assets.
-   Avoid duplicate copies of the same audio file.
-   Provide a manifest or index for searchable presets.
-   Record asset provenance and license information.
-   Do not download or include copyrighted sounds without valid usage
    rights.
-   Do not fabricate audio files or pretend a missing file exists.
-   If the project has no usable SFX assets, build the library structure
    and clearly identify which presets need assets.

------------------------------------------------------------------------

## 12. TECHNICAL IMPLEMENTATION

Use the existing Three.js and project audio architecture. The SFX system
should be modular and deterministic.

Possible logical modules, adapted to existing naming conventions:

-   `SFXPresetRegistry`
-   `SFXAssetManager`
-   `SFXDirector`
-   `SFXEventScheduler`
-   `SFXMixer`
-   `SFXBusManager`
-   `SFXTimelineTrack`
-   `SFXPreviewController`
-   `SFXValidator`

Do not create duplicate modules if equivalent functionality already
exists.

### Required behavior

-   Deterministic event scheduling for repeatable renders.
-   Stable preset IDs.
-   Stable event IDs.
-   Correct cleanup of audio sources after playback.
-   No duplicate trigger caused by rerendering or timeline scrubbing.
-   Correct behavior when seeking backward or forward.
-   Correct behavior when an event is disabled or muted.
-   Correct loop start and stop behavior.
-   No memory leaks from repeated preview playback.
-   No audio playback before the user starts preview, where browser
    autoplay restrictions apply.
-   Graceful handling of missing assets and decode failures.
-   Consistent output between preview and final render.

If the renderer uses a different audio implementation, adapt the
architecture instead of forcing a new one.

------------------------------------------------------------------------

## 13. NARRATION & VISUAL EVENT INTEGRATION

Connect the SFX Director to the existing Narrative-Driven Video Logic
Engine.

The event pipeline should conceptually work like this:

``` text
Narration + Storyboard
        |
        v
Narrative / Semantic Analysis
        |
        v
Story Beat + Visual Event Detection
        |
        v
Character / Popup / Object / Camera Events
        |
        v
SFX Director
        |
        v
Preset Selection + Timing + Mixing Rules
        |
        v
SFX Timeline Events
        |
        v
Preview + Final Render
```

Every generated SFX event should retain its source reference:

-   Narration phrase or story beat.
-   Visual event ID.
-   Character, object, popup, or camera target when applicable.
-   Selected preset ID.
-   Trigger timestamp.
-   Reason for choosing the sound.
-   Confidence or importance score.
-   Any manual override made by the editor.

This makes the system explainable and editable.

------------------------------------------------------------------------

## 14. PREVIEW & QUALITY CONTROL

Do not consider the feature complete merely because the code compiles.

Create a test scene that demonstrates:

1.  Character walking with correctly timed footsteps.
2.  Character reacting with a subtle reaction sound.
3.  Popup appearing with a modern UI accent.
4.  Phone tap aligned to the visible interaction.
5.  Financial balance reveal with a restrained data accent.
6.  Camera tracking a car with a matching whoosh.
7.  Dramatic reveal with controlled impact.
8.  Scene ambience crossfade.
9.  Voice-over remaining clear while SFX and music play.
10. Silence being preserved when no sound is needed.

### Validate

-   Every preset points to a valid asset or is explicitly marked as
    missing.
-   SFX triggers at the correct timeline time.
-   No duplicated playback after seeking or replaying.
-   No unwanted sound overlap.
-   No clipped or distorted audio.
-   Narration remains intelligible.
-   Music and ambience do not jump abruptly.
-   Loops do not click at their boundaries.
-   SFX timing matches visible contact and reveal moments.
-   Preview and exported render sound consistent.

Render and listen to an actual sample. Inspect the timeline and final
output. Fix issues found during validation.

------------------------------------------------------------------------

## 15. DELIVERABLES

Provide:

1.  Complete SFX preset library structure.
2.  Preset metadata schema and registry.
3.  SFX Director and semantic selection logic.
4.  Timeline integration.
5.  Audio bus and mixing behavior.
6.  SFX preview and editing UI.
7.  Asset validation and missing-asset reporting.
8.  Reusable SFX combinations.
9.  Sample scene with synchronized narration, animation, camera, popup,
    and SFX.
10. Documentation explaining how to add, edit, preview, and use presets.
11. A report listing changed files, reused systems, missing assets,
    known limitations, and validation results.

Do not claim that a preset is ready if its audio asset is missing.

------------------------------------------------------------------------

## 16. FINAL ACCEPTANCE CRITERIA

The implementation is successful only when:

-   The SFX library is organized and searchable.
-   Presets have meaningful metadata and safe defaults.
-   The system can choose SFX based on story and visual context.
-   SFX timing follows actual animation and visual events.
-   Camera, popup, character, and object events can trigger relevant
    sounds.
-   The system avoids unnecessary and repetitive sound effects.
-   Voice-over remains the most important audio layer.
-   The editor can manually adjust every generated SFX event.
-   The same timeline produces consistent results across repeated
    renders.
-   A real sample video has been rendered and audio-checked.

## FINAL CREATIVE DIRECTION

Make PuppetKit sound intentional, polished, and alive.

SFX should make an action feel physical, a popup feel responsive, a
reveal feel important, a camera move feel connected, and a character
feel expressive.

But restraint is part of good sound design. **Do not fill every empty
moment with noise.** Choose the right sound, at the right time, at the
right intensity. When no sound improves the scene, use silence.

Build this as a reusable system for every future PuppetKit story, not a
collection of one-off sound effects.
