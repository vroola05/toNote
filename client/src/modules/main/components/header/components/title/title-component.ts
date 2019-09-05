export default class TitleComponent  {
    public dom:HTMLElement = document.createElement("div");
    private domMainTitle:HTMLElement = document.createElement("div");
    private domSubTitle:HTMLElement = document.createElement("div");
    constructor(){
        this.dom.className = "title";
        this.domMainTitle.className = "mainTitle";
        this.domSubTitle.className = "subTitle";

        this.dom.appendChild(this.domMainTitle);
        this.dom.appendChild(this.domSubTitle);
    }

    public setMainTitle(title: string){
        this.domMainTitle.innerHTML = title;
    }

    public setSubTitle(title: string){
        this.domSubTitle.innerHTML = title;
    }
}