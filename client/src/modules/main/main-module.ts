import { State, IRouter } from "../../services/router/types";
import { IWindow } from '../../components/controls/iwindow/iwindow';
import { MainState, TabEnum } from '../../types';

import HeaderComponent from './components/header/header-component';
import ButtonComponent from '../../components/controls/buttons/button-icon/button-icon-component';

import NotebooksComponent from './components/notebooks/notebooks-component';
import ChaptersComponent from './components/chapters/chapters-component';
import NotesComponent from './components/notes/notes-component';
import NoteComponent from './components/note/note-component';
import { Util } from '../../components/util/util';
import HeaderService from "./services/header-service";
import { Router } from "../../services/router/router-service";
import Lang from "../../components/language/lang";
import MainService from "./services/main-service";
import { getMaxListeners } from "cluster";

export default class MainModule extends IWindow{
    
    protected notebooksComponent:NotebooksComponent = new NotebooksComponent();
    protected chaptersComponent:ChaptersComponent = new ChaptersComponent();
    protected notesComponent:NotesComponent = new NotesComponent();
    protected noteComponent:NoteComponent = new NoteComponent();

    protected headerComponent:HeaderComponent = new HeaderComponent(this);

    public state: State;

    constructor(){
        super("main", "Notities");
        this.append(this.headerComponent.dom);

        let tabs = document.createElement("div");
        tabs.className = "tabs";
        
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

        window.onresize = (uiEvent:UIEvent) => {
            MainService.deviceLayoutChanged();
        };
    }

    public load( state : State ) : boolean {
        if(state.value== null){
            state.value = new MainState();
        }

        this.state = state;
        HeaderService.setTitleMain("");
        HeaderService.setTitleSub("");

        let newState : MainState = state.value;
        let currentState = MainService.setCurrentMainState(state.value);

        this.loadNotebooks(currentState, newState);
        this.show();
        return true;
    }

    private loadNotebooks(state: number, newState: MainState) {
        this.notebooksComponent.getItems(newState).then(() => {
            this.notebooksComponent.show();
            if(state===TabEnum.Chapters || state===TabEnum.Notes || state===TabEnum.Note){
                HeaderService.setTitleMain(newState.notebook.name);
                this.chaptersComponent.getItems(newState).then(()=>{
                    this.chaptersComponent.show();
                    this.loadChapters(state, newState);
                }).catch(() => {});;
            } else {
                this.notebooksComponent.setDeviceLayout();
                this.chaptersComponent.hide();
            }
        }).catch(() => {});
    }

    private loadChapters(state: number, newState: MainState) {
        if(state===TabEnum.Notes || state===TabEnum.Note){
            HeaderService.setTitleSub(newState.chapter.name);
            this.notesComponent.getItems(newState).then(() => {
                this.notesComponent.setMenuColor(newState.chapter.color);
                this.notesComponent.show();
                this.loadNote(state, newState);
            }).catch(() => {});;
        } else {
            this.notebooksComponent.setDeviceLayout();
            this.notesComponent.hide();
        }
    }

    private loadNote(state: number, newState: MainState) {
        if(state===TabEnum.Note){
            this.noteComponent.getItem(newState).then(() =>{
                this.noteComponent.show();
                this.notebooksComponent.setDeviceLayout();
            }).catch(() => {});;
        } else{
            this.notebooksComponent.setDeviceLayout();
            this.noteComponent.hide();
        }
    }
}