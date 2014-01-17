
package ;

import js.html.webgl.*;

@:expose("Renderer")
class Renderer 
{

var GL = js.html.webgl.RenderingContext;

var gl:js.html.webgl.RenderingContext;


var mvMatrix:Dynamic;
var pMatrix:Dynamic; 
var shaderProgram:GLProgram;
var height:Int;
var width:Int;
var matx4:Dynamic;

var targets:Array<Renderable>;

public function new(canvas:js.html.Element) {
    matx4 = untyped __js__('mat4');
   	mvMatrix = matx4.create();
    pMatrix = matx4.create();
    initGL(cast(canvas,js.html.CanvasElement));
   	initShaders();
    targets = new Array();
    targets.push(new Hex());
    targets.push(new Hex());
   	initBuffers();

	gl.clearColor(0.2, 0.2, 0.2, 1.0);
   	gl.enable(GL.DEPTH_TEST);
}

public function draw()
{
	drawScene();
}



function initBuffers() {
  for( item in targets )
  {
    item.bindBuffers(gl);
  }
  //Hex.bindBuffers(gl);
};

function drawScene() {
    gl.viewport(0, 0, width,height);
    gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    
    matx4.perspective(pMatrix, .7854, width / height, 0.1, 100.0);
    
    matx4.identity(mvMatrix);
    matx4.translate(mvMatrix, mvMatrix, [-4.5, 0.0, -7.0]);

    for( item in targets )
    {
      matx4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
      shaderProgram.mvMatrix = mvMatrix;
      shaderProgram.pMatrix = pMatrix;
      item.draw(gl,shaderProgram);
    }
};

function initGL(canvas:js.html.CanvasElement) {
    try {
      canvas.width = js.Browser.window.screen.width;
      canvas.height = js.Browser.window.screen.height;
      gl = canvas.getContextWebGL();
      width = canvas.width;
      height = canvas.height;
    } catch(unknown : Dynamic) {
    }
    if (gl == null) {
      js.Lib.alert('Could not initialise WebGL, sorry :-( ');
    }
};

function initShaders() {
    var fragmentShader = getShader(ShaderDefs.shadervs,"vertex");
    var vertexShader = getShader(ShaderDefs.shaderfs,"fragment");

    untyped{ shaderProgram = gl.createProgram(); }
    gl.attachShader(shaderProgram,vertexShader);
    gl.attachShader(shaderProgram,fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!cast(gl.getProgramParameter(shaderProgram, GL.LINK_STATUS),Bool)) {
      js.Lib.alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
};

function getShader(str:String,type:String):Shader {
      var shader;
      if (type == "fragment") {
          shader = gl.createShader(GL.FRAGMENT_SHADER);
      } else if (type == "vertex") {
          shader = gl.createShader(GL.VERTEX_SHADER);
      } else {
          return null;
      }
      gl.shaderSource(shader, str);
      gl.compileShader(shader);
      if (!cast(gl.getShaderParameter(shader, GL.COMPILE_STATUS),Bool)) {
          js.Lib.alert(gl.getShaderInfoLog(shader));
          return null;
      }
      return shader;
};

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

}



