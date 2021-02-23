import UIBlock from "./UIBlock";

export default class MapBlock extends UIBlock {
  constructor() {
    super("map");
  }

  public UpdateWithFlightStates(): void {
    // all the map logic is in MapManager.ts
  }
}