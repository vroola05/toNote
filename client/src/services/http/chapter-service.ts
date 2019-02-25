import { Chapter } from '../../api/types';
import HttpClient from '../../api/httpClient';

export class ChapterService extends HttpClient{
    constructor(){
        super();
    }

    public getChapters(id:number) : Promise<Array<Chapter>>{
        return this.get("notebooks/"+id+"/chapters", null);
    }
}