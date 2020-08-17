import { Mesh } from '../core/Mesh';
import { Point } from '../core/Point';

export const SquareGeometry = [
  [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(1, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
];

export const BoxGeometry = [
  [
    // front view
    new Point(0, 1, 1),
    new Point(1, 1, 1),
    new Point(1, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 1, 1)
  ],
  [
    // right view
    new Point(1, 1, 0),
    new Point(1, 1, 1),
    new Point(1, 0, 1),
    new Point(1, 0, 0),
    new Point(1, 1, 0)
  ],
  // top view
  [
    new Point(0, 0, 1),
    new Point(1, 0, 1),
    new Point(1, 1, 1),
    new Point(0, 1, 1),
    new Point(0, 0, 1)
  ]
];
