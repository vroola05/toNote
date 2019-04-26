import './header-component.scss';

import ButtonComponent from './button-component';

export default class HeaderComponent  {
    private domItem:HTMLElement = document.createElement("div");
    private buttonComponents: Array<ButtonComponent> = new Array();

    constructor(){
        this.domItem.className = "header";
    }

    public add(buttonComponent: ButtonComponent){
        this.buttonComponents.push(buttonComponent);
        this.domItem.appendChild(buttonComponent.get());
    }

    public get() : HTMLElement{
        return this.domItem;
    }
}