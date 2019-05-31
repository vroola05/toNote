import './chapters-component.scss';

import Lang from '../../../../components/language/lang';

import { Chapter, MainState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { ChapterService } from '../../../../services/http/chapter-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';


export default class ChaptersComponent extends TabMenu {
    private notebookId : number;

    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("chapters_name")], 
            ["add", Lang.get("chapters_add")]
        ]);

        super(labels, "chapter");
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
                    this.addItem(chapters[i].id, chapters[i].name, chapters[i], undefined);
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
