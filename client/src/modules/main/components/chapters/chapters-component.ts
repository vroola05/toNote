import svgRename from '../../../../assets/images/rename.svg';
import svgDelete from '../../../../assets/images/delete.svg';
import svgMove from '../../../../assets/images/move.svg';
import svgColors from '../../../../assets/images/colors.svg';


import Lang from '../../../../components/language/lang';

import { Chapter, MainState, Message, Notebook, TabEnum, Sort, SortEnum } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { ChapterService } from '../../../../services/http/chapter-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';


import PopupInputComponent from '../../../../components/popups/popup-input/popup-input-component';
import PopupConfirmComponent from '../../../../components/popups/popup-confirm/popup-confirm-component';
import PopupMoveComponent from '../../../../components/popups/popup-move/popup-move-component';
import HeaderService from '../../services/header-service';
import { LoginService } from '../../../../services/http/login-service';

export default class ChaptersComponent extends TabMenu {
    private notebookId: number;
    private chapterId: number;

    constructor() {
        const labels = new Map<string, string>([
            ['name', Lang.get('chapters_name')],
            ['add', Lang.get('chapters_add')]
        ]);

        super('chapters', labels, 'chapter', TabMenu.COLOR_TYPE_ITEM_COLOR);

        this.addSortItem(Lang.get('order_name'), 'name', SortEnum.ASC);
        this.addSortItem(Lang.get('order_created'), 'creationDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_modified'), 'modifyDate', SortEnum.ASC);
        this.addSortItem(Lang.get('order_custom'), 'sort', SortEnum.ASC);


        this.bindRenamePopup();
        this.bindMovePopup();
        this.bindDeletePopup();

        this.dropdownMenu.addItem(new MenuItemComponent(svgColors, Lang.get('ctx_color'), (e: any) => {
            // Do nothing
        }));
    }

    public click(item: any, identifier: number, name: string, chapter: Chapter): void {
        const module = Router.getCurrentModule();
        const params = Router.getUrlparameters();
        Router.set(module, Lang.get('state_title_notes'), module + '/' + params[1] + '/' + chapter.id);
    }

    public clear(): void {
        super.clear();
        this.notebookId = null;
        this.chapterId = null;
    }

    public getItems(notebookId: number, chapterId: number): Promise<Array<Chapter>> {
        return ChapterService.getChapters(notebookId).then((chapters: Array<Chapter>) => {
            this.clear();
            this.notebookId = notebookId;
            if (chapters !== null) {
                const draggable = this.isDraggable();
                for (const chapter of chapters) {
                    this.addItem(chapter.id, chapter.name, chapter, chapter.color)
                        .setDraggable(draggable);
                }

                if (chapterId) {
                    this.setMenuItemActive(chapterId);
                }
            }
            return chapters;
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

                ChapterService.putChapter(object.object.notebookId, object.object.id, object.object).then((message: Message) => {
                    if (message.status === 200) {
                        object.setName(value);
                        object.object.name = value;
                        if (this.getSelectedMenuItem() && this.getSelectedMenuItem().getId() === object.object.id) {
                            HeaderService.setTitleSub(value);
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

    private bindMovePopup(): void {
        this.dropdownMenu.addItem(new MenuItemComponent(svgMove, Lang.get('ctx_move'), (element1: any) => {
            const movePopup = new PopupMoveComponent(Lang.get('popup_move_title'), Lang.get('chapters_name') + ' - ' + this.dropdownMenu.object.name);
            movePopup.object = this.dropdownMenu.object;

            ChapterService.getMoveChapterList(this.notebookId, this.dropdownMenu.object.identifier).then((notebooks: Array<Notebook>) => {

                for (const notebook of notebooks) {
                    movePopup.add(notebook.name, notebook);
                }
                movePopup.click = (element2, object, value) => {

                    ChapterService.moveChapter(object.object.notebookId, object.object.id, value.id).then((message: Message) => {
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

        menuItem.click = (element1: any) => {
            const deleteMsg = Lang.get('popup_delete_confirm_msg1') + this.dropdownMenu.object.name + Lang.get('popup_delete_confirm_msg2');
            const deletePopup = new PopupConfirmComponent(Lang.get('popup_delete_title'), deleteMsg);
            deletePopup.object = this.dropdownMenu.object;

            deletePopup.click = (element2, object) => {
                ChapterService.deleteChapter(object.object.notebookId, object.object.id).then((message: Message) => {
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
        const newPopup = new PopupInputComponent(Lang.get('popup_new_title'), Lang.get('chapters_name'), '');
        newPopup.click = (element1, object, value) => {
            if (value === '') {
                newPopup.setError('<span>' + Lang.get('popup_new_msg_empty') + '</span>');
                return;
            }
            const chapter = new Chapter();
            chapter.name = value;
            chapter.notebookId = this.notebookId;

            ChapterService.postChapter(this.notebookId, chapter).then((message: Message) => {
                if (message.status === 200) {
                    for (const info of message.info) {
                        if (info.id === 'id') {
                            chapter.id = Number(info.value);
                            this.addItem(chapter.id, chapter.name, chapter, undefined);
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
            this.clear();
            this.getItems(notebookId, chapterId);
        });
    }

    public itemDragged(o: { from: number, to: number }) {
        ChapterService.chapterSort(this.notebookId, o.from, o.to).then((message: Message) => {
            if (message.status === 200) {
                this.moveTabMenuItem(o);
            }
        });

    }
}
