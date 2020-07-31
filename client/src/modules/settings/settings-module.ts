import Lang from '../../components/language/lang';

import {State, IRouter} from '../../services/router/types';
import { User, Info, Message } from '../../types';
import { Router } from '../../services/router/router-service';

import { IWindow } from '../../components/controls/iwindow/iwindow';
import ButtonContainedComponent from '../../components/controls/buttons/button-contained/button-contained-component';

export default class LoginModule extends IWindow {
    private settingsContainer: HTMLElement = document.createElement('div');
    private settingsElement: HTMLElement = document.createElement('div');
    private module: string;

    constructor() {
        super('settings', Lang.get('settings_title'));
        this.append(this.settingsContainer);
        this.settingsContainer.className = 'settingsContainer';
        this.settingsContainer.appendChild(this.settingsElement);

        this.settingsElement.className = 'settingsElement';

        const title: HTMLElement = document.createElement('h1');
        title.innerHTML = Lang.get('settings_title');
        title.className = 'title';
        this.settingsElement.appendChild(title);
        

        const btnCancel = new ButtonContainedComponent(Lang.get('settings_cancel'), () => {
            Router.set('main', Lang.get('state_title_notebooks'), 'main');
        });
        this.settingsElement.appendChild(btnCancel.dom);
        
        const btnSave = new ButtonContainedComponent(Lang.get('settings_save'), () => {
            Router.set('main', Lang.get('state_title_notebooks'), 'main');
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

    public load( module: string, route: Array<string> ): boolean {
        this.module = module;

        this.show();

        return true;
    }
}
