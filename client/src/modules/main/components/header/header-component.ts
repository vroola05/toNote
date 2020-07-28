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

import ButtonIconComponent from '../../../../components/controls/buttons/button-icon/button-icon-component';
import ButtonToggleComponent from '../../../../components/controls/buttons/button-toggle/button-toggle-component';
import ButtonDropdownComponent from '../../../../components/controls/buttons/button-dropdown/button-dropdown-component';
import MenuItemComponent from '../../../../components/controls/menu-item/menu-item-component';

import TitleComponent from './components/title/title-component';
import MainModule from '../../main-module';
import HeaderService from '../../services/header-service';
import { MainState, TabEnum } from '../../../../types';
import MainService from '../../services/main-service';


export default class HeaderComponent {
  public dom: HTMLElement = document.createElement('div');

  private btnBack: ButtonIconComponent;
  private btnLock: ButtonIconComponent;

  private btnLeftContainer: HTMLElement = document.createElement('div');
  private btnRightContainer: HTMLElement = document.createElement('div');
  private titleContainer: HTMLElement = document.createElement('div');

  private mainModule: MainModule;
  private titleComponent: TitleComponent = new TitleComponent();

  constructor(mainModule: MainModule) {
    this.mainModule = mainModule;
    this.dom.className = 'header';

    this.createMenuLeft();
    this.createTitles();
    this.createMenuRight();

    HeaderService.onTitleMainChange((title: string) => {
      this.setMainTitle(title);
    });

    HeaderService.onTitleSubChange((title: string) => {
      this.setSubTitle(title);
    });

    this.setOnStateChange();
  }

  private createMenuLeft(): void {
    this.btnLeftContainer.className = 'btnLeftContainer';
    this.dom.appendChild(this.btnLeftContainer);

    this.btnBack = this.addMenuItem(new ButtonIconComponent(svgHome, Lang.get('header_icon_back'), (item: any) => {
      MainService.back();
    }));

    this.btnLock = this.addMenuItem(new ButtonToggleComponent({
      open: { icon: svgUnlocked, description: Lang.get('header_icon_unlocked') },
      closed: { icon: svgLocked, description: Lang.get('header_icon_locked') }
    }, (event: any, item: ButtonToggleComponent) => {
      HeaderService.setBtnLocked(item.isOpened);
    }));
  }

  private createMenuRight(): void {
    this.btnRightContainer.className = 'btnRightContainer';
    this.dom.appendChild(this.btnRightContainer);

    this.addAltMenuItem(new ButtonDropdownComponent(svgSearch, Lang.get('header_icon_search'), (item: any) => {
    }));

    const btnMenu = this.addAltMenuItem(new ButtonDropdownComponent(svgMenu, Lang.get('header_icon_menu'), (e: Event, item: any) => {
    })) as ButtonDropdownComponent;

    btnMenu.addItem(new MenuItemComponent(svgSettings, Lang.get('header_menu_settings'), (e: any) => {
      Router.set({ key: 'settings', value: null }, Lang.get('state_title_settings'), 'settings');
    }));

    btnMenu.addItem(new MenuItemComponent(svgLogout, Lang.get('header_menu_logout'), (e: any) => {
      new LoginService().logout().then(() => {
        Router.set({ key: 'login', value: null }, Lang.get('state_title_login'), 'login');
      }).catch(() => { });
    }));
  }

  private createTitles(): void {
    this.titleContainer.className = 'titleContainer';
    this.titleContainer.appendChild(this.titleComponent.dom);
    this.dom.appendChild(this.titleContainer);
  }

  public setOnStateChange(): void {
    MainService.onMainStateChange((mainState: MainState) => {
      if (MainService.getCurrentMainState() === TabEnum.Notebooks) {
        this.btnBack.hide();
      } else {
        this.btnBack.show();
      }

      if (MainService.getCurrentMainState() !== TabEnum.Note) {
        this.btnLock.hide();
      } else {
        this.btnLock.show();
      }
    });
  }

  public addMenuItem(buttonComponent: ButtonIconComponent): ButtonIconComponent {
    this.btnLeftContainer.appendChild(buttonComponent.dom);
    return buttonComponent;
  }

  public addAltMenuItem(buttonComponent: ButtonIconComponent) {
    this.btnRightContainer.appendChild(buttonComponent.dom);
    return buttonComponent;
  }

  public setMainTitle(title: string) {
    this.titleComponent.setMainTitle(title);
  }

  public setSubTitle(title: string) {
    this.titleComponent.setSubTitle(title);
  }
}
