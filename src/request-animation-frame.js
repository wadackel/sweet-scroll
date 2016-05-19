const vendors = ["ms", "moz", "webkit"];
let lastTime = 0;

export let raf = window.requestAnimationFrame;
export let caf = window.cancelAnimationFrame;

for (let x = 0; x < vendors.length && !raf; ++x) {
  raf = window[`${vendors[x]}RequestAnimationFrame`];
  caf = window[`${vendors[x]}CancelAnimationFrame`] ||
    window[`${vendors[x]}CancelRequestAnimationFrame`];
}

if (!raf) {
  raf = callback => {
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    const id = window.setTimeout(() => {
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
