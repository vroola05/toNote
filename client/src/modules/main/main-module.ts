import './main-module.scss';
import Lang from '../../components/language/lang';

import { State, IRouter } from "../../services/router/types";
import { IWindow } from '../../components/iwindow/iwindow';
import { NotebookState } from '../../types';
import NotebooksModule from './components/notebooks/notebooks-module';
import ChaptersModule from './components/chapters/chapters-module';
import NotesModule from './components/notes/notes-module';
import NoteModule from './components/note/note-module';

export default class MainModule extends IWindow{
    protected notebooksModule:NotebooksModule = new NotebooksModule();
    protected chaptersModule:ChaptersModule = new ChaptersModule();
    protected notesModule:NotesModule = new NotesModule();
    protected noteModule:NoteModule = new NoteModule();

    constructor(){
        super("main", "Notities");
        let header = document.createElement("div");
        header.className = "header";
        let tabs = document.createElement("div");
        tabs.className = "tabs";
        this.append(header);
        this.append(tabs);

        var back = <HTMLDivElement>(document.createElement('div'));
        header.appendChild(back);
        back.innerHTML = "Back";
        back.onclick = () => {
            this.notebooksModule.back();
        };


        
        this.notebooksModule.setChild(this.chaptersModule);
        this.chaptersModule.setChild(this.notesModule);
        this.notesModule.setChild(this.noteModule);

        tabs.appendChild( this.notebooksModule.get());
        tabs.appendChild( this.chaptersModule.get());
        tabs.appendChild( this.notesModule.get());
        tabs.appendChild( this.noteModule.get());
    }

    public load( state : State ) : boolean {
        console.log(state);
        if(state.value== null){
            state.value = new NotebookState();
        }

        let notebookState : NotebookState = state.value;

        let currentState = this.getCurrentState(state.value);
        /*if(currentState=="note"){
            this.noteModule.show();
            this.notesModule.show();
            this.chaptersModule.show();
            this.notebooksModule.show();
            if(!this.notebooksModule.isSelectedMenuItem(notebookState.notebook.id)){
                this.notebooksModule.setMenuItemActive(notebookState.notebook.id);
                this.chaptersModule.getItems(notebookState);
            }
            if(!this.chaptersModule.isSelectedMenuItem(notebookState.chapter.id)){
                this.chaptersModule.setMenuItemActive(notebookState.chapter.id);
                this.notesModule.getItems(notebookState);
            }
            if(!this.notesModule.isSelectedMenuItem(notebookState.note.id)){
                this.notesModule.setMenuItemActive(notebookState.note.id);
                this.noteModule.getItem(notebookState);
            }
        }else
        if(currentState=="chapter"){
            this.noteModule.hide();
            
            this.notesModule.clearSelectedMenuItem();
            this.notesModule.show();
            this.chaptersModule.show();
            this.notebooksModule.show();
            if(!this.notebooksModule.isSelectedMenuItem(notebookState.notebook.id)){
                this.notebooksModule.setMenuItemActive(notebookState.notebook.id);
                this.chaptersModule.getItems(notebookState);
            }
            if(!this.chaptersModule.isSelectedMenuItem(notebookState.chapter.id)){
                
                this.chaptersModule.setMenuItemActive(notebookState.chapter.id);
                this.notesModule.getItems(notebookState);
            }
        }else
        if(currentState=="notebook"){
            this.noteModule.hide();

            this.notesModule.clearSelectedMenuItem();
            this.notesModule.hide();

            this.chaptersModule.clearSelectedMenuItem();
            this.chaptersModule.show();

            this.notebooksModule.show();
            
            if(!this.notebooksModule.isSelectedMenuItem(notebookState.notebook.id)){
                this.notebooksModule.setMenuItemActive(notebookState.notebook.id);    
                this.chaptersModule.getItems(notebookState);
            }
            console.log("aa");
            if(!this.notebooksModule.hasItems()){
                console.log("jajaja");
                this.notebooksModule.getItems(notebookState.notebook.id);
            }
        } else{
            
            this.notebooksModule.show();
            this.notebooksModule.getItems();
        }*/

        if(!this.notebooksModule.hasItems()){
            console.log("Get notebooks");
            this.notebooksModule.getItems(notebookState);
            this.notebooksModule.show();
        }
        if(notebookState.notebook!== undefined && notebookState.notebook.id != null && !this.notebooksModule.isSelectedMenuItem(notebookState.notebook.id)){
            this.chaptersModule.getItems(notebookState);
            this.chaptersModule.show();
        }
        if(notebookState.chapter !== undefined && notebookState.chapter.id != null && !this.chaptersModule.isSelectedMenuItem(notebookState.chapter.id)){
            this.notesModule.getItems(notebookState);
            this.notesModule.show();
        }

        this.show();
        return true;
        
    }

    private getCurrentState(notebookState : NotebookState){
        if(notebookState.notebook != null && notebookState.notebook.id != null){
            if(notebookState.chapter != null && notebookState.chapter.id != null){
                if(notebookState.note != null && notebookState.note.id != null){
                    return "note";
                }
                return "chapter";
            }
            return "notebook";
        }
        return null;
    }
}