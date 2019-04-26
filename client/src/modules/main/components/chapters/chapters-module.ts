import './chapters-module.scss';

import Lang from '../../../../components/language/lang';

import { Chapter, NotebookState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { ChapterService } from '../../../../services/http/chapter-service';

import {TabMenu} from '../../../../components/tabMenu/tab-menu';


export default class ChaptersModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("chapters_name")], 
            ["add", Lang.get("chapters_add")]
        ]);

        super(labels, "chapter");
    }

    public click(item:any, identifier:number, name:string, chapter:Chapter){
        let state = Router.getCurrentState();

        let notebookState: NotebookState = state.value;
        notebookState.chapter = chapter;
        notebookState.note = null;
        state.value = notebookState;
        
        Router.set(state, name+" - "+Lang.get("state_title_notes"), "notes" );
    }

    public getItems(notebookState: NotebookState){
        const chapterService : ChapterService = new ChapterService();
        chapterService.getChapters(notebookState.notebook.id).then((chapters:Array<Chapter>) => {
            this.clear();
            if(chapters !== null ){
                for(let i in chapters){
                    this.addItem(chapters[i].id, chapters[i].name, chapters[i], undefined);
                }
                if(notebookState!=null && notebookState.chapter!==undefined){
                    this.setMenuItemActive(notebookState.chapter.id);
                }
            }
            //this.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }
}
