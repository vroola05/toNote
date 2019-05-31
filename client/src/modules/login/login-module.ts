import './login-module.scss';
import Lang from '../../components/language/lang';

import svgLogo from '../../assets/images/logo.svg';

import {State, IRouter} from "../../services/router/types";
import { User, Info, Message } from '../../types';
import { Router } from '../../services/router/router-service';
import { LoginService } from '../../services/http/login-service';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { IWindow } from '../../components/controls/iwindow/iwindow';
import ButtonComponent from '../../components/controls/button/button-component';
import InputComponent from '../../components/controls/input/input-component';

export default class LoginModule extends IWindow{
    private loginContainer: HTMLElement = document.createElement("div");
    
    
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
        this.loginContainer.appendChild(this.inputUsername.get());
        
        this.inputPassword = new InputComponent("password", "password", Lang.get("login_password"));
        this.loginContainer.appendChild(this.inputPassword.get());

        const btnLogin = new ButtonComponent(Lang.get("login_send"), () => {
            this.submit();
        });
        this.loginContainer.appendChild(btnLogin.get());
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
            username: this.inputUsername.value(),
            password: this.inputPassword.value(),
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
                    
                    
                    Router.set({ key : "main", value : null}, Lang.get("state_title_notebooks"),"main");
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
