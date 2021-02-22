import APIManager from './APIManager';
import MapManager from './MapManager';
import UIManager from './UIManager';
import StateArray from '../types/StateArray';

export default class TrackerManager {
  public ApiManager: APIManager;
  public MapManager: MapManager;
  public UIManager: UIManager;

  private selectedFlightID: string = '';

  constructor() {
    this.ApiManager = new APIManager();
    this.MapManager = new MapManager(this);
    this.UIManager = new UIManager;
  }

  public Prepare() {
    this.MapManager.InitMap().then(() => {
      this.startQuery();

      this.ApiManager.QueryAllStates().then((value) => { 
        this.receivedDataUpdate(value);

        this.setUpDataRetrievalInterval();
      });
    });
  }

  public RefreshData() {
    if(!document.hasFocus()) return;

    this.startQuery();
    this.ApiManager.QueryAllStates().then((value) => { 
      this.receivedDataUpdate(value);
    }, (reason) => {
      if(reason != "already_running") {
        console.log("Error while fetching data: " + reason);
      }
    });
  }

  public GetSelectedFlightID(): string {
    return this.selectedFlightID;
  }

  public FlightClicked(flightID: string): void {
    if(flightID == this.selectedFlightID) return;

    this.selectedFlightID = flightID;
    this.UIManager.FlightInfo.SelectFlight(flightID);
  }

  public DeselectCurrentFlight(): void {
    this.selectedFlightID = '';
    this.UIManager.FlightInfo.DeselectFlight();
  }

  private receivedDataUpdate(stateArray: StateArray): void {
    this.MapManager.UpdateMarkers(stateArray);
    this.UIManager.UpdateWithFlightStates(stateArray);

    this.endQuery();
  }

  private setUpDataRetrievalInterval(): void {
    setInterval(() => this.RefreshData(), 5000);
  }

  private startQuery(): void {
    this.UIManager.ToggleLoadingIndicator(true);
  }

  private endQuery(): void {
    this.UIManager.ToggleLoadingIndicator(false);
  }
}
