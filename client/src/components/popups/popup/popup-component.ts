import { EventEmitter } from 'events';
import PopupHeaderComponent from '../popup-header/popup-header-component';

export default class PopupComponent  {
    private domBackdrop: HTMLElement = document.createElement("div");
    protected dom: HTMLElement = document.createElement("div");
    protected domContainer: HTMLElement = document.createElement("div");
    private header: PopupHeaderComponent;
    protected object: any;

    public event = new EventEmitter();

    constructor(title:string) {
        this.domBackdrop.className = "backdrop";
        
        this.dom.className = "popup";
        this.domContainer.className = "popupContainer";
        
        
        this.header = new PopupHeaderComponent(title, () => { 
            this.event.emit("close");
            this.hide();
        });
        this.domContainer.appendChild(this.header.dom);
        this.dom.appendChild(this.domContainer);
        
    }

    public show(): void {
        document.body.appendChild(this.domBackdrop);
        document.body.appendChild(this.dom);
    }

    public append(element: HTMLElement){
        this.domContainer.appendChild(element);
    }

    public hide(): void {
        document.body.removeChild(this.domBackdrop);
        document.body.removeChild(this.dom);
    }
    
    public setObject(object:any){
        this.object = object
    }

    public getObject() {
        return this.object;
    }
}
