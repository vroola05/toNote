import {State, IStateHandler} from "../../services/state/types"


import LoginModule from './login-module';

export class LoginStateHandler implements IStateHandler {
    private loginModule : LoginModule;

    constructor( loginModule : LoginModule ){
        this.loginModule = loginModule;
    }

    public load( state : State ) : boolean{
        console.log(state);

        this.loginModule.show();
        return true;
    }
}