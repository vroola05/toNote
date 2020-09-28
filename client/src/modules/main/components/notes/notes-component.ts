import svgRename from '../../../../assets/images/rename.svg';
import svgMove from '../../../../assets/images/move.svg';
import svgDelete from '../../../../assets/images/delete.svg';

import Lang from '../../../../components/language/lang';
import { Note, MainState, Message, Chapter, TabEnum, Sort, SortEnum } from '../../../../types';
import { Router } from '../../../../services/router/router-service';
import { NoteService } from '../../../../services/http/note-service';
import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';

import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';
import PopupConfirmComponent from '../../../../components/popups/popup-confirm/popup-confirm-component';
import PopupMoveComponent from '../../../../components/popups/popup-move/popup-move-component';
import { LoginService } from '../../../../services/http/login-service';

export default class NotesComponent extends TabMenu {
    private notebookId: number;
    private chapterId: number;
    private notesId: number;
    // private noteService: NoteService;
    
    constructor() {
        const labels = new Map<string, string>([
            ['name', Lang.get('notes_name')], 
            ['add', Lang.get('notes_add')]
        ]);
        super('notes', labels, 'notes', TabMenu.COLOR_TYPE_MENU_COLOR);

        this.addSortItem(Lang.get('order_name'), 'name', SortEnum.ASC);
        this.addSortItem(Lang.get('order_created'), 'creationDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_modified'), 'modifyDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_custom'), 'sort', SortEnum.ASC);

        NoteService.event.on('change', (note: Note) => {
            this.getSelectedMenuItem().setName(note.name);
            this.getSelectedMenuItem().setObject(note);
        });

        this.bindRenamePopup();
        this.bindMovePopup();
        this.bindDeletePopup();
    }

    public clear(): void {
        super.clear();
        this.notebookId = null;
        this.chapterId = null;
        this.notesId = null;
    }

    public click(item: any, identifier: number, name: string, note: Note): void {
        const module = Router.getCurrentModule();
        const params = Router.getUrlparameters();
        Router.set(module, Lang.get('state_title_note'), module + '/' + params[1] + '/' + params[2] + '/' + note.id);
    }

    public getItems(notebookId: number, chapterId: number, notesId: number): Promise<Array<Note>> {
        if (this.hasItems() && this.notebookId === notebookId && this.chapterId === chapterId) {
            return new Promise((resolve, reject) => {
                if (notesId) {
                    this.setMenuItemActive(notesId);
                }
                resolve(this.getObjects());
            });
        }

        this.clear();
        this.notebookId = notebookId;
        this.chapterId = chapterId;
        this.notesId = notesId;

        return NoteService.getNotes(notebookId, chapterId).then((notes: Array<Note>) => {
            
            if (notes !== null ) {
                for (const note of notes) {
                    this.addItem(note.id, note.name, note, undefined);
                }
                if (notesId) {
                    this.setMenuItemActive(notesId);
                }
            }
            return notes;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error;
        });
    }

    private bindRenamePopup(): void {
        const menuItem = new MenuItemComponent(svgRename, Lang.get('ctx_rename'));
        this.dropdownMenu.addItem(menuItem);

        menuItem.click = (e: any) => {
            const renamePopup = new PopupInputComponent(Lang.get('popup_rename_title'), Lang.get('notes_name'), this.dropdownMenu.object.name);

            renamePopup.object = this.dropdownMenu.object;
            renamePopup.click = (e, object, value) => {
                if (value === '') {
                    renamePopup.setError('<span>' + Lang.get('popup_rename_empty') + '</span>');
                    return;
                }
                object.object.name = value;

                NoteService.putNote(this.notebookId, object.object.sectionId, object.object.id, object.object).then((message: Message) => {
                    if (message.status === 200) {
                        object.setName(value);
                        object.object.name = value;
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

    private bindMovePopup(): void {
        this.dropdownMenu.addItem(new MenuItemComponent(svgMove, Lang.get('ctx_move'), (e: any) => {
            const movePopup = new PopupMoveComponent(Lang.get('popup_move_title'), Lang.get('note_name') + ' - ' + this.dropdownMenu.object.name);
            movePopup.object = this.dropdownMenu.object;

            NoteService.getMoveNotesList(this.notebookId, this.chapterId, this.dropdownMenu.object.identifier).then((chapters: Array<Chapter>) => {
                for (const chapter of chapters) {
                    movePopup.add(chapter.name, chapter);
                }
                movePopup.click = (e, object, value) => {
                    NoteService.moveNote(this.notebookId, object.object.sectionId, object.object.id, value.id).then((message: Message) => {
                        if (message.status === 200) {
                            this.removeItem(object);
                            movePopup.hide();
                        } else {
                            if (message.info) {
                                let error = '';
                                for (const info of message.info) {
                                    error += '<span>' + info.value + '</span>';
                                }
                                movePopup.setError(error);
                            }
                        }
                    });
                };
                movePopup.show();

            });
            
        }));
    }

    private bindDeletePopup(): void {
        
        const menuItem = new MenuItemComponent(svgDelete, Lang.get('ctx_remove'));
        this.dropdownMenu.addItem(menuItem);
        
        menuItem.click = (e: any) => {
            const deleteMsg = Lang.get('popup_delete_confirm_msg1') + this.dropdownMenu.object.name + Lang.get('popup_delete_confirm_msg2');
            const deletePopup = new PopupConfirmComponent(Lang.get('popup_delete_title'), deleteMsg);
            deletePopup.object = this.dropdownMenu.object;

            deletePopup.click = (e, object) => {
                NoteService.deleteNote(this.notebookId, object.object.sectionId, object.object.id).then((message: Message) => {
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

    public clickNewItem(e: Event): void {
        const newPopup = new PopupInputComponent(Lang.get('popup_new_title'), Lang.get('chapters_name'), '');
        newPopup.click = (e, object, value) => {
            if (value === '') {
                newPopup.setError('<span>' + Lang.get('popup_new_msg_empty') + '</span>');
                return;
            }
            const note = new Note();
            note.name = value;
            note.sectionId = this.chapterId;

            NoteService.postNote(this.notebookId, this.chapterId, note).then((message: Message) => {
                if (message.status === 200) {
                    for (const info of message.info) {
                        if (info.id === 'id') {
                            note.id = Number(info.value);
                            this.addItem(note.id, note.name, note, undefined);
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
            const chapterId = this.chapterId;
            const notesId = this.notesId;
            this.clear();
            this.getItems(notebookId, chapterId, notesId);
        });
    }
}
