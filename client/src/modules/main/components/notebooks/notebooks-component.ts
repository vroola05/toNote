import svgRename from '../../../../assets/images/rename.svg';
import svgDelete from '../../../../assets/images/delete.svg';


import Lang from '../../../../components/language/lang';

import { Notebook, MainState, Message } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NotebookService } from '../../../../services/http/notebook-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';
import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';

export default class NotebooksComponent extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notebooks_name")], 
            ["add", Lang.get("notebooks_add")]
        ]);
        super(labels, "notebook");

        this.bindRenamePopup();
        this.bindDeletePopup();
    }

    public click(item:any, identifier:number, name:string, notebook:Notebook){
        let state = Router.getCurrentState();
        let mainState = new MainState();
        mainState.notebook = notebook;
        state.value = mainState;
        Router.set(state, Lang.get("state_title_chapters") +" - "+ name, "notebook" );
    }

    public getItems(mainState: MainState=null) : Promise<any>{
        const notebookService = new NotebookService();
        if(this.hasItems()){
            return new Promise((resolve, reject) => {
                if(mainState!=null && mainState.notebook!==undefined){
                    this.setMenuItemActive(mainState.notebook.id);
                }
                resolve(this.getObjects());
                
            });
        }
        return notebookService.getNotebooks().then((notebooks:Array<Notebook>) => {
            this.clear();
            if(notebooks !== null ){
                for(let i in notebooks){
                    this.addItem(notebooks[i].id, notebooks[i].name, notebooks[i], undefined);
                }
                if(mainState!=null && mainState.notebook!==undefined){
                    this.setMenuItemActive(mainState.notebook.id);
                }
            }
            return notebooks;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }

    private bindRenamePopup() {
        
        const menuItem = new MenuItemComponent(svgRename, Lang.get("ctx_rename"));
        this.dropdownMenu.addItem(menuItem);

        menuItem.click = (e:any) => {
            const object = this.dropdownMenu.object;
            const renamePopup = new PopupInputComponent(Lang.get("popup_rename_title"), Lang.get("notebooks_name"), object.name);
            renamePopup.setObject(object)
            renamePopup.click = (e, object, value) => {
                const notebook = Object.assign({},object);
                notebook.name = value;

                const notebookService = new NotebookService();
                notebookService.putNotebook(object.id, notebook).then((message:Message) => {
                    if(message.status === 200){
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
        this.dropdownMenu.addItem(new MenuItemComponent(svgDelete, Lang.get("ctx_remove"), (e:any) => {
            //Do nothing
        }));
    }

    public clickNewItem(e: Event) {
        
        const newPopup = new PopupInputComponent(Lang.get("popup_new_title"), Lang.get("notebooks_name"), '');
        
        newPopup.click = (e, object, value) => {
            const notebook = Object.assign({},object);
            notebook.name = value;

            const notebookService = new NotebookService();
            notebookService.putNotebook(object.id, notebook).then((message:Message) => {
                if(message.status === 200){
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
