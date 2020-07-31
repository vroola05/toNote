import ButtonIconAbstract from '../button-icon-abstract';

export default class ButtonFloatComponent extends ButtonIconAbstract {
    
    constructor( icon: any, click: any = undefined ) {
        super(icon, click);
        this.dom.classList.add('btnFloat');
        this.dom.classList.add('btnLocRight');
        this.dom.classList.add('btnLocBottom');
        
    }
}
