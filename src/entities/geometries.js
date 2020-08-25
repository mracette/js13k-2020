import { BlenderGeometry } from '../core/Geometry';

import boxConfig from '../blender/raw/box.json';
import squareConfig from '../blender/raw/square.json';
import tree001Config from '../blender/raw/tree_001.json';
import tree002Config from '../blender/raw/tree_002.json';
import tree003Config from '../blender/raw/tree_003.json';
import trunkConfig from '../blender/raw/trunk.json';
import rockConfig from '../blender/raw/rock.json';
import bushConfig from '../blender/raw/bush.json';

export const tree001 = new BlenderGeometry(tree001Config, { name: 'tree_001' });
export const tree002 = new BlenderGeometry(tree002Config, { name: 'tree_002' });
export const tree003 = new BlenderGeometry(tree003Config, { name: 'tree_003' });
export const trunk = new BlenderGeometry(trunkConfig, { name: 'trunk' });
export const box = new BlenderGeometry(boxConfig, { name: 'box' });
export const square = new BlenderGeometry(squareConfig, { name: 'square' });
export const rock = new BlenderGeometry(rockConfig, { name: 'rock' });
export const bush = new BlenderGeometry(bushConfig, { name: 'bush' });
