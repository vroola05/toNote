import PopupComponent from '../popup/popup-component';
import Lang from '../../language/lang';
import ButtonContainedComponent from '../../controls/buttons/button-contained/button-contained-component';
import ButtonOutlinedComponent from '../../controls/buttons/button-outlined/button-outlined-component';

export default class PopupConfirmComponent extends PopupComponent {
    private popupError: HTMLDivElement;
    
    constructor(title: string, value: string, submit: any = null) {
        super(title, "popupConfirm");

        const popupInputContainer = document.createElement("div");
        popupInputContainer.className = "popupInputContainer";
        this.append(popupInputContainer);

        const popupInputInnerContainer = document.createElement("div");
        popupInputInnerContainer.className = "popupInputInnerContainer";
        popupInputInnerContainer.innerText = value;
        popupInputContainer.appendChild(popupInputInnerContainer);

        const popupErrorContainer = document.createElement("div");
        popupErrorContainer.className = "popupErrorContainer";

        this.popupError = document.createElement("div");
        this.popupError.className = "popupError";

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupInputBtnContainer = document.createElement("div");
        popupInputBtnContainer.className = "popupInputBtnContainer";
        const cancel = new ButtonOutlinedComponent(Lang.get("popup_confirm_btn_no"), ()=>{
            this.hide();
        });
        popupInputBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonContainedComponent(Lang.get("popup_confirm_btn_yes"), (e:any)=>{
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