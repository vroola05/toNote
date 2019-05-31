import './dropdown-menu-component.scss';

import { EventEmitter } from 'events';
import MenuItemComponent from '../menu-item/menu-item-component';

export default class DropdownMenuComponent {
    private domBackdrop:HTMLElement = document.createElement("div");
    private domItem:HTMLElement = document.createElement("div");
    public event = new EventEmitter();

    constructor(){
        this.domBackdrop.className = "backdrop";
        this.domBackdrop.onclick = () => { 
            this.event.emit("close");
        };
        this.domItem.className = "dropdown";
    }

    addItem( menuItemComponent: MenuItemComponent) {
        this.domItem.appendChild(menuItemComponent.get());
        menuItemComponent.event.on('click', () => {
            this.event.emit("close");
        });
    }

    public show() : void{
        document.body.appendChild(this.domBackdrop);
        document.body.appendChild(this.domItem);
    }

    public hide() : void{
        document.body.removeChild(this.domBackdrop);
        document.body.removeChild(this.domItem);
    }
}