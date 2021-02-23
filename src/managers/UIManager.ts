import FlightInfoBlock from '../ui/FlightInfoBlock';
import StateArray from '../types/StateArray';
import TotalBlock from '../ui/TotalBlock';
import LatLngBounds from '../types/LatLngBounds';
import MapBlock from '../ui/MapBlock';
import FlightsBlock from '../ui/FlightsBlock';
import TrackerManager from './TrackerManager';

export default class UIManager {
  public FlightInfo: FlightInfoBlock;
  public Total: TotalBlock;
  public MapBlock: MapBlock;
  public FlightsBlock: FlightsBlock;

  private loadingIndicatorElement: HTMLElement | null;

  // used in FlightsBlock.ts
  private trackerManager: TrackerManager;

  constructor(trackerManager: TrackerManager) {
    this.loadingIndicatorElement = document.querySelector(".header-loading-indicator");

    this.trackerManager = trackerManager;

    this.FlightInfo = new FlightInfoBlock();
    this.Total = new TotalBlock();
    this.MapBlock = new MapBlock();
    this.FlightsBlock = new FlightsBlock(trackerManager);
  }

  public UpdateWithFlightStates(flightStates: StateArray): void {
    this.FlightInfo.UpdateWithFlightStates(flightStates);
    this.FlightsBlock.UpdateWithFlightStates(flightStates);
  }

  public UpdateMapBounds(flightStates: StateArray, mapBounds: LatLngBounds | null): void {
    this.Total.UpdateTotal(flightStates, mapBounds);
  }

  public UpdateLastUpdated(lastUpdated: Date): void {
    this.Total.UpdateLastUpdated(lastUpdated);
  }

  public UpdateLastPosUpdate(lastUpdate: number | null): void {
    if(lastUpdate === null) { 
      this.Total.UpdateLastPosUpdate(null);
      return;
    }

    const date = new Date(lastUpdate * 1000);

    this.Total.UpdateLastPosUpdate(date);
  }

  public ToggleLoadingIndicator(state: boolean): void {
    if(this.loadingIndicatorElement === null) return;

    this.loadingIndicatorElement.style.opacity = Number(state).toString();
  }
}
