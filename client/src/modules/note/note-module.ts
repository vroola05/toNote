require('quill/dist/quill.snow.css');
import Quill from 'quill';

import './note-module.scss';

import {Note} from '../../api/types';


import Lang from '../../components/language/lang';

import { StateService } from '../../services/state/state-service';

import {Tab} from '../../components/tabMenu/tab';

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

    public setNote( note : Note ){
        this.editor.setContents(note.note);
    }
}
