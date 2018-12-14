import { ApplicationConfig } from './types';
import combineUrl from '../../api/combineUrl'

export default class ConfigService {
    
    private static instance: ConfigService;
    private config: ApplicationConfig = null;
    
    private constructor() {
        
        this.readConfig().then((value: ApplicationConfig) => {
            this.config = value;
        });
    }

    static getInstance() {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }
    
    private readConfig() {
        let parts: String[] = ["a"];
        return fetch(combineUrl([process.env.APP_ROOT_URL as string, 'config/appconfig'], false)).then((response) => {
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
        })
    }

    public getConfig(): ApplicationConfig{
        if(this.config == null){
            throw new Error("Config has not been read");
        }
        return this.config;
    }
}