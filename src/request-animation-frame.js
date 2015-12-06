let lastTime = 0;

const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback){
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    const id = window.setTimeout(() => { callback(currentTime + timeToCall) }, timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
  };

export default raf;