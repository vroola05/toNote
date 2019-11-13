import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import InputComponent from '../../controls/input/input-component';
import Lang from '../../language/lang';
import ButtonComponent from '../../controls/buttons/button/button-component';
import ListComponent from '../../controls/lists/list/list-component';

export default class PopupMoveComponent extends PopupComponent {
    private popupError: HTMLDivElement;
    private listComponent: ListComponent;

    constructor(title: string, value: string) {
        super(title + value);

        const popupMoveContainer = document.createElement("div");
        popupMoveContainer.className = "popupMoveContainer";
        this.append(popupMoveContainer);

        this.listComponent = new ListComponent();
        popupMoveContainer.appendChild(this.listComponent.dom);

        const popupErrorContainer = document.createElement("div");
        popupErrorContainer.className = "popupErrorContainer";

        this.popupError = document.createElement("div");
        this.popupError.className = "popupError";

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupInputBtnContainer = document.createElement("div");
        popupInputBtnContainer.className = "popupInputBtnContainer";
        const cancel = new ButtonComponent(Lang.get("popup_btn_cancel"), ()=>{
            this.hide();
        });
        popupInputBtnContainer.appendChild(cancel.dom);
        
        const send = new ButtonComponent(Lang.get("popup_btn_ok"), (e:any)=>{
            this.click(e, this.object);
        });
        popupInputBtnContainer.appendChild(send.dom);
        this.append(popupInputBtnContainer);
    }

    public show(): void {
        super.show();
    }

    public add(value:string, object:any) {
        this.listComponent.add(value, object);
    }

    public click(e: any, object: any): void {
        alert("Not yet implemented!");
    }
    public setError(message: string): void {
        this.popupError.innerHTML = message;
    }
}