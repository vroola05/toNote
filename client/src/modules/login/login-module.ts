import Lang from '../../components/language/lang';

import svgLogo from '../../assets/images/logo.svg';

import {State, IRouter} from "../../services/router/types";
import { User, Info, Message } from '../../types';
import { Router } from '../../services/router/router-service';
import { LoginService } from '../../services/http/login-service';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { IWindow } from '../../components/controls/iwindow/iwindow';
import InputComponent from '../../components/controls/input/input-component';
import ButtonContainedComponent from '../../components/controls/buttons/button-contained/button-contained-component';
import ButtonOutlinedComponent from '../../components/controls/buttons/button-outlined/button-outlined-component';
import ButtonTextComponent from '../../components/controls/buttons/button-text/button-text-component';

export default class LoginModule extends IWindow{
    private loginContainer: HTMLElement = document.createElement("div");
    private loginError: HTMLDivElement;
    
    private inputUsername: InputComponent;
    private inputPassword: InputComponent;
    
    constructor(){
        super("login",Lang.get("state_title_login"));
        this.append(this.loginContainer);
        this.loginContainer.className = "loginContainer";
        
        const imgLogo: HTMLImageElement = document.createElement("img");
        imgLogo.className = "logo";
        imgLogo.src = svgLogo;
        this.loginContainer.appendChild(imgLogo);

        this.inputUsername = new InputComponent("text", "username", Lang.get("login_username"));
        this.loginContainer.appendChild(this.inputUsername.dom);
        
        this.inputPassword = new InputComponent("password", "password", Lang.get("login_password"));
        this.inputPassword.addEventListener("keyup", (e: KeyboardEvent) => { 
            if( e.keyCode === 13 ) {
                this.submit();    
            }
        });
        this.loginContainer.appendChild(this.inputPassword.dom);

        const loginErrorContainer = document.createElement("div");
        loginErrorContainer.className = "loginErrorContainer";

        this.loginError = document.createElement("div");
        this.loginError.className = "loginError";

        loginErrorContainer.appendChild(this.loginError);
        this.loginContainer.appendChild(loginErrorContainer);

        const loginSubmitContainer = document.createElement("div");
        loginSubmitContainer.className = "loginSubmitContainer";
        this.loginContainer.appendChild(loginSubmitContainer);
        const btnLogin = new ButtonContainedComponent(Lang.get("login_send"), () => {
            this.submit();
        });
        btnLogin.addClass("loginSubmit");
        loginSubmitContainer.appendChild(btnLogin.dom);
    }

    private submit() {
        let user : User = {
            userId:undefined,
            username: this.inputUsername.value(),
            password: this.inputPassword.value(),
            active:undefined

        };

        if(user.username === '' || user.password === '') {
            this.setError(Lang.get("login_input_invalid"));
            return;
        }

        let  auth : AuthenticationService = new AuthenticationService();
        auth.clear();
        
        const loginService : LoginService = new LoginService();
        loginService.login(user).then((message:Message) => {
            if( message.info ) {
                message.info.forEach( (info:Info) => {
                    if(info.id==="apikey" && info.value!==undefined && info.value != ""){
                        const auth : AuthenticationService = new AuthenticationService();
                        auth.setApikey(info.value);

                        Router.set({ key : "main", value : null}, Lang.get("state_title_notebooks"),"main");
                        this.hide();
                    }
                });
            } else {
                this.setError(message.message);
            }
            
            
        },
        () => {
            
        });
    }

    public setError(message: string): void {
        this.loginError.innerHTML = '';
        const error = document.createElement("span");
        error.innerText = message;
        this.loginError.appendChild(error);
    }

    public load( state : State ) : boolean {
        this.show();
        this.inputUsername.focus();
        return true;
    }
}
