import './input-component.scss';

export default class InputComponent  {
    private domItem:HTMLElement = document.createElement("div");
    private domLabel:HTMLLabelElement;
    private domInput:HTMLInputElement = document.createElement("input");
    
    
    constructor( type: string, name: string, label: string = undefined ){

        if(label!==undefined){
            this.domLabel = document.createElement("label");
            this.domLabel.innerHTML = label;
            this.domItem.appendChild(this.domLabel);
        }

        this.domItem.appendChild(this.domInput);

        this.domItem.className = "inputContainer";

        this.domInput.type = type;
        
        
    }
    
    public get() : HTMLElement{
        return this.domItem;
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.domInput.value = value;
        }
        
        return this.domInput.value;
    }
}