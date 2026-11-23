# MASTER TASK: BUILD A CINEMATIC CAMERA PRESET & MOVEMENT SYSTEM FOR PUPPETKIT

## PROJECT OBJECTIVE

Build a professional, reusable cinematic camera movement system for the existing PuppetKit storytelling engine using Three.js.

Eliminate static, flat-looking storytelling scenes through expressive camera movement, cinematic zooms, smooth transitions, dynamic reframing, subject tracking, and coordinated visual focus.

This must become a complete reusable camera preset library, not a collection of a few basic zoom animations. Support automatic camera direction based on narration, characters, highlighted objects, environment composition, and storytelling events.

**IMPORTANT: Preserve the existing PuppetKit architecture, Three.js rendering foundation, character rigs, animation controllers, timeline, background system, motion graphics, and export pipeline. Extend the existing camera architecture instead of rebuilding the application.**

---

# PART 1: CAMERA MOVEMENT LIBRARY

Build a complete library of reusable camera presets. Every preset needs a unique ID, visual purpose, configurable duration, start/end framing, easing, optional target subject, optional secondary movement, optional transition behavior, live preview, and deterministic timeline evaluation.

## A. ZOOM PRESETS
1. Cinematic Push In
2. Cinematic Pull Out
3. Slow Dramatic Zoom
4. Fast Punch Zoom
5. Snap Zoom In
6. Snap Zoom Out
7. Micro Zoom Emphasis
8. Progressive Zoom
9. Zoom Through
10. Zoom Reveal
11. Zoom Into Object
12. Zoom Into Character
13. Zoom Into Smartphone
14. Zoom Out Establishing Shot
15. Zoom With Overshoot
16. Elastic Zoom Settle

Each zoom must have distinct movement characteristics. Do not make every zoom a simple camera scale change. Where appropriate, combine zoom with target movement, camera position, framing, and depth.

## B. PAN AND TILT PRESETS
1. Smooth Pan Left
2. Smooth Pan Right
3. Fast Pan Left
4. Fast Pan Right
5. Cinematic Tilt Up
6. Cinematic Tilt Down
7. Diagonal Pan
8. Reveal Pan
9. Character-to-Object Pan
10. Object-to-Character Pan
11. Environmental Sweep
12. Wide Horizontal Reveal

Movement must be intentional and maintain visual composition.

## C. TRACKING PRESETS
1. Character Follow
2. Side Tracking
3. Forward Tracking
4. Backward Tracking
5. Object Tracking
6. Vehicle Tracking
7. Smartphone Tracking
8. Moving Subject Follow
9. Lead Tracking
10. Follow Behind
11. Reveal While Tracking
12. Tracking With Zoom

When a character walks, smoothly follow them. When a car enters, track the car instead of remaining fixed on the character. When the character points toward an object, follow the visual direction and reframe toward that object.

## D. ORBIT AND ROTATION PRESETS
1. Slow Orbit Left
2. Slow Orbit Right
3. Half Orbit
4. Quarter Orbit
5. Full Orbit
6. Hero Object Orbit
7. Character Reveal Orbit
8. Arc Shot
9. Dynamic Circular Reveal
10. Orbit With Push In

Use controlled movement. Avoid excessive perspective distortion or making the 2D character look unnatural. These presets must work with the existing 2.5D environment and object geometry.

## E. DYNAMIC CINEMATIC PRESETS
1. Whip Pan
2. Whip Zoom
3. Dolly Zoom
4. Crash Zoom
5. Snap Reframe
6. Fast Reveal
7. Camera Rush
8. Dramatic Pullback
9. Push Through Reveal
10. Parallax Sweep
11. Focused Object Reveal
12. Cinematic Hero Shot
13. Dynamic Establishing Shot
14. Impact Camera Shake
15. Controlled Handheld Movement
16. Slow Cinematic Drift

These are high-impact presets. Use selectively for important story moments.

---

# PART 2: CINEMATIC CAMERA TRANSITIONS

Build a reusable transition library:
- Smooth Reframe
- Whip Pan Transition
- Zoom Through Transition
- Snap Zoom Transition
- Match Position Transition
- Match Object Transition
- Dolly Transition
- Orbit Transition
- Directional Motion Blur Transition
- Parallax Transition
- Push-In to Pull-Out Transition
- Focus Shift Transition
- Fast Camera Sweep
- Cinematic Ease Transition

A transition must connect the previous shot and next shot.

Avoid sudden unintended camera jumps, random movement, abrupt framing changes, uncontrolled zoom, camera clipping through important objects, and unnecessary movement during dialogue.

Support seamless transitions between character close-up and wide scene, character and highlighted object, environment and character, smartphone and its screen, one object and another, and different environment compositions.

---

# PART 3: SMART SUBJECT TRACKING

Build a visual focus system that understands what the narration is talking about.

The camera must be able to focus on:
- Main character and secondary characters.
- Sports car, private jet, mansion.
- Smartphone and bank balance.
- Money graphics and popup graphics.
- Important environmental objects.
- Any registered visual target.

Each target needs a stable identifier and a defined position or bounding region.

## Example 1: Sports Car

Narration: "You finally buy your dream sports car."

Camera choreography:
1. Start with a medium shot of the character.
2. Character looks toward the car.
3. Character points toward the car.
4. Camera begins a fast but controlled whip pan.
5. Camera lands on the sports car.
6. Smooth push-in reveals the vehicle.
7. Hold the shot briefly.
8. Return to the character when narration changes.

## Example 2: Private Jet

Narration: "Then you get yourself a private jet."

Camera choreography:
1. Begin with the character.
2. Character gestures toward the aircraft.
3. Camera smoothly tracks toward the jet.
4. Reframe into a wide cinematic composition.
5. Slowly push closer to the aircraft.
6. Keep the object clearly visible.

## Example 3: Bank Balance

Narration: "Your bank account now has one million dollars."

Camera choreography:
1. Character holds a smartphone.
2. Camera tracks toward the phone.
3. Camera zooms into the screen.
4. Bank balance becomes the primary visual focus.
5. Animated balance graphics appear.
6. Camera holds the readable composition.
7. Pull back to reveal the character's reaction.

The subject being discussed should receive attention, not necessarily remain in the center of the screen.

---

# PART 4: CAMERA CHOREOGRAPHY DIRECTOR

Create an intelligent Camera Director that converts story events into camera actions.

It should consider narration text, current scene, character position, character gaze, character gesture, highlighted object, environment layout, popup position, visual importance, previous camera state, and upcoming camera movement.

Choose the most suitable preset based on context.

| Narration | Camera Action |
|---|---|
| "Imagine this..." | Slow cinematic push-in |
| "You buy a sports car." | Whip pan to car + push-in |
| "A private jet." | Wide reveal + slow tracking |
| "Look at your bank account." | Track to phone + zoom-in |
| "But here's the problem." | Dramatic push-in on character |
| "Everything changes." | Fast reframe + cinematic pullback |

These are examples, not fixed rules. Do not repeat the same preset continuously. Create variation while preserving visual consistency.

---

# PART 5: CAMERA COMPOSITION PRESETS

Build reusable composition presets.

## Character Framing
- Extreme Wide Shot
- Wide Shot
- Full Body Shot
- Medium Full Shot
- Medium Shot
- Medium Close-Up
- Close-Up
- Extreme Close-Up

## Object Framing
- Object Hero Shot
- Object Detail Shot
- Product Showcase
- Overhead Object Shot
- Three-Quarter Object Shot
- Wide Object Reveal

## Storytelling Composition
- Rule of Thirds
- Centered Hero Composition
- Left Subject Composition
- Right Subject Composition
- Character + Object Split Composition
- Foreground Framing
- Negative Space Composition
- Over-the-Shoulder Composition

Support composition-aware camera movement. Avoid placing captions, graphics, and subjects in conflicting positions. All framing must respect vertical 9:16 storytelling.

---

# PART 6: CAMERA DEPTH AND PARALLAX

Use the existing 2.5D environment system to reveal spatial depth.

Requirements:
- Foreground parallax.
- Midground parallax.
- Background parallax.
- Depth-aware camera movement.
- Layer-aware tracking.
- Smooth depth transitions.
- Controlled perspective.
- Optional subtle camera dolly.

Different environment layers must respond according to their depth. Do not move every layer by the same amount. Avoid exaggerated parallax that makes the scene look disconnected. The 2D character must remain visually integrated with the environment.

---

# PART 7: CINEMATIC CAMERA EFFECTS

Build optional reusable camera effects.

## Movement Effects
- Motion Blur
- Whip Pan Blur
- Camera Shake
- Micro Shake
- Smooth Drift
- Handheld Simulation
- Speed Ramp
- Motion Overshoot
- Camera Settle

## Visual Effects
- Subtle Vignette
- Focus Emphasis
- Depth of Field where supported
- Controlled Zoom Blur
- Directional Blur
- Impact Flash
- Cinematic Framing

Effects must be configurable and optional. Do not apply every effect to every shot. Keep effects consistent with the stylized 2D/2.5D cartoon art direction. Avoid photorealistic effects that clash with the visual world.

---

# PART 8: ADVANCED CAMERA PRESET COMBINATIONS

A single camera preset can combine multiple movement layers.

### Combination A: Sports Car Reveal
- Whip Pan.
- Controlled Motion Blur.
- Smooth Push-In.
- Small Orbit.
- Final Camera Settle.

### Combination B: Million Dollar Reveal
- Slow Push-In.
- Snap Zoom on the important number.
- Micro Camera Shake on impact.
- Smooth Pullback.

### Combination C: Private Jet Reveal
- Wide Establishing Shot.
- Horizontal Tracking.
- Slow Dolly-In.
- Slight Arc Movement.

### Combination D: Dramatic Realization
- Medium Character Shot.
- Slow Push-In.
- Micro Handheld Drift.
- Final Close-Up.

### Combination E: Smartphone Reveal
- Character Follow.
- Object Tracking.
- Zoom Into Screen.
- Focus Emphasis.
- Smooth Pullback.

These combinations must be reusable as named presets.

---

# PART 9: CAMERA TIMELINE AND CONFIGURATION

Integrate the camera system with the existing PuppetKit timeline.

Each camera event should support:
- Start time and end time.
- Preset ID and target ID.
- Start position and end position.
- Start framing and end framing.
- Easing and intensity.
- Zoom amount, pan amount, and rotation amount.
- Tracking behavior.
- Transition behavior.
- Optional effects.
- Priority.

Example configuration:

```js
{
  preset: "whip_pan_reveal",
  target: "sports_car",
  start: 4.0,
  duration: 1.2,
  intensity: 0.8,
  transition: "smooth_settle",
  effects: {
    motionBlur: true,
    cameraShake: false
  }
}
```

This is illustrative only. Adapt it to the actual project architecture.

Support multiple coordinated camera events. Prevent conflicting camera commands from fighting each other. Use priority and blending rules when camera events overlap.

---

# PART 10: CAMERA PRESET PREVIEW LAB

Build a dedicated Camera Preview Lab. I need to see every camera preset in action before using it in a story.

The preview lab must include:
1. Camera preset gallery.
2. Category filters.
3. Live animation preview.
4. Play and replay controls.
5. Adjustable duration.
6. Adjustable movement intensity.
7. Adjustable easing.
8. Target selection.
9. Composition selection.
10. Effect toggles.
11. Preset combination preview.
12. Before-and-after camera comparison.

Create a sample scene containing:
- Main character.
- Smartphone.
- Sports car.
- Private jet.
- Mansion.
- Financial popup.
- Multiple depth layers.

Use this scene to preview the camera system. Every preset must be demonstrated using actual camera movement, not a static screenshot. The preview must show the full movement from beginning to end.

---

# PART 11: TECHNICAL REQUIREMENTS

Use the existing Three.js camera and rendering architecture. Do not introduce a duplicate camera system.

Support:
- Timeline-based camera evaluation.
- Smooth interpolation.
- Easing functions.
- Camera target tracking.
- Composition constraints.
- Camera blending.
- Depth-aware movement.
- Deterministic rendering.

Avoid:
- Math.random() for camera animation.
- Date.now() for timeline progress.
- Frame-dependent accumulated movement.
- Uncontrolled animation loops.
- Sudden jumps caused by changing camera targets.
- Camera clipping through environment geometry.
- Unnecessary camera movement that makes viewers uncomfortable.

The same timestamp must always produce the same camera state. Camera preview and final video export must produce identical movement. Maintain stable framing and composition across different rendering resolutions.

---

# PART 12: QUALITY CONTROL

Test every preset individually.

For each preset:
1. Render the starting frame.
2. Render intermediate frames.
3. Render the ending frame.
4. Inspect movement continuity.
5. Inspect target alignment.
6. Inspect character proportions.
7. Inspect object visibility.
8. Inspect background depth.
9. Inspect caption-safe areas.
10. Verify deterministic playback.

Then test complete combinations.

Make sure:
- No camera jumps.
- No unexpected clipping.
- No excessive zoom.
- No distorted character.
- No unreadable objects.
- No conflicting camera events.
- No inconsistent preview/export behavior.
- No excessive motion sickness-inducing movement.

Do not declare the system complete just because the code compiles. Render and inspect actual previews.

---

# PART 13: REQUIRED DELIVERABLES

Build and deliver:
1. Complete Cinematic Camera Preset Library.
2. Zoom Preset Library.
3. Pan and Tilt Preset Library.
4. Tracking Preset Library.
5. Orbit Preset Library.
6. Dynamic Camera Movement Library.
7. Camera Transition Library.
8. Camera Composition Library.
9. Camera Effects Library.
10. Smart Subject Tracking System.
11. Narration-Driven Camera Director.
12. Camera Timeline Integration.
13. Camera Preset Combination System.
14. Camera Preview Lab.
15. Documentation and usage examples.
16. Working demonstration scene.
17. Actual rendered camera preview outputs.

---

# FINAL CREATIVE DIRECTION

The camera must become an active storytelling tool.

It should guide the viewer's eyes, reveal important objects, emphasize emotional moments, create scale, and make every scene feel alive.

Do not make the camera move constantly just to show off effects. Every movement must have a reason.

A sports car reveal should feel exciting. A private jet reveal should feel impressive. A bank balance reveal should feel focused and satisfying. A dramatic realization should feel intimate. A transition between scenes should feel smooth and intentional.

**Build a complete professional cinematic camera system with reusable presets, intelligent subject tracking, coordinated transitions, and a visual preview laboratory.**

Preserve the existing PuppetKit foundation and integrate everything into the current Three.js rendering pipeline.
