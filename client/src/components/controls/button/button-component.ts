import './button-component.scss';

export default class ButtonComponent  {
    private domItem:HTMLElement = document.createElement("div");
    private iconContainer:HTMLImageElement = document.createElement("img");
    constructor( icon : any, description: string|undefined = undefined ){
        this.domItem.className = "btn";
        
        this.iconContainer.className = "icon";

        this.set(icon, description);
        
        this.domItem.appendChild(this.iconContainer);
        
        this.domItem.onclick = (e) => {
            this.onClick(this);
            this.click(this);
        }
    }

    public set(icon : any, description: string|undefined = undefined) : void{
        this.iconContainer.src = icon;
        if(description!==undefined){
            this.iconContainer.alt = description;
        }
    }
    
    public get() : HTMLElement{
        return this.domItem;
    }

    public onClick(buttonComponent:ButtonComponent){}

    public click(buttonComponent:ButtonComponent){
        console.error("Method not yet implemented!");
    }
}