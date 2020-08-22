import { G } from '../globals';
import { lerp } from 'crco-utils';
import { Vector3 } from '../core/Vector3';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import * as geos from '../geometries/shapes';

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
}
