
package ;

class ShaderDefs 
{

public static var shaderfs = "
precision mediump float;

varying vec4 vColor;

void main(void) { 
   gl_FragColor = vColor;
 }";

public static var shadervs = "
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}";
}