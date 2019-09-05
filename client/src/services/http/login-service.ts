import { User, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class LoginService extends HttpClient{
    constructor(){
        super();
    }

    public login(user : User) : Promise<Message>{
        return this.post("login", user);
    }

    public logout() : Promise<Message>{
        return this.get("logout");
    }

    public check() : Promise<Message>{
        return this.get("login");
    }
}