import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import InputComponent from '../../controls/input/input-component';
import Lang from '../../language/lang';
import ButtonComponent from '../../controls/button/button-component';

export default class PopupRenameComponent extends PopupComponent {
    private input: InputComponent;
    constructor(title: string, description: string, value: string, submit: any = null) {
        super(title);


        const popupRenameContainer = document.createElement("div");
        popupRenameContainer.className = "popupRenameContainer";

        this.input = new InputComponent("text", "rename", description);
        this.input.value(value);
        popupRenameContainer.appendChild(this.input.dom);
        this.append(popupRenameContainer);

        const popupRenameBtnContainer = document.createElement("div");
        popupRenameBtnContainer.className = "popupRenameBtnContainer";
        const cancel = new ButtonComponent(Lang.get("popup_btn_cancel"), ()=>{
            this.hide();
        });
        popupRenameBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonComponent(Lang.get("popup_btn_ok"), (e:any)=>{
            this.click(e, this.input.value());
        });
        popupRenameBtnContainer.appendChild(send.dom);
        this.append(popupRenameBtnContainer);
        
    }

    public click(e:any, value: string): void {
        alert("Not yet implemented!");
    }
}