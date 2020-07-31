export default class LoaderComponent {
    public dom: HTMLSpanElement = document.createElement('span');
    private loader: HTMLSpanElement = document.createElement('span');

    constructor() {
        this.clear();

        this.dom.className = 'loaderContainer';
        this.dom.appendChild(this.loader);
        this.loader.className = 'loader';
    }

    public setPercentage(prc: number): void {
        
        this.loader.style.setProperty('--loaderPrc', ''+ prc);
        
    }

    public clear(): void {
        this.loader.style.setProperty('--loaderPrc', '0');
    }
}
