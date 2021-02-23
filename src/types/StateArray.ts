import State from "./State";

export default class StateArray extends Array<State> {
  public GetByIcao24(icao24: string): State | null {
    const result = this.filter(state => state.Icao24 == icao24);
    if(result.length == 0) return null;

    return result[0];
  }
}