import UIBlock from '../ui/UIBlock';
import FlightInfoBlock from '../ui/FlightInfoBlock';
import StateArray from '../types/StateArray';

export default class UIManager {
  public FlightInfo: FlightInfoBlock;

  private loadingIndicatorElement: HTMLElement | null;

  constructor() {
    this.loadingIndicatorElement = document.querySelector(".header-loading-indicator");

    this.FlightInfo = new FlightInfoBlock();
  }

  public UpdateWithFlightStates(flightStates: StateArray): void {
    this.FlightInfo.UpdateWithFlightStates(flightStates);
  }

  public ToggleLoadingIndicator(state: boolean): void {
    if(this.loadingIndicatorElement === null) return;

    this.loadingIndicatorElement.style.opacity = Number(state).toString();
  }
}
