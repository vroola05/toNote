import { MainState, TabEnum } from "../../../types";
import { Router } from "../../../services/router/router-service";
import Lang from "../../../components/language/lang";
import { EventEmitter } from "events";

export default class MainService {
  private static event = new EventEmitter();
  
  private static currentMainState: number;

  constructor() {
  }

  public static setCurrentMainState(mainState: MainState) : number {
    if (mainState.notebook != null && mainState.notebook.id != null) {
      if (mainState.chapter != null && mainState.chapter.id != null) {
        if (mainState.note != null && mainState.note.id != null) {
          MainService.currentMainState = TabEnum.Note;
        } else {
          MainService.currentMainState = TabEnum.Notes;
        }
      } else {
        MainService.currentMainState = TabEnum.Chapters;
      }
    } else {
      MainService.currentMainState = TabEnum.Notebooks;
    }

    MainService.mainStateChanged(mainState);

    return MainService.currentMainState;
  }

  public static mainStateChanged(mainState: MainState) : void {
    MainService.event.emit("mainStateChanged", mainState);
  }
  public static onMainStateChange(event: any) : void {
    MainService.event.on("mainStateChanged", event);
  }

  public static getCurrentMainState(): number {
    return MainService.currentMainState;
  }


  public static back(): void {
    let state = Router.getCurrentState();
    const mainState = state.value as MainState;
    let currentState = MainService.getCurrentMainState();

    let title = "";
    let url = "";

    const newState = new MainState();

    if (currentState === TabEnum.Note) {
      newState.notebook = mainState.notebook;
      newState.chapter = mainState.chapter;
      title = Lang.get("state_title_notes");
      url = "main/" + mainState.notebook.id + "/" + mainState.chapter.id + "/" + mainState.note.id;
    } else if (currentState === TabEnum.Notes) {
      newState.notebook = mainState.notebook;
      title = Lang.get("state_title_chapters");
      url = "main/" + mainState.notebook.id + "/" + mainState.chapter.id;
    } else if (currentState === TabEnum.Chapters) {
      title = Lang.get("state_title_notebooks");
      url = "main/" + mainState.notebook.id;
    } else {
      return;
    }

    state.value = newState;
    Router.set(state, title, url);
    MainService.deviceLayoutChanged();
  }

  public static onDeviceLayoutChange(event: any) : void {
    MainService.event.on("deviceLayoutChange", event);
  }
  public static deviceLayoutChanged() : void {
    MainService.event.emit("deviceLayoutChange");
  }
}