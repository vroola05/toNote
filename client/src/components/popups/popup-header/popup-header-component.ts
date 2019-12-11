import { EventEmitter } from 'events';
import svgHome from '../../../assets/images/back.svg';
import svgClose from '../../../assets/images/close.svg';
import ButtonIconComponent from '../../controls/buttons/button-icon/button-icon-component';
import Lang from '../../language/lang';

export default class PopupHeaderComponent  {
    public dom: HTMLElement = document.createElement("div");
    public event = new EventEmitter();
    
    constructor(title:string) {
        this.dom.className = "popupHeader";

        const backBtn = new ButtonIconComponent(svgClose, Lang.get("header_icon_back"), (item:any) => {
            this.event.emit("close");
        }, "btnBackMobile");
        const okBtn = new ButtonIconComponent("V", Lang.get("header_icon_back"), (item:any) => {
            this.event.emit("ok");
        }, "btnOkMobile");

        const btnLeftContainer = document.createElement("div");
        btnLeftContainer.className = "btnLeftContainer";
        btnLeftContainer.appendChild(backBtn.dom);
        btnLeftContainer.appendChild(okBtn.dom);

        this.dom.appendChild(btnLeftContainer);
        const titleContainerDesktop = document.createElement("div");
        titleContainerDesktop.className = "titleContainer";
        this.dom.appendChild(titleContainerDesktop);
        titleContainerDesktop.innerHTML = title;
        const btnRightContainer = document.createElement("div");
        btnRightContainer.className = "btnRightContainer";

        const btnClose = new ButtonIconComponent(svgClose, "close", () => { this.event.emit("close"); }, "btnCancelDesktop small");
        
        btnRightContainer.appendChild(btnClose.dom);
        this.dom.appendChild(btnRightContainer);
    }
}
