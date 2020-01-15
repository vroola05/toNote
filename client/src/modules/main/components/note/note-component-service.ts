import { Note, Message } from '../../../../types';
import { EventEmitter } from 'events';
import ConfigService from '../../../../services/config/configService';

export class NoteComponentService {
    public static event = new EventEmitter();

    private static noteText: any = null;
    private static noteTexttimeout: NodeJS.Timeout;

    constructor(){
    }

    public static flush() {
    }

    public static onTextChanged(event: any) {
      this.event.on("text-change", event);
    }

    public static textChanged(noteText: any) {
      NoteComponentService.noteText = noteText;
      clearTimeout(NoteComponentService.noteTexttimeout);
      NoteComponentService.noteTexttimeout = setTimeout(() => {
          NoteComponentService.sendNoteText();
        }, ConfigService.get().content.delay);
    }

    private static sendNoteText(){
      if(NoteComponentService.noteText != null) {
        this.event.emit("text-change", NoteComponentService.noteText);
      }
      NoteComponentService.noteText = null;
    }
}