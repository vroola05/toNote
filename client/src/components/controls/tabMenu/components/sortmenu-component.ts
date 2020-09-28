import DropdownMenuAbstract from '../../dropdown/dropdown-menu-abstract';
import SortmenuItemComponent from './sortmenu-item-component';
import Lang from '../../../language/lang';
import { Sort, SortEnum } from '../../../../types';

export default class SortmenuComponent extends DropdownMenuAbstract  {
    private items: SortmenuItemComponent[] = [];
    private selectedItem: SortmenuItemComponent;
    constructor() {
        super();
    }

    addItem(menuItemComponent: SortmenuItemComponent) {
        this.dom.appendChild(menuItemComponent.dom);
        this.items.push(menuItemComponent);
        menuItemComponent.click = (item, e) => {
            this.selectedItem = item;
            this.items.forEach(listItem => {
                if (listItem !== this.selectedItem) {
                    listItem.selected = false;
                }
            });
            this.event.emit('change', item.sort);
        };
    }

    public selectItem(sort: Sort) {
        this.items.forEach(item => {
            if (item.getIdentifier() === sort.identifier) {
                item.selected = true;
                item.setSort(sort.sort);
            }
        });
    }
}
