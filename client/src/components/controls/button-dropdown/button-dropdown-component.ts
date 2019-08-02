import ButtonComponent from '../button-icon/button-icon-component';
import DropdownMenuComponent from '../dropdown/dropdown-menu-component';
import MenuItemComponent from '../menu-item/menu-item-component';



export default class ButtonDropdownComponent extends ButtonComponent {
    public isOpened: boolean = false;
    public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();

    constructor( icon : any, description: string|undefined = undefined, click: any = undefined ){
        super(icon, description, click);
    
        this.dropdownMenu.event.on('close', () => {
                this.isOpened = false;
                this.dropdownMenu.hide();
            }
         );
    }

    public onClick(event:MouseEvent, buttonComponent:ButtonComponent){
        this.isOpened=!this.isOpened;
        if(this.isOpened){
            this.dropdownMenu.show();
            this.dropdownMenu.setPosition(event.pageX, event.pageY);
        }else{
            this.dropdownMenu.hide();
        }
    }

    public addItem( menuItemComponent: MenuItemComponent) {
        this.dropdownMenu.addItem(menuItemComponent);
    }
}