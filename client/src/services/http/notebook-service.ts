import { Notebook, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class NotebookService extends HttpClient{
    constructor(){
        super();
    }

    public getNotebooks() : Promise<Array<Notebook>>{
        return this.get("notebooks");
    }

    public putNotebook(id:number, notebook:Notebook) : Promise<Message>{
        return this.put("notebooks/" + id, notebook);
    }
}