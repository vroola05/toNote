import { ApplicationConfig } from './types';
import combineUrl from '../../components/http/combineUrl'

export default class ConfigService {
    private static config: ApplicationConfig = null;

    constructor(callback: Function | undefined = undefined ) {
        ConfigService.readConfig().then((value: ApplicationConfig) => {
            ConfigService.config = value;
            if(callback !== undefined){
                callback();
            }
            console.log("config read!");
        });
    }

    public static readConfig() {
        return fetch(combineUrl([process.env.APP_ROOT_URL as string, 'config/appconfig.json'], false)).then((response) => {
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