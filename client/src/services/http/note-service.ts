import { Note, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';
import { EventEmitter } from 'events';

export class NoteService extends HttpClient {
    public static event = new EventEmitter();

    constructor() {
        super();
    }

    public static getNotes(noteboookId: number, chapterId: number): Promise<Array<Note>> {
        return NoteService.get('notebooks/' + noteboookId + '/chapters/' + chapterId + '/notes');
    }

    public static getNote(noteboookId: number, chapterId: number, noteId: number): Promise<Note> {
        return NoteService.get('notebooks/' + noteboookId + '/chapters/' + chapterId + '/notes/' + noteId);
    }

    public static getNoteContent(noteboookId: number, chapterId: number, noteId: number): Promise<any> {
        return NoteService.get('notebooks/' + noteboookId + '/chapters/' + chapterId + '/notes/' + noteId + '/content');
    }

    public static getMoveNotesList(noteboookId: number, chapterId: number, noteId: number): Promise<any> {
        return NoteService.get('notebooks/' + noteboookId + '/chapters/' + chapterId + '/notes/' + noteId + '/move');
    }
    
    public static moveNote(noteboookId: number, chapterId: number, noteId: number, newChapterId: number): Promise<any> {
        return NoteService.get('notebooks/' + noteboookId + '/chapters/' + chapterId + '/notes/' + noteId + '/move/' + newChapterId);
    }
 
    public static postNote(notebookId: number, chapterId: number, note: Note): Promise<Message> {
        return NoteService.post('notebooks/' + notebookId + '/chapters/' + chapterId + '/notes', note);
    }

    public static putNote(notebookId: number, chapterId: number, noteId: number, note: Note): Promise<Message> {
        return NoteService.put('notebooks/' + notebookId + '/chapters/' + chapterId + '/notes/' + noteId, note);
    }

    public static putNoteContent(notebookId: number, chapterId: number, noteId: number, content: string): Promise<Message> {
        return NoteService.put('notebooks/' + notebookId + '/chapters/' + chapterId + '/notes/' + noteId + '/content', content);
    }

    public static deleteNote(notebookId: number, chapterId: number, noteId: number): Promise<Message> {
        return NoteService.delete('notebooks/' + notebookId + '/chapters/' + chapterId + '/notes/' + noteId);
    }
    
}
