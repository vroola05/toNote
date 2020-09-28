import svgAdd from '../../../assets/images/add.svg';

import DropdownMenuComponent from '../dropdown/dropdown-menu-component';
import { Constants } from '../../../services/config/constants';
import { TabMenuItem } from './components/tab-menu-item';
import { Tab } from './tab';

import MenuItemComponent from '../menu-item/menu-item-component';
import ButtonFloatComponent from '../buttons/button-float/button-float-component';
import ButtonSortmenuComponent from './components/button-sortmenu-component';
import { Sort, SortEnum } from '../../../types';

export class TabMenu extends Tab {
  public static COLOR_TYPE_NONE = 1;
  public static COLOR_TYPE_ITEM_COLOR = 2;
  public static COLOR_TYPE_MENU_COLOR = 3;
  public sort: Sort;

  private colorType: number;
  private domItemList: HTMLElement;
  private itemContainer: HTMLElement;
  private labels: Map<string, string>;
  private tabMenuItems: Array<TabMenuItem> = new Array<TabMenuItem>();
  private selectedTabMenuItem: TabMenuItem = null;
  private btnSort: ButtonSortmenuComponent;
  public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();

  constructor(id: string, labels: Map<string, string>, classes: string | null, colorType: number = TabMenu.COLOR_TYPE_NONE) {
    super();
    this.dom.className = this.dom.className + ' tabMenu' + (classes != null && classes !== '' ? ' ' + classes : '');
    this.labels = labels;
    this.colorType = colorType;

    if (this.colorType === TabMenu.COLOR_TYPE_MENU_COLOR) {
      this.dom.classList.add('color');
    }

    this.dom.addEventListener('transitionstart', () => {
      this.itemContainer.style.width = '180px';
    });

    this.dom.addEventListener('transitionend', () => {
      this.itemContainer.style.width = null;
    });

    this.itemContainer = document.createElement('div');
    this.itemContainer.classList.add('itemContainer');

    this.dom.appendChild(this.itemContainer);

    const domItemHeaderContainer = document.createElement('div');
    domItemHeaderContainer.classList.add('itemHeaderContainer');

    const domName = document.createElement('div');
    domName.classList.add('menuName');
    domName.innerHTML = this.labels.get('name');
    domItemHeaderContainer.appendChild(domName);

    this.btnSort = new ButtonSortmenuComponent(id);
    this.btnSort.event.on('change', (sort: any) => {
      this.onSort(sort);
    });
    domItemHeaderContainer.appendChild(this.btnSort.dom);

    this.domItemList = document.createElement('div');
    this.domItemList.classList.add('itemList');

    const addMenuItemMobile = new ButtonFloatComponent(svgAdd, (e: any) => {
      this.clickNewItem(e);
    });
    addMenuItemMobile.classList.add('addBtnMobile');

    const addMenuItemDesktop = new MenuItemComponent(svgAdd, this.labels.get('add'));
    addMenuItemDesktop.click = (menuItem, e) => {
      this.clickNewItem(e);
    };
    addMenuItemDesktop.classList.add('addBtnDesktop');

    this.itemContainer.appendChild(domItemHeaderContainer);
    this.itemContainer.appendChild(this.domItemList);
    this.itemContainer.appendChild(addMenuItemDesktop.dom);
    this.itemContainer.appendChild(addMenuItemMobile.dom);

    this.dropdownMenu.event.on('close', () => {
      this.dropdownMenu.hide();
    }
    );
  }

  /**
   * 
   */
  public clear(): void {
    this.domItemList.innerHTML = '';
    this.tabMenuItems = new Array<TabMenuItem>();
    this.clearSelectedMenuItem();
  }

  public show() {
    super.show();
  }

  public hide() {
    this.clear();
    super.hide();
  }

  public removeItem(tabMenuItem: TabMenuItem) {
    if (tabMenuItem === this.selectedTabMenuItem) {
      this.clearSelectedMenuItem();
    }
    this.domItemList.removeChild(tabMenuItem.dom);
    this.tabMenuItems.splice(this.tabMenuItems.indexOf(tabMenuItem), 1);
  }

  /**
   * 
   * @param name 
   * @param identifier 
   * @param color 
   */
  public addItem(identifier: number, name: string, object: any, color: null | string): void {
    if (this.dom.classList.contains('hidden')) {
      this.dom.classList.remove('hidden');
    }

    //
    if (this.colorType === TabMenu.COLOR_TYPE_ITEM_COLOR) {
      color = (!color || color === '' ? this.getColor(identifier * 6 % Constants.colorsMenu.length) : color);
      object.color = color;
    }
    const tabMenuItem = new TabMenuItem(identifier, name, object, color);
    tabMenuItem.click = (item: TabMenuItem, identifier1: number, name1: string, object1: any) => {
      this.click(item, identifier1, name1, object1);
      this.setMenuItemActive(identifier);
    };

    tabMenuItem.oncontextmenu = (e, item: TabMenuItem, identifier1: number, name1: string, object1: any) => {
      this.dropdownMenu.setObject(item);
      this.dropdownMenu.show();
      this.dropdownMenu.setPosition(e.pageX, e.pageY);
    };

    this.tabMenuItems.push(tabMenuItem);
    this.domItemList.appendChild(tabMenuItem.dom);
  }

  public addSortItem(title: string, identifier: string, sort: SortEnum): void {
    this.btnSort.addItem(title, identifier, sort);
  }

  private getColor(index: number): string {
    return Constants.colorsMenu[index];
  }

  public setMenuColor(color: string) {
    if (this.colorType === TabMenu.COLOR_TYPE_MENU_COLOR) {
      this.dom.style.borderColor = color;
    }
  }

  public hasItems() {
    return this.tabMenuItems.length > 0;
  }

  public clearSelectedMenuItem(): void {
    this.selectedTabMenuItem = null;
    if (this.child != null) {
      this.child.hide();
    }
  }

  public getSelectedMenuItem(): TabMenuItem {
    return this.selectedTabMenuItem;
  }

  public getTabMenuItems(): Array<TabMenuItem> {
    return this.tabMenuItems;
  }

  public getObjects() {
    const objects = new Array<any>();

    this.tabMenuItems.forEach((tabMenuItem) => {
      objects.push(tabMenuItem.getObject());
    });

    return objects;
  }

  public setMenuItemActive(identifier: number): void {
    if (identifier === null) { return; }
    this.tabMenuItems.forEach((tabMenuItem) => {
      if (identifier === tabMenuItem.getId()) {
        this.selectedTabMenuItem = tabMenuItem;
        tabMenuItem.activate(true);
      } else {
        tabMenuItem.activate(false);
      }
    });
  }

  public click(item: TabMenuItem, identifier: number, name: string, object: any) {
    alert('Method not yet implemented!');
  }

  public clickNewItem(e: Event) {
    alert('Method not yet implemented!');
  }

  public onSort(item: Sort) {
    alert('Method not yet implemented!');
  }
}
