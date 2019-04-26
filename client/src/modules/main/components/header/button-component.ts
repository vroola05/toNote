export default class ButtonComponent  {
    private domItem:HTMLElement = document.createElement("div");

    constructor( name : string ){
        this.domItem.className = "btn";
        this.domItem.innerHTML = name;
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