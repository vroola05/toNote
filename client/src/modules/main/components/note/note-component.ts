import { Note, MainState, Message } from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';


import { Tab } from '../../../../components/controls/tabMenu/tab';
import OverlayComponent from './components/overlay/overlay-component';
import NoteContentComponent from './components/note-content/note-content';
import { Constants } from '../../../../services/config/constants';
import { Util } from '../../../../components/util/util';

export default class NoteComponent extends Tab {
    private notebookId : number = null;
    private chapterId : number = null;
    private noteId : number = null;
    private noteService : NoteService;
    private overlayComponent: OverlayComponent;
    private noteContentComponent: NoteContentComponent;

    private object: any;

    constructor(){
        super();

        this.noteService = new NoteService();

        this.dom.className = this.dom.className +" tabNote";

        this.overlayComponent = new OverlayComponent();
        this.dom.appendChild(this.overlayComponent.dom);

        this.noteContentComponent = new NoteContentComponent();
        this.dom.appendChild(this.noteContentComponent.dom);
        this.noteContentComponent.event.on("text-change", text => {
            this.noteService.putNoteContent(this.notebookId, this.chapterId, this.noteId, text)
            .then((message: Message) => {
                this.noteContentComponent.setDateModified(this.getInfoValue(message.info, "modifyDate"));
            });
        });
        this.noteContentComponent.event.on("change", text => {
        });
    }

    /**
     * 
     */
    public onHide() : void{
        if(Util.getDevice() == Constants.mobile) {
            this.noteContentComponent.hide();
            this.overlayComponent.show();
            this.clear();
        } else {
            this.noteContentComponent.hide(() => {
                this.overlayComponent.show(() => {
                    this.clear();
                });
            });
        }
    }

    public clear() : void {
        this.noteContentComponent.clear();
        this.notebookId = null;
        this.chapterId = null;
        this.noteId = null;
        this.object = null;
    }

    public hasContent() : boolean{
        return this.object != null;
    }

    public getItem( mainState: MainState ) : Promise<any> {
        if(this.hasContent() && this.notebookId == mainState.notebook.id && this.chapterId == mainState.chapter.id && this.noteId == mainState.note.id){
            return new Promise((resolve, reject) => {
                resolve(this.object);
            });
        }
        
        this.clear();

        this.notebookId = mainState.notebook.id;
        this.chapterId = mainState.chapter.id
        this.noteId = mainState.note.id;
        return this.noteService.getNote(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((note:Note) => {
            this.noteService.getNoteContent(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((content:any) => {
                this.noteContentComponent.setNote(note);
                
                if (content) {
                    this.object = JSON.parse(content);
                }
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
