import Coordinate from './Coordinate';
import { PositionSource } from './PositionSource';

export default class State {
  public Icao24: string;
  public Callsign: string | null;
  public OriginCountry: string;
  public TimePosition: number;
  public LastContact: number;
  public Coordinate: Coordinate | null;
  public BaroAltitude: number | null;
  public OnGround: boolean;
  public GroundSpeed: number | null;
  public TrueTrack: number | null;
  public VerticalSpeed: number | null;
  public Sensors: number[] | null;
  public GeoAltitude: number | null;
  public Squawk: number | null;
  public SpecialPurposeIndicator: boolean;
  public PositionSource: PositionSource;


  constructor(
    icao24: string, 
    callsign: string | null, 
    originCountry: string, 
    timePosition: number, 
    lastContact: number, 
    coordinate: Coordinate | null, 
    baroAltitude: number | null, 
    onGround: boolean, 
    groundSpeed: number | null, 
    trueTrack: number | null, 
    verticalSpeed: number | null, 
    sensors: number[] | null, 
    geoAltitude: number | null, 
    squawk: number | null, 
    specialPurposeIndicator: boolean, 
    positionSource: PositionSource
) {
    this.Icao24 = icao24
    this.Callsign = callsign
    this.OriginCountry = originCountry
    this.TimePosition = timePosition
    this.LastContact = lastContact
    this.Coordinate = coordinate
    this.BaroAltitude = baroAltitude
    this.OnGround = onGround
    this.GroundSpeed = groundSpeed
    this.TrueTrack = trueTrack
    this.VerticalSpeed = verticalSpeed
    this.Sensors = sensors
    this.GeoAltitude = geoAltitude
    this.Squawk = squawk
    this.SpecialPurposeIndicator = specialPurposeIndicator
    this.PositionSource = positionSource
  }
}

export class JsonState {
  public icao24: string;
  public callsign: string | null;
  public origin_country: string;
  public time_position: number;
  public last_contact: number;
  public longitude: number | null;
  public latitude: number | null;
  public baro_altitude: number | null;
  public on_ground: boolean;
  public velocity: number | null;
  public true_track: number | null;
  public vertical_rate: number | null;
  public sensors: number[] | null;
  public geo_altitude: number | null;
  public squawk: number | null;
  public spi: boolean;
  public position_source: number;


  constructor(
    icao24: string, 
    callsign: string | null, 
    originCountry: string, 
    timePosition: number, 
    lastContact: number, 
    longitude: number | null,
    latitude: number | null ,
    baroAltitude: number | null, 
    onGround: boolean, 
    groundSpeed: number | null, 
    trueTrack: number | null, 
    verticalSpeed: number | null, 
    sensors: number[] | null, 
    geoAltitude: number | null, 
    squawk: number | null, 
    specialPurposeIndicator: boolean, 
    positionSource: number
) {
    this.icao24 = icao24
    this.callsign = callsign
    this.origin_country = originCountry
    this.time_position = timePosition
    this.last_contact = lastContact
    this.latitude = latitude;
    this.longitude = longitude;
    this.baro_altitude = baroAltitude
    this.on_ground = onGround
    this.velocity = groundSpeed
    this.true_track = trueTrack
    this.vertical_rate = verticalSpeed
    this.sensors = sensors
    this.geo_altitude = geoAltitude
    this.squawk = squawk
    this.spi = specialPurposeIndicator
    this.position_source = positionSource
  }
  
  public ToState(): State {
    return new State(this.icao24, this.callsign, this.origin_country, this.time_position, this.last_contact, 
      new Coordinate(this.latitude, this.longitude), this.baro_altitude, this.on_ground, 
      this.velocity, this.true_track, this.vertical_rate, this.sensors, this.geo_altitude, this.squawk, 
      this.spi, this.position_source)
  }
}