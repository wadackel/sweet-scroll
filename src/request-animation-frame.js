import { win } from "./elements";
import { max } from "./math";

const vendors = ["ms", "moz", "webkit"];
let lastTime = 0;

export let raf = win.requestAnimationFrame;
export let caf = win.cancelAnimationFrame;

for (let x = 0; x < vendors.length && !raf; ++x) {
  raf = win[`${vendors[x]}RequestAnimationFrame`];
  caf = win[`${vendors[x]}CancelAnimationFrame`] ||
    win[`${vendors[x]}CancelRequestAnimationFrame`];
}

if (!raf) {
  raf = callback => {
    const currentTime = Date.now();
    const timeToCall = max(0, 16 - (currentTime - lastTime));
    const id = setTimeout(() => {
      callback(currentTime + timeToCall);
    }, timeToCall);

    lastTime = currentTime + timeToCall;

    return id;
  };
}

if (!caf) {
  caf = id => {
    clearTimeout(id);
  };
}
