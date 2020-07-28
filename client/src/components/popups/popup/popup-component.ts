import { EventEmitter } from 'events';
import PopupHeaderComponent from '../popup-header/popup-header-component';

export default class PopupComponent  {
    private domBackdrop: HTMLElement = document.createElement('div');
    protected dom: HTMLElement = document.createElement('div');
    protected domContainer: HTMLElement = document.createElement('div');
    protected domInnerContainer: HTMLElement = document.createElement('div');
    private header: PopupHeaderComponent;
    protected _object: any;

    public _event = new EventEmitter();

    constructor(title: string, className: string) {
        this.domBackdrop.className = 'backdrop';
        
        this.dom.className = 'popup';
        this.domContainer.className = 'popupContainer' + (className ? ' ' + className : '');
        this.header = new PopupHeaderComponent(title);

        this.header.event.on('close', () => {
            this.hide();
        });

        this.domContainer.appendChild(this.header.dom);

        this.domInnerContainer.className = 'popupInnerContainer';

        const headerTitleMobile = document.createElement('h1');
        headerTitleMobile.classList.add('headerTitleMobile');
        headerTitleMobile.innerText = title;
        this.domInnerContainer.appendChild(headerTitleMobile);

        this.domContainer.appendChild(this.domInnerContainer);
        this.dom.appendChild(this.domContainer);
        
    }
    public get event(): EventEmitter {
        return this.header.event;
    }

    public show(): void {
        document.body.appendChild(this.domBackdrop);
        document.body.appendChild(this.dom);
    }

    public append(element: HTMLElement) {
        this.domInnerContainer.appendChild(element);
    }

    public hide(): void {
        document.body.removeChild(this.domBackdrop);
        document.body.removeChild(this.dom);
    }
    
    set object(object: any) {
        this._object = object;
    }

    get object() {
        return this._object;
    }
}
