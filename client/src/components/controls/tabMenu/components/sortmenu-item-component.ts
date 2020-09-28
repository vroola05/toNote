import svgAsc from '../../../../assets/images/sort-asc.svg';
import svgDesc from '../../../../assets/images/sort-desc.svg';

import { EventEmitter } from 'events';
import { Sort, SortEnum } from '../../../../types';
import CheckboxComponent from './checkbox-component';

export default class SortmenuItemComponent {
    private checkbox = new CheckboxComponent();
    private iconAsc = document.createElement('img');
    private iconDesc = document.createElement('img');

    private _selected: boolean = false;
    public name: string;
    public sort: Sort;

    public dom: HTMLElement = document.createElement('div');
    
    public get selected(): boolean {
        return this._selected;
      }

      public set selected(selected: boolean) {
        this._selected  = selected;
        this.checkbox.checked = selected;
        if (!selected) {
            this.iconAsc.classList.add('hidden');
            this.iconDesc.classList.add('hidden');
        }
      }

    constructor(name: string, sort: Sort) {
        this.name = name;
        this.sort = sort;

        this.dom.className = 'menuItem sort';
        this.dom.append(this.checkbox.dom);

        const nameContainer = document.createElement('span');
        nameContainer.className = 'nameContainer';
        nameContainer.innerHTML = name;
        this.dom.appendChild(nameContainer);

        const sortIconContainer = document.createElement('span');
        sortIconContainer.className = 'iconContainer';
        this.dom.appendChild(sortIconContainer);

        this.iconAsc.className = 'icon';
        this.iconAsc.src = svgAsc;
        this.iconAsc.classList.add('hidden');
        sortIconContainer.appendChild(this.iconAsc);

        this.iconDesc.className = 'icon';
        this.iconDesc.src = svgDesc;
        this.iconDesc.classList.add('hidden');
        sortIconContainer.appendChild(this.iconDesc);

        this.dom.onclick = (e) => {
            if (this._selected) {
                if (this.sort.sort === SortEnum.ASC) {
                    this.setSort(SortEnum.DESC);
                } else {
                    this.setSort(SortEnum.ASC);
                }
            } else {
                this.iconAsc.classList.remove('hidden');
            }
            this.selected = true;
            this.click(this, e);
        };
    }

    public get classList(): DOMTokenList {
        return this.dom.classList;
    }

    public setSort(sort: SortEnum) {
        if (sort === SortEnum.ASC) {
            this.iconAsc.classList.remove('hidden');
            this.iconDesc.classList.add('hidden');
        } else {
            this.iconAsc.classList.add('hidden');
            this.iconDesc.classList.remove('hidden');
        }
        this.sort.sort = sort;
    }

    public getIdentifier(): string {
        return this.sort.identifier;
    }

    public click(buttonComponent: SortmenuItemComponent, e: Event) {
        console.error('Method not yet implemented!');
    }
}
