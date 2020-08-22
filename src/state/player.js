import { G } from '../globals';
import { lerp } from 'crco-utils';
import { MapNode } from '../algos/movement';
import { Vector3 } from '../core/Vector3';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import { pageToCanvas } from '../utils/conversions';
import * as geos from '../geometries/shapes';

export const updatePathToHoverTile = (fromObject) => {
  try {
    const path = G.ASTAR.search(G.MAP, fromObject, G.MOUSE_HOVER);
    G.PATHS.PLAYER_TO_HOVER = path;
  } catch {}
};

export class Player {
  constructor(styles) {
    // this is a "virtual" position, because the mesh will always be at the center
    this.prevPosition = new Vector3(15, 15, 0);
    this.position = new Vector3(15, 15, 0);
    this.mesh = this._initMesh(styles, { position: this.position });
    this._movementSpeed = 0.075;
    this._lastUpdateTime = null;
    this.isMoving = false;
  }

  _initMesh(styles, opts) {
    const playerGroup = new Group({
      uid: 'player-group',
      style: styles.emeraldGreen,
      ...opts
    });
    playerGroup.add(new Mesh(geos.box));
    return playerGroup;
  }

  updatePosition(time) {
    // TODO: make this frame rate independent
    const delta = this._movementSpeed;
    let needsUpdate = false;
    if (this.moveForward) {
      this.position.x -= delta;
      this.position.y -= delta;
      needsUpdate = true;
    }
    if (this.moveBackward) {
      this.position.x += delta;
      this.position.y += delta;
      needsUpdate = true;
    }
    if (this.moveLeft) {
      this.position.x -= delta;
      this.position.y += delta;
      needsUpdate = true;
    }
    if (this.moveRight) {
      this.position.x += delta;
      this.position.y -= delta;
      needsUpdate = true;
    }
    return needsUpdate;
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = true;
        break;
      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = true;
        break;
      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = true;
        break;
      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = false;
        break;
      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = false;
        break;
      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = false;
        break;
      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = false;
        break;
    }
  }

  // move(path, startTime) {
  //   this._movementPath = path;
  //   this._movementPathLength = path.length;
  //   this._movementStart = startTime;
  //   this.isMoving = true;
  // }

  // getMovementDelta(camera) {
  //   const prev = this.prevPosition.clone();
  //   const current = this.position.clone();
  //   camera.projectTransform(prev);
  //   camera.projectTransform(current);
  //   return [prev.x - current.x, prev.y - current.y];
  // }

  // updatePosition(time) {
  //   if (this.isMoving) {
  //     this.prevPosition.set(this.position);
  //     const elapsed = time - this._movementStart;
  //     const segmentIndex = elapsed / this._movementSpeed;
  //     // movement is finished
  //     if (segmentIndex >= this._movementPathLength - 1) {
  //       this.isMoving = false;
  //       const finalSegment = this._movementPath[this._movementPathLength - 1];
  //       this.position.x = finalSegment.x;
  //       this.position.y = finalSegment.y;
  //       return this.position;
  //     } else {
  //       // lerp according to time elapsed
  //       const lastSegmentIndex = Math.floor(segmentIndex);
  //       const nextSegmentIndex = Math.ceil(segmentIndex);
  //       const lastSegment = this._movementPath[lastSegmentIndex];
  //       const nextSegment = this._movementPath[nextSegmentIndex];
  //       this.position.x = lerp(
  //         lastSegment.x,
  //         nextSegment.x,
  //         segmentIndex - lastSegmentIndex
  //       );
  //       this.position.y = lerp(
  //         lastSegment.y,
  //         nextSegment.y,
  //         segmentIndex - lastSegmentIndex
  //       );
  //       return this.position;
  //     }
  //   }
  // }
}
