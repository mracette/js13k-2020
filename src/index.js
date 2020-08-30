import { Group } from './core/Group';
import { Map } from './state/world';
import { Player } from './state/player';
import { Camera } from './core/Camera';
// import { WebGL, m4 } from './core/WebGL';
import { WebGL2 } from './core/WebGL2';
import { initDom } from './setup/dom';
import { baseLine } from './entities/styles';
import { renderTileCoords } from './utils/screen';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

const webgl = new WebGL2(G.WEBGL_CTX);

const offscreen = document.createElement('canvas');
const offscreenCtx = offscreen.getContext('2d');
offscreenCtx.fillStyle = 'blue';
offscreenCtx.fillRect(0, 0, 100, 100);
offscreenCtx.fillStyle = 'green';
offscreenCtx.fillRect(25, 25, 50, 50);
createImageBitmap(offscreen, 0, 0, 150, 150).then((img) => {
  var textureInfo = webgl.createTexture(img);
  const draw = (time) => {
    webgl.drawImage(time, textureInfo);
    window.requestAnimationFrame(draw);
  };
  window.requestAnimationFrame(draw);
});

// function main() {
//   var canvas = document.querySelector('#webgl');
//   var gl = canvas.getContext('webgl');

//   const vertexShaderSrc = `
//   attribute vec4 a_position;
//   attribute vec2 a_texcoord;

//   uniform mat4 u_matrix;

//   varying vec2 v_texcoord;

//   void main() {
//      gl_Position = u_matrix * a_position;
//      v_texcoord = a_texcoord;
//   }
//   `;
//   const fragmentShaderSrc = `
//   precision mediump float;

//   varying vec2 v_texcoord;

//   uniform sampler2D u_texture;

//   void main() {
//      gl_FragColor = texture2D(u_texture, v_texcoord);
//   }
//   `;

//   const vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
//   const fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
//   gl.shaderSource(vertShaderObj, vertexShaderSrc);
//   gl.shaderSource(fragShaderObj, fragmentShaderSrc);
//   gl.compileShader(vertShaderObj);
//   gl.compileShader(fragShaderObj);

//   // initialize webgl program
//   const program = gl.createProgram();
//   gl.attachShader(program, vertShaderObj);
//   gl.attachShader(program, fragShaderObj);
//   gl.linkProgram(program);
//   gl.useProgram(program);

//   // look up where the vertex data needs to go.
//   var positionLocation = gl.getAttribLocation(program, 'a_position');
//   var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');

//   // lookup uniforms
//   var matrixLocation = gl.getUniformLocation(program, 'u_matrix');
//   var textureLocation = gl.getUniformLocation(program, 'u_texture');

//   // Create a buffer.
//   var positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Put a unit quad in the buffer
//   var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//   // Create a buffer for texture coords
//   var texcoordBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

//   // Put texcoords in the buffer
//   var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

//   // creates a texture info { width: w, height: h, texture: tex }
//   // The texture will start with 1x1 pixels and be updated
//   // when the image has loaded
//   function createTexture(image) {
//     var tex = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, tex);
//     // Fill the texture with a 1x1 blue pixel.
//     gl.texImage2D(
//       gl.TEXTURE_2D,
//       0,
//       gl.RGBA,
//       1,
//       1,
//       0,
//       gl.RGBA,
//       gl.UNSIGNED_BYTE,
//       new Uint8Array([0, 0, 255, 255])
//     );

//     // let's assume all images are not a power of 2
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

//     var textureInfo = {
//       width: image.width, // we don't know the size until it loads
//       height: image.height,
//       texture: tex
//     };

//     gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

//     return textureInfo;
//   }

//   function resizeCanvasToDisplaySize(canvas, multiplier) {
//     multiplier = multiplier || 1;
//     const width = (canvas.clientWidth * multiplier) | 0;
//     const height = (canvas.clientHeight * multiplier) | 0;
//     if (canvas.width !== width || canvas.height !== height) {
//       canvas.width = width;
//       canvas.height = height;
//       return true;
//     }
//     return false;
//   }

//   function draw(time, textureInfo) {
//     resizeCanvasToDisplaySize(gl.canvas);

//     // Tell WebGL how to convert from clip space to pixels
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//     gl.clear(gl.COLOR_BUFFER_BIT);

//     drawImage(
//       textureInfo.texture,
//       textureInfo.width,
//       textureInfo.height,
//       50 + 50 * Math.sin(time / 1000),
//       50 + 50 * Math.sin(time / 1000)
//     );
//   }

//   var then = 0;
//   function render(time) {
//     var now = time * 0.001;
//     var deltaTime = Math.min(0.1, now - then);
//     then = now;

//     const offscreen = document.createElement('canvas');
//     const offscreenCtx = offscreen.getContext('2d');
//     offscreenCtx.fillStyle = 'blue';
//     offscreenCtx.fillRect(0, 0, 100, 100);
//     offscreenCtx.fillStyle = 'green';
//     offscreenCtx.fillRect(25, 25, 50, 50);
//     createImageBitmap(offscreen).then((img) => {
//       var textureInfo = createTexture(img);
//       draw(time, textureInfo);
//     });

//     requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);

//   // Unlike images, textures do not have a width and height associated
//   // with them so we'll pass in the width and height of the texture
//   function drawImage(tex, texWidth, texHeight, dstX, dstY) {
//     gl.bindTexture(gl.TEXTURE_2D, tex);

//     // Tell WebGL to use our shader program pair
//     gl.useProgram(program);

//     // Setup the attributes to pull data from our buffers
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     gl.enableVertexAttribArray(positionLocation);
//     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
//     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
//     gl.enableVertexAttribArray(texcoordLocation);
//     gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

//     // this matrix will convert from pixels to clip space
//     var matrix = m4.orthographic(
//       0,
//       gl.canvas.width,
//       gl.canvas.height,
//       0,
//       -1,
//       1
//     );

//     // this matrix will translate our quad to dstX, dstY
//     matrix = m4.translate(matrix, dstX, dstY, 0);

//     // this matrix will scale our 1 unit quad
//     // from 1 unit to texWidth, texHeight units
//     matrix = m4.scale(matrix, texWidth, texHeight, 1);

//     // Set the matrix.
//     gl.uniformMatrix4fv(matrixLocation, false, matrix);

//     // Tell the shader to get the texture from texture unit 0
//     gl.uniform1i(textureLocation, 0);

//     // draw the quad (2 triangles, 6 vertices)
//     gl.drawArrays(gl.TRIANGLES, 0, 6);
//   }
// }

// main();
