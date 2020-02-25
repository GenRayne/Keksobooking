'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var Key = window.util.Key;
  var renderCard = window.card.render;

  // ---------------- Переменные модуля ----------------

  var ADS_QUANTITY = 5;

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content;
  var pinButton = pinTemplate.querySelector('.map__pin');
  var filterContainer = map.querySelector('.map__filters-container');

  var Pin = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  var adsData = [];

  // =================================================================

  var renderPin = function (ad) {
    var newPin = pinButton.cloneNode(true);

    newPin.style.left = (ad.location.x - Pin.WIDTH / 2) + 'px';
    newPin.style.top = (ad.location.y - Pin.HEIGHT) + 'px';

    var pinImg = newPin.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;

    return newPin;
  };

  var renderPins = function (ads) {
    clearMap();
    adsData = [];

    for (var i = 0; i < Math.min(ads.length, ADS_QUANTITY); i++) {
      if ('offer' in ads[i]) {
        var newPin = renderPin(ads[i]);
        pinsBlock.appendChild(newPin);

        adsData.push({
          ad: ads[i],
          pin: newPin,
          card: null
        });
      }
    }
    linkPinsWithCards();
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
    var closeCard = function () {
      card.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var onPopupEscPress = function (evt) {
      if (evt.key === Key.ESCAPE) {
        closeCard();
      }
    };

    var cards = map.querySelectorAll('.map__card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('hidden');
    }

    var adItem = adsData.find(function (item) {
      return item.pin === pin;
    });

    var card = (adItem.card) ? adItem.card : renderCard(adItem.ad);

    if (!adItem.card) {
      map.insertBefore(card, filterContainer);
      adItem.card = card;
    } else {
      adItem.card.classList.remove('hidden');
    }

    card.querySelector('.popup__close').addEventListener('click', function () {
      closeCard();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  // ================== Очистка карты ==================

  var clearMap = function () {
    var pins = pinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    var cards = map.querySelectorAll('.map__card.popup');
    for (var i = 0; i < pins.length; i++) {
      pinsBlock.removeChild(pins[i]);
      if (cards[i]) {
        map.removeChild(cards[i]);
      }
    }
  };

  // =================================================================
  // Экспорт:

  window.pins = {
    map: map,
    main: mainPin,
    Key: Key,
    render: renderPins,
    clearMap: clearMap
  };
})();
