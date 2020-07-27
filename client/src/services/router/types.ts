export class State {
    public key : string;
    public value : any | null;
}

export interface IRouter {
    load(state:State, route: Array<string>) : boolean;
}