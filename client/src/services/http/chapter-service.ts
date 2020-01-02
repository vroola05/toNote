import { Chapter, Message, Notebook } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class ChapterService extends HttpClient{
    constructor(){
        super();
    }

    public static getChapters(id:number) : Promise<Array<Chapter>>{
        return ChapterService.get("notebooks/"+id+"/chapters");
    }

    public static getMoveChapterList(notebookId:number, chapterId:number) : Promise<Array<Notebook>>{
        return ChapterService.get("notebooks/" + notebookId + "/chapters/" + chapterId + "/move");
    }

    public static moveChapter(notebookId:number, chapterId:number, notebookIdNew:number) : Promise<Message>{
        return ChapterService.get("notebooks/" + notebookId + "/chapters/" + chapterId + "/move/" + notebookIdNew);
    }

    public static putChapter(notebookId:number, chapterId:number, chapter:Chapter) : Promise<Message>{
        return ChapterService.put("notebooks/" + notebookId + "/chapters/" + chapterId, chapter);
    }

    public static postChapter(notebookId:number, chapter:Chapter) : Promise<Message>{
        return ChapterService.post("notebooks/" + notebookId + "/chapters", chapter);
    }

    public static deleteChapter(notebookId:number, chapterId:number) : Promise<Message>{
        return ChapterService.delete("notebooks/" + notebookId + "/chapters/" + chapterId);
    }
}