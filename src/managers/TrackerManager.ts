import APIManager from './APIManager';
import MapManager from './MapManager';
import UIManager from './UIManager';
import StateArray from '../types/StateArray';
import State from '../types/State';

export default class TrackerManager {
  public ApiManager: APIManager;
  public MapManager: MapManager;
  public UIManager: UIManager;

  private selectedFlightID = '';

  constructor() {
    this.ApiManager = new APIManager();
    this.MapManager = new MapManager(this);
    this.UIManager = new UIManager(this);
  }

  public Prepare(): void {
    this.MapManager.InitMap().then(() => {
      this.startQuery();

      this.ApiManager.QueryAllStates().then((value) => { 
        this.receivedDataUpdate(value);

        this.setUpDataRetrievalInterval();
      });
    });
  }

  public RefreshData(): void {
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

  public FlightClicked(flightID: string, state: State | null): void {
    if(flightID == this.selectedFlightID || state === null) return;

    this.selectedFlightID = flightID;
    this.UIManager.FlightInfo.SelectFlight(flightID);

    this.UIManager.UpdateLastPosUpdate(state.LastContact as number | null);
  }

  public DeselectCurrentFlight(): void {
    this.selectedFlightID = '';
    this.UIManager.FlightInfo.DeselectFlight();

    this.UIManager.UpdateLastPosUpdate(null);
  }

  private receivedDataUpdate(stateArray: StateArray): void {
    this.MapManager.UpdateMarkers(stateArray);

    this.UIManager.UpdateWithFlightStates(stateArray);
    this.UIManager.UpdateMapBounds(stateArray, this.MapManager.GetMapBounds());
    this.UIManager.UpdateLastUpdated(new Date());

    if(this.selectedFlightID != '') {
      this.UIManager.UpdateLastPosUpdate(stateArray.GetByIcao24(this.selectedFlightID)?.LastContact as number | null)
    }

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
