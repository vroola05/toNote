import svgRename from '../../../../assets/images/rename.svg';
import svgDelete from '../../../../assets/images/delete.svg';
import svgMove from '../../../../assets/images/move.svg';
import svgColors from '../../../../assets/images/colors.svg';


import Lang from '../../../../components/language/lang';

import { Chapter, MainState, Message } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { ChapterService } from '../../../../services/http/chapter-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';


import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';
import PopupConfirmComponent from '../../../../components/popups/popup-confirm/popup-confirm-component';

export default class ChaptersComponent extends TabMenu {
    private notebookId : number;

    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("chapters_name")], 
            ["add", Lang.get("chapters_add")]
        ]);

        super(labels, "chapter", TabMenu.COLOR_TYPE_ITEM_COLOR);

        
        this.bindRenamePopup();
        this.dropdownMenu.addItem(new MenuItemComponent(svgMove, Lang.get("ctx_move"), (e:any) => {
            //Do nothing
        }));
        
        this.bindDeletePopup();

        this.dropdownMenu.addItem(new MenuItemComponent(svgColors, Lang.get("ctx_color"), (e:any) => {
            //Do nothing
        }));
    }

    public click(item:any, identifier:number, name:string, chapter:Chapter){
        let state = Router.getCurrentState();

        let mainState: MainState = state.value;
        mainState.chapter = chapter;
        mainState.note = null;
        state.value = mainState;
        
        Router.set(state, Lang.get("state_title_notes") +" - "+ name, "notes" );
    }

    public getItems(mainState: MainState) : Promise<Array<Chapter>> {
        const chapterService : ChapterService = new ChapterService();

        if (this.hasItems() && this.notebookId == mainState.notebook.id ){
            return new Promise((resolve, reject) => {
                if(mainState!=null && mainState.chapter!==undefined){
                    this.setMenuItemActive(mainState.chapter.id);
                }

                resolve(this.getObjects());
            });
        }

        this.notebookId = mainState.notebook.id;
        return chapterService.getChapters(mainState.notebook.id).then((chapters:Array<Chapter>) => {
            this.clear();
            if(chapters !== null ){
                for(let i in chapters){
                    this.addItem(chapters[i].id, chapters[i].name, chapters[i], chapters[i].color);
                }
                if(mainState!=null && mainState.chapter!==undefined){
                    this.setMenuItemActive(mainState.chapter.id);
                }
            }
            return chapters;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }

    private bindRenamePopup() {
        const menuItem = new MenuItemComponent(svgRename, Lang.get("ctx_rename"));
        this.dropdownMenu.addItem(menuItem);

        menuItem.click = (e:any) => {
            
            const renamePopup = new PopupInputComponent(Lang.get("popup_rename_title"), Lang.get("notebooks_name"), this.dropdownMenu.object.name);

            renamePopup.object = this.dropdownMenu.object;
            renamePopup.click = (e, object, value) => {
                if(value===""){
                    renamePopup.setError("<span>" + Lang.get("popup_rename_empty") + "</span>");
                    return;
                }
                object.object.name = value;

                const chapterService = new ChapterService();
                chapterService.putChapter(object.object.notebookId, object.object.id, object.object).then((message:Message) => {
                    if(message.status === 200){
                        object.setName(value);
                        object.object.name = value;
                        renamePopup.hide();
                    } else {
                        if(message.info){
                            let error = "";
                            for(let i=0; i<message.info.length; i++){
                                error += "<span>" + message.info[i].value + "</span>";
                                
                            }
                            renamePopup.setError(error);
                        }
                    }
                    
                    
                }).catch((e)=>{

                });
            };
            renamePopup.show();
        };
    }

    private bindDeletePopup() {
        
        const menuItem = new MenuItemComponent(svgDelete, Lang.get("ctx_remove"));
        this.dropdownMenu.addItem(menuItem);
        
        menuItem.click = (e:any) => {
            const deleteMsg = Lang.get("popup_delete_confirm_msg1") +this.dropdownMenu.object.name+ Lang.get("popup_delete_confirm_msg2");
            const deletePopup = new PopupConfirmComponent(Lang.get("popup_delete_title"), deleteMsg);
            deletePopup.object = this.dropdownMenu.object;

            deletePopup.click = (e, object) => {
                const chapterService = new ChapterService();
                chapterService.deleteChapter(object.object.notebookId, object.object.id).then((message:Message) => {
                    if(message.status === 200){
                        this.removeItem(object);
                        deletePopup.hide();
                    } else {
                        if(message.info){
                            let error = "";
                            for(let i=0; i<message.info.length; i++){
                                error += "<span>" + message.info[i].value + "</span>";
                                
                            }
                            deletePopup.setError(error);
                        }
                    }
                    
                    
                }).catch((e)=>{
    
                });
            };
            deletePopup.show();
        };
    }

    public clickNewItem(e: Event) {
        const newPopup = new PopupInputComponent(Lang.get("popup_new_title"), Lang.get("chapters_name"), '');
        newPopup.click = (e, object, value) => {
            if(value===''){
                newPopup.setError("<span>"+Lang.get("popup_new_msg_empty")+"</span>");
                return;
            }
            const chapter = new Chapter();
            chapter.name = value;
            chapter.notebookId = this.notebookId;

            const notebookService = new ChapterService();
            notebookService.postChapter(this.notebookId, chapter).then((message:Message) => {
                if(message.status === 200){
                    for(let i=0; i<message.info.length; i++){
                        if(message.info[i].id === "id"){
                            chapter.id = Number(message.info[i].value);
                            this.addItem(chapter.id, chapter.name, chapter, undefined);
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
