import ButtonAbstract from '../button-abstract';

export default class ButtonTextComponent extends ButtonAbstract {
    
    constructor( name: string, click: any | undefined ) {
        super(name, click);
        this.dom.classList.add('btnText');
    }

}
