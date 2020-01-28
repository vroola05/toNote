import { Note, MainState, Message } from '../../../../types';
import { NoteService } from '../../../../services/http/note-service';


import { Tab } from '../../../../components/controls/tabMenu/tab';
import OverlayComponent from './components/overlay/overlay-component';
import NoteContentComponent from './components/note-content/note-content';
import { Constants } from '../../../../services/config/constants';
import { Util } from '../../../../components/util/util';
import { NoteComponentService } from './note-component-service';

export default class NoteComponent extends Tab {
    private notebookId : number = null;
    private chapterId : number = null;
    private noteId : number = null;
    private overlayComponent: OverlayComponent;
    private noteContentComponent: NoteContentComponent;

    private object: any;

    constructor(){
        super();
        this.dom.className = this.dom.className +" tabNote";

        this.overlayComponent = new OverlayComponent();
        this.dom.appendChild(this.overlayComponent.dom);

        this.noteContentComponent = new NoteContentComponent();
        this.dom.appendChild(this.noteContentComponent.dom);

        NoteComponentService.onNoteChanged((note:Note) => {
            NoteService.putNote(this.notebookId, this.chapterId, this.noteId, note)
            .then((message: Message) => {
                const date = this.getInfoValue(message.info, "modifyDate");
                this.noteContentComponent.setDateModified(date);
                note.modifyDate = date;
                NoteService.event.emit("change", note);
            });
        });

        NoteComponentService.onNoteTextChanged((text: any) => {
            NoteService.putNoteContent(this.notebookId, this.chapterId, this.noteId, text)
            .then((message: Message) => {
                this.noteContentComponent.setDateModified(this.getInfoValue(message.info, "modifyDate"));
            });
        });
        
    }

    /**
     * 
     */
    public onHide() : void {
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
        this.clear();
        this.notebookId = mainState.notebook.id;
        this.chapterId = mainState.chapter.id
        this.noteId = mainState.note.id;
        return NoteService.getNote(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((note:Note) => {
            NoteService.getNoteContent(mainState.notebook.id, mainState.chapter.id, mainState.note.id).then((content:any) => {
                this.noteContentComponent.setNote(note);
                if (content) {
                    this.object = JSON.parse(content);
                }
                this.noteContentComponent.setContent(this.object);

                if (!this.overlayComponent.isHidden()) {
                    this.overlayComponent.hide(() => {
                        this.noteContentComponent.show();
                    });
                } else {
                    this.noteContentComponent.show();
                }
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
