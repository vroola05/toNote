import './note-component.scss';

import {Note, MainState} from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';

import Lang from '../../../../components/language/lang';
import { Tab } from '../../../../components/controls/tabMenu/tab';
import InputComponent from '../../../../components/controls/input/input-component';
import DateFormat from '../../../../components/date/date';
import OverlayComponent from './components/overlay/overlay-component';
import NoteContentComponent from './components/note-content/note-content';

export default class NoteComponent extends Tab {
    private notebookId : number = null;
    private chapterId : number = null;
    private noteId : number = null;

    private overlayComponent: OverlayComponent;
    private noteContentComponent: NoteContentComponent;

    private object: any;

    constructor(){
        super();
        this.domTab.className = this.domTab.className +" tabNote";

        this.overlayComponent = new OverlayComponent();
        this.domTab.appendChild(this.overlayComponent.dom);

        this.noteContentComponent = new NoteContentComponent();
        this.domTab.appendChild(this.noteContentComponent.dom);
    }

    public hide(){
        this.noteContentComponent.hide(() => {
            this.overlayComponent.show(() => {
                this.clear();
            });
        });
    }

    public clear(){
        this.noteContentComponent.setContent("");
        this.noteContentComponent.setTitle("");
        this.noteContentComponent.setDateCreated("");
        this.noteContentComponent.setDateModified("");
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
                this.noteContentComponent.setTitle(note.name);
                this.noteContentComponent.setDateCreated(Lang.get("main_note_header_created") +": "+ DateFormat.get(note.creationDate));
                this.noteContentComponent.setDateModified(Lang.get("main_note_header_modified") +": "+ DateFormat.get(note.modifyDate));

                this.object = JSON.parse(content);
                this.noteContentComponent.setContent(this.object);

                this.overlayComponent.hide(() => {
                    this.noteContentComponent.show();
                });

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
