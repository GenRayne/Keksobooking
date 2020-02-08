'use strict';

(function () {
  var map = document.querySelector('.map');

  var ADS_QUANTITY = 8;

  var pinsBlock = map.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var cardTemplate = document.querySelector('#card').content;
  var filterContainer = map.querySelector('.map__filters-container');

  var Pin = {
    WIDTH: 50,
    HEIGHT: 70,
    main: {
      ROUND_SIDE: 62,
      HEIGHT: 84,
      START_Y: parseInt(window.getComputedStyle(mainPin).top, 10)
    }
  };
  var Keys = {
    LEFT_MOUSE_BTN: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var createPinsAndCards = function () {
    var ads = generateAdsList(ADS_QUANTITY);
    for (var i = 0; i < ads.length; i++) {
      var newPin = createPin(ads[i]);
      pinsBlock.appendChild(newPin);

      var newCard = createCard(ads[i]);
      map.insertBefore(newCard, filterContainer);
    }
    linkPinsWithCards();
  };

  var generateAdsList = window.generateAdsList;
  var HouseTypes = window.HouseTypes;
  var Rooms = window.Rooms;
  var Guests = window.Guests;
  var ErrorTexts = window.ErrorTexts;

  var createPin = function (ad) {
    var pinTemplate = document.querySelector('#pin').content;
    var newPin = pinTemplate.cloneNode(true);
    var pinButton = newPin.querySelector('.map__pin');

    pinButton.style = 'left: ' + (ad.location.x - Pin.WIDTH / 2) +
                      'px; top: ' + (ad.location.y - Pin.HEIGHT) + 'px;';
    var pinImg = newPin.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;

    return newPin;
  };

  // ======================= Создание карточки =======================

  var createCard = function (ad) {
    var newCard = cardTemplate.cloneNode(true);
    var cardContainer = newCard.querySelector('.map__card');
    cardContainer.classList.add('hidden');
    newCard.querySelector('.popup__title').textContent = ad.offer.title;
    newCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    newCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

    var placeType = newCard.querySelector('.popup__type');
    placeType.textContent = choosePlaceType(ad.offer.type);
    var capacity = newCard.querySelector('.popup__text--capacity');
    capacity.textContent = formCapacityText(ad.offer.rooms, ad.offer.guests);
    var hours = newCard.querySelector('.popup__text--time');
    hours.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var features = newCard.querySelector('.popup__features');
    features.innerHTML = '';
    if (ad.offer.features.length) {
      features.appendChild(createFeaturesList(ad.offer.features));
    } else {
      features.classList.add('hidden');
    }

    var description = newCard.querySelector('.popup__description');
    if (ad.offer.description) {
      description.textContent = ad.offer.description;
    } else {
      description.classList.add('hidden');
    }

    var photos = newCard.querySelector('.popup__photos');
    if (ad.offer.photos.length) {
      var photo = photos.querySelector('.popup__photo');
      photos.innerHTML = '';
      photos.appendChild(createPhotoList(ad.offer.photos, photo));
    } else {
      photos.classList.add('hidden');
    }

    var avatar = newCard.querySelector('.popup__avatar');
    avatar.src = ad.author.avatar;

    return newCard;
  };

  var choosePlaceType = function (place) {
    var type;
    switch (place) {
      case HouseTypes.BUNGALO.type:
        type = HouseTypes.BUNGALO.name;
        break;
      case HouseTypes.FLAT.type:
        type = HouseTypes.FLAT.name;
        break;
      case HouseTypes.HOUSE.type:
        type = HouseTypes.HOUSE.name;
        break;
      case HouseTypes.PALACE.type:
        type = HouseTypes.PALACE.name;
        break;
      default:
        throw new Error(ErrorTexts.TYPE);
    }
    return type;
  };

  var formCapacityText = function (roomsQuantity, guestsQuantity) {
    var text = '';
    switch (roomsQuantity) {
      case +Rooms[1].amount:
        text = Rooms[1].text;
        break;
      case +Rooms[2].amount:
        text = Rooms[2].text;
        break;
      case +Rooms[3].amount:
        text = Rooms[3].text;
        break;
      case +Rooms[100].amount:
        text = Rooms[100].text;
        break;
      default:
        text = ErrorTexts.ROOMS;
    }

    switch (guestsQuantity) {
      case +Guests[1].amount:
        text += ' ' + Guests[1].text;
        break;
      case +Guests[2].amount:
        text += ' ' + Guests[2].text;
        break;
      case +Guests[3].amount:
        text += ' ' + Guests[3].text;
        break;
      case +Guests[0].amount:
        text += ' ' + Guests[0].text;
        break;
      default:
        text += ' ' + ErrorTexts.GUESTS;
    }
    return text;
  };

  var createFeaturesList = function (features) {
    var newFeatures = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature');
      newFeature.classList.add('popup__feature--' + features[i]);
      newFeatures.appendChild(newFeature);
    }
    return newFeatures;
  };

  var createPhotoList = function (photos, photo) {
    var newPhotos = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      var newPhoto = photo.cloneNode();
      newPhoto.src = photos[i];
      newPhotos.appendChild(newPhoto);
    }
    return newPhotos;
  };

  // ================== Открытие карточек по меткам ==================

  var linkPinsWithCards = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main');
    var cards = map.querySelectorAll('.map__card');
    for (var i = 0; i < pins.length; i++) {
      (function (pin, card) {
        pin.addEventListener('click', function () {
          openCard(cards, card);
        });
        card.querySelector('.popup__close').addEventListener('click', function () {
          card.classList.add('hidden');
        });
      })(pins[i], cards[i]);
    }
  };

  var openCard = function (cards, card) {
    var onPopupEscPress = function (ev) {
      if (ev.key === Keys.ESCAPE) {
        closeCard();
      }
    };
    var closeCard = function () {
      card.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };

    for (var j = 0; j < cards.length; j++) {
      cards[j].classList.add('hidden');
    }
    card.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  window.mainPin = mainPin;
  window.Pin = Pin;
  window.Keys = Keys;
  window.createPinsAndCards = createPinsAndCards;
})();
