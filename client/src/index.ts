import './styles.scss';
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
    ////////////////////////////////////////
    // 
    ////////////////////////////////////////
    const conf = new ConfigService(() => {
      Router.readUrl();
      Router.register('login', new LoginModule());
      Router.register('main', new MainModule());
      Router.register('settings', new SettingsModule());

      const loginService: LoginService = new LoginService();
      loginService.check().then(() => {
        const path = Router.getPath();

        Router.set('main', Lang.get('state_title_notebooks'), path);
      }).catch(() => { });
    });

    return 0;
  }
}

Startup.main();
