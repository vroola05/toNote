import svgLogo from '../../../assets/images/logo.svg';

import Lang from '../../../components/language/lang';

import { User, Info, Message } from '../../../types';
import { Router } from '../../../services/router/router-service';
import { LoginService } from '../../../services/http/login-service';
import { AuthenticationService } from '../../../services/authentication/authentication-service';

import InputComponent from '../../../components/controls/input/input-component';

import ButtonContainedComponent from '../../../components/controls/buttons/button-contained/button-contained-component';

export default class LoginComponent {

    public dom: HTMLElement = document.createElement('div');
    private loginError: HTMLDivElement;

    private inputUsername: InputComponent;
    private inputPassword: InputComponent;

    constructor() {
        this.dom.className = 'loginContainer';
        
        const imgLogo: HTMLImageElement = document.createElement('img');
        imgLogo.className = 'logo';
        imgLogo.src = svgLogo;
        this.dom.appendChild(imgLogo);

        this.inputUsername = new InputComponent('text', 'username', Lang.get('login_username'));
        this.dom.appendChild(this.inputUsername.dom);
        
        this.inputPassword = new InputComponent('password', 'password', Lang.get('login_password'));
        this.inputPassword.addEventListener('keyup', (e: KeyboardEvent) => { 
            if ( e.keyCode === 13 ) {
                this.submit();    
            }
        });
        this.dom.appendChild(this.inputPassword.dom);

        const loginErrorContainer = document.createElement('div');
        loginErrorContainer.className = 'loginErrorContainer';

        this.loginError = document.createElement('div');
        this.loginError.className = 'loginError';

        loginErrorContainer.appendChild(this.loginError);
        this.dom.appendChild(loginErrorContainer);

        const loginSubmitContainer = document.createElement('div');
        loginSubmitContainer.className = 'loginSubmitContainer';
        this.dom.appendChild(loginSubmitContainer);
        const btnLogin = new ButtonContainedComponent(Lang.get('login_send'), () => {
            this.submit();
        });
        btnLogin.classList.add('loginSubmit');
        loginSubmitContainer.appendChild(btnLogin.dom);
    }

    private submit() {
        const user: User = {
            userId: undefined,
            name: undefined,
            username: this.inputUsername.value,
            password: this.inputPassword.value,
            active: undefined
        };

        if (user.username === '' || user.password === '') {
            this.setError(Lang.get('login_input_invalid'));
            return;
        }

        AuthenticationService.clear();

        const loginService: LoginService = new LoginService();
        loginService.login(user).then((message: Message) => {
            this.inputPassword.value = '';

            if ( message.status === 401 || !message.info) {
                this.setError(message.message);
            } else {
                message.info.forEach( (info: Info) => {
                    if (info.id === 'apikey' && info.value !== undefined && info.value !== '') {
                        AuthenticationService.setApikey(info.value);
                        Router.goToMain();
                    }
                });
            }
        },
        (err) => {
        });
    }

    public setError(message: string): void {
        this.loginError.innerHTML = '';
        const error = document.createElement('span');
        error.innerText = message;
        this.loginError.appendChild(error);
    }
}
