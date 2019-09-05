import Lang from '../../components/language/lang';

import {State, IRouter} from "../../services/router/types";
import { User, Info, Message } from '../../types';
import { Router } from '../../services/router/router-service';

import { IWindow } from '../../components/controls/iwindow/iwindow';
import ButtonComponent from '../../components/controls/button/button-component';

export default class LoginModule extends IWindow{
    private settingsContainer:HTMLElement = document.createElement("div");
    private settingsElement:HTMLElement = document.createElement("div");
    private state: State;

    constructor(){
        super("settings",Lang.get("settings_title"));
        this.append(this.settingsContainer);
        this.settingsContainer.className = "settingsContainer";
        this.settingsContainer.appendChild(this.settingsElement);

        this.settingsElement.className = "settingsElement";

        var title:HTMLElement = document.createElement("h1");
        title.innerHTML = Lang.get("settings_title");
        title.className = "title";
        this.settingsElement.appendChild(title);
        

        const btnCancel = new ButtonComponent(Lang.get("settings_cancel"), () => {
            Router.set({key : "main", value: this.state.value}, Lang.get("state_title_notebooks"),"main");
        });
        this.settingsElement.appendChild(btnCancel.dom);
        
        const btnSave = new ButtonComponent(Lang.get("settings_save"), () => {
            Router.set({key : "main", value: this.state.value}, Lang.get("state_title_notebooks"),"main");
        });
        this.settingsElement.appendChild(btnSave.dom);

    }

    /*
    public show(){
        document.body.appendChild(this.loginContainer);
    }

    public hide(){
        document.body.removeChild(this.loginContainer);
    }
*/

    public load( state : State ) : boolean {
        this.state = state;

        this.show();

        return true;
    }
}
