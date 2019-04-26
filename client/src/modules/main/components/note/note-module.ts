require('quill/dist/quill.snow.css');
import Quill from 'quill';

import './note-module.scss';

import {Note, NotebookState} from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';

import Lang from '../../../../components/language/lang';

import { Router } from '../../../../services/router/router-service';

import {Tab} from '../../../../components/tabMenu/tab';

export default class NoteModule extends Tab {
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

    public setNote( content : any ){
        this.editor.setContents(content);
    }

    public getItem( notebookState: NotebookState ){
        const noteService : NoteService = new NoteService();
        noteService.getNote(notebookState.notebook.id, notebookState.chapter.id, notebookState.note.id).then((note:Note) => {
            noteService.getNoteContent(notebookState.notebook.id, notebookState.chapter.id, notebookState.note.id).then((content:any) => {
                this.setNote(JSON.parse(content));
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
