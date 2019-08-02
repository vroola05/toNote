import Lang from 'components/language/lang';
import { Constants } from '../../../../services/config/constants';

export class TabMenuItem {
	public dom:HTMLElement = document.createElement("div");
    protected identifier:number;
    protected name:string;
    protected color:string|undefined;
    protected object:any;

	constructor(identifier: number, name: string, object: any, color: string | null = null){
        this.identifier = identifier;
        this.name = name;
        this.object = object;
        this.color = color;

        this.dom.classList.add("item");
        
        if( color !== null) {
            var itemColor = document.createElement("span");
            itemColor.classList.add("color");
            itemColor.appendChild(this.getIcon(color));
            this.dom.appendChild(itemColor);
        }

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
        this.dom.oncontextmenu = (e) => {
            this.oncontextmenu(e, this, this.identifier, this.name, this.object);
            e.preventDefault();
        };
        this.dom.appendChild(itemName);
    }

    public getIcon( color:string ){
        const ns = "http://www.w3.org/2000/svg";
        const colorIcon: SVGElement = document.createElementNS(ns, "svg");
        colorIcon.setAttribute("width", "15px");
        colorIcon.setAttribute("height", "15px");
        /*const rect = document.createElementNS(ns, "rect");
        rect.classList.add("colorRect");
        rect.style.fill = color;
        colorIcon.appendChild(rect);*/
        const circle = document.createElementNS(ns, "circle");
        circle.classList.add("colorRect");
        circle.style.fill = color;
        circle.setAttribute("cx","7.5px");
        circle.setAttribute("cy","7.5px");
        circle.setAttribute("r","7px");
        colorIcon.appendChild(circle);
        return colorIcon;
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

    public oncontextmenu (e:any, item:TabMenuItem, identifier:number, name:string, object:any) {
        console.error("Method not yet implemented!");
    }

    public activate(active:boolean=true){
        if(active){
            this.dom.classList.add("active");
        }else {
            this.dom.classList.remove("active");
        }
    }
}