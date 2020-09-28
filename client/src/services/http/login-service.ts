import { User, Message, Sort } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class LoginService extends HttpClient {
    constructor() {
        super();
    }

    public login(user: User): Promise<Message> {
        return LoginService.post('login', user);
    }

    public logout(): Promise<Message> {
        return LoginService.get('logout');
    }

    public check(): Promise<Message> {
        return LoginService.get('login');
    }

    public user(): Promise<User> {
        return LoginService.get('user');
    }

    public sort(id: string, sort: Sort): Promise<Message> {
        return LoginService.put('user/sort/' + id, sort);
    }
}
