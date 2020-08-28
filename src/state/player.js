import { G } from '../globals';
import { Vector3 } from '../core/Vector3';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import { TAU } from 'crco-utils';
import * as geos from '../entities/geometries';
import * as styles from '../entities/styles';

export class Player {
  constructor() {
    // this is a "virtual" position, because the mesh will always be at the center of the screen
    this.position = new Vector3(-8, -8, 0);
    this.prevPosition = null;

    // identifies actions in the queue
    this._actionId = 0;
    // the action that will be triggered by space bar
    this.currentAction = 'beam';
    // if an action has been triggered by not added to the action list
    this.currentActionTriggered = false;
    // the current list of active actions
    this.currentActions = [];
    // these control animations and gameplay
    this.actionParams = {
      beamDuration: 500
    };

    // movement / rotation params
    this._lastUpdateTime = null;
    this._movementSpeed = 0.075;
    this._rotationSpeed = 0.15;
    this._movementSpeedHalf = this._movementSpeed / 2;
    this._faceOffset = 0.1;
    this.isMoving = false;

    // draw order for face placement
    this.drawOrderForwards = [
      'player-shadow',
      'player-face',
      'player-ring-back',
      'player-body',
      'player-ring-front'
    ];
    this.drawOrderBackwards = [
      'player-shadow',
      'player-ring-back',
      'player-body',
      'player-ring-front',
      'player-face'
    ];

    // the action group + meshes
    this.mesh = this._initMesh();
  }

  _initMesh() {
    const shadow = new Mesh(geos.shadow, {
      uid: 'player-shadow',
      style: [styles.transparentBlack, styles.noLine]
    });
    const body = new Mesh(geos.playerBody, {
      uid: 'player-body',
      style: styles.lilac
    });
    this.face = new Mesh(geos.playerFace, {
      uid: 'player-face',
      style: styles.magnolia,
      position: new Vector3(0.5, 0.5, 0),
      cacheEnabled: false
    });
    const ringFront = new Mesh(geos.playerRingFront, {
      uid: 'player-ring-front',
      // style: [styles.whiteLines, styles.spaceCadet]
      style: [styles.spaceCadet]
    });
    const ringBack = new Mesh(geos.playerRingBack, {
      uid: 'player-ring-back',
      // style: [styles.whiteLines, styles.spaceCadet]
      style: [styles.spaceCadet]
    });
    return new Group([shadow, ringBack, body, ringFront, this.face], {
      uid: 'player-group',
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

  updateRotation(anchor, current, delta) {
    let diff = anchor - current;
    if (diff > Math.PI) {
      diff = anchor - TAU - current;
    } else if (diff < -Math.PI) {
      diff = anchor + TAU - current;
    }
    const next = current + diff * delta;
    const quad = Math.abs((next / TAU) % 1);
    if (quad > 0.36 && quad < 0.64) {
      this.mesh.drawOrder = this.drawOrderForwards;
    } else {
      this.mesh.drawOrder = this.drawOrderBackwards;
    }
    return next;
  }

  updateActions(time) {
    // check for a new action
    if (this.currentActionTriggered) {
      this.initiateAction(this.currentAction, time);
      this.currentActionTriggered = false;
    }
    // animate actions if necessary
    let animationDidEnd;
    const saveFillState = G.CTX.fillStyle;
    const saveStrokeState = G.CTX.strokeStyle;
    console.log('before', G.CTX.fillStyle);
    if (this.currentActions.length) {
      // save context state
      for (let i = 0; i < this.currentActions.length; i++) {
        this.animateAction(time, this.currentActions[i]) &&
          (animationDidEnd = true);
      }
      console.log('during', G.CTX.fillStyle);
    }
    G.CTX.fillStyle = saveFillState;
    console.log('after', G.CTX.fillStyle);
    G.CTX.strokeStyle = saveStrokeState;
    return animationDidEnd;
  }

  updatePosition(time) {
    // TODO: make this frame rate independent
    const delta = this._movementSpeed;
    const rotDelta = this._rotationSpeed;

    let deltaX = 0;
    let deltaY = 0;
    let direction = 0;

    if (this.moveForward && this.moveLeft) {
      deltaX = -delta;
      direction = (3 * Math.PI) / 4;
    } else if (this.moveForward && this.moveRight) {
      deltaY = -delta;
      direction = (5 * Math.PI) / 4;
    } else if (this.moveForward && !this.moveBackward) {
      deltaX = -delta;
      deltaY = -delta;
      direction = Math.PI;
    } else if (this.moveBackward && this.moveLeft) {
      deltaY = delta;
      direction = Math.PI / 4;
    } else if (this.moveBackward && this.moveRight) {
      deltaX = delta;
      direction = (7 * Math.PI) / 4;
    } else if (this.moveBackward && !this.moveForward) {
      deltaX = delta;
      deltaY = delta;
      direction = 2 * Math.PI;
    } else if (this.moveLeft && !this.moveRight) {
      deltaX = -delta / 2;
      deltaY = delta / 2;
      direction = Math.PI / 2;
    } else if (this.moveRight && !this.moveLeft) {
      deltaX = +delta / 2;
      deltaY = -delta / 2;
      direction = -Math.PI / 2;
    }

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
        return this.animateBeam(time, action);
      default:
        break;
    }
  }

  animateBeam(time, action, ctx = G.CTX) {
    const delta = (time - action.start) / this.actionParams.beamDuration;
    // remove the action from the queue
    if (delta > 1) {
      this.currentActions = this.currentActions.filter(
        (a) => a.id !== action.id
      );
      return true;
    } else {
      ctx.arc(
        this.mesh.children[0].screenX,
        this.mesh.children[0].screenY,
        50,
        0,
        TAU
      );
      ctx.fillStyle = 'green';
      ctx.fill();
      return false;
    }
  }
}
