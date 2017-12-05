// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0;

  window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}());
