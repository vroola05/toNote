import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import InputComponent from '../../controls/input/input-component';
import Lang from '../../language/lang';
import ButtonComponent from '../../controls/button/button-component';

export default class PopupRenameComponent extends PopupComponent {
    private input: InputComponent;
    private popupError: HTMLDivElement;
    
    constructor(title: string, description: string, value: string, submit: any = null) {
        super(title);


        const popupRenameContainer = document.createElement("div");
        popupRenameContainer.className = "popupRenameContainer";

        this.input = new InputComponent("text", "rename", description);
        this.input.value(value);
        this.input.addEventListener("keyup", (e:KeyboardEvent) => {
            if (e.keyCode === 13) {
                this.click(e, this.object, this.input.value());
            }
        });
        popupRenameContainer.appendChild(this.input.dom);
        this.append(popupRenameContainer);

        const popupErrorContainer = document.createElement("div");
        popupErrorContainer.className = "popupErrorContainer";

        this.popupError = document.createElement("div");
        this.popupError.className = "popupError";

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupRenameBtnContainer = document.createElement("div");
        popupRenameBtnContainer.className = "popupRenameBtnContainer";
        const cancel = new ButtonComponent(Lang.get("popup_btn_cancel"), ()=>{
            this.hide();
        });
        popupRenameBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonComponent(Lang.get("popup_btn_ok"), (e:any)=>{
            this.click(e, this.object, this.input.value());
        });
        popupRenameBtnContainer.appendChild(send.dom);
        this.append(popupRenameBtnContainer);
    }

    public show(): void {
        super.show();
        this.input.focus();
    }

    public click(e: any, object: any, value: string): void {
        alert("Not yet implemented!");
    }
    public setError(message: string): void {
        console.log(message);
        this.popupError.innerHTML = message;
    }
}