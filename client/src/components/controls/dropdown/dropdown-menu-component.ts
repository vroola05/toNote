import { EventEmitter } from 'events';
import MenuItemComponent from '../menu-item/menu-item-component';

export default class DropdownMenuComponent {
    private domBackdrop: HTMLElement = document.createElement("div");
    private dom: HTMLElement = document.createElement("div");
    public event = new EventEmitter();
    public object: any = null;

    constructor() {
        this.domBackdrop.className = "backdrop";
        this.domBackdrop.onclick = () => {
            this.event.emit("close");
        };
        this.dom.className = "dropdown";
    }

    addItem(menuItemComponent: MenuItemComponent) {
        this.dom.appendChild(menuItemComponent.dom);
        menuItemComponent.event.on('click', () => {
            this.event.emit("close");
        });
    }

    public setObject(object:any){
        this.object = object
    }

    public show(): void {
        document.body.appendChild(this.domBackdrop);
        document.body.appendChild(this.dom);
    }
    
    public setPosition(pageX: number, pageY: number) {
        const rect = this.dom.getBoundingClientRect();
        
        if( pageX+rect.width > document.documentElement.clientWidth ) {
            pageX = pageX - (pageX+rect.width-document.documentElement.clientWidth);
        }
        if( pageY+rect.height > document.documentElement.clientHeight ) {
            pageY = pageY - (pageY+rect.height-document.documentElement.clientHeight);
        }
        this.dom.style.top = pageY + "px";
        this.dom.style.left = pageX + "px";
    }

    public hide(): void {
        this.object = null;
        document.body.removeChild(this.domBackdrop);
        document.body.removeChild(this.dom);
    }
}