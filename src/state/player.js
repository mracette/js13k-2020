import { G } from '../globals';
import { rotatePoint, boundedSin, PI, TAU } from '../utils/math';
import { Vector3 } from '../core/Vector3';
import { make } from '../entities/generators';
import { Action } from '../core/Action';
import { hazyPurple } from '../entities/styles';
import { showShop, closeShop } from '../index';
//import { drawWorld } from '../index';

export class Player {
  constructor() {
    // this is a "virtual" position, because the mesh will always be at the center of the screen
    // this.position = new Vector3(-28, -28, 0);
    this.position = new Vector3(-8, -8, 0);

    // identifies actions in the queue
    this.actionId = 0;

    // the action that will be triggered by space bar
    this.currentAction = 'swing';

    // if an action has been triggered but not added to the action list
    this.currentActionTriggered = false;

    // the current list of active actions
    this.currentActions = [];

    // these control animations and gameplay
    this.actionParams = {
      swingDuration: 300,
      swingLength: G.COORDS.width(0.05),
      swingRadius: Math.PI / 4,
      restLength: 1000
    };

    // movement / rotation params
    this.lastUpdateTime = null;
    this.movementSpeed = 0.003;
    this.rotationSpeed = 0.005;
    this.movementSpeedHalf = this.movementSpeed / 2;
    this.faceOffset = 0.1;

    // state
    this.isMoving = false;
    this.isSwinging = false;
    this.isResting = false;

    // life
    this.maxLife = 10;
    this.currentLife = 9;
    this.restSin = boundedSin(this.actionParams.restLength * 2, -5, 5);

    // money
    this.money = 0;

    // experience
    this.experience = 0;

    // haze
    this.hazeAmount = 'None';
    this.haze = 0;

    // the action group + meshes
    this.mesh = this.initMesh();
    this.quad = 0;
  }

  initMesh() {
    const player = make.player({ position: this.position });
    this.face = player.children[1];
    this.machete = player.children[2];
    this.face.rotation.z;
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
    // used for animation order

    if (next < 0) {
      this.quad = ((next + TAU) / TAU) % 1;
    } else {
      this.quad = (next / TAU) % 1;
    }
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
    const [row, col] = G.MAP.getGridFromTile(newX, newY);
    const entity = G.MAP.getEntityOnGrid(row, col);
    if (entity) {
      if (entity.type.includes('blocks')) {
        return [0, 0];
      }
      if (entity.type.includes('home') && this.currentLife !== this.maxLife) {
        this.isResting = true;
        this.initiateAction('rest', G.CURRENT_TIME);
      }
      if (entity.type.includes('shop')) {
        this.isShopping = true;
        showShop();
      }
    } else {
      // closes shop when leaving the tile
      if (this.isShopping) {
        this.isShopping = false;
        closeShop();
      }
    }
    this.prevHaze = this.haze;
    // haze effects
    if (row > 30) {
      this.haze = 1 + 9 * (row / 500);
      if (this.haze < 3) {
        this.hazeAmount = 'Low';
      } else if (this.haze < 6) {
        this.hazeAmount = 'Harmful';
      } else if (this.haze < 9) {
        this.hazeAmount = 'Extreme';
      } else {
        this.hazeAmount = 'EXCRUCIATING';
      }
    } else {
      this.haze = 0;
      this.hazeAmount = 'None';
    }
    if (this.prevHaze !== this.haze) {
      G.POST_CTX.fillStyle = hazyPurple.fillStyle;
      G.POST_CTX.globalAlpha = this.haze / 20;
      G.POST_CTX.clearRect(0, 0, G.COORDS.width(), G.COORDS.height());
      G.POST_CTX.fillRect(0, 0, G.COORDS.width(), G.COORDS.height());
    }
    return [deltaX, deltaY];
  }

  updatePosition() {
    if (this.isResting) {
      return false;
    }
    const delta = G.TIME_DELTA * this.movementSpeed;
    const rotDelta = G.TIME_DELTA * this.rotationSpeed;

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
      const newRotation = this.updateRotation(
        direction,
        this.face.rotation.z,
        rotDelta
      );
      this.face.rotation.z = newRotation;
      this.machete.rotation.z = newRotation;
      // change position
      this.position.x += deltaX;
      this.position.y += deltaY;
      // change face position
      this.face.position.x =
        0.5 + this.faceOffset * Math.cos(Math.PI / 4 + this.face.rotation.z);
      this.face.position.y =
        0.5 + this.faceOffset * Math.sin(Math.PI / 4 + this.face.rotation.z);
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
    if (type === 'swing') {
      if (this.isSwinging) return;
      this.isSwinging = true;
    }
    this.currentActions.push({
      id: this.actionId++,
      type,
      start
    });
  }

  animateAction(time, action) {
    switch (action.type) {
      case 'swing':
        this.animateSwing(time, action);
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
      this.currentLife = this.maxLife;
      this.isResting = false;
      return;
    }
    G.CAMERA.magnification = G.MAGNIFICATION - this.restSin(delta);
  }
  animateSwing(time, action, ctx = G.CTX) {
    const delta = (time - action.start) / this.actionParams.swingDuration;
    // remove the action from the queue
    if (delta > 1) {
      this.removeAction(action.id);
      this.isSwinging = false;
      this.machete.rotation.z = this.face.rotation.z;
      this.machete.rotation.y = 0;
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.55 - 0.55 * delta * 0.8})`;
      ctx.setTransform(2, 0, 0, 1, -G.COORDS.width(0.5), 0);
      const c = this.position.clone().translate(new Vector3(0.5, 0.5, 0));
      G.CAMERA.project(c);
      const cx = c.x;
      const cy = c.y;
      const px = cx + this.actionParams.swingLength;
      const baseRot =
        this.face.rotation.z + PI / 2 + this.actionParams.swingRadius / 2;
      const currentRot = baseRot - delta * this.actionParams.swingRadius;
      // ground animation
      const p1 = rotatePoint(px, cy, cx, cy, baseRot);
      const p2 = rotatePoint(px, cy, cx, cy, currentRot);
      // rotate the machete
      this.machete.rotation.z = Math.PI + currentRot;
      this.machete.rotation.y = (Math.PI / 2) * delta;
      // samples tiles between the player and the end of the swing
      const dx = G.COORDS.nx(0) - p2.x;
      const dy = p2.y - G.COORDS.ny(0);
      for (let i = 0, n = 5; i <= n; i++) {
        const check = G.CAMERA.unproject(
          new Vector3(p2.x - dx * (i / n), p2.y - dy * (i / n), 0)
        );
        const [row, col] = G.MAP.getGridFromTile(
          Math.round(check.x - 0.5),
          Math.round(check.y - 0.5)
        );
        const entity = G.MAP.getEntityOnGrid(row, col);
        if (entity && !entity.action && entity.type.includes('breaks')) {
          G.MAP.addAction(new Action(time, 'breaks', row, col));
        }
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.fill();
    }
  }
}
