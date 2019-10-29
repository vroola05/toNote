import { Chapter, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class ChapterService extends HttpClient{
    constructor(){
        super();
    }

    public getChapters(id:number) : Promise<Array<Chapter>>{
        return this.get("notebooks/"+id+"/chapters");
    }

    public putChapter(notebookId:number, chapterId:number, chapter:Chapter) : Promise<Message>{
        return this.put("notebooks/" + notebookId + "/chapters/" + chapterId, chapter);
    }

    public postChapter(notebookId:number, chapter:Chapter) : Promise<Message>{
        return this.post("notebooks/" + notebookId + "/chapters", chapter);
    }

    public deleteChapter(notebookId:number) : Promise<Message>{
        return this.delete("notebooks/" + notebookId);
    }
}