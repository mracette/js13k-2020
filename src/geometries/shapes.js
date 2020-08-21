import { Geometry } from '../core/Geometry';
import { BlenderGeometry } from '../core/Geometry';
import { Vector3 } from '../core/Vector3';

import boxConfig from '../blender/raw/box.json';
import squareConfig from '../blender/raw/square.json';
import tree001Config from '../blender/raw/tree_001.json';

class Tree001Geometry extends BlenderGeometry {
  constructor() {
    super(tree001Config, { name: 'tree_001' });
  }
}
export const tree001 = new Tree001Geometry();

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
