import {State, IStateHandler} from "../../services/state/types"

export class ChaptersStateHandler implements IStateHandler {

    constructor(){

    }

    public load( state:State) : boolean{
        return true;
    }
}