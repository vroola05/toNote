import Lang from 'components/language/lang';
import { Constants } from '../../../../services/config/constants';

export class TabMenuItem {
    public dom: HTMLElement = document.createElement('div');
    private domName: HTMLElement = document.createElement('span');
    protected identifier: number;
    protected name: string;
    protected color: string|undefined;
    protected object: any;

	constructor(identifier: number, name: string, object: any, color: string | null = null) {
        this.identifier = identifier;
        this.object = object;
        this.color = color;

        this.dom.classList.add('item');
        
        if ( color !== null) {
            const itemColor = document.createElement('span');
            itemColor.classList.add('color');
            itemColor.appendChild(this.getIcon(color));
            this.dom.appendChild(itemColor);
        }
        
        this.domName.classList.add('name');
        this.setName(name);

        this.dom.onclick = (e: DragEvent) => {
            this.click(this, this.identifier, this.name, this.object);
        };

        this.dom.draggable = true;

        const ruler = document.createElement('span');
        ruler.className = 'ruler';
        this.dom.appendChild(ruler);
        this.dom.ondragenter = (e) => {
            console.log(this.dom, e);
        };
        this.dom.ondragleave = (e) => {

        };

        this.dom.ondragover = (e) => {
            e.preventDefault();
        };
        this.dom.ondragstart = (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify(this.object));
            console.log('a', e);
        };
        this.dom.ondragend = (e) => {
            e.preventDefault();
        };
        this.dom.ondrop = (e) => {
            e.dataTransfer.dropEffect = 'move';
            console.log('d', this.object, JSON.parse(e.dataTransfer.getData('text')));
        };
        
        this.dom.oncontextmenu = (e) => {
            this.oncontextmenu(e, this, this.identifier, this.name, this.object);
            e.preventDefault();
        };
        this.dom.appendChild(this.domName);
    }

    public getIcon( color: string ) {
        const ns = 'http://www.w3.org/2000/svg';
        const colorIcon: SVGElement = document.createElementNS(ns, 'svg');
        colorIcon.setAttribute('viewBox', '0 0 21 21');
        const circle = document.createElementNS(ns, 'circle');
        circle.classList.add('colorRect');
        circle.style.fill = color;
        circle.setAttribute('cx', '10.5px');
        circle.setAttribute('cy', '10.5px');
        circle.setAttribute('r', '10px');
        colorIcon.appendChild(circle);
        return colorIcon;
    }

    public getId() {
        return this.identifier;
    }

    public getObject() {
        return this.object;
    }
    public setObject(object: any) {
        this.object = object;
    }

    public setName(name: string) {
        this.name = name;
        if (name === undefined || name === '') {
            this.domName.classList.add('noTitle');
        } else {
            this.domName.innerHTML = name;
        }
    }

	/**
	 * 
	 * @param e 
	 * @param identifier 
	 */
    public click(item: TabMenuItem, identifier: number, name: string, object: any) {
        console.error('Method not yet implemented!');
    }

    public oncontextmenu(e: any, item: TabMenuItem, identifier: number, name: string, object: any) {
        console.error('Method not yet implemented!');
    }

    public activate(active: boolean= true) {
        if (active) {
            this.dom.classList.add('active');
        } else {
            this.dom.classList.remove('active');
        }
    }
}
