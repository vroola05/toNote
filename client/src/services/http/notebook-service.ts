import { Notebook, Message } from '../../types';
import HttpClient from '../../components/http/httpClient';

export class NotebookService extends HttpClient {
    constructor() {
        super();
    }

    public static getNotebooks(): Promise<Array<Notebook>> {
        return NotebookService.get('notebooks');
    }

    public static notebookSort(fromId: number, toId: number): Promise<Message> {
        return NotebookService.get('notebooks/sort/' + fromId + '/' + toId);
    }

    public static putNotebook(id: number, notebook: Notebook): Promise<Message> {
        return NotebookService.put('notebooks/' + id, notebook);
    }

    public static postNotebook(notebook: Notebook): Promise<Message> {
        return NotebookService.post('notebooks', notebook);
    }

    public static deleteNotebook(id: number): Promise<Message> {
        return NotebookService.delete('notebooks/' + id);
    }
}
