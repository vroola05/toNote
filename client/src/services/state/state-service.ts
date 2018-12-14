import { State, IStateHandler } from './types';

export class StateService{
    private static stateMap:Map<string, IStateHandler>;

    constructor(){
    }

    /**
     * Register a handler of a specific state. 
     * @param key - An identifier key
     * @param value - 
     */
    public static register(key:string, value:IStateHandler){
        if(StateService.stateMap == null){
            StateService.stateMap = new Map<string, IStateHandler>();
            window.onpopstate = function(event) {
                event.preventDefault();
                StateService.load(event.state);
            };
        }
        StateService.stateMap.set(key, value);
    }

    /**
     * Does the same as the back button
     */
    public static back(){
        if(window.history.length>0){
            window.history.back();
        }
    }

    /**
     * Sets a specific state
     * @param state 
     * @param title 
     * @param url 
     */
    public static set(state : State, title : string, url : string){
        console.log(state, title, url);
        document.title = title;
        window.history.pushState(state, title, "#" + url);
    }

    /**
     * Loads a specific state
     * @param state 
     */
    private static load(state : State){
        if(StateService.stateMap.has(state.key)){
            StateService.stateMap.get(state.key).load(state);
        }
    }

}