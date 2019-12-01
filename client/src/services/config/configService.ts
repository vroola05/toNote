import { ApplicationConfig } from './types';
import Lang from '../../components/language/lang';


export default class ConfigService {
    private static config: ApplicationConfig = null;

    constructor(callback: Function | undefined = undefined ) {
        ConfigService.readConfig().then((value: ApplicationConfig) => {
            console.log(value);
            ConfigService.config = value;
            ConfigService.readLanguage().then((lang: any) => {
                Lang.setMap(lang);
                if(callback !== undefined){
                    callback();
                }
            });
        });
    }

    public static readLanguage() {
        
        return fetch('config/language.json').then((response) => {
            if (response.status === 200) {
                return response.json().catch((e) => {
                    const jsonError = new Error('Could not parse the language file.') as any
                    jsonError.source = 'config'
                    jsonError.inner = e
                    throw jsonError
                }) as Promise<ApplicationConfig>
            }

            const error = new Error('Cannot configure the application: no access to the configuration file.') as any
            error.source = 'config'
            error.status = response.status
            throw error
        });
    }

    public static readConfig() {
        console.log("lala");
        return fetch('config/appconfig.json').then((response) => {

            if (response.status === 200) {
                return response.json().catch((e) => {
                    const jsonError = new Error('Could not parse the configuration.') as any
                    jsonError.source = 'config'
                    jsonError.inner = e
                    throw jsonError
                }) as Promise<ApplicationConfig>
            }

            const error = new Error('Cannot configure the application: no access to the configuration file.') as any
            error.source = 'config'
            error.status = response.status
            throw error
        });
    }

    public static get(): ApplicationConfig{
        if(ConfigService.config == null){
            throw new Error("Config has not been read");
        }
        return ConfigService.config;
    }
}