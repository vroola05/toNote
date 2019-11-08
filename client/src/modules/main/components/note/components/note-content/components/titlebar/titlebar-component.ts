import { EventEmitter } from 'events';

export default class TitlebarComponent {
    public dom: HTMLDivElement = document.createElement('div');
    public event = new EventEmitter();
    private timeout: any = null;

    constructor(){
        this.dom.className = "titlebar";
        this.dom.contentEditable = "true";
        this.dom.addEventListener("input", () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.event.emit("change", this.value());
            }, 400);
            
        });
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value.replace(/\n/g,' ');
        } else return this.dom.innerText.replace(/\n/g,' ');
    }
}
