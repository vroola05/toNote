export default class ButtonIconComponent  {
    public dom:HTMLElement = document.createElement("div");
    private iconContainer:HTMLImageElement;

    constructor( icon : any, description: string|undefined = undefined, click: any = undefined ){
        this.dom.className = "btnIcon";
        

        this.iconContainer = document.createElement("img");
        this.iconContainer.className = "icon";

        
        this.set(icon, description);
        
        this.dom.appendChild(this.iconContainer);
        
        if(click !== undefined ){
            this.click = click;
        }

        this.dom.onclick = (e) => {
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

    public onClick(buttonComponent:ButtonIconComponent){}

    public click(buttonComponent:ButtonIconComponent){
        console.error("Method not yet implemented!");
    }
}