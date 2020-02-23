'use strict';

(function () {
  // --------------------- Импорт ---------------------
  var map = window.pins.map;
  var MainPin = window.pins.MainPin;
  var mainPinEl = window.pins.mainPinEl;

  // ---------------- Переменные формы ----------------

  var MAP_WIDTH = map.offsetWidth;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MIN_TOP = MIN_Y - MainPin.HEIGHT;
  var MAX_TOP = MAX_Y - MainPin.HEIGHT;

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  // =================================================================

  var limitXDrag = function (coord, min, max) {
    if (coord < min) {
      return min;
    } else if (coord > max) {
      return max;
    }
    return coord;
  };

  var getAddressPointerCoords = function (x, y) {
    var pointerCoords = {
      x: x + MainPin.ROUND_SIDE / 2,
      y: y + MainPin.HEIGHT
    };
    adFormAddress.value = pointerCoords.x + ', ' + pointerCoords.y;
  };

  window.dragMainPin = function (ev) {
    var minLeft = -MainPin.ROUND_SIDE / 2;
    var maxLeft = minLeft + MAP_WIDTH;
    var startCoords = {
      x: ev.clientX,
      y: ev.clientY
    };

    var onMouseMove = function (moveEv) {
      moveEv.preventDefault();

      var shift = {
        x: startCoords.x - moveEv.clientX,
        y: startCoords.y - moveEv.clientY
      };

      startCoords = {
        x: moveEv.clientX,
        y: moveEv.clientY
      };

      var coords = {
        x: limitXDrag((mainPinEl.offsetLeft - shift.x), minLeft, maxLeft),
        y: limitXDrag((mainPinEl.offsetTop - shift.y), MIN_TOP, MAX_TOP)
      };

      mainPinEl.style.left = coords.x + 'px';
      mainPinEl.style.top = coords.y + 'px';
      getAddressPointerCoords(coords.x, coords.y);
    };

    var onMouseUp = function (upEv) {
      upEv.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      var pinCoords = {
        x: mainPinEl.offsetLeft,
        y: mainPinEl.offsetTop
      };
      getAddressPointerCoords(pinCoords.x, pinCoords.y);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.mainPin = {
    adForm: adForm,
    adFormAddress: adFormAddress
  };
})();
