import Coordinate from './Coordinate';

export default class LatLngBounds {
  public SouthWestCorner: Coordinate; // lat min, long min
  public NorthEastCorner: Coordinate; // lat max, long max

  constructor(southWestCorner: Coordinate, northEastCorner: Coordinate) {
    this.SouthWestCorner = southWestCorner;
    this.NorthEastCorner = northEastCorner;
  }
}