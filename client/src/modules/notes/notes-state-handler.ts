import {State, IStateHandler} from "../../services/state/types"
import NotesModule from './notes-module';

import {Note} from '../../api/types';
import { NoteService } from '../../services/http/note-service';


export class NotesStateHandler implements IStateHandler {
    private notesModule : NotesModule;

    constructor( notesModule : NotesModule ){
        this.notesModule = notesModule;
    }

    public load( state : State ) : boolean{

        
        const noteService : NoteService = new NoteService();
        const self = this;
        noteService.getNotes(state.value, 0).then(function(notebooks:Array<Note>){
            self.notesModule.removeItems();
            if(notebooks !== null ){
                for(let i in notebooks){
                    self.notesModule.addItem(notebooks[i].name, notebooks[i].id, undefined);
                }
            }
            self.notesModule.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
        
        return true;
    }
}