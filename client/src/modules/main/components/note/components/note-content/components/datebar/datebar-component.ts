
export default class DatebarComponent {
    public dom: HTMLSpanElement = document.createElement('span');
    
    constructor(classes : string = null){
        this.dom.className = "datebar" + (classes==null?"":" "+classes);
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value;
        } else return this.dom.innerText;
    }
}
