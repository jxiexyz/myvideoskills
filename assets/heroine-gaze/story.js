import {createGazePreset} from '../../presets/gaze.js';
const glance=createGazePreset();
export function poseAt(t){
 return {...glance(t),x:0,y:0,turns:{body:0,head:0,neck:0,
  leftUpperArm:0,rightUpperArm:0,leftForearm:5,rightForearm:0,
  leftHand:0,rightHand:0,braidL:0,braidR:0},expression:'neutral'};
}
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:3.2};

