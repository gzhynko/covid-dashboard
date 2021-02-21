import APIManager from './APIManager';
import MapManager from './MapManager';

export default class TrackerManager {
  public ApiManager: APIManager;
  public MapManager: MapManager;

  private selectedFlightID: string = '';

  constructor() {
    this.ApiManager = new APIManager();
    this.MapManager = new MapManager(this);
  }

  public Prepare() {
    this.MapManager.InitMap().then(() => {
      this.ApiManager.QueryAllStates().then((value) => this.MapManager.PlaceInitialPlaneMarkers(value));

      this.setUpDataRetrievalInterval();
    });
  }

  public RefreshData() {
    if(!document.hasFocus()) return;

    const mapBounds = this.MapManager.GetMapBounds();

    if(mapBounds === null) {
      this.ApiManager.QueryAllStates().then((value) => this.MapManager.UpdateMarkers(value));
    } else {
      this.ApiManager.QueryStatesWithinBounds(mapBounds).then((value) => this.MapManager.UpdateMarkers(value));
    }
  }

  public GetSelectedFlightID(): string {
    return this.selectedFlightID;
  }

  public FlightClicked(flightID: string): void {
    if(flightID == this.selectedFlightID) return;

    this.selectedFlightID = flightID;
    console.log(flightID);
  }

  public DeselectCurrentFlight(): void {
    this.selectedFlightID = '';
  }

  setUpDataRetrievalInterval(): void {
    setInterval(() => this.RefreshData(), 5000);
  }
}
