import State from "../types/State";

export default abstract class UIBlock {
  domElement: HTMLElement | null;

  constructor(domElementID: string) {
    this.domElement = document.getElementById(domElementID);
  }

  public abstract UpdateWithFlightStates(flightStates: Array<State>): void;
}