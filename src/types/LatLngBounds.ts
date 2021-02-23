import Coordinate from './Coordinate';

export default class LatLngBounds {
  public SouthWestCorner: Coordinate; // lat min, long min
  public NorthEastCorner: Coordinate; // lat max, long max

  constructor(southWestCorner: Coordinate, northEastCorner: Coordinate) {
    this.SouthWestCorner = southWestCorner;
    this.NorthEastCorner = northEastCorner;
  }

  public InBounds(coordinate: Coordinate | null): boolean {
    if(coordinate === null) return false;
    if(coordinate.AnyValueNull()) return false;

    const latitudeIn = (coordinate.Latitude as number) >= (this.SouthWestCorner.Latitude as number) 
      && (coordinate.Latitude as number) <= (this.NorthEastCorner.Latitude as number);

    const longitudeIn = (coordinate.Longitude as number) >= (this.SouthWestCorner.Longitude as number) 
    && (coordinate.Longitude as number) <= (this.NorthEastCorner.Longitude as number);

    return latitudeIn && longitudeIn;
  }
}