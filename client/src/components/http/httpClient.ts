import { Method } from '../../types';
import Config from '../../services/config/configService';
import { Profile } from '../../services/profile/profile-service';
import { Router } from '../../services/router/router-service';
import Lang from '../language/lang';

export default class HttpClient {
    private static apiUrl: string;

    constructor() {
        HttpClient.apiUrl = Config.get().api.url;
    }

    public static get<T, D>(endpoint: string, body: D = null): Promise<T> {
        return HttpClient.doRequest('GET', endpoint, null);
    }

    public static post<T, D>(endpoint: string, body: D): Promise<T> {
        return HttpClient.doRequest('POST', endpoint, body);
    }

    public static put<T, D>(endpoint: string, body: D): Promise<T> {
        return HttpClient.doRequest('PUT', endpoint, body);
    }

    public static delete<T, D>(endpoint: string, body: D = null): Promise<T> {
        return HttpClient.doRequest('DELETE', endpoint, body);
    }

    private static doRequest<T, D>(method: Method, endpoint: string, data: D): Promise<T> {
        const requestOptions: RequestInit = {
            method,
            body: data ? JSON.stringify(data) : null
        };
        
        const headers = new Headers();
        headers.append('Accept-Language', navigator.language);
        
        requestOptions.headers = headers;

        const apikey = Profile.getApikey();
        if (apikey !== null) {
            headers.append('apikey', apikey);
        }

        // can add default headers etc
        if (method !== 'GET') {
            headers.append('Content-Type', 'application/json');   
        }

        return fetch(this.apiUrl + endpoint, requestOptions).then((response) => {
            if (response.status === 401 && (!Router.getCurrentModule() || Router.getCurrentModule() !== 'login') ) {
                Router.set('login', Lang.get('state_title_login'), 'login');
            } else {
                return response.json().catch((error) => {
                    throw error;
                }) as Promise<T>;
            } 
        })
        .catch((error) => {
            throw error;
        });
    }
}
