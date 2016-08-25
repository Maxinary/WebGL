var drawings = [];
class Drawable{//would work well as a factory
  constructor(shaderAttributes, drawMod, abscoords){//for now: shape coord, tex coord, indexies
    this.shadeAttribs = shaderAttributes;
    this.shadeObjs = {};
    for(var key in shaderAttributes){
      this.shadeObjs[key] = gl.createBuffer();
    }
    this.drawMod = drawMod;
    this.coords = abscoords;
    this.rotation = [0,0,0];
  }
}

class World{
  constructor(world, width, length, playerPos){
    this.map = world;
    this.rowSize = width;
    this.numRows = length;
    this.numFloors = this.map.length/(width*length);
  }
  genStructure(){
    var m = new Drawable({
    "vertexPositionBuffer":[],
    "vertexTextureCoordBuffer":[],
    "vertexIndexBuffer":[],
    "vertexNormals":[]
    }, gl.TRIANGLES, [0.0,0.0,-1.0]);
    var count = 0;
    for(var ii=0;ii<this.map.length;ii++){
      if(this.map[ii]!==0){
        var x = ii%this.rowSize;
        var y = Math.floor((ii-(this.rowSize*this.numRows)*Math.floor(ii/(this.rowSize*this.numRows)))/this.rowSize);
        var z = Math.floor(ii/(this.rowSize*this.numRows));

        var xx = 2*x;
        var yy = 2*y;
        var zz = 2*z;
        //The (xyz)>0 is correct. Those values are adjusted, don't try to "fix" it
        
        if(y<this.numRows-1 && this.map[ii+this.rowSize]!=1){ // Front face: South
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([
            xx-1.0, zz-1.0, yy+1.0,
            xx+1.0, zz-1.0, yy+1.0,
            xx+1.0, zz+1.0, yy+1.0,
            xx-1.0, zz+1.0, yy+1.0
          ]);
          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3
          ]);
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0
          ]);
          count+=4;
        }
        if(y>0 && this.map[ii-this.rowSize]!=1){
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([
            // Back face: North
            xx-1.0, zz-1.0, yy-1.0,
            xx-1.0, zz+1.0, yy-1.0,
            xx+1.0, zz+1.0, yy-1.0,
            xx+1.0, zz-1.0, yy-1.0
          ]);
          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3
          ]);
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
          ]);
          count+=4;
        }

        if(z>0 && this.map[ii-this.rowSize*this.numRows]!=1){
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([
            // Bottom face: Down
            xx-1.0, zz-1.0, yy-1.0,
            xx+1.0, zz-1.0, yy-1.0,
            xx+1.0, zz-1.0, yy+1.0,
            xx-1.0, zz-1.0, yy+1.0
          ]);
          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3,    // Back face
          ]);
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
          ]);
          count+=4;
        }
        if(z<this.numFloors - 1 && this.map[ii+this.rowSize*this.numRows]!=1){
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([
            // Top face: Up
            xx-1.0,  zz+1.0, yy-1.0,
            xx-1.0,  zz+1.0, yy+1.0,
            xx+1.0,  zz+1.0, yy+1.0,
            xx+1.0,  zz+1.0, yy-1.0
          ]);

          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3,    // Front face
          ]);          
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0
          ]);
          count+=4;
        }

        if(x<this.rowSize-1 && this.map[ii+1]!=1){
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([ 
          // Right face: East
           xx+1.0, zz-1.0, yy-1.0,
           xx+1.0, zz+1.0, yy-1.0,
           xx+1.0, zz+1.0, yy+1.0,
           xx+1.0, zz-1.0, yy+1.0
          ]);
          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3,  // Top face
          ]);
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0
          ]);
          count+=4;
        }        
        if(x>0 && this.map[ii-1]!=1){
          m.shadeAttribs.vertexPositionBuffer = m.shadeAttribs.vertexPositionBuffer.concat([
            // Left face: West
            xx-1.0, zz-1.0, yy-1.0,
            xx-1.0, zz-1.0, yy+1.0,
            xx-1.0, zz+1.0, yy+1.0,
            xx-1.0, zz+1.0, yy-1.0
          ]);
          m.shadeAttribs.vertexTextureCoordBuffer = m.shadeAttribs.vertexTextureCoordBuffer.concat([
            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
          ]);
          m.shadeAttribs.vertexIndexBuffer = m.shadeAttribs.vertexIndexBuffer.concat([
            count, count+1, count+2,
            count, count+2, count+3
          ]);
          m.shadeAttribs.vertexNormals = m.shadeAttribs.vertexNormals.concat([
            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
          ]);
          count+=4;
        }
      }
    }
    return m;
  }
}

var gl;
function initGL(canvas) {
  try {
    canvas.width=document.body.clientWidth;
    canvas.height=document.body.clientHeight;
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {}
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

var shaderProgram;
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal"); 
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  
  shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length === 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function initBuffers() {
  drawings.push(new World([
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    
    1,1,1,1,1,1,1,
    1,1,0,0,0,1,1,
    1,0,0,0,0,0,1,
    1,0,0,0,0,0,1,
    1,0,0,0,0,0,1,
    1,1,0,0,0,1,1,
    1,1,1,1,1,1,1
  ], 7, 7).genStructure());
  
  for(var ii=0; ii<drawings.length; ii++){
    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawings[ii].shadeAttribs.vertexPositionBuffer), gl.STATIC_DRAW);
    drawings[ii].shadeObjs.vertexPositionBuffer.itemSize = 3;
    drawings[ii].shadeObjs.vertexPositionBuffer.numItems = drawings[ii].shadeAttribs.vertexPositionBuffer.length/3;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawings[ii].shadeAttribs.vertexTextureCoordBuffer), gl.STATIC_DRAW);
    drawings[ii].shadeObjs.vertexTextureCoordBuffer.itemSize = 2;
    drawings[ii].shadeObjs.vertexTextureCoordBuffer.numItems = drawings[ii].shadeAttribs.vertexTextureCoordBuffer.length/2;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, drawings[ii].shadeObjs.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(drawings[ii].shadeAttribs.vertexIndexBuffer), gl.STATIC_DRAW);
    drawings[ii].shadeObjs.vertexIndexBuffer.itemSize = 1;
    drawings[ii].shadeObjs.vertexIndexBuffer.numItems = drawings[ii].shadeAttribs.vertexIndexBuffer.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawings[ii].shadeAttribs.vertexNormals), gl.STATIC_DRAW);
    drawings[ii].shadeObjs.vertexNormals.itemSize = 3;
    drawings[ii].shadeObjs.vertexNormals.numItems = drawings[ii].shadeAttribs.vertexNormals.length/3;
  }
  console.log(drawings);
}

var thetaX = 0;
var thetaY = 0;
var thetaZ = 0;
worldShift = [0,0,0];
function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0, 0, 0, 0.3);

  mat4.perspective(45.0, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);

  mat4.rotate(mvMatrix, thetaX, [1, 0, 0]);
  mat4.rotate(mvMatrix, thetaY, [0, 1, 0]);
  mat4.rotate(mvMatrix, thetaZ, [0, 0, 1]);

  mat4.translate(mvMatrix,  worldShift);

  for(var ii=0;ii<drawings.length;ii++){
    mvPushMatrix();

    gl.uniform3f(
      shaderProgram.ambientColorUniform, 
      0.8, 0.8, 0.75
    );
    var adjustedLD = vec3.create();
    vec3.normalize([1, 0, 1], adjustedLD);
    vec3.scale(adjustedLD, -1);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
    gl.uniform3f(
      shaderProgram.directionalColorUniform,
      0.6, 0.5, 0.1
    );

    mat4.rotate(mvMatrix, drawings[ii].rotation[0], [1, 0, 0]);
    mat4.rotate(mvMatrix, drawings[ii].rotation[1], [0, 1, 0]);
    mat4.rotate(mvMatrix, drawings[ii].rotation[2], [0, 0, 1]);
    
    mat4.translate(mvMatrix,  drawings[ii].coords);

    //vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, drawings[ii].shadeObjs.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); 
    
    //normals
    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexNormals);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, drawings[ii].shadeObjs.vertexNormals.itemSize, gl.FLOAT, false, 0, 0);
    
    //texture Coords
    gl.bindBuffer(gl.ARRAY_BUFFER, drawings[ii].shadeObjs.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, drawings[ii].shadeObjs.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    //vertex index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, drawings[ii].shadeObjs.vertexIndexBuffer);

    setMatrixUniforms();
    gl.drawElements(drawings[ii].drawMod, drawings[ii].shadeObjs.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();
  }


}

var lastTime = 0;
function animate() {
  var timeNow = new Date().getTime();
  if (lastTime !== 0) {
    var elapsed = timeNow - lastTime;
  
    //rSquare += (75 * elapsed) / 1000.0;
  }
  lastTime = timeNow;
}

var tex;
function initTexture() {
  tex = gl.createTexture();
  tex.image = new Image();
  tex.image.onload = function() {
    handleLoadedTexture(tex);
  };

  tex.image.src = "good.jpg";
}

function handleLoadedTexture(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function tick(){
  requestAnimFrame(tick);
  move = [Math.sin(thetaY)/20, Math.cos(thetaY)/20];
  keyTick();
  drawScene();
  //animate();
}

var move = [1,0];
function webGLStart() {
  var canvas = document.getElementById("lesson01-canvas");
  initGL(canvas);
  initShaders();
  initBuffers();
  initTexture();

  registerKeyPress(buttonMove.hold, 38, function(){thetaX-=0.02;});
  registerKeyPress(buttonMove.hold, 40, function(){thetaX+=0.02;});
  registerKeyPress(buttonMove.hold, 37, function(){thetaY-=0.02;});
  registerKeyPress(buttonMove.hold, 39, function(){thetaY+=0.02;});

  registerKeyPress(buttonMove.hold, 83, function(){worldShift[0]+=move[0];worldShift[2]-=move[1];});
  registerKeyPress(buttonMove.hold, 87, function(){worldShift[0]-=move[0];worldShift[2]+=move[1];});
  registerKeyPress(buttonMove.hold, 65, function(){worldShift[0]+=move[1];worldShift[2]+=move[0];});
  registerKeyPress(buttonMove.hold, 68, function(){worldShift[0]-=move[1];worldShift[2]-=move[0];});
  registerKeyPress(buttonMove.hold, 16, function(){worldShift[1]+=1/20;});//down
  registerKeyPress(buttonMove.hold, 32, function(){worldShift[1]-=1/20;});//up

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  
  tick();
}