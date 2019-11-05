import svgRename from '../../../../assets/images/rename.svg';
import svgMove from '../../../../assets/images/move.svg';
import svgDelete from '../../../../assets/images/delete.svg';

import Lang from '../../../../components/language/lang';
import { Note, MainState, Message } from '../../../../types';
import { Router } from '../../../../services/router/router-service';
import { NoteService } from '../../../../services/http/note-service';
import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';

import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';

export default class NotesComponent extends TabMenu {
    private notebookId : number;
    private chapterId : number;

    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notes_name")], 
            ["add", Lang.get("notes_add")]
        ]);
        super(labels, "notes", TabMenu.COLOR_TYPE_MENU_COLOR);

        this.dropdownMenu.addItem(new MenuItemComponent(svgRename, Lang.get("ctx_rename"), (e:any) => {
            //Do nothing
        }));
        this.dropdownMenu.addItem(new MenuItemComponent(svgMove, Lang.get("ctx_move"), (e:any) => {
            //Do nothing
        }));
        this.dropdownMenu.addItem(new MenuItemComponent(svgDelete, Lang.get("ctx_remove"), (e:any) => {
            //Do nothing
        }));
    }

    public click(item:any, identifier:number, name:string, note:Note){
        let state = Router.getCurrentState();
        let mainState: MainState = state.value;
        mainState.note = note;
        state.value = mainState;

        Router.set(state, Lang.get("state_title_note") + " - "+ name  , "note" );
    }

    public getItems(mainState: MainState) : Promise<Array<Note>> {
        const noteService : NoteService = new NoteService();

        if(this.hasItems() && this.notebookId == mainState.notebook.id && this.chapterId == mainState.chapter.id){
            return new Promise((resolve, reject) => {
                resolve(this.getObjects());
            });
        }
        this.notebookId = mainState.notebook.id;
        this.chapterId = mainState.chapter.id;
        return noteService.getNotes(mainState.notebook.id, mainState.chapter.id).then((notes:Array<Note>) => {
            this.clear();
            if(notes !== null ){
                for(let i in notes){
                    this.addItem(notes[i].id, notes[i].name, notes[i], undefined);
                }
                if(mainState!=null && mainState.note!==null){
                    this.setMenuItemActive(mainState.note.id);
                }
            }
            return notes;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error;
        });
    }

    public clickNewItem(e: Event) {
        const newPopup = new PopupInputComponent(Lang.get("popup_new_title"), Lang.get("chapters_name"), '');
        newPopup.click = (e, object, value) => {
            if(value===''){
                newPopup.setError("<span>"+Lang.get("popup_new_msg_empty")+"</span>");
                return;
            }
            const note = new Note();
            note.name = value;
            note.sectionId = this.chapterId;

            const notebookService = new NoteService();
            notebookService.postNote(this.notebookId, this.chapterId, note).then((message:Message) => {
                if(message.status === 200){
                    for(let i=0; i<message.info.length; i++){
                        if(message.info[i].id === "id"){
                            note.id = Number(message.info[i].value);
                            this.addItem(note.id, note.name, note, undefined);
                        }
                    }
                    
                    newPopup.hide();
                } else {
                    if(message.info){
                        let error = "";
                        for(let i=0; i<message.info.length; i++){
                            error += "<span>" + message.info[i].value + "</span>";
                            
                        }
                        newPopup.setError(error);
                    }
                }
                
                
            }).catch((e)=>{

            });
        };
        newPopup.show();
    
    }
}
