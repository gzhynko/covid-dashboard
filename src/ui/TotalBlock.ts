import StateArray from '../types/StateArray';
import UIBlock from './UIBlock';
import LatLngBounds from '../types/LatLngBounds';

export default class TotalBlock extends UIBlock {
  private lastUpdated: Date | null;
  private lastPosUpdate: Date | null;

  private totalPlanesElement: HTMLElement | null;
  private lastUpdatedElement: HTMLElement | null;
  private lastPosUpdateElement: HTMLElement | null;

  constructor() {
    super("total-info");

    this.lastUpdated = null;
    this.lastPosUpdate = null;

    this.totalPlanesElement = document.querySelector(".total-flights .block-value");
    this.lastUpdatedElement = document.querySelector(".last-update .block-value");
    this.lastPosUpdateElement = document.querySelector(".last-pos-update .block-value");

    setInterval(() => this.secondTick(), 1000);
  }

  public UpdateWithFlightStates(): void { 
    // nothing here
  }

  public UpdateLastUpdated(lastUpdated: Date): void {
    this.lastUpdated = lastUpdated;
  }

  public UpdateLastPosUpdate(lastUpdate: Date | null): void {
    this.lastPosUpdate = lastUpdate;
  }

  public UpdateTotal(flightState: StateArray, mapBounds: LatLngBounds | null): void {
    if(this.totalPlanesElement === null) return;

    const totalPlanes = flightState.length;
    let planesInMapBounds = 0;

    if(mapBounds != null) {
      flightState.forEach(state => {
        if(mapBounds.InBounds(state.Coordinate)) {
          planesInMapBounds++;
        }
      });
    }

    this.totalPlanesElement.innerHTML = totalPlanes + ' (' + planesInMapBounds + ')';
  }

  private secondTick(): void {
    if(this.lastUpdated === null || this.lastUpdatedElement === null) return;

    const secondsTillLastUpdated = (new Date().getTime() - this.lastUpdated.getTime()) / 1000;

    this.lastUpdatedElement.innerHTML = Math.floor(secondsTillLastUpdated) + 's';

    if(this.lastPosUpdateElement === null) return;

    if(this.lastPosUpdate === null) {
      this.lastPosUpdateElement.innerHTML = 'N/As';

      return;
    }

    const secondsTillLastPosUpdate = (new Date().getTime() - this.lastPosUpdate.getTime()) / 1000;

    this.lastPosUpdateElement.innerHTML = Math.floor(secondsTillLastPosUpdate) + 's';
  }
}
