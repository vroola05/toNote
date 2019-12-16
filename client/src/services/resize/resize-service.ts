export class Resize{
    
    private static resize: Map<string, any> = new Map<string, any>();

    constructor(){
    }

    public static set(key:string, value:any) {
        Resize.remove(key);

        window.addEventListener("resize", value, true);
        this.resize.set(key, value);
    }

    public static remove(key:string) {
        const func = this.resize.get(key);
        if (func) {
            window.removeEventListener("resize", func, true);
            this.resize.delete(key);
        }
    }
}
