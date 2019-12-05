export default class ButtonIconAbstract  {
    public dom:HTMLButtonElement = document.createElement("button");
    private iconContainer:HTMLImageElement;

    constructor( icon : any, click: any = undefined ){
        this.dom.type = "button";
        this.dom.className = "btn";
        this.dom.disabled = false;

        this.iconContainer = document.createElement("img");
        this.iconContainer.className = "icon";
        this.iconContainer.src = icon;
        this.dom.appendChild(this.iconContainer);

        if(click !== undefined ){
            this.click = click;
        }

        this.dom.onclick = (e) => {
            this.click(this);
        }
    }

    public set disabled(disabled: boolean) {
        this.dom.disabled = disabled;
    }

    public get disabled(): boolean {
        return this.dom.disabled;
    }

    public click(buttonComponent: ButtonIconAbstract){
        console.error("Method not yet implemented!");
    }
}