import './dropdown-menu-component.scss';

import { EventEmitter } from 'events';
import MenuItemComponent from '../menu-item/menu-item-component';

export default class DropdownMenuComponent {
    private domBackdrop:HTMLElement = document.createElement("div");
    private dom:HTMLElement = document.createElement("div");
    public event = new EventEmitter();

    constructor(){
        this.domBackdrop.className = "backdrop";
        this.domBackdrop.onclick = () => { 
            this.event.emit("close");
        };
        this.dom.className = "dropdown";
    }

    addItem( menuItemComponent: MenuItemComponent) {
        this.dom.appendChild(menuItemComponent.dom);
        menuItemComponent.event.on('click', () => {
            this.event.emit("close");
        });
    }

    public show() : void{
        document.body.appendChild(this.domBackdrop);
        document.body.appendChild(this.dom);
    }

    public hide() : void{
        document.body.removeChild(this.domBackdrop);
        document.body.removeChild(this.dom);
    }
}