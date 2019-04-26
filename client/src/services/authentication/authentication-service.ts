export class AuthenticationService{
    
    constructor(){
        
    }

    
    public clear() : void{
        localStorage.clear();
    }

    public getApikey() : string{
        return localStorage.getItem("apikey");
    }

    public setApikey(apikey: string)  {
        localStorage.setItem("apikey", apikey);
    }
}