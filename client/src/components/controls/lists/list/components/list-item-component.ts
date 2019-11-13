export default class ListItemComponent  {
    public dom:HTMLElement = document.createElement("div");
    private value: string;
    private object: any;

    constructor( value: string, object: any ){
        this.dom.className = "listItem";
    
        this.value = value;
        this.object = object;
        
        const listItemValueContainer = document.createElement("span");
        listItemValueContainer.className = "listItemValueContainer";
        listItemValueContainer.innerHTML = value;
        this.dom.appendChild(listItemValueContainer);
    }

    public click(listItemComponent:ListItemComponent, e :Event){
        console.error("Method not yet implemented!");
    }
}