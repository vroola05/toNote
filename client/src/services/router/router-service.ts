import { State, IRouter } from './types';

export class Router{
    private static stateMap:Map<string, IRouter>;
    protected static state : State;

    constructor(){
    }

    /**
     * Register a handler of a specific state. 
     * @param key - An identifier key
     * @param value - 
     */
    public static register(key:string, value:IRouter){
        if(Router.stateMap == null){
            Router.stateMap = new Map<string, IRouter>();
            window.onpopstate = function(event) {
                event.preventDefault();
                Router.load(event.state);
            };
        }
        Router.stateMap.set(key, value);
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
        if(title){
            document.title = title;
        }
        window.history.pushState(state, title, "#" + url);
        Router.load(state);
    }

    /**
     * Loads a specific state
     * @param state 
     */
    private static load(state : State){
        if(Router.stateMap.has(state.key)){
            Router.state = state;
            Router.stateMap.get(state.key).load(state);
        }
    }

    public static getCurrentState() : State{
        return Router.state;
    }
}