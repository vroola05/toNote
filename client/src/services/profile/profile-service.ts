import { User, Sort } from 'types';
import { Observable } from '../../components/util/subscribe';

export class Profile {
    // private static user: User = null;
    private static user: Observable<User> = new Observable(null);
    private static sort: Observable<Sort[]> = new Observable([]);

    constructor() {
    }

    public static clear(): void {
        localStorage.clear();
    }

    public static getApikey(): string {
        return localStorage.getItem('apikey');
    }

    public static setApikey(apikey: string) {
        localStorage.setItem('apikey', apikey);
    }

    public static setUser(user: User) {
        Profile.user.next(user);
        Profile.setSort(user.sort);
    }

    public static getUser(): User {
        return Profile.user.getValue();
    }

    public static getUserAsObservable(): Observable<User> {
        return Profile.user;
    }

    public static setSort(sort: Sort[]) {
        if (sort) {
            Profile.sort.next(sort);
        }
    }

    public static updateSort(sort: Sort): void {
        const sortList = Profile.sort.getValue();
        for (let i = 0; i < sortList.length; i++) {
            if (sort.name === sortList[i].name) {
                sortList[i] = sort;
                Profile.setSort(sortList);
                return;
            }
        }
        // sortList.push(sort);
        // Profile.setSort(sortList);
    }

    public static getSort(): Sort[] {
        return Profile.sort.getValue();
    }

    public static getSortByName(name: string): Sort {
        return Profile.sort.getValue().find(sort => sort.name === name);
    }

    public static getSortAsObservable(): Observable<Sort[]> {
        return Profile.sort;
    }
}
