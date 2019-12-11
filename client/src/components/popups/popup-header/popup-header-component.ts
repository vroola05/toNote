import { EventEmitter } from 'events';
import svgOk from '../../../assets/images/ok.svg';
import svgClose from '../../../assets/images/close.svg';
import svgCloseMobile from '../../../assets/images/close-mobile.svg';
import ButtonIconComponent from '../../controls/buttons/button-icon/button-icon-component';
import Lang from '../../language/lang';

export default class PopupHeaderComponent  {
    public dom: HTMLElement = document.createElement("div");
    public event = new EventEmitter();
    
    constructor(title:string) {
        this.dom.className = "popupHeader";

        const backBtn = new ButtonIconComponent(svgCloseMobile, Lang.get("header_icon_back"), (item:any) => {
            this.event.emit("close");
        }, "btnBackHeaderMobile");

        const okBtn = new ButtonIconComponent(svgOk, Lang.get("header_icon_back"), (item:any) => {
            this.event.emit("ok");
        }, "btnOkHeaderMobile");

        const popupHeaderMobileSpacer = document.createElement("div");
        popupHeaderMobileSpacer.className = "popupHeaderMobileSpacer";

        const popupHeaderMobile = document.createElement("div");
        popupHeaderMobile.className = "popupHeaderMobile";
        popupHeaderMobile.appendChild(backBtn.dom);
        popupHeaderMobile.appendChild(popupHeaderMobileSpacer);
        popupHeaderMobile.appendChild(okBtn.dom);
        

        this.dom.appendChild(popupHeaderMobile);

        const popupHeaderDesktop = document.createElement("div");
        popupHeaderDesktop.className = "popupHeaderDesktop";
        this.dom.appendChild(popupHeaderDesktop);

        const titleContainerDesktop = document.createElement("div");
        titleContainerDesktop.className = "titleContainer";
        popupHeaderDesktop.appendChild(titleContainerDesktop);
        titleContainerDesktop.innerHTML = title;
        const btnRightContainer = document.createElement("div");
        btnRightContainer.className = "btnRightContainer";

        const btnClose = new ButtonIconComponent(svgClose, "close", () => { this.event.emit("close"); }, "btnCancelDesktop small");
        
        btnRightContainer.appendChild(btnClose.dom);
        popupHeaderDesktop.appendChild(btnRightContainer);
    }
}
