export default class ButtonIconComponent  {
    public dom:HTMLElement = document.createElement("div");
    private iconContainer:HTMLImageElement;

    constructor( icon : any, description: string|null = null, click: any = null, classes: string = null ){
        this.dom.className = "btnIcon" + (classes=== null?"":" "+classes);
        

        this.iconContainer = document.createElement("img");
        this.iconContainer.className = "icon";

        
        this.set(icon, description);

        this.dom.appendChild(this.iconContainer);
        
        if(click !== null ){
            this.click = click;
        }

        this.dom.onclick = (e) => {
            this.onClick(e, this);
            this.click(e, this);
        }
    }

    
    public set(icon : any, description: string|null = undefined) : void{
        this.iconContainer.src = icon;
        if(description!==null){
            this.iconContainer.alt = description;
        }
    }

    public onClick(event:Event, buttonComponent:ButtonIconComponent){}

    public click(event:Event, buttonComponent:ButtonIconComponent){
        console.error("Method not yet implemented!");
    }
}