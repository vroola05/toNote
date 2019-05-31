import './button-component.scss';

export default class ButtonComponent  {
    private domItem:HTMLInputElement = document.createElement("input");
    
    constructor( name: string, click: any = undefined ){
        this.domItem.type = "button";
        this.domItem.className = "btn";

        if(name!==undefined){
            this.domItem.value = name;
        }
        
        if(click !== undefined ){
            this.click = click;
        }
        this.domItem.onclick = (e) => {
            this.click(this);
        }
    }
    
    public get() : HTMLElement{
        return this.domItem;
    }

    public click(buttonComponent:ButtonComponent){
        console.error("Method not yet implemented!");
    }
}