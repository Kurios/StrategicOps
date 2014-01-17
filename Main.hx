
package ;

class Main 
{
    static function main() {
        trace("Hello World !");
    }

    function webGLStart() {
   		var context = new Renderer(document.getElementById("canvas"));
   		context.draw();
	}
}