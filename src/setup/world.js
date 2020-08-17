import { G } from '../globals';
import { Group } from '../core/Group';
import { Mesh } from '../core/Mesh';
import { Point } from '../core/Point';
import { Style } from '../core/Style';
import { TileStyle } from '../styles/styles';
import { SquareGeometry, BoxGeometry } from '../geometries/shapes';

export const initTiles = () => {
  const tileGroup = new Group();
  tileGroup.style = new TileStyle();
  for (let i = 0; i < G.MAP_SIZE.x; i++) {
    for (let j = 0; j < G.MAP_SIZE.y; j++) {
      tileGroup.add(
        new Mesh(SquareGeometry, {
          position: new Point(i, j, 0),
          updatesOn: ['perspective', 'resize']
        })
      );
    }
  }
  return tileGroup;
};

export const initTestCubes = () => {
  const cubeGroup = new Group();
  cubeGroup.style = new Style([['fillStyle', G.COLORS.LILAC]]);
  cubeGroup.add(
    new Mesh(BoxGeometry, {
      position: new Point(5, 5, 0),
      updatesOn: ['perspective', 'resize']
    })
  );
  cubeGroup.add(
    new Mesh(BoxGeometry, {
      position: new Point(5, 7, 0),
      updatesOn: ['perspective', 'resize']
    })
  );
  cubeGroup.add(
    new Mesh(BoxGeometry, {
      position: new Point(4, 10, 0),
      updatesOn: ['perspective', 'resize']
    })
  );
  cubeGroup.add(
    new Mesh(BoxGeometry, {
      position: new Point(8, 9, 0),
      updatesOn: ['perspective', 'resize']
    })
  );
  return cubeGroup;
};
