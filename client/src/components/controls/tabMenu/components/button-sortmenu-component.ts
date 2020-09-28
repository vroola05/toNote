import svgSort from '../../../../assets/images/sort.svg';
import ButtonIconComponent from '../../buttons/button-icon/button-icon-component';
import { Resize } from '../../../../services/resize/resize-service';
import Lang from '../../../language/lang';
import SortmenuComponent from './sortmenu-component';
import {EventEmitter} from 'events';
import SortmenuItemComponent from './sortmenu-item-component';
import { AuthenticationService } from '../../../../services/authentication/authentication-service';
import { Sort, SortEnum } from '../../../../types';

export default class ButtonSortmenuComponent extends ButtonIconComponent {
    public isOpened: boolean = false;
    public sortmenuComponent: SortmenuComponent = new SortmenuComponent();
    public event = new EventEmitter();
    private id: string;

    constructor(id: string) {
        super(svgSort, Lang.get('order_btn_alt'), (item: any) => {
        }, 'small btnSort');
        this.id = id;

        AuthenticationService.getUserAsObservable().subscribe((user) => {
            if (user && user.sort) {
                const sort = user.sort.find(s => s.name === id);
                if (sort) {
                    this.sortmenuComponent.selectItem(sort);
                }
            }
        });
        
        this.sortmenuComponent.event.on('change', (sort: Sort) => {
            sort.name = this.id;
            this.event.emit('change', sort);
        });

        this.sortmenuComponent.event.on('close', (value) => {
            this.isOpened = false;
            this.dom.classList.remove('active');
            this.sortmenuComponent.hide();
            Resize.remove('dropdown');
        });
    }

    public addItem(title: string, identifier: string, sort: SortEnum) {
        this.sortmenuComponent.addItem(new SortmenuItemComponent(title, new Sort(identifier, sort)));
    }

    private setPosition() {
        const boundingBox = this.dom.getBoundingClientRect();
        this.sortmenuComponent.setPosition(boundingBox.left, boundingBox.top + boundingBox.height);
    }

    public onClick(event: MouseEvent, buttonComponent: ButtonIconComponent) {
        this.isOpened = !this.isOpened;
        if (this.isOpened) {
            this.dom.classList.add('active');
            this.sortmenuComponent.show();
            this.setPosition();
            Resize.set('dropdown', () => {
                this.setPosition();
            });
        }
    }

    /*public addItem( menuItemComponent: SortmenuItemComponent) {
        this.sortmenuComponent.addItem(menuItemComponent);
    }*/
}
