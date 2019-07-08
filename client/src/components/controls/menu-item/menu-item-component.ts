import './menu-item-component.scss';

import { EventEmitter } from 'events';


export default class MenuItemComponent  {
    public event = new EventEmitter();

    public dom:HTMLElement = document.createElement("div");
    
    constructor( icon : any, name: string, click: any = undefined ){
        this.dom.className = "menuItem";
    
        const iconContainer = document.createElement("span");
        iconContainer.className = "iconContainer";
        this.dom.appendChild(iconContainer);

        const iconImg:HTMLImageElement = document.createElement("img");
        iconImg.className = "icon";
        iconImg.src = icon;
        iconContainer.appendChild(iconImg);
        
        const nameContainer = document.createElement("span");
        nameContainer.className = "nameContainer";
        nameContainer.innerHTML = name;
        this.dom.appendChild(nameContainer);
        
        if(click !== undefined){
            this.click = click;
        }

        this.dom.onclick = (e) => {
            this.onClick(this);
            this.click(this);
            this.event.emit("click");
        }
    }

    public onClick(buttonComponent:MenuItemComponent){}

    public click(buttonComponent:MenuItemComponent){
        console.error("Method not yet implemented!");
    }
}