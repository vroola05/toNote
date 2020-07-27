import { Entity, Method } from '../../types';
//import combineUrl from './combineUrl'
import ConfigService from '../../services/config/configService';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { Router } from '../../services/router/router-service';
import Lang from '../language/lang';

export default class HttpClient{
    private static apiUrl: string;

    constructor(){
        HttpClient.apiUrl = ConfigService.get().api.url;
    }

    public static get<T, D>(endpoint: string, body: D = null) : Promise<T> {
        return HttpClient.doRequest('GET', endpoint, null)
    }

    public static post<T, D>(endpoint: string, body: D) : Promise<T> {
        return HttpClient.doRequest('POST', endpoint, body)
    }

    public static put<T, D>(endpoint: string, body: D) : Promise<T> {
        return HttpClient.doRequest('PUT', endpoint, body)
    }

    public static delete<T, D>(endpoint: string, body: D = null) : Promise<T> {
        return HttpClient.doRequest('DELETE', endpoint, body)
    }

    private static doRequest<T, D>(method: Method, endpoint: string, data: D) : Promise<T>{
        let requestOptions: RequestInit = {
            method,
            body: data ? JSON.stringify(data) : null
        }
        
        const headers = new Headers();
        headers.append("Accept-Language", navigator.language);
        
        requestOptions.headers=headers;

        const apikey = AuthenticationService.getApikey();
        if(apikey !== null){
            headers.append("apikey", apikey);
        }

        // can add default headers etc
        if(method!=="GET"){
            headers.append("Content-Type", "application/json");   
        }

        return fetch(this.apiUrl + endpoint, requestOptions).then(function(response) {
            if(response.status===401 && (!Router.getCurrentState() || Router.getCurrentState().key !== "login") ){
                Router.set({ "key" : "login", "value" : null}, Lang.get("state_title_login"),"login");
            } else {
                return response.json().catch((error) => {
                    throw error;
                }) as Promise<T>;
            } 
        })
        .catch(function(error) {
            throw error;
        });
    }
}