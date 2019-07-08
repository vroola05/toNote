import './button-component.scss';

export default class ButtonComponent  {
    public dom:HTMLInputElement = document.createElement("input");
    
    constructor( name: string, click: any = undefined ){
        this.dom.type = "button";
        this.dom.className = "btn";

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

    public click(buttonComponent:ButtonComponent){
        console.error("Method not yet implemented!");
    }
}