import './menu-item-component.scss';

export default class MenuItemComponent  {
    private domItem:HTMLElement = document.createElement("div");
        constructor( icon : any, name: string ){
        this.domItem.className = "menuItem";
    
        const iconContainer = document.createElement("span");
        iconContainer.className = "iconContainer";
        this.domItem.appendChild(iconContainer);

        const iconImg:HTMLImageElement = document.createElement("img");
        iconImg.className = "icon";
        iconImg.src = icon;
        iconContainer.appendChild(iconImg);
        
        const nameContainer = document.createElement("span");
        nameContainer.className = "nameContainer";
        nameContainer.innerHTML = name;
        this.domItem.appendChild(nameContainer);
        
        this.domItem.onclick = (e) => {
            this.onClick(this);
            this.click(this);
        }
    }

    public get() : HTMLElement{
        return this.domItem;
    }

    public onClick(buttonComponent:MenuItemComponent){}

    public click(buttonComponent:MenuItemComponent){
        console.error("Method not yet implemented!");
    }
}