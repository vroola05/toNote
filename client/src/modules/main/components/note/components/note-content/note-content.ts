require('quill/dist/quill.snow.css');
import Quill from 'quill';

import TitlebarComponent from './components/titlebar/titlebar-component';
import DatebarComponent from './components/datebar/datebar-component';
import ToolbarComponent from './components/toolbar/toolbar-component';

export default class NoteContentComponent {
    public dom: HTMLDivElement;
    
    
    private titlebarComponent = new TitlebarComponent
    private dateCreated: DatebarComponent;
    private dateModified: DatebarComponent;

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

        const toolbar = new ToolbarComponent();
        this.dom.appendChild(toolbar.dom);
        const noteHeaderContainer: HTMLDivElement = document.createElement('div');
        noteHeaderContainer.className = "noteHeaderContainer";
        this.dom.appendChild(noteHeaderContainer);
        
        this.titlebarComponent = new TitlebarComponent();
        noteHeaderContainer.appendChild(this.titlebarComponent.dom);

        const noteDateContainer: HTMLDivElement = document.createElement('div');
        noteDateContainer.className = "dateContainer";
        noteHeaderContainer.appendChild(noteDateContainer);

        this.dateCreated = new DatebarComponent("created");
        noteDateContainer.appendChild(this.dateCreated.dom);
        this.dateModified = new DatebarComponent("modified");
        noteDateContainer.appendChild(this.dateModified.dom);

        const noteInnerContainer: HTMLDivElement = document.createElement('div');
        noteInnerContainer.className = "noteInnerContainer";
        this.dom.appendChild(noteInnerContainer);

        const note: HTMLDivElement = document.createElement('div');
        note.className = "note";
        noteInnerContainer.appendChild(note);

        this.editor =  new Quill(note, { 
            theme: 'snow',
            modules: {
                toolbar: toolbar.dom
            }
        });
        
    }

    public setTitle( title: string ){
        this.titlebarComponent.value(title);
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
