import './title-component.scss';

export default class TitleComponent  {
    private domItem:HTMLElement = document.createElement("div");
    private domMainTitle:HTMLElement = document.createElement("div");
    private domSubTitle:HTMLElement = document.createElement("div");
    constructor(){
        this.domItem.className = "title";
        this.domMainTitle.className = "mainTitle";
        this.domSubTitle.className = "subTitle";

        this.domItem.appendChild(this.domMainTitle);
        this.domItem.appendChild(this.domSubTitle);
    }

    public get() : HTMLElement{
        return this.domItem;
    }

    public setMainTitle(title: string){
        this.domMainTitle.innerHTML = title;
    }

    public setSubTitle(title: string){
        this.domSubTitle.innerHTML = title;
    }
}