import { G } from '../globals';
import { rotatePoint, boundedSin, PI, TAU } from '../utils/math';
import { Vector3 } from '../core/Vector3';
import { make } from '../entities/generators';
//import { drawWorld } from '../index';

export class Player {
  constructor() {
    // this is a "virtual" position, because the mesh will always be at the center of the screen
    // this.position = new Vector3(-28, -28, 0);
    this.position = new Vector3(-8, -8, 0);

    // identifies actions in the queue
    this._actionId = 0;

    // the action that will be triggered by space bar
    this.currentAction = 'beam';

    // if an action has been triggered but not added to the action list
    this.currentActionTriggered = false;

    // the current list of active actions
    this.currentActions = [];

    // these control animations and gameplay
    this.actionParams = {
      beamDuration: 500,
      beamLength: G.COORDS.width(0.05),
      beamRadius: Math.PI / 4,
      restLength: 1000
    };

    // movement / rotation params
    this._lastUpdateTime = null;
    this._movementSpeed = 0.03;
    this._rotationSpeed = 0.005;
    this._movementSpeedHalf = this._movementSpeed / 2;
    this._faceOffset = 0.1;
    this.isMoving = false;

    // life
    this._maxLife = 10;
    this._currentLife = 9;
    this._isResting = false;
    this.restSin = boundedSin(this.actionParams.restLength * 2, -5, 5);

    // the action group + meshes
    this.mesh = this._initMesh();
  }

  _initMesh() {
    const player = make.player({ position: this.position });
    this.face = player.children[1];
    return player;
  }

  updateRotation(anchor, current, delta) {
    let diff = anchor - current;
    if (diff > PI) {
      diff = anchor - TAU - current;
    } else if (diff < -PI) {
      diff = anchor + TAU - current;
    }
    const next = current + diff * delta;
    const quad = Math.abs((next / TAU) % 1);
    quad > 0.36 && quad < 0.64
      ? (this.orientation = 'up')
      : (this.orientation = 'down');
    return next;
  }

  checkForActions(time) {
    // check for a *new* action
    if (this.currentActionTriggered) {
      this.initiateAction(this.currentAction, time);
      this.currentActionTriggered = false;
      return true;
    }
    return this.currentActions.length > 0;
  }

  updateActions(time) {
    // animate actions if necessary
    if (this.currentActions.length) {
      // save context state prior to each animatino
      G.CTX.save();
      for (let i = 0; i < this.currentActions.length; i++) {
        this.animateAction(time, this.currentActions[i]);
      }
      G.CTX.restore();
      return true;
    } else {
      return false;
    }
  }

  performTileAction(deltaX, deltaY) {
    if (!deltaX && !deltaY) return [0, 0];
    const newX = Math.trunc(this.position.x + deltaX - 0.5);
    const newY = Math.trunc(this.position.y + deltaY - 0.5);
    const [i, j] = G.MAP.getGridFromTile(newX, newY);
    const entity = G.MAP.getEntityOnGrid(i, j);
    if (entity) {
      if (entity.type === 'blocks') {
        return [0, 0];
      }
      if (entity.type === 'home' && this._currentLife !== this._maxLife) {
        this._isResting = true;
        this.initiateAction('rest', G.CURRENT_TIME);
      }
    }
    return [deltaX, deltaY];
  }

  updatePosition() {
    if (this._isResting) {
      return false;
    }
    const delta = G.TIME_DELTA * this._movementSpeed;
    const rotDelta = G.TIME_DELTA * this._rotationSpeed;

    let deltaX = 0;
    let deltaY = 0;
    let direction = 0;

    if (this.moveLeft && !this.moveRight) {
      if (this.moveForward) {
        deltaX = -delta;
        direction = (3 * PI) / 4;
      } else if (this.moveBackward) {
        deltaY = delta;
        direction = PI / 4;
      } else {
        deltaX = -delta / 2;
        deltaY = delta / 2;
        direction = PI / 2;
      }
    } else if (this.moveRight && !this.moveLeft) {
      if (this.moveForward) {
        deltaY = -delta;
        direction = (5 * PI) / 4;
      } else if (this.moveBackward) {
        deltaX = delta;
        direction = (7 * PI) / 4;
      } else {
        deltaX = +delta / 2;
        deltaY = -delta / 2;
        direction = -PI / 2;
      }
    } else if (this.moveForward && !this.moveBackward) {
      deltaX = -delta;
      deltaY = -delta;
      direction = PI;
    } else if (this.moveBackward && !this.moveForward) {
      deltaX = delta;
      deltaY = delta;
      direction = 2 * PI;
    }

    [deltaX, deltaY] = this.performTileAction(deltaX, deltaY);

    const needsUpdate = deltaX !== 0 || deltaY !== 0;

    if (needsUpdate) {
      this.face.rotation.z = this.updateRotation(
        direction,
        this.face.rotation.z,
        rotDelta
      );
      // change position
      this.position.x += deltaX;
      this.position.y += deltaY;
      // change face
      this.face.position.x =
        0.5 + this._faceOffset * Math.cos(Math.PI / 4 + this.face.rotation.z);
      this.face.position.y =
        0.5 + this._faceOffset * Math.sin(Math.PI / 4 + this.face.rotation.z);
    }

    return needsUpdate;
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      // space
      case 32:
        this.currentActionTriggered = true;
        break;
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

  initiateAction(type, start) {
    this.currentActions.push({
      id: this._actionId++,
      type,
      start
    });
  }

  animateAction(time, action) {
    switch (action.type) {
      case 'beam':
        this.animateBeam(time, action);
        break;
      case 'rest':
        this.animateRest(time, action);
        break;
      default:
        break;
    }
  }

  removeAction(id) {
    this.currentActions = this.currentActions.filter((a) => a.id !== id);
  }

  animateRest(time, action) {
    const delta = (time - action.start) / 5;
    if (delta > this.actionParams.restLength) {
      this.removeAction(action.id);
      this._isResting = false;
      return;
    }
    G.CAMERA.magnification = G.MAGNIFICATION - this.restSin(delta);
  }

  animateBeam(time, action, ctx = G.CTX) {
    const delta = (time - action.start) / this.actionParams.beamDuration;
    // remove the action from the queue
    if (delta > 1) {
      this.removeAction(action.id);
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.55 - 0.55 * delta})`;
      ctx.setTransform(2, 0, 0, 1, -G.COORDS.width(0.5), 0);
      const c = this.position.clone().translate(new Vector3(0.5, 0.5, 0));
      G.CAMERA.project(c);
      const cx = c.x;
      const cy = c.y;
      const px = cx + this.actionParams.beamLength;
      const baseRot = this.face.rotation.z + PI / 2;
      const addRot = this.actionParams.beamRadius / 2;
      const p1 = rotatePoint(px, cy, cx, cy, baseRot + addRot);
      const p2 = rotatePoint(px, cy, cx, cy, baseRot - addRot);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.fill();
    }
  }
}
