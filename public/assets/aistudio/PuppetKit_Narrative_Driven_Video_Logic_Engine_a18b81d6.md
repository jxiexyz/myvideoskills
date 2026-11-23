# MASTER TASK: BUILD THE NARRATIVE-DRIVEN VIDEO LOGIC ENGINE FOR PUPPETKIT

## 1. PROJECT OBJECTIVE

Build a complete Narrative-Driven Animation and Visual Direction System for the existing PuppetKit storytelling engine using Three.js.

The objective is to make every visual element respond intelligently to the meaning and timing of the narrator's speech.

The character's body movements, facial expressions, gestures, popup graphics, visual elements, background interactions, and camera movements must all work together as one coordinated storytelling system.

**The narration must drive the entire visual experience.**

When the narrator talks about money, the relevant money visual should appear.

When the narrator mentions a sports car, the camera should highlight the sports car.

When the narrator expresses excitement, the character should react with an appropriate expression and gesture.

When the narrator introduces a problem, the visual mood, character acting, popup design, and camera composition should reflect that change.

Do not create disconnected animations.

Do not randomly display popups.

Do not use repetitive character movements.

Do not move the camera without a storytelling reason.

Build an intelligent system that understands WHAT is being said, WHAT it means, WHAT should appear, and HOW every visual element should react.

IMPORTANT:
- Preserve the existing PuppetKit architecture.
- Continue using Three.js.
- Reuse existing character rigs, expressions, gestures, background templates, popup templates, and camera presets.
- Integrate with the existing timeline and rendering pipeline.
- Do not rebuild or replace existing systems unnecessarily.
- Inspect the existing implementation before modifying it.

---

# 2. CORE SYSTEM: NARRATIVE-TO-VISUAL DIRECTOR

Create a central system called Narrative-to-Visual Director.

This system acts as the brain of the entire storytelling engine.

Its job is to analyze the narration and generate coordinated visual instructions.

For every narration segment, it must determine:

1. What is the narrator talking about?
2. What is the emotional tone?
3. What is the intended meaning?
4. Which character should react?
5. What facial expression is appropriate?
6. What body movement or gesture is appropriate?
7. Which visual objects should appear?
8. Which popup or motion graphic should be displayed?
9. Which background or environmental elements should change?
10. Which camera target should receive attention?
11. What camera movement should be used?
12. When should each animation start and finish?

All these decisions must be coordinated through one shared story timeline.

The system must understand semantic meaning, not simply match individual keywords.

For example, the word "money" does not always mean a positive financial situation.

Compare:

- "You just made one million dollars."
- "You lost one million dollars."
- "You owe one million dollars."
- "You wish you had one million dollars."

All four mention money, but they require completely different expressions, graphics, and camera choreography.

The system must understand the context.

---

# 3. NARRATION ANALYSIS AND STORY BEAT DETECTION

Before generating animations, divide the narration into meaningful visual beats.

Do not divide the narration only by sentence length.

Identify semantic units such as:

- Hook.
- Introduction.
- Question.
- Explanation.
- Financial information.
- Character decision.
- Important object reveal.
- Emotional reaction.
- Conflict.
- Unexpected twist.
- Consequence.
- Conclusion.
- Audience engagement question.

Each beat should have a clear visual purpose.

Example narration:

"Imagine making just $2,000 a month, but dreaming of becoming a millionaire."

The system should identify multiple beats:

### Beat A: "$2,000 a month"
Meaning: Limited monthly income.

Visual direction:
- Character looks at a smartphone.
- A monthly salary card appears.
- "$2,000 / MONTH" is displayed.
- Camera tracks toward the salary graphic.

### Beat B: "Dreaming of becoming a millionaire"
Meaning: Ambition and a financial goal.

Visual direction:
- Character looks upward with an ambitious expression.
- A million-dollar target appears.
- Financial progress graphics animate.
- Camera moves from the salary card toward the $1M target.

These beats should feel connected rather than like separate presentations.

---

# 4. CHARACTER ACTING DIRECTOR

Build a system that automatically selects character expressions and movements based on narration meaning.

Character acting must never feel random or disconnected from the voice.

## A. FACIAL EXPRESSION LOGIC

Support expressions such as:

- Happy.
- Excited.
- Curious.
- Confused.
- Surprised.
- Shocked.
- Worried.
- Nervous.
- Sad.
- Disappointed.
- Angry.
- Frustrated.
- Confident.
- Determined.
- Thinking.
- Skeptical.
- Relieved.
- Proud.
- Embarrassed.
- Neutral.

The system must select expressions based on the emotional meaning of each narration beat.

Examples:

| Narration Meaning | Expression |
|---|---|
| Introducing an exciting opportunity | Excited |
| Asking an interesting question | Curious |
| Revealing unexpected information | Surprised |
| Discussing financial problems | Worried |
| Explaining a difficult decision | Thinking |
| Revealing a major loss | Shocked or disappointed |
| Achieving a goal | Happy or proud |
| Introducing a serious twist | Serious |

Expressions must transition smoothly.

Do not instantly switch between unrelated expressions unless the story specifically requires a sudden reaction.

## B. BODY MOVEMENT AND GESTURE LOGIC

Build an intelligent gesture selection system.

Available gesture categories:

- Explaining.
- Pointing.
- Presenting.
- Counting.
- Showing an object.
- Holding a smartphone.
- Looking at something.
- Thinking.
- Shrugging.
- Celebrating.
- Reacting with surprise.
- Expressing frustration.
- Walking.
- Turning toward an object.
- Reaching toward an object.
- Comparing two objects.
- Emphasizing an important number.

Examples:

Narration: "You earn $2,000 every month."

Character:
- Looks at the smartphone.
- Raises one hand toward the salary popup.
- Uses a subtle explanatory gesture.

Narration: "But you want to become a millionaire."

Character:
- Changes to a determined expression.
- Looks toward the $1M visual.
- Points toward the financial target.

Narration: "But here's the problem."

Character:
- Stops the previous gesture.
- Changes to a serious expression.
- Slightly leans forward.
- Uses a small hand gesture to emphasize the problem.

Avoid repetitive idle animations.

Combine gestures with natural breathing, blinking, head movement, gaze, and subtle body movement.

## C. GAZE AND ATTENTION

Character gaze must respond to important visual elements.

Examples:

- When a popup appears on the left, the character can look toward it.
- When a car appears on the right, the character should turn toward the car.
- When a smartphone is shown, the character should look at the phone.
- When the character speaks directly to the audience, maintain audience-facing gaze.

Do not let the character stare in one direction while the relevant visual happens somewhere else.

---

# 5. POPUP AND VISUAL GRAPHICS DIRECTOR

Build a system that chooses popup templates according to the information being communicated.

The popup must explain, emphasize, or visualize something relevant to the narration.

It must not exist merely to fill empty space.

## A. POPUP CATEGORIES

Create reusable categories:

### Financial Graphics
- Salary Card.
- Bank Balance.
- Money Counter.
- Income Comparison.
- Expense Breakdown.
- Investment Growth.
- Financial Goal.
- Million Dollar Counter.
- Profit and Loss.
- Monthly Budget.
- Savings Progress.
- Financial Warning.

### Object and Product Graphics
- Product Showcase.
- Sports Car Reveal.
- Private Jet Reveal.
- Mansion Showcase.
- Smartphone Interface.
- Purchase Confirmation.
- Product Price Tag.
- Feature Highlight.

### Information Graphics
- Statistics Card.
- Percentage Counter.
- Comparison Panel.
- Timeline.
- Progress Bar.
- Checklist.
- Important Number.
- Explanation Card.
- Warning Card.
- Success Card.

### Emotional and Story Graphics
- Question Card.
- Thought Bubble.
- Surprise Reveal.
- Reaction Graphic.
- Achievement Indicator.
- Problem Indicator.
- Opportunity Reveal.
- Dramatic Information Card.

## B. SEMANTIC POPUP SELECTION

The system must choose the appropriate popup based on what the narrator communicates.

Examples:

| Narration | Visual |
|---|---|
| "You make $2,000 a month." | Monthly salary card |
| "Your goal is $1 million." | Animated financial target |
| "You spend $800 on rent." | Expense breakdown |
| "Your savings keep growing." | Savings progress chart |
| "You buy a Ferrari." | Car showcase + price tag |
| "You lose everything." | Financial loss graphic |
| "You have only 30 days." | Countdown timer |
| "There is one big problem." | Warning graphic |

Do not use the same generic popup for every situation.

Select a visual design that communicates the actual information.

## C. POPUP ANIMATION CHOREOGRAPHY

Every popup should support:

- Entrance animation.
- Position movement.
- Scale animation.
- Rotation where appropriate.
- Opacity animation.
- Staggered internal elements.
- Highlight effects.
- Number counting.
- Progress animation.
- Exit animation.

Use the existing motion graphics template library.

A popup should have a complete animation lifecycle:

1. Prepare.
2. Enter.
3. Reveal information.
4. Emphasize the important detail.
5. Hold for readability.
6. Exit or transform into the next visual.

Do not display too many graphics simultaneously.

Prioritize the most important information.

---

# 6. SMART CAMERA HIGHLIGHT DIRECTOR

The camera must follow the subject being discussed by the narrator.

This is one of the most important parts of the system.

The camera must not remain permanently focused on the main character.

It must dynamically move between characters, objects, graphics, and environmental elements.

Use the existing Cinematic Camera Preset System.

## A. CAMERA TARGET SELECTION

Possible targets:

- Main character.
- Secondary character.
- Smartphone.
- Salary popup.
- Bank balance.
- Money graphics.
- Sports car.
- Private jet.
- Mansion.
- Important object.
- Background element.
- Any registered visual target.

Every visual target must have a stable target ID and a reliable position or bounding region.

## B. NARRATION-DRIVEN CAMERA EXAMPLES

Narration: "You buy a brand-new sports car."

Camera:
1. Start on the character.
2. Character looks toward the car.
3. Camera performs a controlled whip pan.
4. Camera lands on the car.
5. Perform a cinematic push-in.
6. Hold the hero shot.

Narration: "Then you get yourself a private jet."

Camera:
1. Reframe from the car.
2. Perform a smooth pan or tracking movement toward the aircraft.
3. Use a wide reveal.
4. Slightly push in toward the aircraft.

Narration: "Your bank account now shows $1,000,000."

Camera:
1. Track toward the smartphone.
2. Zoom into the phone screen.
3. Highlight the balance.
4. Hold while the number animation finishes.
5. Pull back to the character's reaction.

Narration: "But there is a problem."

Camera:
1. Leave the financial graphic.
2. Reframe toward the character.
3. Use a controlled dramatic push-in.
4. Hold on the serious expression.

## C. CAMERA MOVEMENT SELECTION

Choose movements according to storytelling intent.

- Important reveal: Whip Pan, Snap Reframe, or Zoom Reveal.
- Financial information: Track to graphic and controlled push-in.
- Emotional reaction: Character close-up and slow push-in.
- Object introduction: Hero reveal and object tracking.
- Comparison: Reframe between two targets.
- Scene introduction: Wide establishing shot.
- Dramatic twist: Controlled crash zoom or dramatic push-in.
- Calm explanation: Subtle tracking or slow camera drift.

Avoid unnecessary camera movement.

The camera must always have a clear visual target and reason for moving.

---

# 7. VOICE AND ANIMATION SYNCHRONIZATION

Every visual action must respect the narration timing.

Build synchronization between:

- Voice over.
- Word and phrase timing.
- Character mouth movement.
- Facial expressions.
- Body gestures.
- Popup appearance.
- Number animations.
- Camera movement.
- Visual sound effects.

Use actual voice timing or word/phrase timestamps when available.

Do not estimate synchronization from sentence length alone when accurate audio timing exists.

## SYNCHRONIZATION EXAMPLE

Narration:

"Imagine making just two thousand dollars a month."

Suggested choreography:

- "Imagine": Character looks toward the viewer, curious expression.
- "making": Character begins an explanatory gesture.
- "two thousand dollars": Salary popup enters and the number animates.
- "a month": Monthly label appears, camera settles on the complete salary card.

Narration:

"But your dream is to become a millionaire."

- "But": Character expression changes to determined.
- "your dream": Character looks toward the financial target.
- "millionaire": $1M target appears with a strong reveal animation.
- Camera transitions toward the target and holds.

The timing must feel natural, not mechanically synchronized to every individual word.

Use meaningful phrase-level timing and emphasis.

## LIP SYNC

Use the existing talking and mouth animation system.

If phoneme-level timing is supported, use it.

If not, use the best available speech-driven mouth animation.

Never claim accurate phoneme synchronization if it is not implemented.

---

# 8. VISUAL HIERARCHY AND ATTENTION MANAGEMENT

At any given moment, determine what the viewer should focus on.

Create an attention hierarchy:

1. Primary subject: The most important information currently being narrated.
2. Secondary subject: Supporting character or visual context.
3. Supporting graphics: Additional information.
4. Environment: Visual atmosphere and spatial context.

Examples:

When discussing a salary:
- Primary: Salary graphic.
- Secondary: Character.
- Supporting: Smartphone.
- Environment: Bedroom or home office.

When discussing a sports car:
- Primary: Sports car.
- Secondary: Character reaction.
- Supporting: Price graphic.
- Environment: Garage or luxury setting.

When discussing a financial problem:
- Primary: Problem indicator.
- Secondary: Character reaction.
- Supporting: Relevant financial numbers.
- Environment: Appropriate contextual setting.

Do not highlight everything simultaneously.

The camera, character gaze, popup animation, and composition should reinforce the same primary subject whenever possible.

---

# 9. BACKGROUND AND ENVIRONMENT RESPONSE

Backgrounds must support the story being told.

The environment should change or respond when the narrative introduces a new context.

Examples:

- Talking about salary: Bedroom, home office, or everyday living environment.
- Talking about luxury: Mansion, garage, luxury showroom, or airport.
- Talking about investments: Modern financial workspace.
- Talking about financial stress: More restrained visual atmosphere.
- Talking about success: Bright, colorful, celebratory environment.

Use the existing background template library.

Do not change backgrounds without a story reason.

Use environmental props and layered depth to support the visual message.

Keep the character integrated into the scene.

---

# 10. STORY EVENT CHOREOGRAPHY

Build a unified event system that coordinates every visual layer.

A story event should be able to trigger:

- Character expression.
- Character gesture.
- Character gaze.
- Body movement.
- Popup entrance.
- Popup animation.
- Object animation.
- Background reaction.
- Camera movement.
- Visual effects.
- Sound effect.
- Narration synchronization.

All actions should be coordinated as one event.

Example event:

```js
{
  id: "million_dollar_reveal",
  trigger: {
    narrationBeat: "millionaire",
    semanticTarget: "financial_goal"
  },
  character: {
    expression: "excited",
    gesture: "point_toward_target",
    gaze: "million_dollar_graphic"
  },
  visual: {
    type: "financial_goal",
    template: "million_dollar_reveal",
    targetId: "million_dollar_graphic"
  },
  camera: {
    preset: "cinematic_push_in",
    target: "million_dollar_graphic",
    priority: "high"
  },
  timing: {
    entrance: "on_emphasis",
    hold: 1.5,
    exit: "after_visual_beat"
  }
}
```

This is an illustrative schema only.

Inspect the existing project and adapt the structure to its actual APIs.

Avoid implementing isolated event handlers that bypass the existing timeline.

---

# 11. PRIORITY, CONFLICT RESOLUTION, AND TIMING

The system must understand that not all visual actions should happen at once.

Implement visual priority and coordination rules.

Examples:

- A major object reveal can temporarily take camera priority over the character.
- A critical narration phrase should not be covered by an unrelated popup.
- A character should not point toward an object that has already disappeared.
- The camera should not move away before the important number finishes animating.
- A serious emotional moment should not be interrupted by decorative effects.
- A new popup should not overlap an existing important popup without a clear design reason.

Support:

- Event priority.
- Start and end timing.
- Action dependencies.
- Interruptibility.
- Transition blending.
- Hold duration.
- Exit conditions.
- Camera ownership.
- Visual target locking.
- Timeline synchronization.

When two actions conflict, resolve them according to story importance.

---

# 12. AUTOMATIC STORYBOARD GENERATION

Before rendering a video, generate a visual storyboard from the narration.

For each beat, show:

- Narration.
- Meaning.
- Emotional tone.
- Character expression.
- Character gesture.
- Visual target.
- Popup template.
- Background.
- Camera shot.
- Camera preset.
- Animation timing.
- Transition to next beat.

The storyboard must be editable.

Allow the user or agent to override any generated decision.

Do not immediately render a complete video without first generating and validating the visual plan.

---

# 13. PREVIEW AND EDITOR REQUIREMENTS

Build a Narrative Logic Preview Lab.

The user should be able to inspect how the system interprets narration.

Required features:

1. Narration segment viewer.
2. Semantic beat viewer.
3. Character expression preview.
4. Gesture preview.
5. Popup template preview.
6. Camera target preview.
7. Camera movement preview.
8. Background selection preview.
9. Full synchronized scene playback.
10. Timeline event visualization.
11. Event priority inspection.
12. Manual override controls.

The preview must demonstrate real animation.

Do not use static mockups as proof of implementation.

Allow individual visual layers to be enabled or disabled for debugging.

---

# 14. TECHNICAL AND DETERMINISTIC REQUIREMENTS

Use the existing Three.js rendering pipeline.

The same timeline timestamp must always produce the same visual state.

Avoid:
- Math.random() for animation state.
- Date.now() for timeline progress.
- Frame-dependent accumulated movement.
- Uncontrolled animation loops.
- Independent timelines that drift out of synchronization.
- Duplicate camera controllers.
- Duplicate character animation controllers.
- Hardcoded scene-specific logic that cannot be reused.

Use deterministic evaluation and the existing project conventions.

Ensure preview playback and final rendering produce identical results.

---

# 15. QUALITY CONTROL AND VALIDATION

Test the system using a complete narration sample.

Verify that:

1. Every narration beat has a meaningful visual interpretation.
2. Expressions match the emotional context.
3. Gestures match the spoken meaning.
4. Character gaze follows relevant visual targets.
5. Popups communicate the correct information.
6. Camera highlights the correct subject.
7. Backgrounds support the story.
8. Animations are synchronized with voice timing.
9. Visual hierarchy remains clear.
10. Transitions are smooth.
11. No unrelated visual elements appear.
12. No repetitive generic gestures dominate the video.
13. No popup appears without a meaningful reason.
14. No camera movement distracts from the narration.
15. The final video feels like one coherent animated story.

Render actual preview frames and inspect the complete video.

Do not declare completion based only on successful compilation.

---

# 16. REQUIRED DELIVERABLES

Build and integrate:

1. Narrative-to-Visual Director.
2. Semantic Story Beat Analyzer.
3. Character Acting Director.
4. Expression Selection System.
5. Gesture Selection System.
6. Gaze and Attention System.
7. Semantic Popup Director.
8. Smart Camera Highlight Director.
9. Voice and Animation Synchronization.
10. Background and Environment Response.
11. Unified Story Event System.
12. Visual Priority and Conflict Resolution.
13. Automatic Storyboard Generator.
14. Narrative Logic Preview Lab.
15. Documentation.
16. Fully working demonstration story.
17. Actual rendered preview outputs.

---

# FINAL CREATIVE DIRECTION

I do not want a video where the narrator speaks while the character performs random idle animations and generic popups appear on the screen.

I want every visual element to feel intentional.

The narrator says something, the character reacts appropriately, the relevant visual appears, and the camera moves to highlight what matters.

All visual systems must behave as one coordinated storytelling director.

**The narration is the source of truth. Character acting, facial expressions, gestures, popups, background interactions, visual effects, and camera choreography must all follow its meaning and timing.**

Build this as a reusable system for every future PuppetKit story, not a one-off implementation for a single video.
