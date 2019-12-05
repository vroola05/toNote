import ButtonIconAbstract from "../button-icon-abstract";

export default class ButtonFloatComponent extends ButtonIconAbstract {
    
    constructor( icon: any, click: any = undefined ){
        super(icon, click);
        this.dom.classList.add("btn-float");
        this.dom.classList.add("btn-loc-right");
        this.dom.classList.add("btn-loc-bottom");
        
    }
}