// adapted from https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html

class m4 {
  constructor() {}
  static orthographic(left, right, bottom, top, near, far, dst) {
    dst = dst || new Float32Array(16);
    dst[0] = 2 / (right - left);
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 2 / (top - bottom);
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;
    return dst;
  }
  static scale(m, sx, sy, sz, dst) {
    // This is the optimized version of
    // return multiply(m, scaling(sx, sy, sz), dst);
    dst = dst || new Float32Array(16);

    dst[0] = sx * m[0 * 4 + 0];
    dst[1] = sx * m[0 * 4 + 1];
    dst[2] = sx * m[0 * 4 + 2];
    dst[3] = sx * m[0 * 4 + 3];
    dst[4] = sy * m[1 * 4 + 0];
    dst[5] = sy * m[1 * 4 + 1];
    dst[6] = sy * m[1 * 4 + 2];
    dst[7] = sy * m[1 * 4 + 3];
    dst[8] = sz * m[2 * 4 + 0];
    dst[9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  }

  static translate(m, tx, ty, tz, dst) {
    // This is the optimized version of
    // return multiply(m, translation(tx, ty, tz), dst);
    dst = dst = dst || new Float32Array(16);

    var m00 = m[0];
    var m01 = m[1];
    var m02 = m[2];
    var m03 = m[3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];

    if (m !== dst) {
      dst[0] = m00;
      dst[1] = m01;
      dst[2] = m02;
      dst[3] = m03;
      dst[4] = m10;
      dst[5] = m11;
      dst[6] = m12;
      dst[7] = m13;
      dst[8] = m20;
      dst[9] = m21;
      dst[10] = m22;
      dst[11] = m23;
    }

    dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
    dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
    dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
    dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

    return dst;
  }
}

export class WebGL {
  // just pass a webgl context
  constructor(ctx) {
    this.gl = ctx;
    this.vertexShaderSrc = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;

    uniform mat4 u_matrix;

    varying vec2 v_texcoord;

    void main() {
    gl_Position = u_matrix * a_position;
    v_texcoord = a_texcoord;
    }
    `;
    this.fragmentShaderSrc = `
    precision mediump float;

    varying vec2 v_texcoord;

    uniform sampler2D u_texture;

    void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
    }
    `;
    this.unitQuad = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    this.setup(this.gl);
  }

  setup(gl) {
    // set up shader from text source
    const vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
    const fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertShaderObj, this.vertexShaderSrc);
    gl.shaderSource(fragShaderObj, this.fragmentShaderSrc);
    gl.compileShader(vertShaderObj);
    gl.compileShader(fragShaderObj);

    // initialize webgl program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertShaderObj);
    gl.attachShader(this.program, fragShaderObj);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    // look up where the vertex data needs to go.
    this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
    this.texcoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');

    // lookup uniforms
    this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.textureLocation = gl.getUniformLocation(this.program, 'u_texture');

    // Create a buffer.
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // put unit quad in buffer
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.unitQuad),
      gl.STATIC_DRAW
    );

    // Create a buffer for texture coords
    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    // Put texcoords in the buffer
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.unitQuad),
      gl.STATIC_DRAW
    );
  }

  createTexture(image) {
    const gl = this.gl;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const textureInfo = {
      width: image.width,
      height: image.height,
      texture: tex
    };
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return textureInfo;
  }

  drawImage(img, x, y) {
    this.render(this.gl, img, x, y);
  }

  drawTexture(textureInfo, x, y) {
    const gl = this.gl;
    const { texture, width, height } = textureInfo;

    this.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell WebGL to use our shader program pair
    gl.useProgram(this.program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    // gl.enableVertexAttribArray(this.texcoordLocation);
    // gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matrix will convert from pixels to clip space
    var matrix = m4.orthographic(
      0,
      gl.canvas.width,
      gl.canvas.height,
      0,
      -1,
      1
    );

    // this matrix will translate our quad to dstX, dstY
    matrix = m4.translate(matrix, x, y, 0);
    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, width, height, 1);
    // Set the matrix.
    gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(this.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || window.devicePixelRatio;
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  //   render(gl, image, x, y) {
  //     // Set a rectangle the same size as the image.
  //     this.setRectangle(gl, x, y, image.width, image.height);

  //     // provide texture coordinates for the rectangle.
  //     var texcoordBuffer = gl.createBuffer();
  //     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  //     gl.bufferData(
  //       gl.ARRAY_BUFFER,
  //       new Float32Array(this.unitQuad),
  //       gl.STATIC_DRAW
  //     );

  //     // Create a texture.
  //     var texture = gl.createTexture();
  //     gl.bindTexture(gl.TEXTURE_2D, texture);

  //     // Set the parameters so we can render any size image.
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  //     // Upload the image into the texture.
  //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  //     // lookup uniforms
  //     var resolutionLocation = gl.getUniformLocation(
  //       this.program,
  //       'u_resolution'
  //     );

  //     // Tell WebGL how to convert from clip space to pixels
  //     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //     // Clear the canvas
  //     gl.clearColor(0, 0, 0, 0);
  //     gl.clear(gl.COLOR_BUFFER_BIT);

  //     // Tell it to use our program (pair of shaders)
  //     gl.useProgram(this.program);

  //     // Turn on the position attribute
  //     gl.enableVertexAttribArray(this.positionLocation);

  //     // Bind the position buffer.
  //     gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

  //     gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

  //     // Turn on the texcoord attribute
  //     gl.enableVertexAttribArray(this.texcoordLocation);

  //     // bind the texcoord buffer.
  //     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

  //     // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  //     gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  //     // set the resolution
  //     gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  //     // Draw the rectangle.
  //     var primitiveType = gl.TRIANGLES;
  //     var offset = 0;
  //     var count = 6;
  //     gl.drawArrays(primitiveType, offset, count);
  //   }

  //   setRectangle(gl, x, y, width, height) {
  //     var x1 = x;
  //     var x2 = x + width;
  //     var y1 = y;
  //     var y2 = y + height;
  //     gl.bufferData(
  //       gl.ARRAY_BUFFER,
  //       new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
  //       gl.STATIC_DRAW
  //     );
  //   }
}
