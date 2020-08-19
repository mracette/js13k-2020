import { Geometry } from '../core/Geometry';
import { Vector3 } from '../core/Vector3';

export class SquareGeometry extends Geometry {
  constructor() {
    super({ name: 'square' });
    this.faces = [
      [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(1, 1, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 0, 0)
      ]
    ];
  }
}

export class BoxGeometry extends Geometry {
  constructor() {
    super({ name: 'box' });
    this.faces = [
      [
        // front view
        new Vector3(0, 1, 1),
        new Vector3(1, 1, 1),
        new Vector3(1, 1, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 1, 1)
      ],
      [
        // right view
        new Vector3(1, 1, 0),
        new Vector3(1, 1, 1),
        new Vector3(1, 0, 1),
        new Vector3(1, 0, 0),
        new Vector3(1, 1, 0)
      ],
      // top view
      [
        new Vector3(0, 0, 1),
        new Vector3(1, 0, 1),
        new Vector3(1, 1, 1),
        new Vector3(0, 1, 1),
        new Vector3(0, 0, 1)
      ]
    ];
  }
}
