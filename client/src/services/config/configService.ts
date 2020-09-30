import { ApplicationConfig } from './types';
import Lang from '../../components/language/lang';


export default class Config {
    private static config: ApplicationConfig = null;

    constructor(callback: Function | undefined = undefined ) {
        Config.readConfig().then((value: ApplicationConfig) => {
            Config.config = value;
            Config.readLanguage().then((lang: any) => {
                Lang.setMap(lang);
                if (callback !== undefined) {
                    callback();
                }
            });
        });
    }

    public static readLanguage() {
        
        return fetch('config/language.json').then((response) => {
            if (response.status === 200) {
                return response.json().catch((e) => {
                    const jsonError = new Error('Could not parse the language file.') as any;
                    jsonError.source = 'config';
                    jsonError.inner = e;
                    throw jsonError;
                }) as Promise<ApplicationConfig>;
            }

            const error = new Error('Cannot configure the application: no access to the configuration file.') as any;
            error.source = 'config';
            error.status = response.status;
            throw error;
        });
    }

    public static readConfig() {
        return fetch('config/appconfig.json').then((response) => {

            if (response.status === 200) {
                return response.json().catch((e) => {
                    const jsonError = new Error('Could not parse the configuration.') as any;
                    jsonError.source = 'config';
                    jsonError.inner = e;
                    throw jsonError;
                }) as Promise<ApplicationConfig>;
            }

            const error = new Error('Cannot configure the application: no access to the configuration file.') as any;
            error.source = 'config';
            error.status = response.status;
            throw error;
        });
    }

    public static get(): ApplicationConfig {
        if (Config.config == null) {
            throw new Error('Config has not been read');
        }
        return Config.config;
    }
}
