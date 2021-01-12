import svgAdd from '../../../assets/images/add.svg';

import DropdownMenuComponent from '../dropdown/dropdown-menu-component';
import { Constants } from '../../../services/config/constants';
import { TabMenuItem } from './components/tab-menu-item';
import { Tab } from './tab';

import MenuItemComponent from '../menu-item/menu-item-component';
import ButtonFloatComponent from '../buttons/button-float/button-float-component';
import ButtonSortmenuComponent from './components/button-sortmenu-component';
import { Sort, SortEnum } from '../../../types';
import { Profile } from '../../../services/profile/profile-service';

export class TabMenu extends Tab {
  public static COLOR_TYPE_NONE = 1;
  public static COLOR_TYPE_ITEM_COLOR = 2;
  public static COLOR_TYPE_MENU_COLOR = 3;

  public identifier: string;
  public sort: Sort;

  private colorType: number;
  protected domTabMenuItems: HTMLElement;
  private domTabMenuContainer: HTMLElement;
  private labels: Map<string, string>;
  protected tabMenuItems: Array<TabMenuItem> = new Array<TabMenuItem>();
  private selectedTabMenuItem: TabMenuItem = null;
  private btnSort: ButtonSortmenuComponent;
  public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();

  constructor(identifier: string, labels: Map<string, string>, classes: string | null, colorType: number = TabMenu.COLOR_TYPE_NONE) {
    super();
    this.identifier = identifier;
    this.dom.className = this.dom.className + ' tabMenu' + (classes != null && classes !== '' ? ' ' + classes : '');
    this.labels = labels;
    this.colorType = colorType;

    if (this.colorType === TabMenu.COLOR_TYPE_MENU_COLOR) {
      this.dom.classList.add('color');
    }

    this.dom.addEventListener('transitionstart', () => {
      this.domTabMenuContainer.style.width = '180px';
    });

    this.dom.addEventListener('transitionend', () => {
      this.domTabMenuContainer.style.width = null;
    });

    this.domTabMenuContainer = document.createElement('div');
    this.domTabMenuContainer.classList.add('tabMenuContainer');

    this.dom.appendChild(this.domTabMenuContainer);

    const domTabMenuHeader = document.createElement('div');
    domTabMenuHeader.classList.add('tabMenuHeader');

    const domTabMenuHeaderName = document.createElement('div');
    domTabMenuHeaderName.classList.add('tabMenuHeaderName');
    domTabMenuHeaderName.innerHTML = this.labels.get('name');
    domTabMenuHeader.appendChild(domTabMenuHeaderName);

    this.btnSort = new ButtonSortmenuComponent(identifier);
    this.btnSort.event.on('change', (sort: any) => {
      this.onSort(sort);
    });
    domTabMenuHeader.appendChild(this.btnSort.dom);

    this.domTabMenuItems = document.createElement('div');
    this.domTabMenuItems.classList.add('tabMenuItems');

    const tabMenuAddMenuItemMobile = new ButtonFloatComponent(svgAdd, (e: any) => {
      this.clickNewItem(e);
    });
    tabMenuAddMenuItemMobile.classList.add('tabMenuAddBtnMobile');

    const tabMenuAddBtnDesktop = new MenuItemComponent(svgAdd, this.labels.get('add'));
    tabMenuAddBtnDesktop.click = (menuItem, e) => {
      this.clickNewItem(e);
    };
    tabMenuAddBtnDesktop.classList.add('tabMenuAddBtnDesktop');

    this.domTabMenuContainer.appendChild(domTabMenuHeader);
    this.domTabMenuContainer.appendChild(this.domTabMenuItems);
    this.domTabMenuContainer.appendChild(tabMenuAddBtnDesktop.dom);
    this.domTabMenuContainer.appendChild(tabMenuAddMenuItemMobile.dom);

    this.dropdownMenu.event.on('close', () => {
      this.dropdownMenu.hide();
    });
  }

  /**
   * 
   */
  public clear(): void {
    this.domTabMenuItems.innerHTML = '';
    this.tabMenuItems = [];
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
    this.domTabMenuItems.removeChild(tabMenuItem.dom);
    this.tabMenuItems.splice(this.tabMenuItems.indexOf(tabMenuItem), 1);
  }

  /**
   * 
   * @param name 
   * @param identifier 
   * @param color 
   */
  public addItem(identifier: number, name: string, object: any, color: null | string): TabMenuItem {
    if (this.dom.classList.contains('hidden')) {
      this.dom.classList.remove('hidden');
    }

    //
    if (this.colorType === TabMenu.COLOR_TYPE_ITEM_COLOR) {
      color = (!color || color === '' ? this.getColor(identifier * 6 % Constants.colorsMenu.length) : color);
      object.color = color;
    }
    const tabMenuItem = new TabMenuItem(this.identifier, identifier, name, object, color);
    tabMenuItem.click = (item: TabMenuItem, identifier1: number, name1: string, object1: any) => {
      this.click(item, identifier1, name1, object1);
      this.setMenuItemActive(identifier);
    };

    tabMenuItem.oncontextmenu = (e, item: TabMenuItem, identifier1: number, name1: string, object1: any) => {
      this.dropdownMenu.setObject(item);
      this.dropdownMenu.show();
      this.dropdownMenu.setPosition(e.pageX, e.pageY);
    };

    tabMenuItem.onDragged.subscribe((o) => {
      this.itemDragged(o);
    });

    this.tabMenuItems.push(tabMenuItem);
    this.domTabMenuItems.appendChild(tabMenuItem.dom);
    return tabMenuItem;
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

  public moveTabMenuItem(o: {from: number, to: number}): void {

    const from = this.tabMenuItems.find(a => a.getId() === o.from);
    const to = this.tabMenuItems.find(a => a.getId() === o.to);
    
    const children = [...this.domTabMenuItems.children];
    const indexFrom = children.indexOf(from.dom);
    const indexTo = children.indexOf(to.dom);

    if (indexFrom > indexTo) {
      this.domTabMenuItems.insertBefore(from.dom, to.dom);
    } else {
      this.domTabMenuItems.insertBefore(from.dom, to.dom.nextSibling);
    }
  }

  
  public isDraggable(): boolean {
    const sort = Profile.getSort().find(s => s.name === this.identifier);
    if (sort && sort.identifier === 'sort') {
        return true;
    }
    return false;
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

  public itemDragged(o: {from: number, to: number}) {
    alert('Method not yet implemented!');
  }
}
