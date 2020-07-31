import PopupComponent from '../popup/popup-component';
import Lang from '../../language/lang';
import ButtonContainedComponent from '../../controls/buttons/button-contained/button-contained-component';
import ButtonOutlinedComponent from '../../controls/buttons/button-outlined/button-outlined-component';
import ListComponent from '../../controls/lists/list/list-component';

export default class PopupMoveComponent extends PopupComponent {
    private popupError: HTMLDivElement;
    private listComponent: ListComponent;
    private ok: ButtonContainedComponent;

    constructor(title: string, value: string) {
        super(title + value, 'popupMove');

        this.event.on('ok', (e: any) => {
            if (!this.ok.disabled) {
                this.click(e, this.object, this.listComponent.getValue());
            }
        });

        const popupMoveContainer = document.createElement('div');
        popupMoveContainer.className = 'popupMoveContainer';
        this.append(popupMoveContainer);

        this.listComponent = new ListComponent();
        popupMoveContainer.appendChild(this.listComponent.dom);
        this.listComponent.event.on('onSelected', (object) => {
            if (object) {
                this.ok.disabled = false;
            } else {
                this.ok.disabled = true;
            }
        });
        const popupErrorContainer = document.createElement('div');
        popupErrorContainer.className = 'popupErrorContainer';

        this.popupError = document.createElement('div');
        this.popupError.className = 'popupError';

        popupErrorContainer.appendChild(this.popupError);
        this.append(popupErrorContainer);

        const popupInputBtnContainer = document.createElement('div');
        popupInputBtnContainer.className = 'popupInputBtnContainer';
        const cancel = new ButtonOutlinedComponent(Lang.get('popup_btn_cancel'), () => {
            this.hide();
        });
        cancel.classList.add('btnCancel');
        popupInputBtnContainer.appendChild(cancel.dom);

        this.ok = new ButtonContainedComponent(Lang.get('popup_btn_ok'), (e: any) => {
            this.click(e, this.object, this.listComponent.getValue());
        });
        this.ok.disabled = true;
        this.ok.classList.add('btnOk');
        popupInputBtnContainer.appendChild(this.ok.dom);
        this.append(popupInputBtnContainer);
    }

    public show(): void {
        super.show();
    }

    public add(value: string, object: any) {
        this.listComponent.add(value, object);
    }

    public click(e: any, object: any, value: any): void {
        
        alert('Not yet implemented!');
    }
    public setError(message: string): void {
        this.popupError.innerHTML = message;
    }
}
