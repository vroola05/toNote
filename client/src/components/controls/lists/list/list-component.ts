import { EventEmitter } from 'events';
import ListItemComponent from './components/list-item-component';


export default class ListComponent  {
    public event = new EventEmitter();
    public dom: HTMLElement = document.createElement('div');
    
    private listItemComponents: Array<ListItemComponent>;

    constructor() {
        this.dom.className = 'list';
        this.listItemComponents = new Array<ListItemComponent>();

    }

    public add(value: string, object: any) {
        const listItemComponent = new ListItemComponent(value, object);
        listItemComponent.event.on('onSelected', (object) => {
            this.listItemComponents.forEach((lic: ListItemComponent) => {
                if (lic.object !== object) {
                    lic.selected = false;
                }
            });
            this.event.emit('onSelected', this.getValue());
        });
        this.dom.appendChild(listItemComponent.dom);
        this.listItemComponents.push(listItemComponent);
    }

    public getValue(): any {
        for (const listItemComponent of this.listItemComponents) {
            if (listItemComponent.selected) { 
                return listItemComponent.object;
            }
        }
        return null;
    }

}
