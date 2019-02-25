import {State, IStateHandler} from "../../services/state/types"
import ChaptersModule from './chapters-module';
import { ChapterService } from '../../services/http/chapter-service';
import { Chapter } from "../../api/types";

export class ChaptersStateHandler implements IStateHandler {
    private chaptersModule : ChaptersModule;

    constructor( chaptersModule : ChaptersModule ){
        this.chaptersModule = chaptersModule;
    }

    public load( state : State ) : boolean{

        const chapterService : ChapterService = new ChapterService();
        const self = this;
        chapterService.getChapters(state.value).then(function(notebooks:Array<Chapter>){
            self.chaptersModule.removeItems();
            if(notebooks !== null ){
                for(let i in notebooks){
                    self.chaptersModule.addItem(notebooks[i].name, notebooks[i].id, undefined);
                }
            }
            self.chaptersModule.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });

        return true;
    }
}