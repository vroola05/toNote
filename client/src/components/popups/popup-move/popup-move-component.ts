import { EventEmitter } from 'events';
import PopupComponent from '../popup/popup-component';
import Lang from '../../language/lang';
import ButtonContainedComponent from '../../controls/buttons/button-contained/button-contained-component';
import ListComponent from '../../controls/lists/list/list-component';

export default class PopupMoveComponent extends PopupComponent {
    private popupError: HTMLDivElement;
    private listComponent: ListComponent;

    constructor(title: string, value: string) {
        super(title + value, "popupMove");

        const popupMoveContainer = document.createElement("div");
        popupMoveContainer.className = "popupMoveContainer";
        this.append(popupMoveContainer);

        this.listComponent = new ListComponent();
        popupMoveContainer.appendChild(this.listComponent.dom);
        this.listComponent.event.on("onSelected", (object) => {
            if (object) {
                send.disabled = false;
            } else {
                send.disabled = true;
            }
        });
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
            this.click(e, this.object, this.listComponent.getValue());
        });
        send.disabled = true;
        popupInputBtnContainer.appendChild(send.dom);
        this.append(popupInputBtnContainer);
    }

    public show(): void {
        super.show();
    }

    public add(value:string, object:any) {
        this.listComponent.add(value, object);
    }

    public click(e: any, object: any, value: any): void {
        
        alert("Not yet implemented!");
    }
    public setError(message: string): void {
        this.popupError.innerHTML = message;
    }
}