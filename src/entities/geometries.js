import { BlenderGeometry } from '../core/Geometry';

import boxConfig from './geometries/box.json';
import squareConfig from './geometries/square.json';
import tree1Config from './geometries/tree1.json';
import tree2Config from './geometries/tree2.json';
import tree3Config from './geometries/tree3.json';
import trunkConfig from './geometries/trunk.json';
import rockConfig from './geometries/rock.json';
import bushConfig from './geometries/bush.json';
import grassConfig from './geometries/grass.json';
import playerHandsConfig from './geometries/player_hands.json';
import playerBodyConfig from './geometries/player_body.json';
import playerRingFrontConfig from './geometries/player_ring_front.json';
import playerRingBackConfig from './geometries/player_ring_back.json';
import playerFaceConfig from './geometries/player_face.json';
import shadowConfig from './geometries/shadow.json';
import starfishConfig from './geometries/starfish.json';
import shellConfig from './geometries/shell.json';
import enemy1Config from './geometries/enemy1.json';

export const tree1 = new BlenderGeometry(tree1Config, { name: 'tree1' });
export const tree2 = new BlenderGeometry(tree2Config, { name: 'tree2' });
export const tree3 = new BlenderGeometry(tree3Config, { name: 'tree3' });
export const trunk = new BlenderGeometry(trunkConfig, { name: 'trunk' });
export const box = new BlenderGeometry(boxConfig, { name: 'box' });
export const square = new BlenderGeometry(squareConfig, { name: 'square' });
export const rock = new BlenderGeometry(rockConfig, { name: 'rock' });
export const bush = new BlenderGeometry(bushConfig, { name: 'bush' });
export const grass = new BlenderGeometry(grassConfig, { name: 'grass' });
export const playerHands = new BlenderGeometry(playerHandsConfig);
export const playerRingFront = new BlenderGeometry(playerRingFrontConfig);
export const playerRingBack = new BlenderGeometry(playerRingBackConfig);
export const playerBody = new BlenderGeometry(playerBodyConfig);
export const playerFace = new BlenderGeometry(playerFaceConfig);
export const shadow = new BlenderGeometry(shadowConfig);
export const starfish = new BlenderGeometry(starfishConfig, {
  name: 'starfish'
});
export const shell = new BlenderGeometry(shellConfig, { name: 'shell' });
export const enemy1 = new BlenderGeometry(enemy1Config);
