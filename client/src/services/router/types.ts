export class State {
    public key: string;
    public value: any | null;
}

export interface IRouter {
    load(module: string, route: Array<string>): boolean;
}
