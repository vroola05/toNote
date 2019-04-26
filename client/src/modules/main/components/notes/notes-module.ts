import './notes-module.scss';

import Lang from '../../../../components/language/lang';

import { Note, NotebookState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NoteService } from '../../../../services/http/note-service';

import {TabMenu} from '../../../../components/tabMenu/tab-menu';


export default class ChaptersModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notes_name")], 
            ["add", Lang.get("notes_add")]
        ]);
        super(labels, "notes");
    }

    public click(item:any, identifier:number, name:string, note:Note){
        let state = Router.getCurrentState();
        let notebookState: NotebookState = state.value;
        notebookState.note = note;
        state.value = notebookState;

        Router.set(state, name +" - "+ Lang.get("state_title_note") , "note" );
    }

    public getItems(notebookState: NotebookState){
        const noteService : NoteService = new NoteService();
        noteService.getNotes(notebookState.notebook.id, notebookState.chapter.id).then((notebooks:Array<Note>) => {
            this.clear();
            if(notebooks !== null ){
                for(let i in notebooks){
                    this.addItem(notebooks[i].id, notebooks[i].name, notebooks[i], undefined);
                }
                if(notebookState!=null && notebookState.note!==undefined){
                    this.setMenuItemActive(notebookState.note.id);
                }
            }
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }
}
