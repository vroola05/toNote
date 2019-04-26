import './tab-menu.scss';

import Lang from '../language/lang';
import { TabMenuItem } from './components/tab-menu-item';
import { Tab } from './tab';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export class TabMenu extends Tab {
	private static colorScheme: Array<string> = new Array("#CD5C5C", "#F08080", "#FA8072", "#E9967A", "#FFA07A", "#DC143C", "#FF0000", "#B22222", "#8B0000", "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093", "#FFA07A", "#FF7F50", "#FF6347", "#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2", "#FFEFD5", "#FFE4B5", "#FFDAB9", "#EEE8AA", "#F0E68C", "#BDB76B", "#E6E6FA", "#D8BFD8", "#DDA0DD", "#EE82EE", "#DA70D6", "#FF00FF", "#FF00FF", "#BA55D3", "#9370DB", "#663399", "#8A2BE2", "#9400D3", "#9932CC", "#8B008B", "#800080", "#4B0082", "#6A5ACD", "#483D8B", "#7B68EE", "#ADFF2F", "#7FFF00", "#7CFC00", "#00FF00", "#32CD32", "#98FB98", "#90EE90", "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#228B22", "#008000", "#006400", "#9ACD32", "#6B8E23", "#808000", "#556B2F", "#66CDAA", "#8FBC8B", "#20B2AA", "#008B8B", "#008080", "#00FFFF", "#00FFFF", "#E0FFFF", "#AFEEEE", "#7FFFD4", "#40E0D0", "#48D1CC", "#00CED1", "#5F9EA0", "#4682B4", "#B0C4DE", "#B0E0E6", "#ADD8E6", "#87CEEB", "#87CEFA", "#00BFFF", "#1E90FF", "#6495ED", "#7B68EE", "#4169E1", "#0000FF", "#0000CD", "#00008B", "#000080", "#191970", "#FFF8DC", "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3", "#DEB887", "#D2B48C", "#BC8F8F", "#F4A460", "#DAA520", "#B8860B", "#CD853F", "#D2691E", "#8B4513", "#A0522D", "#A52A2A", "#800000", "#FFFFFF", "#FFFAFA", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF", "#F5F5F5", "#FFF5EE", "#F5F5DC", "#FDF5E6", "#FFFAF0", "#FFFFF0", "#FAEBD7", "#FAF0E6", "#FFF0F5", "#FFE4E1", "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F");

	private domItemList: HTMLElement;
	private labels: Map<string, string>;
	private tabMenuItems: Array<TabMenuItem> = new Array<TabMenuItem>();
	private selectedTabMenuItem: TabMenuItem = null;

	constructor(labels: Map<string, string>, classes: string | undefined) {
		super();
		this.domTab.className = this.domTab.className + " tabMenu" + (classes != undefined && classes != "" ? " " + classes : "");
		this.labels = labels;


		let domTabMenuContainer = document.createElement("div");
		domTabMenuContainer.classList.add("tabMenuContainer");

		var itemContainer = document.createElement("div");
		itemContainer.classList.add("itemContainer");

		domTabMenuContainer.appendChild(itemContainer);

		this.domTab.appendChild(domTabMenuContainer);

		let domName = document.createElement("div");
		domName.classList.add("name");
		domName.innerHTML = this.labels.get("name");

		this.domItemList = document.createElement("div");
		this.domItemList.classList.add("itemList");

		let domAdd = document.createElement("div");
		domAdd.classList.add("options");
		domAdd.innerHTML = "<span class='icon'>+</span><span class='text'>" + this.labels.get("add") + "</span><div>"

		var self = this;
		domAdd.addEventListener("click", function (e) {
			self.clickNewItem(e);
		});

		itemContainer.appendChild(domName);
		itemContainer.appendChild(this.domItemList);
		itemContainer.appendChild(domAdd);
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
	public addItem(identifier: number, name: string, obejct: any, color: undefined | string): void {
		if (this.domTab.classList.contains("hidden")) {
			this.domTab.classList.remove("hidden");
		}

		let tabMenuItem = new TabMenuItem(identifier, name, obejct, color);
		tabMenuItem.click = (item: TabMenuItem, identifier: number, name: string, object: any) => {

			this.click(item, identifier, name, object);
			this.setMenuItemActive(identifier);
		}
		this.domItemList.appendChild(tabMenuItem.get());
		this.tabMenuItems.push(tabMenuItem);
		/*var self = this;
		var item = document.createElement("div");
		item.classList.add("item");
		item.setAttribute("identifier", identifier.toString());
		item.setAttribute("label", name);

		var itemColor = document.createElement("span");
		itemColor.classList.add("color");
		if(color !== undefined && color != ""){
			itemColor.style.backgroundColor = color;
		}else{
			itemColor.style.backgroundColor = this.getColor(identifier*6%142);
		}
		item.appendChild(itemColor);

		var itemName = document.createElement("span");
		itemName.classList.add("name");
		if (name === undefined || name == "") {
			itemName.classList.add("noTitle");
			itemName.innerHTML = this.getEmptyTitle();
		} else {
			itemName.innerHTML = name;
		}

		item.addEventListener("click", function(e) {
			self.setMenuItemActive(identifier);
			self.domTab.classList.remove("active");
			if(self.child != null){
				self.child.show();
			}

			self.click(e, Number(this.getAttribute("identifier")), this.getAttribute("label"));
		});
		item.appendChild(itemName);

		//this.contextMenu.attach(item);
		this.domItemList.appendChild(item);   */
	}

	/**
	 * 
	 * @param index 
	 */
	private getColor(index: number): string {
		return TabMenu.colorScheme[index];
	}

	/**
	 * 
	 * @param identifier 
	 */
	public removeItem(identifier: number): void {
		var item = this.domItemList.querySelector("[identifier='" + identifier + "']");
		if (item != null) {
			this.domItemList.removeChild(item);
		}
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

	/**
	 * 
	 * @param identifier 
	 */
	public setMenuItemActive(identifier: number): void {
		if(identifier===null) return;
		this.tabMenuItems.forEach((tabMenuItem) => {
			if (identifier == tabMenuItem.getId()) {
				this.selectedTabMenuItem = tabMenuItem;
				tabMenuItem.setActive(true);
			} else {
				tabMenuItem.setActive(false);
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