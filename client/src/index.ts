import Quill from 'quill';
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
          

        return 0;
    }
}

Startup.main();