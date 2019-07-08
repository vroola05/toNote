import './tab-menu-item.scss';

import Lang from 'components/language/lang';

export class TabMenuItem {
	public dom:HTMLElement = document.createElement("div");
    protected identifier:number;
    protected name:string;
    protected color:string|undefined;
    protected object:any;

	constructor(identifier:number, name:string, object:any, color:string|undefined=undefined){
        this.identifier = identifier;
        this.name = name;
        this.object = object;
        this.color = color;

        this.dom.classList.add("item");
        
        var itemColor = document.createElement("span");
        itemColor.classList.add("color");
        if(color !== undefined && color != ""){
            itemColor.style.backgroundColor = color;
        }else{
            //itemColor.style.backgroundColor = this.getColor(identifier*6%142);
        }
        this.dom.appendChild(itemColor);

        var itemName = document.createElement("span");
        itemName.classList.add("name");
        if (name === undefined || name == "") {
            itemName.classList.add("noTitle");
            
        } else {
            itemName.innerHTML = name;
        }
        this.dom.onclick = (e) => {
            this.click(this, this.identifier, this.name, this.object);
        };
        this.dom.appendChild(itemName);
    }

    public getId(){
        return this.identifier;
    }

    public getObject(){
        return this.object;
    }

	/**
	 * 
	 * @param e 
	 * @param identifier 
	 */
    public click(item:TabMenuItem, identifier:number, name:string, object:any){
        console.error("Method not yet implemented!");
    }

    public setActive(active:boolean=true){
        if(active){
            this.dom.classList.add("active");
        }else {
            this.dom.classList.remove("active");
        }
    }
}