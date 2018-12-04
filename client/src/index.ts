import Quill from 'quill';
import LoginModule from './modules/login/login-module';
import "./styles.scss";

require('quill/dist/quill.snow.css');

class Startup {
    public static main(): number {
        console.log('Hello World');

        var container = <HTMLDivElement>(document.createElement('div'));
        container.id = "editor";
        document.body.appendChild(container);

        var quill =  new Quill(container, {
            theme: 'snow'
        });
          
        var test:LoginModule = new LoginModule();
        test.print("This is just a test!");

        return 0;
    }
}

Startup.main();
