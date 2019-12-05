import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import InputComponent from '../../controls/input/input-component';
import Lang from '../../language/lang';
import ButtonContainedComponent from '../../controls/buttons/button-contained/button-contained-component';

export default class PopupInputComponent extends PopupComponent {
    private input: InputComponent;
    private popupError: HTMLDivElement;
    
    constructor(title: string, description: string, value: string, submit: any = null) {
        super(title, "popupInput");


        const popupInputContainer = document.createElement("div");
        popupInputContainer.className = "popupInputContainer";

        this.input = new InputComponent("text", "inputfield", description);

        this.input.value(value);
        this.input.addEventListener("keyup", (e:KeyboardEvent) => {
            if (e.keyCode === 13) {
                this.click(e, this.object, this.input.value());
            }
        });
        popupInputContainer.appendChild(this.input.dom);
        this.append(popupInputContainer);

        const popupErrorContainer = document.createElement("div");
        popupErrorContainer.className = "popupErrorContainer";

        this.popupError = document.createElement("div");
        this.popupError.className = "popupError";

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupInputBtnContainer = document.createElement("div");
        popupInputBtnContainer.className = "popupInputBtnContainer";
        const cancel = new ButtonContainedComponent(Lang.get("popup_btn_cancel"), ()=>{
            this.hide();
        });
        popupInputBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonContainedComponent(Lang.get("popup_btn_ok"), (e:any)=>{
            this.click(e, this.object, this.input.value());
        });
        popupInputBtnContainer.appendChild(send.dom);
        this.append(popupInputBtnContainer);
    }

    public show(): void {
        super.show();
        this.input.focus();
    }

    public click(e: any, object: any, value: string): void {
        alert("Not yet implemented!");
    }
    public setError(message: string): void {
        this.popupError.innerHTML = message;
    }
}