import ButtonComponent from '../../../../../../components/controls/button/button-component';
import DropdownMenuComponent from '../../../../../../components/controls/dropdown/dropdown-menu-component';
import MenuItemComponent from '../../../../../../components/controls/menu-item/menu-item-component';



export default class ButtonDropdownComponent extends ButtonComponent {
    public isOpened: boolean = false;
    public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();

    constructor( icon : any, description: string|undefined = undefined ){
        super(icon, description);
    
        this.dropdownMenu.event.on('canceled', () => 
            {
                this.isOpened = false;
                this.dropdownMenu.hide();
            }
         );
    }

    public onClick(buttonComponent:ButtonComponent){
        this.isOpened=!this.isOpened;
        if(this.isOpened){
            this.dropdownMenu.show();
        }else{
            this.dropdownMenu.hide();
        }
    }

    public addItem( menuItemComponent: MenuItemComponent) {
        this.dropdownMenu.addItem(menuItemComponent);
    }
}