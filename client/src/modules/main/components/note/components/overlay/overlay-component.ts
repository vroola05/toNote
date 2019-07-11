
import { EventEmitter } from 'events';

import Lang from '../../../../../../components/language/lang';

export default class OverlayComponent {

    public dom: HTMLDivElement = document.createElement('div');
    private hidden: boolean = false;
    private onanimationend: any;

    constructor( ) {

        this.dom.className = "noteOverlay";

        const noteOverlayMessage: HTMLDivElement = document.createElement('div');
        noteOverlayMessage.className = "noteOverlayMessage";
        noteOverlayMessage.innerText = Lang.get("main_note_content_no_note");
        this.dom.appendChild(noteOverlayMessage);
        this.dom.addEventListener("animationend", (a) => {
            this.dom.classList.remove("loading");
            this.dom.classList.add("loaded");

            if(this.onanimationend !== undefined){
                this.onanimationend();
            }
        });
    }

    public hide(onanimationend: any = undefined){
        if( !this.hidden ){
            this.onanimationend = onanimationend;
            this.hidden = true;
            this.dom.classList.remove("loaded");
            this.dom.classList.add("loading");
            this.dom.classList.add("inactive");
            this.dom.classList.remove("active");
        }
        
    }

    public show(onanimationend: any = undefined){
        if( this.hidden ){
            this.onanimationend = onanimationend;
            this.hidden = false;
            this.dom.classList.add("loading");
            this.dom.classList.remove("inactive");
            this.dom.classList.add("active");
        }
    }
}