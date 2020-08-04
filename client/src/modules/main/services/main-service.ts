import { MainState, TabEnum } from '../../../types';
import { Router } from '../../../services/router/router-service';
import Lang from '../../../components/language/lang';
import { EventEmitter } from 'events';

export default class MainService {
  private static event = new EventEmitter();
  
  private static currentMainState: number;

  constructor() {
  }

  public static setCurrentMainState(currentState: number): number {
    MainService.currentMainState = currentState;
    MainService.mainStateChanged();

    return MainService.currentMainState;
  }

  public static mainStateChanged(): void {
    MainService.event.emit('mainStateChanged', MainService.currentMainState);
  }

  public static onMainStateChange(event: any): void {
    MainService.event.on('mainStateChanged', event);
  }

  public static getCurrentMainState(): number {
    const params = Router.getUrlparameters();
    return (params.length === 4 ? TabEnum.Note : params.length === 3 ? TabEnum.Notes : params.length === 2 ? TabEnum.Chapters : TabEnum.Notebooks);
  }

  public static back(): void {
    const module = Router.getCurrentModule();
    const params = Router.getUrlparameters();

    if (params && params.length > 1) {
      params.pop();
    }

    const currentState = MainService.getCurrentMainState();
    
    let title = '';
    const url = params.join('/');

    if (currentState === TabEnum.Note) {
      title = Lang.get('state_title_notes');
    } else if (currentState === TabEnum.Notes) {
      title = Lang.get('state_title_chapters');
    } else if (currentState === TabEnum.Chapters) {
      title = Lang.get('state_title_notebooks');
    } else {
      title = Lang.get('state_title_notebooks');
    }

    Router.set(module, title, url);
    MainService.deviceLayoutChanged();
  }

  public static onDeviceLayoutChange(event: any): void {
    MainService.event.on('deviceLayoutChange', event);
  }

  public static deviceLayoutChanged(): void {
    MainService.event.emit('deviceLayoutChange');
  }
}
