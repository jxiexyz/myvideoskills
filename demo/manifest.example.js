// Coordinates are normalized to the source image: top-left (0,0), bottom-right (1,1).
// Replace these example polygons with masks traced around your own character.
export const characterManifest = {
  name: 'SamplePuppet',
  parts: [
    { name: 'body', polygon: [{x:.32,y:.43},{x:.69,y:.43},{x:.75,y:.92},{x:.27,y:.92}], pivot: {x:.5,y:.48}, z: 1 },
    { name: 'leftArm', polygon: [{x:.25,y:.48},{x:.39,y:.48},{x:.36,y:.88},{x:.22,y:.88}], pivot: {x:.35,y:.52}, parent: 'body', z: 2 },
    { name: 'rightArm', polygon: [{x:.61,y:.48},{x:.76,y:.48},{x:.79,y:.88},{x:.64,y:.88}], pivot: {x:.66,y:.52}, parent: 'body', z: 2 },
    { name: 'head', polygon: [{x:.28,y:.03},{x:.72,y:.03},{x:.75,y:.48},{x:.25,y:.48}], pivot: {x:.5,y:.44}, z: 3 },
    { name: 'eyes', polygon: [{x:.34,y:.20},{x:.66,y:.20},{x:.66,y:.31},{x:.34,y:.31}], pivot: {x:.5,y:.25}, parent: 'head', z: 4 },
    { name: 'mouth', polygon: [{x:.43,y:.34},{x:.57,y:.34},{x:.57,y:.40},{x:.43,y:.40}], pivot: {x:.5,y:.37}, parent: 'head', z: 5 }
  ],
  expressions: {
    neutral: { eyes: true, mouth: true },
    happy: { eyes: true, mouth: true },
    surprised: { eyes: true, mouth: true }
  }
};

