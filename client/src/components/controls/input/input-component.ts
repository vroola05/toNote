export default class InputComponent  {
    public dom:HTMLElement = document.createElement("div");
    private domLabel:HTMLLabelElement;
    private domInput:HTMLInputElement = document.createElement("input");
    
    
    constructor( type: string, name: string, label: string = undefined ){

        if(label!==undefined){
            this.domLabel = document.createElement("label");
            this.domLabel.innerHTML = label;
            this.domLabel.classList.add("label");
            this.dom.appendChild(this.domLabel);
        }

        this.dom.appendChild(this.domInput);

        this.dom.className = "inputContainer";

        this.domInput.type = type;
        this.domInput.classList.add("input");
        
        
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.domInput.value = value;
        }
        
        return this.domInput.value;
    }

    public focus(){
        this.domInput.focus();
    }

    public addEventListener(event:string, func:any){
        this.domInput.addEventListener(event, func);
    }
}