'use strict';

window.onload = function () {

  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var drawSegments = [[]];
  var segment = 0;

  window.tracking.ColorTracker.registerColor('blue', function (r, g, b) {
    if (r < 66 && g > 66 && b < 155) {
      return true;
    }
    return false;
  });

  var tracker = new   window.tracking.ColorTracker(['magenta', 'cyan']);

    window.tracking.track('#video', tracker, { camera: true });

  tracker.on('track', function (event) {
    if (event.data.length === 0 && drawSegments[segment].length > 0) {
      segment++;

      if (!drawSegments[segment]) {
        drawSegments[segment] = [];
      }
    }

    event.data.forEach(function (rect) {
      if (rect.color === 'magenta') {
        draw(rect);
      } else if (rect.color === 'cyan') {
        erase(rect);
      }
    });
  });

  function draw(rect) {
    drawSegments[segment].push(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }

  function erase(rect) {
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  function isInsideRect(x, y, rect) {
    return rect.x <= x && x <= rect.x + rect.width && rect.y <= y && y <= rect.y + rect.height;
  }

  (function loop() {
    for (var i = 0, len = drawSegments.length; i < len; i++) {
      drawSpline(context, drawSegments[i], 0.5, false);
    }

    drawSegments = [drawSegments[drawSegments.length - 1]];
    segment = 0;

    requestAnimationFrame(loop);
  })();
};
