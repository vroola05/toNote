import { SessionState } from './config/types';


export default class StateService {

  
  constructor() {
  }

  public static setSessionState(sessionState: SessionState): void {
    sessionStorage.setItem('state', JSON.stringify(sessionState));
  }

  public static getSessionState(): SessionState {
    const state = sessionStorage.getItem('state');
    if (state) {
      return JSON.parse(state) as SessionState;
    } else {
      return {
        locked: false
      };
    }
  }

  public static getLocked(): boolean {
    return StateService.getSessionState().locked;
  }

  public static setLocked(locked: boolean): void {
    const state = StateService.getSessionState();
    state.locked = locked;
    StateService.setSessionState(state);
  }

  public static clear(): void {
    sessionStorage.clear();
  }
}
