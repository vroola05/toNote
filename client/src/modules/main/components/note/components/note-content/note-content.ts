require('quill/dist/quill.snow.css');
import Quill from 'quill';
import DateFormat from '../../../../../../components/date-format/date-format';
import ConfigService from '../../../../../../services/config/configService';
import TitlebarComponent from './components/titlebar/titlebar-component';
import DatebarComponent from './components/datebar/datebar-component';
import ToolbarComponent from './components/toolbar/toolbar-component';
import Lang from '../../../../../../components/language/lang';
import { EventEmitter } from 'events';
import { Note } from 'types';

export default class NoteContentComponent {
    public dom: HTMLDivElement;
    
    private titlebarComponent = new TitlebarComponent
    private dateCreated: DatebarComponent;
    private dateModified: DatebarComponent;

    private editor : Quill;
    private hidden: boolean = true;
    private onanimationend: any;
    private toolbar: ToolbarComponent;

    public event = new EventEmitter();

    private timeout: any = null;

    private note: Note;

    constructor() {
        this.dom = document.createElement('div');
        this.dom.className = "noteContent loaded inactive";

        this.toolbar = new ToolbarComponent();
        this.dom.appendChild(this.toolbar.dom);
        const noteHeaderContainer: HTMLDivElement = document.createElement('div');
        noteHeaderContainer.className = "noteHeaderContainer";
        this.dom.appendChild(noteHeaderContainer);
        
        this.titlebarComponent = new TitlebarComponent();
        noteHeaderContainer.appendChild(this.titlebarComponent.dom);
        this.titlebarComponent.event.on("change", (text: string) => {
            if(this.note) {
                this.note.name = text;
                this.event.emit("change", this.note);
            }
        });

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
                toolbar: this.toolbar.dom
            }
        });
        this.editor.on("text-change", (delta, oldDelta, source: string) => {
            
            if (source == "user") {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.event.emit("text-change", this.getContent());
                }, ConfigService.get().content.delay);
            }
        });

        this.dom.addEventListener("animationend", (a) => {
            this.dom.classList.remove("loading");
            this.dom.classList.add("loaded");
            
            if(this.onanimationend !== undefined) {
                this.onanimationend();
            }

            this.toolbar.setToolbarGroupsWidth();
            this.toolbar.calculateToolbarPages();
        });
    }

    public setNote(note: Note) : void {
        this.clear();
        this.note = note;
        this.setTitle(note.name);
        this.setDateCreated(note.creationDate);
        this.setDateModified(note.modifyDate);
    }
    
    public clear() : void {
        this.note = null;
        this.setContent("");
        this.setTitle("");
        this.setDateCreated(null);
        this.setDateModified(null);
        this.toolbar.clear();
    }

    private setTitle( title: string ) : void {
        this.titlebarComponent.value(title);
    }

    public setDateCreated( date: Date ) : void {
        if (!date) {
            this.dateCreated.value("");    
        } else {
            this.dateCreated.value(Lang.get("main_note_header_created") +": "+ DateFormat.get(date));
        }
    }

    public setDateModified( date: Date ) : void {
        if (!date) {
            this.dateCreated.value("");    
        } else {
            this.dateModified.value(Lang.get("main_note_header_modified") +": "+ DateFormat.get(date));
        }
    }

    public setContent( content : any ) : void {
        this.editor.setContents(content);
    }

    public getContent() : any{
        return this.editor.getContents();
    }

    public hide(onanimationend: any = undefined) : void {
        if( !this.hidden ){
            this.onanimationend = (e:any)=> { 
                if(onanimationend) {
                    onanimationend(e);
                }
            }
            this.hidden = true;
            this.dom.classList.remove("loaded");
            this.dom.classList.add("loading");
            this.dom.classList.add("inactive");
            this.dom.classList.remove("active");
        }
        
    }

    public show(onanimationend: any = undefined) : void {
        if( this.hidden ){
            this.onanimationend = (e:any)=>{
                if(onanimationend){
                    onanimationend(e);
                }
            };
            this.hidden = false;
            this.dom.classList.add("loading");
            this.dom.classList.remove("inactive");
            this.dom.classList.add("active");
        }
    }
}
