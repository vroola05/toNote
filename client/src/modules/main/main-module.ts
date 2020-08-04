import { State, IRouter } from '../../services/router/types';
import { IWindow } from '../../components/controls/iwindow/iwindow';
import { MainState, TabEnum, Notebook } from '../../types';

import HeaderComponent from './components/header/header-component';
import ButtonComponent from '../../components/controls/buttons/button-icon/button-icon-component';

import NotebooksComponent from './components/notebooks/notebooks-component';
import ChaptersComponent from './components/chapters/chapters-component';
import NotesComponent from './components/notes/notes-component';
import NoteComponent from './components/note/note-component';
import { Util } from '../../components/util/util';
import HeaderService from './services/header-service';
import { Router } from '../../services/router/router-service';
import Lang from '../../components/language/lang';
import MainService from './services/main-service';
import { getMaxListeners } from 'cluster';

export default class MainModule extends IWindow {
    
    protected notebooksComponent: NotebooksComponent = new NotebooksComponent();
    protected chaptersComponent: ChaptersComponent = new ChaptersComponent();
    protected notesComponent: NotesComponent = new NotesComponent();
    protected noteComponent: NoteComponent = new NoteComponent();

    protected headerComponent: HeaderComponent = new HeaderComponent(this);

    public module: string;

    constructor() {
        super('main', 'Notities');
        this.append(this.headerComponent.dom);

        const tabs = document.createElement('div');
        tabs.className = 'tabs';
        
        this.append(tabs);
        
        this.notebooksComponent.setChild( this.chaptersComponent );
        this.chaptersComponent.setChild( this.notesComponent );
        this.notesComponent.setChild( this.noteComponent );
        this.noteComponent.setParent( this.notesComponent );

        tabs.appendChild( this.notebooksComponent.dom );
        tabs.appendChild( this.chaptersComponent.dom );
        tabs.appendChild( this.notesComponent.dom );
        tabs.appendChild( this.noteComponent.dom );

        MainService.onDeviceLayoutChange(() => {
            this.notebooksComponent.setDeviceLayout();    
        });

        window.onresize = (uiEvent: UIEvent) => {
            MainService.deviceLayoutChanged();
        };
    }

    public load( module: string, route: Array<string> ): boolean {
        if (!route) {
            route = [];
        }

        this.module = module;
        HeaderService.setTitleMain('');
        HeaderService.setTitleSub('');

        const currentState = (route.length === 4 ? TabEnum.Note : route.length === 3 ? TabEnum.Notes : route.length === 2 ? TabEnum.Chapters : TabEnum.Notebooks);

        switch (currentState) {
            case TabEnum.Note:
                this.loadNotebooks(Number(route[1]), Number(route[2]), Number(route[3]));
                break;
            case TabEnum.Notes:
                this.loadNotebooks(Number(route[1]), Number(route[2]));
                break;
            case TabEnum.Chapters:
                this.loadNotebooks(Number(route[1]));
                break;
            case TabEnum.Notebooks:
                this.loadNotebooks();
                break;
        }
        MainService.setCurrentMainState(currentState);
        this.show();
        return true;
    }

    private loadNotebooks(notebookId?: number, chapterId?: number, notesId?: number) {
        this.notebooksComponent.getItems(notebookId).then((notebooks: Array<Notebook>) => {
            this.notebooksComponent.show();
            if (notebookId) {
                notebooks.filter((n) => n.id === notebookId).forEach(n => {
                    HeaderService.setTitleMain(n.name);
                });

                this.chaptersComponent.getItems(notebookId, chapterId).then((chapters) => {
                    chapters.filter((c) => c.id === chapterId).forEach(c => {
                        HeaderService.setTitleSub(c.name);
                        this.notesComponent.setMenuColor(c.color);
                    });

                    this.chaptersComponent.show();
                    this.loadChapters(notebookId, chapterId, notesId);
                }).catch(() => {}); 
            } else {
                this.notebooksComponent.setDeviceLayout();
                this.chaptersComponent.hide();
            }
        }).catch(() => {});
    }

    private loadChapters(notebookId?: number, chapterId?: number, notesId?: number) {
        if (chapterId) {
            this.notesComponent.getItems(notebookId, chapterId, notesId).then(() => {
                this.notesComponent.show();
                this.loadNote(notebookId, chapterId, notesId);
            }).catch(() => {});
        } else {
            this.notebooksComponent.setDeviceLayout();
            this.notesComponent.hide();
        }
    }

    private loadNote(notebookId?: number, chapterId?: number, notesId?: number): void {
        if (notesId) {
            this.noteComponent.getItem(notebookId, chapterId, notesId).then(() => {
                this.noteComponent.show();
                this.notebooksComponent.setDeviceLayout();
            }).catch(() => {}); 
        } else {
            this.notebooksComponent.setDeviceLayout();
            this.noteComponent.hide();
        }
    }
}
