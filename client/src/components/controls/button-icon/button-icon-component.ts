import './button-icon-component.scss';

export default class ButtonIconComponent  {
    private domItem:HTMLElement = document.createElement("div");
    private iconContainer:HTMLImageElement;

    constructor( icon : any, description: string|undefined = undefined, click: any = undefined ){
        this.domItem.className = "btnIcon";
        

        this.iconContainer = document.createElement("img");
        this.iconContainer.className = "icon";

        
        this.set(icon, description);
        
        this.domItem.appendChild(this.iconContainer);
        
        if(click !== undefined ){
            this.click = click;
        }

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

    public onClick(buttonComponent:ButtonIconComponent){}

    public click(buttonComponent:ButtonIconComponent){
        console.error("Method not yet implemented!");
    }
}