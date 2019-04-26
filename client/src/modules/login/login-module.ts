import './login-module.scss';
import Lang from '../../components/language/lang';

import {State, IRouter} from "../../services/router/types";
import { User, Info, Message } from '../../types';
import { Router } from '../../services/router/router-service';
import { LoginService } from '../../services/http/login-service';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { IWindow } from '../../components/iwindow/iwindow';

export default class LoginModule extends IWindow{
    private loginContainer:HTMLElement = document.createElement("div");
    private loginElement:HTMLElement = document.createElement("div");
    private usernameElement:HTMLInputElement = document.createElement("input");
    private passwordElement:HTMLInputElement = document.createElement("input");
    private submitElement:HTMLButtonElement = document.createElement("button");

    constructor(){
        super("login",Lang.get("state_title_login"));
        this.append(this.loginContainer);
        this.loginContainer.className = "loginContainer";
        this.loginContainer.appendChild(this.loginElement);

        this.loginElement.className = "loginElement";

        var label:HTMLLabelElement = document.createElement("label");
        label.innerHTML = Lang.get("login_username");
        this.loginElement.appendChild(label);
        this.usernameElement.type = "text";
        this.usernameElement.className = "username";
        this.usernameElement.name = "username";
        this.loginElement.appendChild(this.usernameElement);

        var label:HTMLLabelElement = document.createElement("label");
        label.innerHTML = Lang.get("login_password");
        this.loginElement.appendChild(label);
        this.passwordElement.type = "password";
        this.passwordElement.className = "password";
        this.passwordElement.name = "password";
        this.loginElement.appendChild(this.passwordElement);

        this.submitElement.className = "btn submit";
        this.submitElement.innerHTML = Lang.get("login_send");
        let self = this;
        this.submitElement.onclick = function(){
            self.submit();
        }
        this.loginElement.appendChild(this.submitElement);
    }

    /*
    public show(){
        document.body.appendChild(this.loginContainer);
    }

    public hide(){
        document.body.removeChild(this.loginContainer);
    }
*/
    private submit(){
        let user : User = {
            userId:undefined,
            username: this.usernameElement.value,
            password: this.passwordElement.value,
            active:undefined

        };

        let  auth : AuthenticationService = new AuthenticationService();
        auth.clear();
        
        const loginService : LoginService = new LoginService();
        loginService.login(user).then((message:Message) => {
            message.info.forEach( (info:Info) => {
                if(info.id==="apikey" && info.value!==undefined && info.value != ""){
                    const auth : AuthenticationService = new AuthenticationService();
                    auth.setApikey(info.value);
                    
                    
                    Router.set({ "key" : "main", value : null}, Lang.get("state_title_notebooks"),"main");
                }
            });
            
            this.hide();
        });
    }

    public load( state : State ) : boolean {
        
        this.show();
        
        
        return true;
    }
}
