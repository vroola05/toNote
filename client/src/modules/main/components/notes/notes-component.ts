import './notes-component.scss';

import Lang from '../../../../components/language/lang';

import { Note, MainState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NoteService } from '../../../../services/http/note-service';

import {TabMenu} from '../../../../components/tabMenu/tab-menu';


export default class NotesComponent extends TabMenu {
    private notebookId : number;
    private chapterId : number;

    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notes_name")], 
            ["add", Lang.get("notes_add")]
        ]);
        super(labels, "notes");
    }

    public click(item:any, identifier:number, name:string, note:Note){
        let state = Router.getCurrentState();
        let mainState: MainState = state.value;
        mainState.note = note;
        state.value = mainState;

        Router.set(state, name +" - "+ Lang.get("state_title_note") , "note" );
    }

    public getItems(mainState: MainState) : Promise<Array<Note>>{
        const noteService : NoteService = new NoteService();

        if(this.hasItems() && this.notebookId == mainState.notebook.id && this.chapterId == mainState.chapter.id){
            return new Promise((resolve, reject) => {
                resolve(this.getObjects());
            });
        }

        return noteService.getNotes(mainState.notebook.id, mainState.chapter.id).then((notes:Array<Note>) => {
            this.clear();
            if(notes !== null ){
                for(let i in notes){
                    this.addItem(notes[i].id, notes[i].name, notes[i], undefined);
                }
                if(mainState!=null && mainState.note!==null){
                    this.setMenuItemActive(mainState.note.id);
                }
            }
            return notes;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error;
        });
    }
}
