import "./styles.scss";
import ConfigService from './services/config/configService';
import Lang from './components/language/lang';

import { StateService } from './services/state/state-service';
import { State, IStateHandler } from './services/state/types';

import LoginModule from './modules/login/login-module';

import NotebooksModule from './modules/notebooks/notebooks-module';
import ChaptersModule from './modules/chapters/chapters-module';
import NotesModule from './modules/notes/notes-module';
import NoteModule from './modules/note/note-module';

import { LoginStateHandler } from './modules/login/login-state-handler';
import { NotebooksStateHandler } from './modules/notebooks/notebooks-state-handler';
import { ChaptersStateHandler } from './modules/chapters/chapters-state-handler';
import { NotesStateHandler } from './modules/notes/notes-state-handler';
import { NoteStateHandler } from './modules/note/note-state-handler';

class Startup {
    public static main(): number {
        var main = <HTMLDivElement>(document.createElement('div'));
        main.className = "main";
        document.body.appendChild(main);
        
        let loginModule = new LoginModule();

        let notebooksModule = new NotebooksModule();

        let chaptersModule = new ChaptersModule();
        notebooksModule.setChild(chaptersModule);

        let notesModule = new NotesModule();
        chaptersModule.setChild(notesModule);

        let noteModule = new NoteModule();
        notesModule.setChild(noteModule);

        var back = <HTMLDivElement>(document.createElement('div'));
        back.innerHTML = "Back";
        back.onclick = function(){
            notebooksModule.back();
        };
        document.body.appendChild(back);


        ////////////////////////////////////////
        // 
        ////////////////////////////////////////
        StateService.register("login", new LoginStateHandler(loginModule));
        StateService.register("notebooks", new NotebooksStateHandler(notebooksModule));
        StateService.register("chapters", new ChaptersStateHandler(chaptersModule));
        StateService.register("notes", new NotesStateHandler(notesModule));
        StateService.register("note", new NoteStateHandler(noteModule));

        ////////////////////////////////////////
        // 
        ////////////////////////////////////////
        main.appendChild(notebooksModule.get());
        main.appendChild(chaptersModule.get());
        main.appendChild(notesModule.get());
        main.appendChild(noteModule.get());

        ////////////////////////////////////////
        // 
        ////////////////////////////////////////
        new ConfigService( function() {
            StateService.set({ "key" : "notebooks", value : null}, Lang.get("state_title_notebooks"),"notebooks");
            //StateService.set({ "key" : "login", "id" : null}, Lang.get("login_title"),"login");
        } );
        
        
        return 0;
    }
}

Startup.main();
