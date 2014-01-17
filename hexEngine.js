function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var GLProgram = function() { }
GLProgram.__name__ = true;
GLProgram.__super__ = WebGLProgram;
GLProgram.prototype = $extend(WebGLProgram.prototype,{
	__class__: GLProgram
});
var Renderable = function() { }
Renderable.__name__ = true;
Renderable.prototype = {
	setMatrixUniforms: function(gl,program) {
		gl.uniformMatrix4fv(program.pMatrixUniform,false,program.pMatrix);
		gl.uniformMatrix4fv(program.mvMatrixUniform,false,program.mvMatrix);
	}
	,draw: function(gl,program) {
	}
	,bindBuffers: function(context) {
	}
	,__class__: Renderable
}
var Hex = function() {
	this.GL = WebGLRenderingContext;
};
Hex.__name__ = true;
Hex.__super__ = Renderable;
Hex.prototype = $extend(Renderable.prototype,{
	draw: function(gl,program) {
		gl.bindBuffer(34962,this.VertexPositionBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute,this.VertexPositionBuffer.itemSize,5126,true,0,0);
		gl.bindBuffer(34962,this.VertexColorBuffer);
		gl.vertexAttribPointer(program.vertexColorAttribute,this.VertexColorBuffer.itemSize,5126,true,0,0);
		this.setMatrixUniforms(gl,program);
		gl.drawArrays(5,0,this.VertexPositionBuffer.numItems);
	}
	,bindBuffers: function(gl) {
		this.VertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(34962,this.VertexPositionBuffer);
		var y = 0.5 * Math.sqrt(3);
		var vertices = [0.0,-1.0,0.0,y,-0.5,0.0,-1 * y,-0.5,0.0,y,0.5,0.0,-1 * y,0.5,0.0,0.0,1.0,0.0];
		gl.bufferData(34962,new Float32Array(vertices),35044);
		this.VertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(34962,this.VertexColorBuffer);
		var colors = [0.0,0.0,1.0,1.0,0.0,0.0,0.85,1.0,0.0,0.0,0.7,1.0,0.0,0.0,0.55,1.0,0.0,0.0,0.40,1.0,0.0,0.0,0.25,1.0];
		gl.bufferData(34962,new Float32Array(colors),35044);
		this.VertexPositionBuffer.itemSize = 3;
		this.VertexPositionBuffer.numItems = 6;
		this.VertexColorBuffer.itemSize = 4;
	}
	,__class__: Hex
});
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	console.log("Hello World !");
}
Main.webGLStart = function() {
	var context = new Renderer(js.Browser.document.getElementById("canvas"));
	context.draw();
}
var Renderer = function(canvas) {
	this.GL = WebGLRenderingContext;
	this.matx4 = mat4;
	this.mvMatrix = this.matx4.create();
	this.pMatrix = this.matx4.create();
	this.initGL(js.Boot.__cast(canvas , HTMLCanvasElement));
	this.initShaders();
	this.targets = new Array();
	this.targets.push(new Hex());
	this.targets.push(new Hex());
	this.initBuffers();
	this.gl.clearColor(0.2,0.2,0.2,1.0);
	this.gl.enable(2929);
};
Renderer.__name__ = true;
Renderer.prototype = {
	setMatrixUniforms: function() {
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,false,this.pMatrix);
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,false,this.mvMatrix);
	}
	,getShader: function(str,type) {
		var shader;
		if(type == "fragment") shader = this.gl.createShader(35632); else if(type == "vertex") shader = this.gl.createShader(35633); else return null;
		this.gl.shaderSource(shader,str);
		this.gl.compileShader(shader);
		if(!js.Boot.__cast(this.gl.getShaderParameter(shader,35713) , Bool)) {
			js.Lib.alert(this.gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}
	,initShaders: function() {
		var fragmentShader = this.getShader(ShaderDefs.shadervs,"vertex");
		var vertexShader = this.getShader(ShaderDefs.shaderfs,"fragment");
		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram,vertexShader);
		this.gl.attachShader(this.shaderProgram,fragmentShader);
		this.gl.linkProgram(this.shaderProgram);
		if(!js.Boot.__cast(this.gl.getProgramParameter(this.shaderProgram,35714) , Bool)) js.Lib.alert("Could not initialise shaders");
		this.gl.useProgram(this.shaderProgram);
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram,"aVertexPosition");
		this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram,"aVertexColor");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
		this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram,"uPMatrix");
		this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram,"uMVMatrix");
	}
	,initGL: function(canvas) {
		try {
			canvas.width = js.Browser.window.screen.width;
			canvas.height = js.Browser.window.screen.height;
			this.gl = js.html._CanvasElement.CanvasUtil.getContextWebGL(canvas,null);
			this.width = canvas.width;
			this.height = canvas.height;
		} catch( unknown ) {
		}
		if(this.gl == null) js.Lib.alert("Could not initialise WebGL, sorry :-( ");
	}
	,drawScene: function() {
		this.gl.viewport(0,0,this.width,this.height);
		this.gl.clear(16640);
		this.matx4.perspective(this.pMatrix,.7854,this.width / this.height,0.1,100.0);
		this.matx4.identity(this.mvMatrix);
		this.matx4.translate(this.mvMatrix,this.mvMatrix,[-4.5,0.0,-7.0]);
		var _g = 0, _g1 = this.targets;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			this.matx4.translate(this.mvMatrix,this.mvMatrix,[3.0,0.0,0.0]);
			this.shaderProgram.mvMatrix = this.mvMatrix;
			this.shaderProgram.pMatrix = this.pMatrix;
			item.draw(this.gl,this.shaderProgram);
		}
	}
	,initBuffers: function() {
		var _g = 0, _g1 = this.targets;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			item.bindBuffers(this.gl);
		}
	}
	,draw: function() {
		this.drawScene();
	}
	,__class__: Renderer
}
var ShaderDefs = function() { }
ShaderDefs.__name__ = true;
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
js.Lib = function() { }
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
if(!js.html) js.html = {}
if(!js.html._CanvasElement) js.html._CanvasElement = {}
js.html._CanvasElement.CanvasUtil = function() { }
js.html._CanvasElement.CanvasUtil.__name__ = true;
js.html._CanvasElement.CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0, _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
}
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Renderable.GL = WebGLRenderingContext;
ShaderDefs.shaderfs = "\r\nprecision mediump float;\r\n\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) { \r\n   gl_FragColor = vColor;\r\n }";
ShaderDefs.shadervs = "\r\nattribute vec3 aVertexPosition;\r\nattribute vec4 aVertexColor;\r\n\r\nuniform mat4 uMVMatrix;\r\nuniform mat4 uPMatrix;\r\n\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\r\n    vColor = aVertexColor;\r\n}";
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
