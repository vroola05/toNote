export class State {
    public key: string;
    public type :string;
    public name:string;
    public id:number;
}

export interface IStateHandler {
    load(state:State) : boolean;
}