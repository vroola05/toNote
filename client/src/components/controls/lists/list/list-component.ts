import { EventEmitter } from 'events';
import ListItemComponent from './components/list-item-component';


export default class ListComponent  {
    public event = new EventEmitter();

    public dom:HTMLElement = document.createElement("div");
    
    constructor(){
        this.dom.className = "list";

    }

    public add(value:string, object: any) {
        const listItemComponent = new ListItemComponent(value, object);
        this.dom.appendChild(listItemComponent.dom);
    }
}