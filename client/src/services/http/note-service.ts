import { Note, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';
import {Quill, DeltaOperation} from 'quill';

export class NoteService extends HttpClient{
    constructor(){
        super();
    }

    public getNotes(noteboookId:number, chapterId:number) : Promise<Array<Note>>{
        return this.get("notebooks/"+noteboookId+"/chapters/"+chapterId+"/notes");
    }

    public getNote(noteboookId:number, chapterId:number, noteId:number) : Promise<Note>{
        return this.get("notebooks/"+noteboookId+"/chapters/"+chapterId+"/notes/"+noteId);
    }
    public getNoteContent(noteboookId:number, chapterId:number, noteId:number) : Promise<any>{
        return this.get("notebooks/"+noteboookId+"/chapters/"+chapterId+"/notes/"+noteId+"/content");
    }
 
    public postNote(notebookId:number, chapterId:number, note:Note) : Promise<Message>{
        return this.post("notebooks/" + notebookId + "/chapters/" + chapterId + "/notes", note);
    }

    public putNoteContent(notebookId:number, chapterId:number, noteId:number, content: string) : Promise<Message>{
        return this.put("notebooks/" + notebookId + "/chapters/" + chapterId + "/notes/" + noteId + "/content", content);
    }
}