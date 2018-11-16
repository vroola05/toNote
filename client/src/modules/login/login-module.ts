import './login-module.scss';

export default class LoginModule{
    private loginElement:HTMLElement = document.createElement("div");

    constructor(){
        
        this.loginElement.className = "loginElement";
        this.loginElement.innerHTML = "Sample";
        document.body.appendChild(this.loginElement);
    }

    public print(test:String){
        console.log(test);
        this.loginElement.innerHTML = test.toString();
    }
}
