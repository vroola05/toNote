require('quill/dist/quill.snow.css');
import Quill from 'quill';
import DateFormat from '../../../../../../components/date-format/date-format';
import Config from '../../../../../../services/config/configService';
import TitlebarComponent from './components/titlebar/titlebar-component';
import DatebarComponent from './components/datebar/datebar-component';
import ToolbarComponent from './components/toolbar/toolbar-component';
import Lang from '../../../../../../components/language/lang';
import { EventEmitter } from 'events';
import { Note } from 'types';
import HeaderService from '../../../../services/header-service';
import { NoteComponentService } from '../../note-component-service';
import { Timer } from '../../../../../../components/timer/timer';
import LoaderComponent from './components/loader/loader-component';

export default class NoteContentComponent {
    public dom: HTMLDivElement;

    private titlebarComponent = new TitlebarComponent();
    private dateCreated: DatebarComponent;
    private dateModified: DatebarComponent;
    private loaderComponent: LoaderComponent;

    private editor: Quill;
    public hidden: boolean = true;
    private onanimationend: any;
    private toolbar: ToolbarComponent;

    public event = new EventEmitter();


    private note: Note;

    constructor() {

        this.dom = document.createElement('div');
        this.dom.className = 'noteContent loaded inactive';

        this.toolbar = new ToolbarComponent();
        this.dom.appendChild(this.toolbar.dom);
        const noteHeaderContainer: HTMLDivElement = document.createElement('div');
        noteHeaderContainer.className = 'noteHeaderContainer';
        this.dom.appendChild(noteHeaderContainer);

        this.titlebarComponent = new TitlebarComponent();
        noteHeaderContainer.appendChild(this.titlebarComponent.dom);

        const noteDateContainer: HTMLDivElement = document.createElement('div');
        noteDateContainer.className = 'dateContainer';
        noteHeaderContainer.appendChild(noteDateContainer);

        this.dateCreated = new DatebarComponent('created');
        noteDateContainer.appendChild(this.dateCreated.dom);
        this.dateModified = new DatebarComponent('modified');
        noteDateContainer.appendChild(this.dateModified.dom);

        this.loaderComponent = new LoaderComponent();
        noteDateContainer.appendChild(this.loaderComponent.dom);

        const noteInnerContainer: HTMLDivElement = document.createElement('div');
        noteInnerContainer.className = 'noteInnerContainer';
        this.dom.appendChild(noteInnerContainer);

        const note: HTMLDivElement = document.createElement('div');
        note.className = 'note';
        noteInnerContainer.appendChild(note);

        this.editor =  new Quill(note, { 
            theme: 'snow',
            modules: {
                toolbar: this.toolbar.dom
            }
        });

        this.dom.addEventListener('animationend', (a) => {
            this.dom.classList.remove('loading');
            this.dom.classList.add('loaded');

            if (this.onanimationend !== undefined) {
                this.onanimationend();
            }

            this.toolbar.setToolbarGroupsWidth();
            this.toolbar.calculateToolbarPages();
        });

        this.setLocked(HeaderService.getBtnLocked());
        HeaderService.onBtnLockedChange((locked: boolean) => {
            this.setLocked(locked);
        });

        this.onNoteUpdate();
        this.onNoteTextUpdate();
    }

    private setLocked(locked: boolean) {
        if (locked) {
            this.toolbar.hide();
            this.titlebarComponent.disable();
            this.editor.disable();
        } else {
            this.editor.enable();
            this.titlebarComponent.enable();
            this.toolbar.show();
        }
    }

    private onNoteTextUpdate(): void {
        const timer = new Timer(Config.get().content.delay);
        this.editor.on('text-change', (delta, oldDelta, source: string) => {
            if (source === 'user') {
                NoteComponentService.noteTextChanged(this.getContent());
                timer.start();
            }
        });

        timer.onInterval((prc: number) => {
            this.loaderComponent.setPercentage(prc);
        });
        timer.onFinished(() => {
            NoteComponentService.sendNoteText();
            this.loaderComponent.clear();
        });
    }

    private onNoteUpdate(): void {
        const timer = new Timer(Config.get().content.delay);
        this.titlebarComponent.event.on('change', (text: string) => {
            if (this.note) {
                this.note.name = text;
                NoteComponentService.noteChanged(this.note);
                timer.start();
            }
        });
        timer.onInterval((prc: number) => {
            this.loaderComponent.setPercentage(prc);
        });
        timer.onFinished(() => {
            NoteComponentService.sendNote();
            this.loaderComponent.clear();
        });
    }

    public setNote(note: Note): void {
        this.clear();
        this.note = note;
        this.setTitle(note.name);
        this.setDateCreated(note.creationDate);
        this.setDateModified(note.modifyDate);
    }
    
    public clear(): void {
        NoteComponentService.flush();
        this.note = null;
        this.toolbar.clear();
        this.setContent('');
        this.setTitle('');
        this.setDateCreated(null);
        this.setDateModified(null);
    }

    private setTitle( title: string ): void {
        this.titlebarComponent.value = title;
    }

    public setDateCreated( date: Date ): void {
        if (!date) {
            this.dateCreated.value('');
        } else {
            this.dateCreated.value(Lang.get('main_note_header_created') + ': ' + DateFormat.get(date));
        }
    }

    public setDateModified( date: Date ): void {
        if (!date) {
            this.dateCreated.value('');
        } else {
            this.dateModified.value(Lang.get('main_note_header_modified') + ': ' + DateFormat.get(date));
        }
    }

    public setContent( content: any ): void {
        this.editor.setContents(content);
    }

    public getContent(): any {
        return this.editor.getContents();
    }

    public hide(onanimationend: any = undefined): void {
        if ( !this.hidden ) {
            this.onanimationend = (e: any) => { 
                if (onanimationend) {
                    onanimationend(e);
                }
            };
            this.hidden = true;
            this.dom.classList.remove('loaded');
            this.dom.classList.add('loading');
            this.dom.classList.add('inactive');
            this.dom.classList.remove('active');
        }
        
    }

    public show(onanimationend: any = undefined): void {
        if ( !this.hidden ) {
            this.toolbar.calculateToolbarPages();
        } else {
            this.onanimationend = (e: any) => {
                if (onanimationend) {
                    onanimationend(e);
                }
            };
            this.hidden = false;
            this.dom.classList.add('loading');
            this.dom.classList.remove('inactive');
            this.dom.classList.add('active');
        }
    }
}
