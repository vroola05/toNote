import svgRename from '../../../../assets/images/rename.svg';
import svgDelete from '../../../../assets/images/delete.svg';


import Lang from '../../../../components/language/lang';

import { Notebook, MainState, Message, TabEnum, Sort, SortEnum } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NotebookService } from '../../../../services/http/notebook-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';
import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';
import PopupConfirmComponent from '../../../../components/popups/popup-confirm/popup-confirm-component';
import HeaderService from '../../services/header-service';
import { LoginService } from '../../../../services/http/login-service';

export default class NotebooksComponent extends TabMenu {
    private notebookId: number;

    constructor() {
        const labels = new Map<string, string>([
            ['name', Lang.get('notebooks_name')], 
            ['add', Lang.get('notebooks_add')]
        ]);
        super('notebooks', labels, 'notebook');

        this.addSortItem(Lang.get('order_name'), 'name', SortEnum.ASC);
        this.addSortItem(Lang.get('order_created'), 'creationDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_modified'), 'modifyDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_custom'), 'sort', SortEnum.ASC);

        this.bindRenamePopup();
        this.bindDeletePopup();
    }

    public clear(): void {
        super.clear();
        this.notebookId = null;
    }

    public click(item: any, identifier: number, name: string, notebook: Notebook): void {
        const module = Router.getCurrentModule();
        Router.set(module, Lang.get('state_title_chapters'),  module + '/' + notebook.id );
    }

    public getItems(id: number = null): Promise<any> {
        if (this.hasItems()) {
            return new Promise((resolve, reject) => {
                if (id) {
                    this.setMenuItemActive(id);
                }
                resolve(this.getObjects());
                
            });
        }
        return NotebookService.getNotebooks().then((notebooks: Array<Notebook>) => {
            this.clear();
            if (notebooks !== null ) {
                for (const notebook of notebooks) {
                    this.addItem(notebook.id, notebook.name, notebook, undefined);
                }
                if (id) {
                    this.setMenuItemActive(id);
                }
            }
            return notebooks;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error; 
        });
    }

    private bindRenamePopup(): void {
        
        const menuItem = new MenuItemComponent(svgRename, Lang.get('ctx_rename'));
        this.dropdownMenu.addItem(menuItem);

        menuItem.click = (element1: any) => {
            
            const renamePopup = new PopupInputComponent(Lang.get('popup_rename_title'), Lang.get('notebooks_name'), this.dropdownMenu.object.name);

            renamePopup.object = this.dropdownMenu.object;
            renamePopup.click = (element2, object, value) => {
                if (value === '') {
                    renamePopup.setError('<span>' + Lang.get('popup_rename_empty') + '</span>');
                    return;
                }
                object.object.name = value;

                NotebookService.putNotebook(object.identifier, object.object).then((message: Message) => {
                    if (message.status === 200) {
                        object.setName(value);
                        object.object.name = value;

                        if (this.getSelectedMenuItem() && this.getSelectedMenuItem().getId() === object.object.id ) {
                            HeaderService.setTitleMain(value);
                        }

                        renamePopup.hide();
                    } else {
                        if (message.info) {
                            let error = '';
                            for (const info of message.info) {
                                error += '<span>' + info.value + '</span>';
                            }
                            renamePopup.setError(error);
                        }
                    }
                    
                    
                }).catch((e) => {
                });
            };
            renamePopup.show();
        };
    }

    private bindDeletePopup(): void {
        const menuItem = new MenuItemComponent(svgDelete, Lang.get('ctx_remove'));
        this.dropdownMenu.addItem(menuItem);
        
        menuItem.click = (element1: any) => {
            const deleteMsg = Lang.get('popup_delete_confirm_msg1') + this.dropdownMenu.object.name + Lang.get('popup_delete_confirm_msg2');
            const deletePopup = new PopupConfirmComponent(Lang.get('popup_delete_title'), deleteMsg);
            deletePopup.object = this.dropdownMenu.object;

            deletePopup.click = (element2, object) => {
                NotebookService.deleteNotebook(object.identifier).then((message: Message) => {
                    if (message.status === 200) {
                        this.removeItem(object);                        
                        deletePopup.hide();
                    } else {
                        if (message.info) {
                            let error = '';
                            for (const info of message.info) {
                                error += '<span>' + info.value + '</span>';
                            }
                            deletePopup.setError(error);
                        }
                    }
                    
                    
                }).catch((e) => {
    
                });
            };
            deletePopup.show();
        };
    }

    public clickNewItem(event: Event): void {
        
        const newPopup = new PopupInputComponent(Lang.get('popup_new_title'), Lang.get('notebooks_name'), '');
        
        newPopup.click = (element1, object, value) => {
            if (value === '') {
                newPopup.setError('<span>' + Lang.get('popup_new_msg_empty') + '</span>');
                return;
            }
            const notebook = new Notebook();
            notebook.name = value;

            NotebookService.postNotebook(notebook).then((message: Message) => {
                if (message.status === 200) {
                    for (const info of message.info) {
                        if (info.id === 'id') {
                            notebook.id = Number(info.value);
                            this.addItem(notebook.id, notebook.name, notebook, undefined);
                        }
                    }
                    newPopup.hide();
                } else {
                    if (message.info) {
                        let error = '';
                        for (const info of message.info) {
                            error += '<span>' + info.value + '</span>';
                        }

                        newPopup.setError(error);
                    }
                }
                
                
            }).catch((e) => {

            });
        };
        newPopup.show();
    
    }

    public onSort(sort: Sort) {
        new LoginService().sort(sort.name, sort).then(v => {
            const notebookId = this.notebookId;
            this.clear();
            this.getItems(notebookId);
        });
    }

    public itemDragged(o: {from: number, to: number}) {
        NotebookService.notebookSort(o.from, o.to).then((message: Message) => {
            if (message.status === 200) {
                this.moveTabMenuItem(o);
            }
        });
        
      }
}
