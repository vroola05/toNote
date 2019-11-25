import { Chapter, Message, Notebook } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class ChapterService extends HttpClient{
    constructor(){
        super();
    }

    public getChapters(id:number) : Promise<Array<Chapter>>{
        return this.get("notebooks/"+id+"/chapters");
    }

    public getMoveChapterList(notebookId:number, chapterId:number) : Promise<Array<Notebook>>{
        return this.get("notebooks/" + notebookId + "/chapters/" + chapterId + "/move");
    }

    public moveChapter(notebookId:number, chapterId:number, notebookIdNew:number) : Promise<Message>{
        return this.get("notebooks/" + notebookId + "/chapters/" + chapterId + "/move/" + notebookIdNew);
    }

    public putChapter(notebookId:number, chapterId:number, chapter:Chapter) : Promise<Message>{
        return this.put("notebooks/" + notebookId + "/chapters/" + chapterId, chapter);
    }

    public postChapter(notebookId:number, chapter:Chapter) : Promise<Message>{
        return this.post("notebooks/" + notebookId + "/chapters", chapter);
    }

    public deleteChapter(notebookId:number, chapterId:number) : Promise<Message>{
        return this.delete("notebooks/" + notebookId + "/chapters/" + chapterId);
    }
}