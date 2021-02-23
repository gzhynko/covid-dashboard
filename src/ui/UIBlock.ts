import State from "../types/State";

export default abstract class UIBlock {
  domElement: HTMLElement | null;
  resizeButton: HTMLElement | null;

  isExpanded = false;

  constructor(domElementID: string) {
    this.domElement = document.getElementById(domElementID);

    this.resizeButton = this.domElement?.querySelector(".resize") ?? null;
    this.resizeButton?.addEventListener('click', () => {
      this.ToggleExpand(this.isExpanded);
    });
  }

  public abstract UpdateWithFlightStates(flightStates: Array<State>): void;

  public ToggleExpand(currentState: boolean): void {
    if(!currentState) {
      this.isExpanded = true;
      this.resizeButton?.classList.replace('resize--expand', 'resize--collapse');

      this.domElement?.classList.add('fullscreen');
      document.querySelectorAll('.grid-item').forEach(el => {
        if(el == this.domElement) return;
        el.classList.add('hidden');
      });
    } else {
      this.isExpanded = false;
      this.resizeButton?.classList.replace('resize--collapse', 'resize--expand');

      this.domElement?.classList.remove('fullscreen');
      document.querySelectorAll('.grid-item').forEach(el => {
        if(el == this.domElement) return;
        el.classList.remove('hidden');
      });
    }
  }
}