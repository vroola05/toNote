require('quill/dist/quill.snow.css');
import Quill from 'quill';

import './note-component.scss';

import {Note, MainState} from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';

import Lang from '../../../../components/language/lang';
import { Tab } from '../../../../components/controls/tabMenu/tab';
import InputComponent from '../../../../components/controls/input/input-component';
import DateFormat from '../../../../components/date/date';

export default class NoteComponent extends Tab {
    private notebookId : number = null;
    private chapterId : number = null;
    private noteId : number = null;

    private title: InputComponent;
    private dateCreated: InputComponent;
    private dateModified: InputComponent;

    private object: any;

    private editor : Quill;
    constructor(){
        super();
        this.domTab.className = this.domTab.className +" tabNote";

        const noteContainer: HTMLDivElement = document.createElement('div');
        noteContainer.className = "noteContainer";
        this.domTab.appendChild(noteContainer);

        const noteHeaderContainer: HTMLDivElement = document.createElement('div');
        noteHeaderContainer.className = "noteHeaderContainer";
        noteContainer.appendChild(noteHeaderContainer);
        
        this.dateCreated = new InputComponent("text", "dateCreated");
        noteHeaderContainer.appendChild(this.dateCreated.get());
        this.dateModified = new InputComponent("text", "dateModified");
        noteHeaderContainer.appendChild(this.dateModified.get());

        this.title = new InputComponent("text", "title");
        noteHeaderContainer.appendChild(this.title.get());


        const noteInnerContainer: HTMLDivElement = document.createElement('div');
        noteInnerContainer.className = "noteInnerContainer";
        noteContainer.appendChild(noteInnerContainer);

        const note: HTMLDivElement = document.createElement('div');
        note.className = "note";
        noteInnerContainer.appendChild(note);

        this.editor =  new Quill(note, { 
            theme: 'snow',
            modules: {
                toolbar: false
            }
        });
        
    }

    public hide(){
        this.editor.setContents("");
    }

    public setContent( content : any ){
        this.editor.setContents(content);
    }
    public hasContent() : boolean{
        return this.object != null;
    }

    public getItem( mainState: MainState ) : Promise<any>{
        const noteService : NoteService = new NoteService();

        if(this.hasContent() && this.notebookId == mainState.notebook.id && this.chapterId == mainState.chapter.id && this.noteId == mainState.note.id){
            return new Promise((resolve, reject) => {
                resolve(this.object);
            });
        }

        return noteService.getNote(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((note:Note) => {
        
            this.title.value(note.name);

            this.dateCreated.value(Lang.get("main_note_header_created") +": "+ DateFormat.get(note.creationDate));
            this.dateModified.value(Lang.get("main_note_header_modified") +": "+ DateFormat.get(note.modifyDate));

            noteService.getNoteContent(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((content:any) => {
                this.object = JSON.parse(content);
                this.setContent(this.object);
                return note;
            }).catch((error: Error) => {
                console.error(error.stack);   
                throw error 
            });
            
            this.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }

    
}
