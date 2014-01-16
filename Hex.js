 function webGLStart() {
   initGL(document.getElementById("canvas"));
   initShaders();
   initBuffers();

   gl.clearColor(0.2, 0.2, 0.2, 1.0);
   gl.enable(gl.DEPTH_TEST);

   drawScene();
   drawScene();
}

var triangle = [];
var square = [];

function initBuffers() {
    triangle.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.VertexPositionBuffer);
    var y  = 0.5 * Math.sqrt(3);
    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    triangle.VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.VertexColorBuffer);
    var colors = [
    	 0.0, 0.0, 1.0, 1.0,
    	 0.0, 0.0, 0.5, 1.0,
    	 0.0, 0.0, 0.0, 1.0
    ];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    triangle.VertexPositionBuffer.itemSize = 3;
    triangle.VertexPositionBuffer.numItems = 3;
    triangle.VertexColorBuffer.itemSize = 4;


	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    square.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square.VertexPositionBuffer);
    vertices = [
        0.0, -1.0,  0.0,
        y,  -0.5,  0.0,
        -1*y, -0.5,  0.0,
		y, 0.5,  0.0,
		-1*y,  0.5,  0.0,
         0.0,  1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    square.VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,square.VertexColorBuffer);
    colors = [
    	0.0, 0.0, 1.0,	1.0,
    	0.0, 0.0, 0.85,	1.0,
    	0.0, 0.0, 0.7,	1.0,
    	0.0, 0.0, 0.55, 1.0,
    	0.0, 0.0, 0.40, 1.0,
    	0.0, 0.0, 0.25,	1.0
    	];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    square.VertexPositionBuffer.itemSize = 3;
    square.VertexPositionBuffer.numItems = 6;
    square.VertexColorBuffer.itemSize = 4;
};

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(pMatrix, .7854, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangle.VertexPositionBuffer.itemSize, gl.FLOAT, true, 0, 0);
    setMatrixUniforms();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.VertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangle.VertexColorBuffer.itemSize, gl.FLOAT, true, 0,0);
    gl.drawArrays(gl.TRIANGLES, 0, triangle.VertexPositionBuffer.numItems);

    
    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, square.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, square.VertexPositionBuffer.itemSize, gl.FLOAT, true, 0, 0);
    setMatrixUniforms();
    gl.bindBuffer(gl.ARRAY_BUFFER, square.VertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, square.VertexColorBuffer.itemSize, gl.FLOAT, true, 0,0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.VertexPositionBuffer.numItems);
};

var gl;

function initGL(canvas) {
    try {
      canvas.width = window.screen.width;
      canvas.height = window.screen.height;
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-( ");
    }
};

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

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
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
};

function getShader(gl, id) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
          return null;
      }

      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
          if (k.nodeType == 3)
              str += k.textContent;
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
};

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function main()
{
	webGLStart();
}