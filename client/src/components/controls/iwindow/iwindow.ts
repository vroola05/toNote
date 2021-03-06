import {State, IRouter} from '../../../services/router/types';

export class IWindow implements IRouter {


    constructor(name: string, title: string) {
        if (IWindow.windows == null) {
            IWindow.windows = new Array<IWindow>();
        }
        IWindow.windows.push(this);
        this.name = name;
        this.title = title;
        this.main.className = this.name;
    }

    private static windows: Array<IWindow>;
    private main: HTMLDivElement = document.createElement('div');    private title: string;
    private name: string;

    public show() {
        IWindow.windows.forEach(w => {
            if (w.getName() !== this.getName()) {
                w.hide();
            }
        });
        document.body.appendChild(this.main);
    }

    public hide() {
        if (document.body.contains(this.main)) {
            document.body.removeChild(this.main);
        }
    }

    public getName() {
        return this.name;
    }

    protected append(element: any) {
        this.main.appendChild(element);
    }

    public load( module: string, route: Array<string> ): boolean { console.error('NOT YET IMPLEMENTED'); return false; }

    public setTitle(title: string) {

    }
}
