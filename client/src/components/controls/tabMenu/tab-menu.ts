import svgAdd from '../../../assets/images/add.svg';

import DropdownMenuComponent from '../dropdown/dropdown-menu-component';
import { Constants } from '../../../services/config/constants';
import Lang from '../../language/lang';
import { TabMenuItem } from './components/tab-menu-item';
import { Tab } from './tab';

import MenuItemComponent from '../menu-item/menu-item-component';

export class TabMenu extends Tab {
	public static COLOR_TYPE_NONE = 1;
	public static COLOR_TYPE_ITEM_COLOR = 2;
	public static COLOR_TYPE_MENU_COLOR = 3;

	private colorType : number;
	private domItemList: HTMLElement;
	private itemContainer: HTMLElement 
	private labels: Map<string, string>;
	private tabMenuItems: Array<TabMenuItem> = new Array<TabMenuItem>();
	private selectedTabMenuItem: TabMenuItem = null;

	public dropdownMenu: DropdownMenuComponent = new DropdownMenuComponent();

	constructor(labels: Map<string, string>, classes: string | null, colorType: number = TabMenu.COLOR_TYPE_NONE) {
		super();
		this.dom.className = this.dom.className + " tabMenu" + (classes != null && classes != "" ? " " + classes : "");
		this.labels = labels;
		this.colorType = colorType;
		if (this.colorType == TabMenu.COLOR_TYPE_MENU_COLOR){
			this.dom.classList.add("color");
		}
		this.dom.addEventListener("transitionstart", () => {
			this.itemContainer.style.width = "180px";
		});
		this.dom.addEventListener("transitionend", () => {
			this.itemContainer.style.width =null;
		});

		this.itemContainer = document.createElement("div");
		this.itemContainer.classList.add("itemContainer");

		this.dom.appendChild(this.itemContainer);

		let domName = document.createElement("div");
		domName.classList.add("menuName");
		domName.innerHTML = this.labels.get("name");

		this.domItemList = document.createElement("div");
		this.domItemList.classList.add("itemList");
		
		const addMenuItem = new MenuItemComponent(svgAdd, this.labels.get("add"));
		addMenuItem.click = (menuItem, e) => {
			this.clickNewItem(e);
		};

		this.itemContainer.appendChild(domName);
		this.itemContainer.appendChild(this.domItemList);
		this.itemContainer.appendChild(addMenuItem.dom);

		this.dropdownMenu.event.on('close', () => {
			this.dropdownMenu.hide();
		}
	 );
	}

    /**
     * 
     */
	public clear(): void {
		this.domItemList.innerHTML = "";
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

    /**
     * 
     * @param name 
     * @param identifier 
     * @param color 
     */
	public addItem(identifier: number, name: string, object: any, color: null | string): void {
		if (this.dom.classList.contains("hidden")) {
			this.dom.classList.remove("hidden");
		}

		//
		if (this.colorType == TabMenu.COLOR_TYPE_ITEM_COLOR){
			color = (!color || color == ""?this.getColor(identifier*6%Constants.colorsMenu.length):color)	;
			object.color = color;
		}
		let tabMenuItem = new TabMenuItem(identifier, name, object, color);
		tabMenuItem.click = (item: TabMenuItem, identifier: number, name: string, object: any) => {
			this.click(item, identifier, name, object);
			this.setMenuItemActive(identifier);
		}

		tabMenuItem.oncontextmenu = (e, item: TabMenuItem, identifier: number, name: string, object: any) => {
			
			this.dropdownMenu.setObject(item);
			this.dropdownMenu.show();
			this.dropdownMenu.setPosition(e.pageX, e.pageY);
			
		}
		
		this.domItemList.appendChild(tabMenuItem.dom);
		this.tabMenuItems.push(tabMenuItem);
	}

	/**
	 * 
	 * @param index 
	 */
	private getColor(index: number): string {
		return Constants.colorsMenu[index];
	}

	public setMenuColor( color : string ){
		if(this.colorType === TabMenu.COLOR_TYPE_MENU_COLOR) {
			this.dom.style.borderColor = color;
		}
	}

	public hasItems(){
		return this.tabMenuItems.length>0;
	}

	public clearSelectedMenuItem(): void {
		this.selectedTabMenuItem = null;
	}

	public getSelectedMenuItem(): TabMenuItem {
		return this.selectedTabMenuItem;
	}

	public getTabMenuItems(): Array<TabMenuItem> {
		return this.tabMenuItems;
	}

	public getObjects(){
		let objects = new Array<any>();
		
		this.tabMenuItems.forEach((tabMenuItem) => {
			objects.push(tabMenuItem.getObject());
		});

		return objects;
	}

	/**
	 * 
	 * @param identifier 
	 */
	public setMenuItemActive(identifier: number): void {
		if(identifier===null) return;
		this.tabMenuItems.forEach((tabMenuItem) => {
			if (identifier == tabMenuItem.getId()) {
				this.selectedTabMenuItem = tabMenuItem;
				tabMenuItem.activate(true);
			} else {
				tabMenuItem.activate(false);
			}
		});
	}

	/**
	 * 
	 * @param e 
	 * @param identifier 
	 */
	public click(item: TabMenuItem, identifier: number, name: string, object: any) {
		alert("Method not yet implemented!");
	}

	/**
	 * 
	 * @param e 
	 */
	public clickNewItem(e: Event) {
		alert("Method not yet implemented!");
	}
}