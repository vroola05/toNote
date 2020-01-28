import { EventEmitter } from 'events';
import ConfigService from '../../../../../../../../services/config/configService';

export default class TitlebarComponent {
    public dom: HTMLDivElement = document.createElement('div');
    public event = new EventEmitter();

    constructor(){
        this.dom.className = "titlebar";
        this.dom.contentEditable = "true";
        this.dom.addEventListener("input", () => {
            this.event.emit("change", this.value());
        });
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value.replace(/\n/g,' ');
        } else return this.dom.innerText.replace(/\n/g,' ');
    }
}
