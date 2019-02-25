import './login-module.scss';
import Lang from '../../components/language/lang';

import { User, Info, Message } from '../../api/types';
import { StateService } from '../../services/state/state-service';
import { LoginService } from '../../services/http/login-service';
import { AuthenticationService } from '../../services/authentication/authentication-service';

export default class LoginModule{
    private loginElement:HTMLElement = document.createElement("div");
    private usernameElement:HTMLInputElement = document.createElement("input");
    private passwordElement:HTMLInputElement = document.createElement("input");
    private submitElement:HTMLButtonElement = document.createElement("button");

    constructor(){
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

        this.submitElement.className = "submit";
        this.submitElement.innerHTML = Lang.get("login_send");
        let self = this;
        this.submitElement.onclick = function(){
            self.submit();
        }
        this.loginElement.appendChild(this.submitElement);
    }

    public show(){
        document.body.appendChild(this.loginElement);
    }

    public hide(){
        document.body.removeChild(this.loginElement);
    }

    private submit(){
        let user : User = {
            userId:undefined,
            username: this.usernameElement.value,
            password: this.passwordElement.value,
            active:undefined

        };
        const self = this;
        const loginService : LoginService = new LoginService();
        loginService.login(user).then(function(message:Message){
            message.info.forEach(function(info:Info){
                if(info.id==="apikey" && info.value!==undefined && info.value != ""){
                    const auth : AuthenticationService = new AuthenticationService();
                    auth.setApikey(info.value);
                }
            });
            
            self.hide();

            
            StateService.set({ "key" : "notebooks", "value" : null}, Lang.get("state_title_notebooks"),"notebooks");
        });
    }
}
