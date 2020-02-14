'use strict';

(function () {
  // --------------------- Импорт ---------------------
  var createCard = window.card.createCard;

  // ---------------- Переменные формы ----------------

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var mainPinEl = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content;
  var pinButton = pinTemplate.querySelector('.map__pin');
  var filterContainer = map.querySelector('.map__filters-container');

  var Pin = {
    WIDTH: 50,
    HEIGHT: 70,
  };
  var MainPin = {
    ROUND_SIDE: 62,
    HEIGHT: 84,
    START_Y: parseInt(window.getComputedStyle(mainPinEl).top, 10)
  };
  var Keys = {
    LEFT_MOUSE_BTN: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var adsData = [];

  // =================================================================

  var createPins = function (adObjects) {
    for (var i = 0; i < adObjects.length; i++) {
      var newPin = createPin(adObjects[i]);
      pinsBlock.appendChild(newPin);

      adsData.push({
        ad: adObjects[i],
        pin: newPin,
        card: null
      });
    }
    linkPinsWithCards();
  };

  var createPin = function (ad) {
    var newPin = pinButton.cloneNode(true);

    newPin.style = 'left: ' + (ad.location.x - Pin.WIDTH / 2) +
                   'px; top: ' + (ad.location.y - Pin.HEIGHT) + 'px;';
    var pinImg = newPin.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;

    return newPin;
  };

  // ================== Открытие карточек по меткам ==================

  var linkPinsWithCards = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      (function (pin) {
        pin.addEventListener('click', function () {
          openCard(pin);
        });
      })(pins[i]);
    }
  };

  var openCard = function (pin) {
    var onPopupEscPress = function (event) {
      if (event.key === Keys.ESCAPE) {
        closeCard();
      }
    };
    var closeCard = function () {
      card.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var cards = map.querySelectorAll('.map__card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('hidden');
    }
    var adItem = adsData.find(function (item) {
      return item.pin === pin;
    });
    var card = (adItem.card) ? adItem.card : createCard(adItem.ad);

    if (!adItem.card) {
      map.insertBefore(card, filterContainer);
      adItem.card = card;
    } else {
      adItem.card.classList.remove('hidden');
    }

    card.querySelector('.popup__close').addEventListener('click', function () {
      card.classList.add('hidden');
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  // =================================================================
  // Экспорт:

  window.pins = {
    mainPinEl: mainPinEl,
    Pin: Pin,
    MainPin: MainPin,
    Keys: Keys,
    createPins: createPins
  };
})();
