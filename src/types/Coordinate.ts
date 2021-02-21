export default class Coordinate {
  public Latitude: number | null;
  public Longitude: number | null;

  constructor(latitude: number | null, longitude: number | null) {
    this.Latitude = latitude;
    this.Longitude = longitude;
  }

  public AnyValueNull(): boolean {
    return this.Latitude === null || this.Longitude === null;
  }
}