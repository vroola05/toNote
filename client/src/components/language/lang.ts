export default class Lang{
    private static map:any;
    private static language:string;

    public static get(tag:string){
        return Lang.map[this.language][tag];
    }

    public static setMap(map:any){
        Lang.map = map;
        Lang.language = Lang.map[navigator.language]!==undefined?navigator.language:"en-US";
    }
}
