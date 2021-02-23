import State from '../types/State';
import StateArray from '../types/StateArray';
import UIBlock from './UIBlock';

export default class FlightInfoBlock extends UIBlock {
  private selectedFlight: State | null;
  private selectedFlightIcao24: string;
  private latestStatesData: StateArray;

  private noFlightSelectedElement: HTMLElement | null;
  private flightInfoElement: HTMLElement | null;
  private flightInfoTable: HTMLElement | null;

  constructor() {
    super("flight-info");

    this.selectedFlight = null;
    this.selectedFlightIcao24 = '';
    this.latestStatesData = new StateArray();

    this.noFlightSelectedElement = document.querySelector(".flight-info__no-flight");
    this.flightInfoElement = document.querySelector(".flight-info__info");
    this.flightInfoTable = document.querySelector(".flight-info-table");
  }

  public UpdateWithFlightStates(flightStates: StateArray): void {
    this.latestStatesData = flightStates;

    this.selectedFlight = flightStates.GetByIcao24(this.selectedFlightIcao24);
    if(this.selectedFlight === null) {
      this.DeselectFlight();

      return;
    }

    this.ConstructAndUpdateTableData(this.latestStatesData, this.selectedFlightIcao24);
  }

  public SelectFlight(flightIcao24: string): void {
    if(this.noFlightSelectedElement === null || this.flightInfoElement === null) return;

    this.selectedFlightIcao24 = flightIcao24;
    this.selectedFlight = this.latestStatesData.GetByIcao24(flightIcao24);

    this.ConstructAndUpdateTableData(this.latestStatesData, flightIcao24);

    this.flightInfoElement.style.display = 'block';
    this.noFlightSelectedElement.style.display = 'none';
  }

  public DeselectFlight(): void {
    if(this.noFlightSelectedElement === null || this.flightInfoElement === null) return;

    this.selectedFlightIcao24 = '';
    this.selectedFlight = null;

    this.flightInfoElement.style.display = 'none';
    this.noFlightSelectedElement.style.display = 'flex';
  }

  private ConstructAndUpdateTableData(statesArray: StateArray, flightIcao24: string): void {
    if(this.flightInfoTable === null) return;

    // we assume the state is not null here as this method is only called when the state exists.
    const state = statesArray.GetByIcao24(flightIcao24) as State;
    const stateKeyValueArray = state.ToKeyValueArrayForTable();
    
    // remove table rows
    this.flightInfoTable.textContent = '';

    stateKeyValueArray.forEach(item => {
      this.flightInfoTable?.appendChild(this.ConstructTableRow(item.Key, item.Value));
    });
  }

  private ConstructTableRow(key: string, value: string): HTMLTableRowElement {
    const row = document.createElement('tr');
    const leftColumn = document.createElement('td');
    const rightColumn = document.createElement('td');

    leftColumn.classList.add("left-column");
    rightColumn.classList.add("right-column");

    leftColumn.innerHTML = key;
    rightColumn.innerHTML = value;

    row.appendChild(leftColumn);
    row.appendChild(rightColumn);

    return row;
  }
}