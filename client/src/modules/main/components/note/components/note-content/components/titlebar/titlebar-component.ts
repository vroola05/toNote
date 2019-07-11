export default class TitlebarComponent {
    public dom: HTMLDivElement = document.createElement('div');
    
    constructor(){
        this.dom.className = "titlebar";
        this.dom.contentEditable = "true";
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value;
        } else return this.dom.innerText;
    }
}
