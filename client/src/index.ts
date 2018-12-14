import Quill from 'quill';

import "./styles.scss";
import ConfigService from './services/config/configService';

import { StateService } from './services/state/state-service';
import { State, IStateHandler } from './services/state/types';

import LoginModule from './modules/login/login-module';
import NotebooksModule from './modules/notebooks/notebooks-module';
import ChaptersModule from './modules/chapters/chapters-module';
import NotesModule from './modules/notes/notes-module';

import { NotebooksStateHandler } from './modules/notebooks/notebooks-state-handler';
import { ChaptersStateHandler } from './modules/chapters/chapters-state-handler';
import { NotesStateHandler } from './modules/notes/notes-state-handler';

require('quill/dist/quill.snow.css');

class Startup {
    public static main(): number {

        ConfigService.getInstance();
        console.log('Hello World');

        /* var container = <HTMLDivElement>(document.createElement('div'));

        container.id = "editor";
        document.body.appendChild(container);

        var quill =  new Quill(container, {
            theme: 'snow'
        });*/

        ////////////////////////////////////////
        // 
        ////////////////////////////////////////
        StateService.register("notebooks", new NotebooksStateHandler());
        StateService.register("chapters", new ChaptersStateHandler());
        StateService.register("notes", new NotesStateHandler());

        var main = <HTMLDivElement>(document.createElement('div'));
        main.className = "main";
        document.body.appendChild(main);

        let notebooksModule = new NotebooksModule();
        let chaptersModule = new ChaptersModule();
        notebooksModule.setChild(chaptersModule);
        let notesModule = new NotesModule();
        chaptersModule.setChild(notesModule);

        main.appendChild(notebooksModule.get());
        main.appendChild(chaptersModule.get());
        main.appendChild(notesModule.get());

        notebooksModule.show();
        notebooksModule.addItem("Item 1",1, "#234567");
        notebooksModule.addItem("",2, "#234567");
        notebooksModule.addItem("Item 2",3, "#234567");
        notebooksModule.addItem("Item 3",4, "#234567");
        return 0;
    }
}

Startup.main();
