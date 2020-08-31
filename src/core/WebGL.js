// adapted from https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html

class m4 {
  constructor() {}
  static orthographic(left, right, bottom, top, near, far, dst) {
    dst = dst || new Float32Array(16).fill(0);
    dst[0] = 2 / (right - left);
    dst[5] = 2 / (top - bottom);
    dst[10] = 2 / (near - far);
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;
    return dst;
  }
  static scale(m, sx, sy, sz, dst) {
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
    dst = new Float32Array(16);
    if (m !== dst) {
      dst[0] = m[0];
      dst[1] = m[1];
      dst[2] = m[2];
      dst[3] = m[3];
      dst[4] = m[1 * 4 + 0];
      dst[5] = m[1 * 4 + 1];
      dst[6] = m[1 * 4 + 2];
      dst[7] = m[1 * 4 + 3];
      dst[8] = m[2 * 4 + 0];
      dst[9] = m[2 * 4 + 1];
      dst[10] = m[2 * 4 + 2];
      dst[11] = m[2 * 4 + 3];
    }
    dst[12] = dst[0] * tx + dst[4] * ty + m[2 * 4 + 0] * tz + m[3 * 4 + 0];
    dst[13] = dst[1] * tx + dst[5] * ty + m[2 * 4 + 1] * tz + m[3 * 4 + 1];
    dst[14] = dst[2] * tx + dst[6] * ty + m[2 * 4 + 2] * tz + m[3 * 4 + 2];
    dst[15] = dst[3] * tx + dst[7] * ty + m[2 * 4 + 3] * tz + m[3 * 4 + 3];
    return dst;
  }
}

export class WebGL {
  constructor(gl) {
    this.gl = gl;

    const vertexShaderSrc = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    
    uniform mat4 u_matrix;
    
    varying vec2 v_texcoord;
    
    void main() {
       gl_Position = u_matrix * a_position;
       v_texcoord = a_texcoord;
    }
    `;

    const fragmentShaderSrc = `
    precision mediump float;
              
    varying vec2 v_texcoord;
    
    uniform sampler2D u_texture;
    
    void main() {
       gl_FragColor = texture2D(u_texture, v_texcoord);
    }
    `;

    const vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
    const fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertShaderObj, vertexShaderSrc);
    gl.shaderSource(fragShaderObj, fragmentShaderSrc);
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
    this.texcoordLocation = gl.getAttribLocation(this.program, 'a_texcoord');

    // lookup uniforms
    this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.textureLocation = gl.getUniformLocation(this.program, 'u_texture');

    // Create a buffer.
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // Put a unit quad in the buffer
    var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coords
    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    // Put texcoords in the buffer
    var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    // enable alpha
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  createTexture(image) {
    const gl = this.gl;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var textureInfo = {
      width: image.width, // we don't know the size until it loads
      height: image.height,
      texture: tex
    };

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    return textureInfo;
  }

  drawImage(textureInfo, x, y) {
    const gl = this.gl;
    // this.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const { texture, width, height } = textureInfo;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell WebGL to use our shader program pair
    gl.useProgram(this.program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.enableVertexAttribArray(this.texcoordLocation);
    gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

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
}
