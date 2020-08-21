import { Geometry } from '../core/Geometry';
import { BlenderGeometry } from '../core/Geometry';
import { Vector3 } from '../core/Vector3';

import boxConfig from '../blender/raw/box.json';
import squareConfig from '../blender/raw/square.json';
import tree001Config from '../blender/raw/tree_001.json';
import tree002Config from '../blender/raw/tree_002.json';
import tree003Config from '../blender/raw/tree_003.json';
import trunkConfig from '../blender/raw/trunk.json';
import rockConfig  from '../blender/raw/rock.json';
import bushConfig from '../blender/raw/bush.json';

class Tree001Geometry extends BlenderGeometry {
  constructor() {
    super(tree001Config, { name: 'tree_001' });
  }
}
export const tree001 = new Tree001Geometry();

class Tree002Geometry extends BlenderGeometry {
  constructor() {
    super(tree002Config, { name: 'tree_002' });
  }
}
export const tree002 = new Tree002Geometry();

class Tree003Geometry extends BlenderGeometry {
  constructor() {
    super(tree003Config, { name: 'tree_003' });
  }
}
export const tree003 = new Tree003Geometry();

class TrunkGeometry extends BlenderGeometry {
  constructor() {
    super(trunkConfig, { name: 'trunk' });
  }
}
export const trunk = new TrunkGeometry();

export class BoxGeometry extends BlenderGeometry {
  constructor() {
    super(boxConfig, { name: 'box' });
  }
}
export const box = new BoxGeometry();

export class SquareGeometry extends BlenderGeometry {
  constructor() {
    super(squareConfig, { name: 'square' });
  }
}
export const square = new SquareGeometry();
