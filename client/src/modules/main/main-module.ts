import './main-module.scss';

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

        window.onresize = (s) => {
            this.recalculateMenus();
        };
		
    }

    public recalculateMenus() {
        this.notebooksComponent.setMenuLayout();
    }

    

    public load( state : State ) : boolean {
        
        if(state.value== null){
            state.value = new MainState();
        }

        this.state = state;

        this.headerComponent.setMainTitle("");
        this.headerComponent.setSubTitle("");

        let mainState : MainState = state.value;
        let currentState = this.getCurrentState(state.value);

        this.notebooksComponent.getItems(mainState).then(() => {
            this.notebooksComponent.show();
            if(currentState=="notebook" || currentState=="chapter" || currentState=="note"){
                this.headerComponent.setMainTitle(mainState.notebook.name);
                this.chaptersComponent.getItems(mainState).then(()=>{
                    this.chaptersComponent.show();
                    if(currentState=="chapter" || currentState=="note"){
                        this.headerComponent.setSubTitle(mainState.chapter.name);
                        this.notesComponent.getItems(mainState).then(() => {
                            this.notesComponent.show();
                            if(currentState=="note"){
                                this.noteComponent.getItem(mainState).then(() =>{
                                    this.noteComponent.show();
                                    this.notebooksComponent.setMenuLayout();
                                }).catch(() => {});;
                            } else{
                                this.notebooksComponent.setMenuLayout();
                                this.noteComponent.hide();
                            }
                        }).catch(() => {});;
                    } else {
                        this.notebooksComponent.setMenuLayout();
                        this.notesComponent.hide();
                    }
                }).catch(() => {});;
            } else {
                this.notebooksComponent.setMenuLayout();
                this.chaptersComponent.hide();
            }
        }).catch(() => {});

        this.show();
        return true;
        
    }

    public back(){
        this.notebooksComponent.back();
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