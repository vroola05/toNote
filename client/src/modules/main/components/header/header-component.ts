import svgHome from '../../../../assets/images/back.svg';
import svgLocked from '../../../../assets/images/locked.svg';
import svgUnlocked from '../../../../assets/images/unlocked.svg';
import svgSearch from '../../../../assets/images/search.svg';
import svgMenu from '../../../../assets/images/menu.svg';
import svgSettings from '../../../../assets/images/settings.svg';
import svgLogout from '../../../../assets/images/logout.svg';

import Lang from '../../../../components/language/lang';

import { Router } from '../../../../services/router/router-service';
import { LoginService } from '../../../../services/http/login-service';

import ButtonIconComponent from '../../../../components/controls/button-icon/button-icon-component';
import ButtonToggleComponent from '../../../../components/controls/button-toggle/button-toggle-component';
import ButtonDropdownComponent from '../../../../components/controls/button-dropdown/button-dropdown-component';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';

import TitleComponent from './components/title/title-component';
import MainModule from '../../main-module';


export default class HeaderComponent  {
    public dom: HTMLElement = document.createElement("div");
    private btnLeftContainer: HTMLElement = document.createElement("div");
    private btnRightContainer: HTMLElement = document.createElement("div");
    private titleContainer: HTMLElement = document.createElement("div");

    private mainModule: MainModule;
    private titleComponent: TitleComponent = new TitleComponent();
    
    private buttonComponents: Array<ButtonIconComponent> = new Array();

    constructor(mainModule: MainModule){
        this.mainModule = mainModule;
        this.dom.className = "header";

        this.btnLeftContainer.className = "btnLeftContainer";
        this.titleContainer.className = "titleContainer";
        this.titleContainer.appendChild(this.titleComponent.dom);
        this.btnRightContainer.className = "btnRightContainer";

        this.dom.appendChild(this.btnLeftContainer);
        this.dom.appendChild(this.titleContainer);
        this.dom.appendChild(this.btnRightContainer);

        //////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////

        //
        this.addMenuItem(new ButtonIconComponent(svgHome, Lang.get("header_icon_back"), (item:any) => {
            this.mainModule.back();
            this.mainModule.setDeviceLayout();
        }));

        //
        this.addMenuItem(new ButtonToggleComponent({
            open:{icon:svgUnlocked, description: Lang.get("header_icon_unlocked")},
            closed:{icon:svgLocked, description: Lang.get("header_icon_locked")}
        }, (item:ButtonToggleComponent) => {
            console.log(item.isOpened);
        }));
        
        //
        this.addAltMenuItem(new ButtonDropdownComponent(svgSearch, Lang.get("header_icon_search"), (item:any) => {
            console.log(item.isOpened);
        }));

        //////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////
        //

        const btnMenu= new ButtonDropdownComponent(svgMenu, Lang.get("header_icon_menu"), (e:Event, item:any) => {
            console.log(item.isOpened);
        });
        this.addAltMenuItem(btnMenu);

        btnMenu.addItem(new MenuItemComponent(svgSettings, Lang.get("header_menu_settings"), (e:any) => {
            Router.set({ "key" : "settings", value : mainModule.state}, Lang.get("state_title_settings"),"settings");
        }));
        btnMenu.addItem(new MenuItemComponent(svgLogout, Lang.get("header_menu_logout"), (e:any) => {
            new LoginService().logout().then(()=>{
                Router.set({ "key" : "login", "value" : null}, Lang.get("state_title_login"),"login");
            }).catch(() => {});;
        }));

    }

    public addMenuItem(buttonComponent: ButtonIconComponent){
        this.buttonComponents.push(buttonComponent);
        this.btnLeftContainer.appendChild(buttonComponent.dom);
    }

    public addAltMenuItem(buttonComponent: ButtonIconComponent){
        this.buttonComponents.push(buttonComponent);
        this.btnRightContainer.appendChild(buttonComponent.dom);
    }

    public setMainTitle(title: string){
        this.titleComponent.setMainTitle(title);
    }
    public setSubTitle(title: string){
        this.titleComponent.setSubTitle(title);
    }
}
