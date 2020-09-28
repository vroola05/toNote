import MenuItemComponent from '../menu-item/menu-item-component';
import DropdownMenuAbstract from './dropdown-menu-abstract';

export default class DropdownMenuComponent extends DropdownMenuAbstract {

    constructor() {
        super();
    }

    addItem(menuItemComponent: MenuItemComponent) {
        this.dom.appendChild(menuItemComponent.dom);
        menuItemComponent.event.on('click', () => {
            this.event.emit('close');
        });
    }
}
