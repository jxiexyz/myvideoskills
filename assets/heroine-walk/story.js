import {createWalkPreset} from '../../presets/walk.js';
// A complete idle -> walk -> idle preview. The reusable gait lives in presets/walk.js.
export const poseAt=createWalkPreset({duration:4.2,cycleSeconds:1.4,stridePx:50,liftPx:78,
 direction:1,travel:true,startXPx:-75});
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:2.7};

