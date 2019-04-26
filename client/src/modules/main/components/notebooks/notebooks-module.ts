import Lang from '../../../../components/language/lang';

import { Notebook, NotebookState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NotebookService } from '../../../../services/http/notebook-service';

import {TabMenu} from '../../../../components/tabMenu/tab-menu';
import { stringify } from 'querystring';

export default class NotebooksModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notebooks_name")], 
            ["add", Lang.get("notebooks_add")]
        ]);
        super(labels, "notebook");
    }

    public click(item:any, identifier:number, name:string, notebook:Notebook){
        let state = Router.getCurrentState();
        let notebookState = new NotebookState();
        notebookState.notebook = notebook;
        state.value = notebookState;
        Router.set(state, name+" - "+Lang.get("state_title_chapters"), "notebook" );
    }

    public getItems(notebookState: NotebookState=null){
        const notebookService : NotebookService = new NotebookService();
        notebookService.getNotebooks().then((notebooks:Array<Notebook>) => {
            this.clear();
            if(notebooks !== null ){
                for(let i in notebooks){
                    this.addItem(notebooks[i].id, notebooks[i].name, notebooks[i], undefined);
                }
                if(notebookState!=null && notebookState.notebook!==undefined){
                    this.setMenuItemActive(notebookState.notebook.id);
                }
            }
            //this.show();
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }
}
