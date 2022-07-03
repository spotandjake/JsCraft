import { clamp } from './Utils';
import Vector from './Vector';
// Handles Inputs
class Controller {
  // General Keys
  public keys: Map<string, boolean> = new Map();
  public mouseKeys: Set<number> = new Set();
  // Constructor
  constructor(elm: Document) {
    // Set Events
    elm.onkeydown = (event: KeyboardEvent) => {
      // Handle Key Down
      this.keys.set(event.code, true);
    };
    elm.onkeyup = (event: KeyboardEvent) => {
      // Handle Key Down
      this.keys.set(event.code, false);
    };
    document.onmousedown = (event: MouseEvent) => {
      // Handle Mouse Down
      this.mouseKeys.add(event.button);
    };
    document.onmouseup = (event: MouseEvent) => {
      // Handle Mouse Up
      this.mouseKeys.delete(event.button);
    };
    // TOD: Handle Mouse Look Around
  }
  // Axis
  public get forwardAxis() {
    let axis = 0;
    if (this.keys.get('KeyW')) axis += 1;
    if (this.keys.get('KeyS')) axis -= 1;
    return clamp(axis, -1, 1);
  }
  public get sideAxis() {
    let axis = 0;
    if (this.keys.get('KeyA')) axis -= 1;
    if (this.keys.get('KeyD')) axis += 1;
    return clamp(axis, -1, 1);
  }
  // Toggles
  public get leftClick() {
    return this.mouseKeys.has(0);
  }
  public get middleClick() {
    return this.mouseKeys.has(1);
  }
  public get rightClick() {
    return this.mouseKeys.has(2);
  }

  public get jumpButton() {
    return this.keys.get('Space') == true;
  }
  public get crouchButton() {
    return this.keys.get('ShiftLeft') == true;
  }
}
// Export Controller
export default Controller;
