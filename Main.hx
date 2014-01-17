
package ;

class Main 
{
    static function main() {
        trace("Hello World !");
    }
    public static function webGLStart() {
   		var context = new Renderer(js.Browser.document.getElementById("canvas"));
   		context.draw();
	}
}