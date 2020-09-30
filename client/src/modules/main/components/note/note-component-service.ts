import { Note, Message } from '../../../../types';
import { EventEmitter } from 'events';

export class NoteComponentService {
    public static event = new EventEmitter();

    private static noteText: any = null;
    private static note: Note = null;

    constructor() {
    }

    public static flush() {
      NoteComponentService.sendNoteText();
      NoteComponentService.sendNote();
    }

    public static onNoteChanged(event: any) {
      this.event.on('change', event);
    }
    public static noteChanged(note: Note) {
      NoteComponentService.note = note;
    }
    public static sendNote() {
      if (NoteComponentService.note != null) {
        this.event.emit('change', NoteComponentService.note);
      }
      NoteComponentService.note = null;
    }
    
    public static onNoteTextChanged(event: any) {
      this.event.on('text-change', event);
    }
    public static noteTextChanged(noteText: any) {
      NoteComponentService.noteText = noteText;
    }
    public static sendNoteText() {
      if (NoteComponentService.noteText != null) {
        this.event.emit('text-change', NoteComponentService.noteText);
      }
      NoteComponentService.noteText = null;
    }
}
