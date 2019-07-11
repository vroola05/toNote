import svgAdd from '../../../assets/images/add.svg';

import { Constants } from '../../../services/config/constants';
import Lang from '../../language/lang';
import { TabMenuItem } from './components/tab-menu-item';
import { Tab } from './tab';

import MenuItemComponent from '../menu-item/menu-item-component';

export class TabMenu extends Tab {

	private domItemList: HTMLElement;
	private itemContainer: HTMLElement 
	private labels: Map<string, string>;
	private tabMenuItems: Array<TabMenuItem> = new Array<TabMenuItem>();
	private selectedTabMenuItem: TabMenuItem = null;

	

	constructor(labels: Map<string, string>, classes: string | undefined) {
		super();
		this.dom.className = this.dom.className + " tabMenu" + (classes != undefined && classes != "" ? " " + classes : "");
		this.labels = labels;

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
	public addItem(identifier: number, name: string, object: any, color: undefined | string): void {
		if (this.dom.classList.contains("hidden")) {
			this.dom.classList.remove("hidden");
		}

		let tabMenuItem = new TabMenuItem(identifier, name, object, color);
		tabMenuItem.click = (item: TabMenuItem, identifier: number, name: string, object: any) => {
			this.click(item, identifier, name, object);
			this.setMenuItemActive(identifier);
		}
		this.domItemList.appendChild(tabMenuItem.dom);
		this.tabMenuItems.push(tabMenuItem);
	}

	public hasItems(){
		return this.tabMenuItems.length>0;
	}

	public isSelectedMenuItem(id: number): boolean {
		return this.selectedTabMenuItem == null ? false : this.selectedTabMenuItem.getId() == id;
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
	 * @param identifier 
	 * @param name 
	 */
	public renameItem(identifier: number, name: string) {
		var item = this.domItemList.querySelector("[identifier='" + identifier + "']");

		if (name === undefined || name == "") {
			item.classList.add("noTitle");
			item.querySelector(".name").innerHTML = this.getEmptyTitle();
		} else {
			if (item.classList.contains("noTitle")) {
				item.classList.remove("noTitle")
			}
			item.querySelector(".name").innerHTML = name;
		}
	}

	/**
	 * 
	 */
	private getEmptyTitle(): string {
		var e = this.domItemList.querySelectorAll(".item .noTitle");
		return Lang.get("tabmenu_empty") + (e == null ? 1 : (e.length + 1));
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