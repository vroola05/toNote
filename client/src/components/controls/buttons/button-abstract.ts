export default class ButtonAbstract  {
    public dom:HTMLInputElement = document.createElement("input");
    
    constructor( name: string, click: any = undefined ){
        this.dom.type = "button";
        this.dom.className = "btn";
        this.dom.disabled = false;

        if(name!==undefined){
            this.dom.value = name;
        }
        
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

    public addClass(value: string): void {
        this.dom.classList.add(value);
    }

    public click(buttonComponent: ButtonAbstract){
        console.error("Method not yet implemented!");
    }
}