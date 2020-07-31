import { State, IRouter } from './types';

export class Router {
    private static stateMap: Map<string, IRouter>;
    protected static module: string;
    protected static urlParameters: Array<string>;

    constructor() {
    }
 
    public static getPath(): string {
        return location.hash.replace('#', '');
    }

    public static readUrl(): void {
        const urlParameters = location.hash.replace('#', '');
        if (urlParameters) {
            this.urlParameters = urlParameters.split('/');
        } else {
            this.urlParameters = new Array<string>();
        }
    }

    /**
     * Register a handler of a specific state. 
     * @param key - An identifier key
     * @param value - 
     */
    public static register(key: string, value: IRouter): void {
        if (Router.stateMap == null) {
            Router.stateMap = new Map<string, IRouter>();
            window.onpopstate = function(event: PopStateEvent) {
                event.preventDefault();
                Router.load(event.state);
            };
        }
        Router.stateMap.set(key, value);
    }

    /**
     * Does the same as the back button
     */
    public static back(): void {
        if (window.history.length > 0) {
            window.history.back();
        }
    }

    /**
     * Sets a specific state
     * @param state 
     * @param title 
     * @param url 
     */
    public static set(module: string, title: string, url: string): void {
        this.module = module;
        if (title) {
            document.title = title;
        }

        window.history.pushState(module, title, '#' + ( !url ? '' : url ));

        Router.load(module);
    }

    /**
     * Loads a specific state
     * @param state 
     */
    private static load(module: string): void {
        Router.readUrl();
        if (Router.stateMap.has(module)) {
            Router.stateMap.get(module).load(module, Router.getUrlparameters());
        }
    }

    public static getCurrentModule(): string {
        return Router.module;
    }

    public static getUrlparameters(): Array<string> {
        return this.urlParameters;
    }
}
