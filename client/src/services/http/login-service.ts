import { User, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class LoginService extends HttpClient {
    constructor(){
        super();
    }

    public login(user : User) : Promise<Message>{
        return LoginService.post("login", user);
    }

    public logout() : Promise<Message>{
        return LoginService.get("logout");
    }

    public check() : Promise<Message>{
        return LoginService.get("login");
    }
}