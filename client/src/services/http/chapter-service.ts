import { Chapter } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class ChapterService extends HttpClient{
    constructor(){
        super();
    }

    public getChapters(id:number) : Promise<Array<Chapter>>{
        return this.get("notebooks/"+id+"/chapters");
    }
}