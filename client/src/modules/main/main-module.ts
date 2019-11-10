import { State, IRouter } from "../../services/router/types";
import { IWindow } from '../../components/controls/iwindow/iwindow';
import { MainState } from '../../types';

import HeaderComponent from './components/header/header-component';
import ButtonComponent from '../../components/controls/button-icon/button-icon-component';

import NotebooksComponent from './components/notebooks/notebooks-component';
import ChaptersComponent from './components/chapters/chapters-component';
import NotesComponent from './components/notes/notes-component';
import NoteComponent from './components/note/note-component';
import { Util } from '../../components/util/util';

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

        window.onresize = (uiEvent:UIEvent) => {
            this.setDeviceLayout();
        };
		
    }


    public setDeviceLayout() {
        this.notebooksComponent.setDeviceLayout();
    }

    public load( state : State ) : boolean {
        if(state.value== null){
            state.value = new MainState();
        }
        this.state = state;

        this.headerComponent.setMainTitle("");
        this.headerComponent.setSubTitle("");

        let newState : MainState = state.value;
        let currentState = this.getCurrentState(state.value);
        this.loadNotebooks(currentState, newState);
        this.show();
        return true;
        
    }

    public back(){
        this.notebooksComponent.back();
    }

    private loadNotebooks(state: string, newState: MainState) {
        this.notebooksComponent.getItems(newState).then(() => {
            this.notebooksComponent.show();
            if(state=="notebook" || state=="chapter" || state=="note"){
                this.headerComponent.setMainTitle(newState.notebook.name);
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

    private loadChapters(state: string, newState: MainState) {
        if(state=="chapter" || state=="note"){
            this.headerComponent.setSubTitle(newState.chapter.name);
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

    private loadNote(state: string, newState: MainState) {
        if(state=="note"){
            this.noteComponent.getItem(newState).then(() =>{
                this.noteComponent.show();
                this.notebooksComponent.setDeviceLayout();
            }).catch(() => {});;
        } else{
            this.notebooksComponent.setDeviceLayout();
            this.noteComponent.hide();
        }
    }

    private getCurrentState(mainState : MainState){
        if(mainState.notebook != null && mainState.notebook.id != null){
            if(mainState.chapter != null && mainState.chapter.id != null){
                if(mainState.note != null && mainState.note.id != null){
                    return "note";
                }
                return "chapter";
            }
            return "notebook";
        }
        return null;
    }
}