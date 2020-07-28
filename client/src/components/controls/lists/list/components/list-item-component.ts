import { EventEmitter } from 'events';

export default class ListItemComponent  {
    public event = new EventEmitter();
    public dom: HTMLElement = document.createElement('div');
    private value: string;
    public object: any;
    private _selected: boolean = false;

    constructor( value: string, object: any ) {
        this.dom.className = 'listItem';
    
        this.value = value;
        this.object = object;
        
        const listItemValueContainer = document.createElement('span');
        listItemValueContainer.className = 'listItemValueContainer';
        listItemValueContainer.innerHTML = value;
        this.dom.appendChild(listItemValueContainer);
        this.dom.onclick = () => {
            this.selected = !this.selected;
            
            this.event.emit('onSelected', this.object);
        };
    }

    public set selected( selected: boolean) {
        this._selected = selected;
        if (selected) {
            this.dom.classList.add('selected');
        } else {
            this.dom.classList.remove('selected');
        }

    }

    public get selected(): boolean {
        return this._selected;
    }
}
