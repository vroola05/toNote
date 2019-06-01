require('quill/dist/quill.snow.css');
import Quill from 'quill';

import './note-content.scss';

import {Note} from '../../../../../../types';


import Lang from '../../../../../../components/language/lang';

import InputComponent from '../../../../../../components/controls/input/input-component';
import DateFormat from '../../../../../../components/date/date';


export default class NoteContentComponent {
    public dom: HTMLDivElement;
    
    private title: InputComponent;
    private dateCreated: InputComponent;
    private dateModified: InputComponent;

    private editor : Quill;
    private hidden: boolean = true;
    private onanimationend: any;

    constructor(){


        this.dom = document.createElement('div');
        this.dom.className = "noteContent loaded inactive";
        this.dom.addEventListener("animationend", (a) => {
            this.dom.classList.remove("loading");
            this.dom.classList.add("loaded");

            if(this.onanimationend !== undefined){
                this.onanimationend();
            }
        });

        const noteHeaderContainer: HTMLDivElement = document.createElement('div');
        noteHeaderContainer.className = "noteHeaderContainer";
        this.dom.appendChild(noteHeaderContainer);
        
        this.dateCreated = new InputComponent("text", "dateCreated");
        noteHeaderContainer.appendChild(this.dateCreated.get());
        this.dateModified = new InputComponent("text", "dateModified");
        noteHeaderContainer.appendChild(this.dateModified.get());

        this.title = new InputComponent("text", "title");
        noteHeaderContainer.appendChild(this.title.get());


        const noteInnerContainer: HTMLDivElement = document.createElement('div');
        noteInnerContainer.className = "noteInnerContainer";
        this.dom.appendChild(noteInnerContainer);

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

    public setTitle( title: string ){
        this.title.value(title);
    }

    public setDateCreated( date: string ){
        this.dateCreated.value(date);
    }

    public setDateModified( date: string ){
        this.dateModified.value(date);
    }

    public setContent( content : any ){
        this.editor.setContents(content);
    }

    public hide(onanimationend: any = undefined){
        if( !this.hidden ){
            this.onanimationend = onanimationend;
            this.hidden = true;
            this.dom.classList.remove("loaded");
            this.dom.classList.add("loading");
            this.dom.classList.add("inactive");
            this.dom.classList.remove("active");
        }
        
    }

    public show(onanimationend: any = undefined){
        if( this.hidden ){
            this.onanimationend = onanimationend;
            this.hidden = false;
            this.dom.classList.add("loading");
            this.dom.classList.remove("inactive");
            this.dom.classList.add("active");
        }
    }
}
