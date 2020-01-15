import { EventEmitter } from "events";

export default class HeaderService  {

  private static event = new EventEmitter();

  constructor(){
  }

  public static setTitleMain(title:string): void {
    HeaderService.event.emit("titleMainChange", title);
  }
  public static onTitleMainChange(event: any) {
    HeaderService.event.on("titleMainChange", event);
  }

  public static setTitleSub(title:string): void {
    HeaderService.event.emit("titleSubChange", title);
  }
  public static onTitleSubChange(event: any) {
    HeaderService.event.on("titleSubChange", event);
  }

  public static setBtnLocked(locked:boolean): void {
    HeaderService.event.emit("btnLockedChange", locked);
  }
  public static onBtnLockedChange(event: any) {
    HeaderService.event.on("btnLockedChange", event);
  }
}