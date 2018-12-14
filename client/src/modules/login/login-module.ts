import './login-module.scss';
import Lang from '../../components/language/lang';

export default class LoginModule{
    private loginElement:HTMLElement = document.createElement("div");
    private usernameElement:HTMLInputElement = document.createElement("input");
    private passwordElement:HTMLInputElement = document.createElement("input");
    private submitElement:HTMLButtonElement = document.createElement("button");

    constructor(){
        this.loginElement.className = "loginElement";
        
        document.body.appendChild(this.loginElement);

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
        this.loginElement.appendChild(this.submitElement);
    }

    public print(test:String){
    
    }
}
