import './datebar-component.scss';

export default class DatebarComponent {
    public dom: HTMLSpanElement = document.createElement('span');
    
    constructor(){
        this.dom.className = "datebar";
    }

    public value(value: string = undefined) : string {
        if(value !== undefined){
            this.dom.innerText = value;
            return value;
        } else return this.dom.innerText;
    }
}
