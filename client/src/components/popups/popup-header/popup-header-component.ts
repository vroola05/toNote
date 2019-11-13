import svgClose from '../../../assets/images/close.svg';
import ButtonIconComponent from '../../controls/buttons/button-icon/button-icon-component';

export default class PopupHeaderComponent  {
    public dom: HTMLElement = document.createElement("div");

    constructor(title:string, close:any) {
        this.dom.className = "popupHeader";

        const titleContainer = document.createElement("div");
        titleContainer.className = "titleContainer";
        this.dom.appendChild(titleContainer);
        titleContainer.innerHTML = title;
        const btnRightContainer = document.createElement("div");
        btnRightContainer.className = "btnRightContainer";

        const btnClose = new ButtonIconComponent(svgClose, "close", close, "small");
        
        btnRightContainer.appendChild(btnClose.dom);
        this.dom.appendChild(btnRightContainer);
    }
}
