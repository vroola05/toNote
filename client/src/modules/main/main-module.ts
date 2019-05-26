import './main-module.scss';

import svgHome from '../../assets/images/back.svg';
import svgLocked from '../../assets/images/locked.svg';
import svgUnlocked from '../../assets/images/unlocked.svg';
import svgSearch from '../../assets/images/search.svg';
import svgMenu from '../../assets/images/menu.svg';
import svgSettings from '../../assets/images/settings.svg';
import svgLogout from '../../assets/images/logout.svg';


import Lang from '../../components/language/lang';

import { State, IRouter } from "../../services/router/types";
import { IWindow } from '../../components/controls/iwindow/iwindow';
import { MainState } from '../../types';

import HeaderComponent from './components/header/header-component';
import ButtonComponent from '../../components/controls/button/button-component';

import NotebooksComponent from './components/notebooks/notebooks-component';
import ChaptersComponent from './components/chapters/chapters-component';
import NotesComponent from './components/notes/notes-component';
import NoteComponent from './components/note/note-component';
import ButtonToggleComponent from './components/header/components/button-toggle/button-toggle-component';
import ButtonDropdownComponent from './components/header/components/button-dropdown/button-dropdown-component';
import MenuItemComponent from '../../components/controls/menu-item/menu-item-component';

export default class MainModule extends IWindow{
    protected notebooksComponent:NotebooksComponent = new NotebooksComponent();
    protected chaptersComponent:ChaptersComponent = new ChaptersComponent();
    protected notesComponent:NotesComponent = new NotesComponent();
    protected noteComponent:NoteComponent = new NoteComponent();

    protected headerComponent:HeaderComponent = new HeaderComponent();

    constructor(){
        super("main", "Notities");
        this.append(this.headerComponent.get());
        
        //
        let btnBack = new ButtonComponent(svgHome, Lang.get("header_icon_back"));
        btnBack.click = (item:any) => {
            this.notebooksComponent.back();
        };
        this.headerComponent.addMenuItem(btnBack);

        
        //
        let btnLock = new ButtonToggleComponent({
            open:{icon:svgUnlocked, description: Lang.get("header_icon_unlocked")},
            closed:{icon:svgLocked, description: Lang.get("header_icon_locked")}
        });
        btnLock.click = (item:ButtonToggleComponent) => {
            console.log(item.isOpened);
        };
        this.headerComponent.addMenuItem(btnLock);
        //
        let btnSearch = new ButtonDropdownComponent(svgSearch, Lang.get("header_icon_search"));
        btnSearch.click = (item:any) => {
            alert("");
        };
        this.headerComponent.addAltMenuItem(btnSearch);
        
        //
        let btnMenu = new ButtonDropdownComponent(svgMenu, Lang.get("header_icon_menu"));
        btnMenu.click = (item:any) => {
        };
        this.headerComponent.addAltMenuItem(btnMenu);

        btnMenu.addItem(new MenuItemComponent(svgSettings,"Instellingen"));
        btnMenu.addItem(new MenuItemComponent(svgLogout,"Uitloggen"));

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
                                });
                            } else{
                                this.noteComponent.hide();
                            }
                        });
                    } else {
                        this.notesComponent.hide();
                    }
                });
            } else {
                this.chaptersComponent.hide();
            }
        });

        this.show();
        return true;
        
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