import ButtonAbstract from '../button-abstract';

export default class ButtonOutlinedComponent extends ButtonAbstract {
    
    constructor( name: string, click: any | undefined ) {
        super(name, click);
        this.dom.classList.add('btnOutlined');
    }

}
