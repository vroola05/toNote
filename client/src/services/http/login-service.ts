import { User, Message } from '../../api/types';
import HttpClient from '../../api/httpClient';

export class LoginService extends HttpClient{
    constructor(){
        super();
    }

    public login(user : User) : Promise<Message>{
        return this.post("login", user);
    }

}