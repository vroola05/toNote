require('quill/dist/quill.snow.css');
import Quill from 'quill';

import './note-component.scss';

import {Note, MainState} from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';

import Lang from '../../../../components/language/lang';

import { Router } from '../../../../services/router/router-service';

import {Tab} from '../../../../components/tabMenu/tab';

export default class NoteComponent extends Tab {
    private notebookId : number = null;
    private chapterId : number = null;
    private noteId : number = null;

    private object: any;

    private editor : Quill;
    constructor(){
        super();
        this.domTab.className = this.domTab.className +" tabNote";

        var noteContainer = <HTMLDivElement>(document.createElement('div'));
        noteContainer.className = "noteContainer";
        this.domTab.appendChild(noteContainer);

        this.editor =  new Quill(noteContainer, {
            theme: 'snow'
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
