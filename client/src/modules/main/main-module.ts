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

export default class MainModule extends IWindow{
    protected notebooksComponent:NotebooksComponent = new NotebooksComponent();
    protected chaptersComponent:ChaptersComponent = new ChaptersComponent();
    protected notesComponent:NotesComponent = new NotesComponent();
    protected noteComponent:NoteComponent = new NoteComponent();

    protected headerComponent:HeaderComponent = new HeaderComponent(this);

    public state: State;


    constructor(){
        super("main", "Notities");
        this.append(this.headerComponent.get());
        
        //let testBtn = new ButtonComponent("test");
        //headerComponent.addMenuItem(testBtn);

        let tabs = document.createElement("div");
        tabs.className = "tabs";
        
        this.append(tabs);
/*
        var back = <HTMLDivElement>(document.createElement('div'));
        header.appendChild(back);
        back.innerHTML = "Back";
        back.onclick = () => {
            this.notebooksComponent.back();
        };
*/
        this.notebooksComponent.setChild(this.chaptersComponent);
        this.chaptersComponent.setChild(this.notesComponent);
        this.notesComponent.setChild(this.noteComponent);
        this.noteComponent.setParent(this.notesComponent);

        tabs.appendChild( this.notebooksComponent.get());
        tabs.appendChild( this.chaptersComponent.get());
        tabs.appendChild( this.notesComponent.get());
        tabs.appendChild( this.noteComponent.get());
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
                                }).catch(() => {});;
                            } else{
                                this.noteComponent.hide();
                            }
                        }).catch(() => {});;
                    } else {
                        this.notesComponent.hide();
                    }
                }).catch(() => {});;
            } else {
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