export default class Lang{
    private static map:any;
    private static language:string;

    public static get(tag:string){
        return Lang.map[this.language][tag];
    }

    public static setMap(map:any){
        Lang.map = map;
        const langCode = navigator.language.substring(0,2);
        Lang.language = Lang.map[langCode]!==undefined?langCode:"en";
    }
}
