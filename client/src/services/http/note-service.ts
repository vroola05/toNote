import { Note } from '../../api/types';
import HttpClient from '../../api/httpClient';

export class NoteService extends HttpClient{
    constructor(){
        super();
    }

    public getNotes(noteboookId:number, chapterId:number) : Promise<Array<Note>>{
        return this.get("notebooks/"+noteboookId+"/chapters/"+chapterId+"/notes", null);
    }
}