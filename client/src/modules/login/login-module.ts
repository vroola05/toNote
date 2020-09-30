import Lang from '../../components/language/lang';

import { State, IRouter } from '../../services/router/types';
import { User, Info, Message, LoginState } from '../../types';
import { Router } from '../../services/router/router-service';
import { LoginService } from '../../services/http/login-service';
import { Profile } from '../../services/profile/profile-service';
import { IWindow } from '../../components/controls/iwindow/iwindow';
import InputComponent from '../../components/controls/input/input-component';
import LoginComponent from './login/login-component';


export default class LoginModule extends IWindow {
    private loginComponent: LoginComponent;

    public state: State;

    constructor() {
        super('login', Lang.get('state_title_login'));

        this.loginComponent = new LoginComponent();
        this.append(this.loginComponent.dom);
    }

    public load(module: string, route: Array<string>): boolean {
        /* if (this.isStateLoaded(state)) {
        } */


        this.show();
        // this.inputUsername.focus();
        return true;
    }

    private isStateLoaded(state: State): boolean {
        return (this.state && this.state.key === state.key);
    }
}
