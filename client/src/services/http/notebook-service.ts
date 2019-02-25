import { Notebook } from '../../api/types';
import HttpClient from '../../api/httpClient';

export class NotebookService extends HttpClient{
    constructor(){
        super();
    }

    public getNotebooks() : Promise<Array<Notebook>>{
        return this.get("notebooks", null);
    }
}