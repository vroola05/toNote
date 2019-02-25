export class AuthenticationService{
    
    constructor(){
        
    }


    public getApikey() : string{
        return localStorage.getItem("apikey");
    }

    public setApikey(apikey: string)  {
        localStorage.setItem("apikey", apikey);
    }
}