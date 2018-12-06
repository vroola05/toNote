import { Entity, Method } from './types';
import combineUrl from './combineUrl'
import ConfigService from '../services/config/configService';

export default class HttpClient{

    private apiUrl: string;
    constructor(){
        this.apiUrl = ConfigService.getInstance().getConfig().api.url;
    }

    public post<T, D>(endpoint: string, body: D) : Promise<T> {
        
        return this.doRequest('POST', endpoint, body)
    }

    private doRequest<T, D>(method: Method, endpoint: string, data: D) : Promise<T>{
        
        let requestOptions: RequestInit = {
            method, 
            body: data ? JSON.stringify(data) : null
        }
        // can add default headers etc

        return fetch(combineUrl([this.apiUrl, endpoint], false), requestOptions)
            .then(function(response) {
                if (response.status === 200) {
                    return response.json().catch((e) => {
                        const jsonError = new Error('Could not parse the configuration.') as any
                        jsonError.source = 'config'
                        jsonError.inner = e
                        throw jsonError
                    }) as Promise<T>
                }
                const error = new Error('Cannot configure the application: no access to the configuration file.') as any
                error.source = 'config'
                error.status = response.status
                throw error
            });
    }
}