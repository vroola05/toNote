
import ButtonComponent from '../../../../../../components/controls/button/button-component';

export default class ButtonToggleComponent extends ButtonComponent {
    public isOpened: boolean = true;
    private icons: any;
    constructor( icons:{open:{icon : any, description: string|undefined}, closed:{icon : any, description: string|undefined}} ){
        super(icons.open.icon, icons.open.description);
        this.icons = icons;
        
    }

    public onClick(buttonComponent:ButtonComponent){
        this.isOpened=!this.isOpened;
        if(this.isOpened){
            this.set(this.icons.open.icon,this.icons.open.description);
        }else{
            this.set(this.icons.closed.icon,this.icons.closed.description);
        }
    }
}
