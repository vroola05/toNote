import { User, Sort } from 'types';
import { Observable } from '../../components/util/subscribe';

export class AuthenticationService {
    // private static user: User = null;
    public static user: Observable<User> = new Observable(null);
    
    constructor() {
    }

    public static clear(): void {
        localStorage.clear();
    }

    public static getApikey(): string {
        return localStorage.getItem('apikey');
    }

    public static setApikey(apikey: string)  {
        localStorage.setItem('apikey', apikey);
    }

    public static setUser(user: User)  {
        AuthenticationService.user.next(user);
    }

    public static getUser(): User  {
        return AuthenticationService.user.getValue();
    }

    public static getUserAsObservable(): Observable<User>  {
        return AuthenticationService.user;
    }

    /*public static getSort(name: string): Sort  {
        
        if (AuthenticationService.user && AuthenticationService.user.sort) {
            for (const sort of AuthenticationService.user.sort) {
                console.log(sort);
                if (name === sort.name) {
                    return sort;
                }
            }
        }
        return null;
    }*/
}
