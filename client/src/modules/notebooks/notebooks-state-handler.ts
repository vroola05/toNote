import { State, IStateHandler } from '../../services/state/types'
import { Notebook } from '../../api/types';

import NotebooksModule from './notebooks-module';
import { NotebookService } from '../../services/http/notebook-service';

export class NotebooksStateHandler implements IStateHandler {
    private notebooksModule : NotebooksModule;

    constructor( notebooksModule : NotebooksModule ){
        this.notebooksModule = notebooksModule;
    }

    public load( state : State ) : boolean {
        const notebookService : NotebookService = new NotebookService();
        const self = this;
        notebookService.getNotebooks().then(function(notebooks:Array<Notebook>){
            self.notebooksModule.removeItems();
            if(notebooks !== null ){
                for(let i in notebooks){
                    self.notebooksModule.addItem(notebooks[i].name, notebooks[i].id, undefined);
                }
            }
            self.notebooksModule.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
        return true;
    }
}