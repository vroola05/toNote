
import ButtonComponent from '../button-icon/button-icon-component';

export default class ButtonToggleComponent extends ButtonComponent {
    public isOpened: boolean = true;
    private icons: any;
    constructor( icons: {open: {icon: any, description: string|undefined}, closed: {icon: any, description: string|undefined}}, click: any | undefined, isOpened: boolean = true ) {
        super(icons.open.icon, icons.open.description, click);
        this.icons = icons;
        this.isOpened = isOpened;
        this.setBtnState();
    }

    public onClick(event: Event, buttonComponent: ButtonComponent) {
        this.isOpened = !this.isOpened;
        this.setBtnState();
    }

    private setBtnState(): void {
        if (this.isOpened) {
            this.set(this.icons.open.icon, this.icons.open.description);
        } else {
            this.set(this.icons.closed.icon, this.icons.closed.description);
        }
    }
}
