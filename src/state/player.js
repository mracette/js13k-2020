import { Vector3 } from '../core/Vector3';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import * as geos from '../entities/geometries';
import * as styles from '../entities/styles';

export class Player {
  constructor() {
    // this is a "virtual" position, because the mesh will always be at the center
    this.position = new Vector3(-8, -8, 0);
    this.prevPosition = null;
    this._movementSpeed = 0.075;
    this._movementSpeedHalf = this._movementSpeed / 2;
    this._lastUpdateTime = null;
    this.isMoving = false;

    this.mesh = new Group(new Mesh(geos.box), {
      uid: 'player-group',
      style: styles.emeraldGreen,
      position: this.position
    });
  }

  getNeighborMapCoords() {
    return [
      Math.round(this.position.x - 1),
      Math.round(-1 * this.position.y - 3),
      Math.round(this.position.x + 1),
      Math.round(-1 * this.position.y + 3)
    ];
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
      this.position.x -= this._movementSpeedHalf;
      this.position.y += this._movementSpeedHalf;
      needsUpdate = true;
    }
    if (this.moveRight) {
      this.position.x += this._movementSpeedHalf;
      this.position.y -= this._movementSpeedHalf;
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
