export class State {
    public key : string;
    public value : any | null;
}

export interface IStateHandler {
    load(state:State) : boolean;
}