import "./styles.scss";
import ConfigService from './services/config/configService';
import Lang from './components/language/lang';

import { Router } from './services/router/router-service';
import { State, IRouter } from './services/router/types';

import LoginModule from './modules/login/login-module';
import MainModule from './modules/main/main-module';
import SettingsModule from './modules/settings/settings-module';

import { LoginService } from './services/http/login-service';

class Startup {
    public static main(): number {

        Router.register("login", new LoginModule());
        Router.register("main", new MainModule());
        Router.register("settings", new SettingsModule());

        ////////////////////////////////////////
        // 
        ////////////////////////////////////////

        ////////////////////////////////////////
        // 
        ////////////////////////////////////////
        new ConfigService( function() {
            
            const loginService : LoginService = new LoginService();
            loginService.check().then(()=>{
                let state = window.history.state;
                if(state==null){
                    state = { "key" : "main", value : null};
                }
                Router.set(state, Lang.get("state_title_notebooks"),"main");
            }).catch(() => {
            });
        } );
        
        
        return 0;
    }
}

Startup.main();
