/*************************************************************************
 * Copyright vrooland.net
 *
 *************************************************************************
 * @description
 * @author Mark Vrooland
 *************************************************************************/
class User {
    userId: number|undefined;
    username: String|undefined;
    password: String|undefined;
    active: boolean|undefined;
    
    constructor() {
    }

    setUserId(userId: number) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }

    setUsername(username: String) {
        this.username = username;
    }
    getUsername() {
        return this.username;
    }

    setPassword(password: String) {
        this.password = password;
    }
    getPassword() {
        return this.password;
    }

    setActive(active: boolean) {
        this.active = active;
    }
    getActive() {
        return this.active;
    }
}
