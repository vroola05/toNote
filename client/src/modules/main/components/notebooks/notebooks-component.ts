import Lang from '../../../../components/language/lang';

import { Notebook, MainState } from '../../../../types';

import { Router } from '../../../../services/router/router-service';
import { NotebookService } from '../../../../services/http/notebook-service';

import { TabMenu } from '../../../../components/controls/tabMenu/tab-menu';
import { stringify } from 'querystring';
import { rejects } from 'assert';

export default class NotebooksComponent extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notebooks_name")], 
            ["add", Lang.get("notebooks_add")]
        ]);
        super(labels, "notebook");
    }

    public click(item:any, identifier:number, name:string, notebook:Notebook){
        let state = Router.getCurrentState();
        let mainState = new MainState();
        mainState.notebook = notebook;
        state.value = mainState;
        Router.set(state, Lang.get("state_title_chapters") +" - "+ name, "notebook" );
    }

    public getItems(mainState: MainState=null) : Promise<any>{
        const notebookService : NotebookService = new NotebookService();
        
        if(this.hasItems()){
            return new Promise((resolve, reject) => {
                if(mainState!=null && mainState.notebook!==undefined){
                    this.setMenuItemActive(mainState.notebook.id);
                }
                resolve(this.getObjects());
                
            });
        }
        return notebookService.getNotebooks().then((notebooks:Array<Notebook>) => {
            this.clear();
            if(notebooks !== null ){
                for(let i in notebooks){
                    this.addItem(notebooks[i].id, notebooks[i].name, notebooks[i], undefined);
                }
                if(mainState!=null && mainState.notebook!==undefined){
                    this.setMenuItemActive(mainState.notebook.id);
                }
            }
            return notebooks;
        }).catch((error: Error) => {
            console.error(error.stack);   
            throw error 
        });
    }

    public clickNewItem(e: Event) {
		alert("Jaa!");
	}
}
