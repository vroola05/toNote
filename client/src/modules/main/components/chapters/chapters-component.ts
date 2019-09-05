import svgRename from '../../../../assets/images/rename.svg';
import svgDelete from '../../../../assets/images/delete.svg';
import svgMove from '../../../../assets/images/move.svg';
import svgColors from '../../../../assets/images/colors.svg';


import Lang from '../../../../components/language/lang';

import { Chapter, MainState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { ChapterService } from '../../../../services/http/chapter-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';

export default class ChaptersComponent extends TabMenu {
    private notebookId : number;

    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("chapters_name")], 
            ["add", Lang.get("chapters_add")]
        ]);

        super(labels, "chapter", TabMenu.COLOR_TYPE_ITEM_COLOR);

        this.dropdownMenu.addItem(new MenuItemComponent(svgRename, Lang.get("ctx_rename"), (e:any) => {
            //Do nothing
        }));
        this.dropdownMenu.addItem(new MenuItemComponent(svgMove, Lang.get("ctx_move"), (e:any) => {
            //Do nothing
        }));
        this.dropdownMenu.addItem(new MenuItemComponent(svgDelete, Lang.get("ctx_remove"), (e:any) => {
            //Do nothing
        }));
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
}
