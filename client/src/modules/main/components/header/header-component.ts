import './header-component.scss';
import ButtonComponent from '../../../../components/controls/button/button-component';


import TitleComponent from './components/title/title-component';

export default class HeaderComponent  {
    private domItem: HTMLElement = document.createElement("div");
    private btnLeftContainer: HTMLElement = document.createElement("div");
    private btnRightContainer: HTMLElement = document.createElement("div");
    private titleContainer: HTMLElement = document.createElement("div");

    private titleComponent: TitleComponent = new TitleComponent();
    
    private buttonComponents: Array<ButtonComponent> = new Array();

    constructor(){
        this.domItem.className = "header";

        this.btnLeftContainer.className = "btnLeftContainer";
        this.titleContainer.className = "titleContainer";
        this.titleContainer.appendChild(this.titleComponent.get());
        this.btnRightContainer.className = "btnRightContainer";

        this.domItem.appendChild(this.btnLeftContainer);
        this.domItem.appendChild(this.titleContainer);
        this.domItem.appendChild(this.btnRightContainer);
    }

    public addMenuItem(buttonComponent: ButtonComponent){
        this.buttonComponents.push(buttonComponent);
        this.btnLeftContainer.appendChild(buttonComponent.get());
    }

    public addAltMenuItem(buttonComponent: ButtonComponent){
        this.buttonComponents.push(buttonComponent);
        this.btnRightContainer.appendChild(buttonComponent.get());
    }

    public get() : HTMLElement{
        return this.domItem;
    }

    public setMainTitle(title: string){
        this.titleComponent.setMainTitle(title);
    }
    public setSubTitle(title: string){
        this.titleComponent.setSubTitle(title);
    }
}
