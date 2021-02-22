import * as MapBoxGL from 'mapbox-gl';
import Constants from '../Constants';
import State from '../types/State';
import LatLngBounds from '../types/LatLngBounds';
import Coordinate from '../types/Coordinate';
import TrackerManager from './TrackerManager';

export default class MapManager {
  public Map: MapBoxGL.Map | undefined;
  public SelectedFlight = "";

  private markersLayer = "markers";
  private markersSource = "markers";

  private lastClickedMouseX = 0;
  private lastClickedMouseY = 0;

  private trackerManager: TrackerManager;

  constructor(trackerManager: TrackerManager) {
    this.trackerManager = trackerManager;
  }

  public InitMap(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.Map = new MapBoxGL.Map({
        accessToken: Constants.MapAccessToken,
        container: document.querySelector('#map') as HTMLElement,
        style: 'mapbox://styles/mapbox/outdoors-v11'
      });

      this.GetMap().dragRotate.disable();
      this.GetMap().touchZoomRotate.disableRotation();

      this.GetMap().on('load', () => {
        this.GetMap().loadImage("./images/plane_marker.png", (error, image) => {
          if(image === undefined) return;

          this.GetMap().addImage("plane-marker", image);
        });

        this.GetMap().addSource(this.markersSource, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        this.GetMap().addLayer({
          'id': this.markersLayer,
          'type': 'symbol',
          'source': this.markersSource,
          'layout': {
            'icon-image': ["get", "icon"],
            'icon-allow-overlap': true,
            'icon-size': 1.2,
            'icon-rotate': ["get", "rotation"]
          }
        });

        this.setUpMarkerEvents();
        
        resolve();
      });
    });
  }

  public UpdateMarkers(flightStates: Array<State>): void {
    this.placeMarkers(flightStates);
  }

  public GetMapBounds(): LatLngBounds | null {
    const mapBounds = this.Map?.getBounds();
    const southWestCoordinate = mapBounds?.getSouthWest();
    const northEastCoordinate = mapBounds?.getNorthEast();

    if(mapBounds === undefined || southWestCoordinate === undefined || northEastCoordinate === undefined) return null;

    return new LatLngBounds(new Coordinate(southWestCoordinate.lat, southWestCoordinate.lng), new Coordinate(northEastCoordinate.lat, northEastCoordinate.lng));
  }

  public GetMarkerByIcao24(icao24: string): any {
    (this.GetMap().getSource(this.markersSource) as any)._data.features.forEach((feature: any) => {
      if(feature.properties.icao24 == icao24){
        return feature;
      }
    });
  }

  placeMarkers(flightStates: Array<State>): void {
    let featureCollection = [];

    for (let i = 0; i < flightStates.length; i++) {
      const flightState = flightStates[i];
      if(flightState.Coordinate == null || flightState.Coordinate.AnyValueNull()) continue;
      
      let feature = {
        'type': "Feature" as any,
        'properties': {
          'id': flightState.Icao24,
          'rotation': flightState.TrueTrack,
          'icon': 'plane-marker'
        },
        'geometry': {
          'type': 'Point' as any,
          'coordinates': [flightState.Coordinate.Longitude as number, flightState.Coordinate.Latitude as number]
        }
      }

      featureCollection.push(feature);
    }

    (this.GetMap().getSource(this.markersSource) as any).setData({
      type: "FeatureCollection",
      features: featureCollection
    });
  }

  setUpMarkerEvents(): void {
    this.GetMap().on('mouseover', this.markersLayer, (e) => {
      this.GetMap().getCanvas().style.cursor = 'pointer';
    });

    this.GetMap().on('mouseleave', this.markersLayer, (e) => {
      this.GetMap().getCanvas().style.cursor = '';
    });

    this.GetMap().on('click', this.markersLayer, (e) => {
      this.lastClickedMouseX = e.point.x;
      this.lastClickedMouseY = e.point.y;

      if(e.features === undefined || e.features[0].properties === null) return;

      this.trackerManager.FlightClicked(e.features[0].properties.id);
    });

    this.GetMap().on('click', (e) => {
      if(this.lastClickedMouseX == e.point.x && this.lastClickedMouseY == e.point.y) return;

      this.trackerManager.DeselectCurrentFlight();
    });
  }

  public GetMap(): MapBoxGL.Map {
    return this.Map as MapBoxGL.Map;
  }
}
