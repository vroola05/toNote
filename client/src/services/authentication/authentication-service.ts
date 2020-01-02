export class AuthenticationService{
    
    constructor(){
        
    }

    
    public static clear() : void{
        localStorage.clear();
    }

    public static getApikey() : string{
        return localStorage.getItem("apikey");
    }

    public static setApikey(apikey: string)  {
        localStorage.setItem("apikey", apikey);
    }
}