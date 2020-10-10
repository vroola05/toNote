import { Drag } from '../../../../services/drag/drag-service';
import { Observable } from '../../../../components/util/subscribe';
import { Profile } from '../../../../services/profile/profile-service';

export class TabMenuItem {
    public onDragged: Observable<{from: number, to: number}> = new Observable<{from: number, to: number}>(null);
    public dom: HTMLElement = document.createElement('div');
    private domName: HTMLElement = document.createElement('span');
    private draggableUnlockBtn: HTMLElement;
    protected parentName: string;
    protected identifier: number;
    protected name: string;
    protected color: string|undefined;
    protected object: any;
    private dragenterCount = 0;
    public drag = false;

	constructor(parentName: string, identifier: number, name: string, object: any, color: string | null = null) {
        this.parentName = parentName;
        this.identifier = identifier;
        this.object = object;
        this.color = color;
        this.dom.classList.add('item');

        const itemContainer = document.createElement('span');
        itemContainer.classList.add('itemContainer');
        this.dom.appendChild(itemContainer);

        itemContainer.onclick = (e) => {
            this.click(this, this.identifier, this.name, this.object);
        };

        itemContainer.oncontextmenu = (e) => {
            this.oncontextmenu(e, this, this.identifier, this.name, this.object);
            e.preventDefault();
        };

        if ( color !== null) {
            const itemColor = document.createElement('span');
            itemColor.classList.add('color');
            itemColor.appendChild(this.getIcon(color));
            itemContainer.appendChild(itemColor);
        }

        this.domName.classList.add('name');
        this.setName(name);
        itemContainer.appendChild(this.domName);

        this.draggableUnlockBtn = this.createDraggableUnlockBtn();
        this.dom.appendChild(this.draggableUnlockBtn);


        this.bindDragEvents();
    }

    private createDraggableUnlockBtn() {
        const draggableUnlockBtn = document.createElement('span');
        draggableUnlockBtn.className = 'draggableUnlockBtn';
        this.dom.draggable = this.drag;
        draggableUnlockBtn.onmousedown = () => {
            this.dom.draggable = this.drag;
        };
        draggableUnlockBtn.onmouseup = () => {
            this.dom.draggable = false;
        };

        const bars = document.createElement('span');
        bars.className = 'bars';
        draggableUnlockBtn.appendChild(bars);
        return draggableUnlockBtn;
    }

    public bindDragEvents() {
        this.dom.draggable = this.drag;

        this.dom.ondragenter = (e) => {
            this.dom.style.backgroundColor = 'red';
            if (this.parentName !== Drag.identifier) {
                return;
            }

            if ( this.dragenterCount === 0) {
                this.dom.classList.add('droppable');
            }
            this.dragenterCount++;
        };
        this.dom.ondragleave = (e) => {
            this.dom.style.backgroundColor = '';
            if (this.parentName !== Drag.identifier) {
                return;
            }
            
            this.dragenterCount--;
            if ( this.dragenterCount === 0) {
                this.dom.classList.remove('droppable');
            }
        };
        this.dom.ondragstart = (e) => {
            Drag.identifier = this.parentName;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.identifier.toString());
        };
        this.dom.ondrop = (e) => {
            this.dom.style.backgroundColor = '';
            if (this.parentName !== Drag.identifier) {
                return;
            }
            this.dragenterCount = 0;
            this.dom.classList.remove('droppable');
            
            e.dataTransfer.dropEffect = 'move';
            this.onDragged.next({from: Number(e.dataTransfer.getData('text')), to: this.identifier});
        };
        this.dom.ondragover = (e) => {
            e.preventDefault();
        };
        this.dom.ondragend = (e) => {
            e.preventDefault();
        };
    }

    public setDraggable(drag: boolean) {
        if (drag) {
            this.drag = true;
            this.draggableUnlockBtn.classList.add('show');
        } else {
            this.draggableUnlockBtn.classList.remove('show');
            this.drag = true;
        }
        
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
