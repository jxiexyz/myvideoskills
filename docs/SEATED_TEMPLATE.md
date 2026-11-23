# Bent-knee seated template

Run: bash make.sh heroine-sit full 150 30

This template uses articulated thigh, shin and foot SVGs continuously; the obsolete legs_seated card is hidden. pose.legLengths supplies projected lengths; the harness scales meshes around their pivots and explicitly repositions child joints, never scaling the hierarchy. pose.skirtForeshorten shortens the standing skirt continuously to expose the thigh-to-knee bend.

At frame 64 onward the hips and knees have equal projected Y, thighs extend 118.8 px to screen right, ankles stay at Y=881.8 px, and interior knee angles are 88.4 degrees. Both shoes stay inside the 540x960 frame.

Actual world-transform projection, deterministic frame capture, and MP4 decode were checked. See seated-verification.json for measurements. Larger z means foreground when absoluteDrawOrder is true.

