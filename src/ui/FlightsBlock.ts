import State from '../types/State';
import StateArray from '../types/StateArray';
import UIBlock from './UIBlock';
import * as countryLookup from 'country-code-lookup';
import TrackerManager from '../managers/TrackerManager';

export default class FlightsBlock extends UIBlock {
  private displayedStates: StateArray;

  private noFlightsElement: HTMLElement | null;
  private flightsElement: HTMLElement | null;
  private flightsArrayElement: HTMLElement | null;
  private searchElement: HTMLInputElement | null;

  private currentSearchQuery = '';

  private trackerManager: TrackerManager;

  constructor(trackerManager: TrackerManager) {
    super("flights");

    this.displayedStates = new StateArray();

    this.trackerManager =  trackerManager;

    this.noFlightsElement = document.querySelector(".flights__no-flights");
    this.flightsElement = document.querySelector(".flights__flights");
    this.flightsArrayElement = document.querySelector(".flights-display");
    this.searchElement = document.querySelector(".flights-search");

    this.searchElement?.addEventListener('input', () => {
      const value = (this.searchElement as HTMLInputElement).value;

      this.currentSearchQuery = value;
      this.searchAndDisplayResults(value);
    });
  }

  public UpdateWithFlightStates(flightStates: StateArray): void {
    this.displayedStates = flightStates;

    if(this.currentSearchQuery == '') {
      this.updateDisplayedStates(flightStates);
    } else {
      this.searchAndDisplayResults(this.currentSearchQuery);
    }
  }

  private updateDisplayedStates(flightStates: StateArray, search = false): void {
    if(this.flightsArrayElement === null || this.noFlightsElement === null || this.flightsElement === null) return;

    if(flightStates.length == 0 && !search) {
      this.noFlightsElement.style.display = 'flex';
      this.flightsElement.style.display = 'none';

      return;
    }

    this.noFlightsElement.style.display = 'none';
    this.flightsElement.style.display = 'block';

    const scrollTop = this.flightsArrayElement.scrollTop;
    this.flightsArrayElement.innerText = '';

    flightStates.forEach(state => {
      this.flightsArrayElement?.appendChild(this.constructFlightItem(state));
    });

    this.flightsArrayElement.scroll(0, scrollTop ?? 0);
  }

  private searchAndDisplayResults(query: string): void {
    const matchedStates = this.displayedStates.filter(state => state.Callsign?.toUpperCase().includes(query.toUpperCase())) as StateArray;

    this.updateDisplayedStates(matchedStates, true);
  }

  private constructFlightItem(state: State): HTMLElement {
    const flightItem = document.createElement('div');
    flightItem.classList.add('flight-item');

    const country = countryLookup.byCountry(state.OriginCountry);

    const flightCountryIcon = document.createElement('img');
    flightCountryIcon.classList.add('flight-item-country');
    if(country != null) {
      flightCountryIcon.src = 'https://www.countryflags.io/' + country.iso2.toLowerCase() + '/flat/32.png';
      flightCountryIcon.alt = country.iso2.toLowerCase();
    }
    flightItem.appendChild(flightCountryIcon);

    const flightCallsign = document.createElement('span');
    flightCallsign.classList.add('flight-item-callsign');
    flightCallsign.innerHTML = state.Callsign ?? 'N/A';
    flightItem.appendChild(flightCallsign);

    flightItem.addEventListener('click', () => this.flightItemClicked(state.Icao24));

    return flightItem;
  }

  private flightItemClicked(icao24: string): void {
    this.trackerManager.MapManager.PanToMarker(icao24);
    this.trackerManager.FlightClicked(icao24, this.displayedStates.GetByIcao24(icao24));
  }
}
