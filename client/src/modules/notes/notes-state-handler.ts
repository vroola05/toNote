import {State, IStateHandler} from "../../services/state/types"

export class NotesStateHandler implements IStateHandler {

    constructor(){

    }

    public load( state:State) : boolean{
        return true;
    }
}