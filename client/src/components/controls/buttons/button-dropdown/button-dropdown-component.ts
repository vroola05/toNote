import ButtonComponent from '../button-icon/button-icon-component';
import DropdownMenuComponent from '../../dropdown/dropdown-menu-component';
import MenuItemComponent from '../../menu-item/menu-item-component';



export default class ButtonDropdownComponent extends ButtonComponent {
    public isOpened: boolean = false;
    public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();
    
    private onResize = () => {
        this.setPosition();
    };

    constructor( icon : any, description: string|undefined = undefined, click: any = undefined ){
        super(icon, description, click);

        this.dropdownMenu.event.on('close', () => {
                this.isOpened = false;
                this.dropdownMenu.hide();
                window.removeEventListener('resize', this.onResize);
            }
         );
    }

    private setPosition() {
        const boundingBox = this.dom.getBoundingClientRect();
        this.dropdownMenu.setPosition(boundingBox.left, boundingBox.top + boundingBox.height);
    }
    
    
    public onClick(event:MouseEvent, buttonComponent:ButtonComponent){
        this.isOpened=!this.isOpened;
        if(this.isOpened){
            this.dropdownMenu.show();
            this.setPosition();
            window.addEventListener('resize', this.onResize);

        }else{
            this.dropdownMenu.hide();
        }
    }

    public addItem( menuItemComponent: MenuItemComponent) {
        this.dropdownMenu.addItem(menuItemComponent);
    }
}