import { Entity, Method } from './types';
import combineUrl from './combineUrl'
import ConfigService from '../services/config/configService';
import { AuthenticationService } from '../services/authentication/authentication-service';
import { StateService } from '../services/state/state-service';
import Lang from '../components/language/lang';

export default class HttpClient{
    private  auth : AuthenticationService = new AuthenticationService();
    private apiUrl: string;
    constructor(){
        this.apiUrl = ConfigService.get().api.url;
    }

    public get<T, D>(endpoint: string, body: D) : Promise<T> {
        return this.doRequest('GET', endpoint, body)
    }

    public post<T, D>(endpoint: string, body: D) : Promise<T> {
        return this.doRequest('POST', endpoint, body)
    }

    private doRequest<T, D>(method: Method, endpoint: string, data: D) : Promise<T>{
        let requestOptions: RequestInit = {
            method,
            body: data ? JSON.stringify(data) : null
        }
        
        const headers = new Headers();
        requestOptions.headers=headers;

        const apikey = this.auth.getApikey();
        if(apikey !== null){
            headers.append("apikey", apikey);
        }

        // can add default headers etc
        if(method!=="GET"){
            const headers = new Headers();
            headers.append("Content-Type", "application/json");   
        }
        
        

        return fetch(combineUrl([this.apiUrl, endpoint], false), requestOptions).then(function(response) {
            if (response.ok) {
                return response.json().catch((error) => {
                    throw error;
                }) as Promise<T>
            } else if(response.status===401){
                StateService.set({ "key" : "login", "value" : null}, Lang.get("state_title_login"),"login");
            }
            throw response;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
    }
}