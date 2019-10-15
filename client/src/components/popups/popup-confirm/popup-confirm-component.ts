import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import InputComponent from '../../controls/input/input-component';
import Lang from '../../language/lang';
import ButtonComponent from '../../controls/button/button-component';

export default class PopupConfirmComponent extends PopupComponent {
    private popupError: HTMLDivElement;
    
    constructor(title: string, value: string, submit: any = null) {
        super(title);

        const popupInputContainer = document.createElement("div");
        popupInputContainer.className = "popupInputContainer";
        popupInputContainer.innerText = value;
        this.append(popupInputContainer);

        const popupErrorContainer = document.createElement("div");
        popupErrorContainer.className = "popupErrorContainer";

        this.popupError = document.createElement("div");
        this.popupError.className = "popupError";

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupInputBtnContainer = document.createElement("div");
        popupInputBtnContainer.className = "popupInputBtnContainer";
        const cancel = new ButtonComponent(Lang.get("popup_confirm_btn_no"), ()=>{
            this.hide();
        });
        popupInputBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonComponent(Lang.get("popup_confirm_btn_yes"), (e:any)=>{
            this.click(e, this.object);
        });
        popupInputBtnContainer.appendChild(send.dom);
        this.append(popupInputBtnContainer);
    }

    public show(): void {
        super.show();
    }

    public click(e: any, object: any): void {
        alert("Not yet implemented!");
    }
    public setError(message: string): void {
        this.popupError.innerHTML = message;
    }
}