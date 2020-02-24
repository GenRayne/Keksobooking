'use strict';

(function () {
  // --------------------- Импорт ---------------------
  var map = window.pins.map;
  var mainPin = window.pins.mainPin;

  // ---------------- Переменные модуля ----------------

  var MAP_WIDTH = map.offsetWidth;

  var MainPin = {
    ROUND_SIDE: 62,
    HEIGHT: 84
  };

  var MIN_Y = 130;
  var MAX_Y = 630;
  var MIN_TOP = MIN_Y - MainPin.HEIGHT;
  var MAX_TOP = MAX_Y - MainPin.HEIGHT;

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  // =================================================================

  var limitDrag = function (coord, min, max) {
    if (coord < min) {
      return min;
    } else if (coord > max) {
      return max;
    }
    return coord;
  };

  var getAddressCoords = function (x, y) {
    var pointerCoords = {
      x: x + MainPin.ROUND_SIDE / 2,
      y: y + MainPin.HEIGHT
    };
    adFormAddress.value = pointerCoords.x + ', ' + pointerCoords.y;
  };

  window.dragMainPin = function (evt) {
    var minLeft = -MainPin.ROUND_SIDE / 2;
    var maxLeft = minLeft + MAP_WIDTH;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coords = {
        x: limitDrag((mainPin.offsetLeft - shift.x), minLeft, maxLeft),
        y: limitDrag((mainPin.offsetTop - shift.y), MIN_TOP, MAX_TOP)
      };

      mainPin.style.left = coords.x + 'px';
      mainPin.style.top = coords.y + 'px';
      getAddressCoords(coords.x, coords.y);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      var pinCoords = {
        x: mainPin.offsetLeft,
        y: mainPin.offsetTop
      };
      getAddressCoords(pinCoords.x, pinCoords.y);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.mainPin = {
    adForm: adForm,
    adFormAddress: adFormAddress,
    MainPin: MainPin
  };
})();
