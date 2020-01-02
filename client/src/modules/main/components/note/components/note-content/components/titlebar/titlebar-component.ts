import { EventEmitter } from 'events';
import ConfigService from '../../../../../../../../services/config/configService';

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
            }, ConfigService.get().content.delay);
            
        });
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value.replace(/\n/g,' ');
        } else return this.dom.innerText.replace(/\n/g,' ');
    }
}
