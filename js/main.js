'use strict';

(function () {
  var map = document.querySelector('.map');

  var MAP_WIDTH = +window.getComputedStyle(map).width.slice(0, -2);
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var MIN_INT = 1;
  var MAX_ROOMS = 10;
  var MAX_GUESTS = 10;
  var MAX_PRICE = 15000;
  var MAX_PLACES = 100;

  var PHOTO_URLS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];
  var IN_OUT_HOURS = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var createPins = function () {
    var ads = generateAdsList();
    var pinsBlock = map.querySelector('.map__pins');

    for (var i = 0; i < ads.length; i++) {
      var newPin = createPin(ads[i]);
      pinsBlock.appendChild(newPin);
    }
    map.insertBefore(createCard(ads[0]), filterContainer);
  };

  var createPin = function (ad) {
    var pinTemplate = document.querySelector('#pin').content;
    var newPin = pinTemplate.cloneNode(true);
    var pinButton = newPin.querySelector('.map__pin');

    pinButton.style = 'left: ' + (ad.location.x - PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - PIN_HEIGHT) + 'px;';
    var pinImg = newPin.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;

    return newPin;
  };

  // Создание карточки

  var createCard = function (ad) {
    var newCard = cardTemplate.cloneNode(true);
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
      case 'flat':
        type = 'Квартира';
        break;
      case 'bungalo':
        type = 'Бунгало';
        break;
      case 'house':
        type = 'Дом';
        break;
      case 'palace':
        type = 'Дворец';
    }
    return type;
  };

  var formCapacityText = function (roomsQuantity, guestsQuantity) {
    var text = roomsQuantity;
    if (roomsQuantity === 1) {
      text += ' комната ';
    } else if (roomsQuantity > 1 && roomsQuantity < 5) {
      text += ' комнаты ';
    } else if (roomsQuantity >= 5) {
      text += ' комнат ';
    }
    if (guestsQuantity === 1) {
      text += 'для ' + guestsQuantity + ' гостя';
    } else if (guestsQuantity > 1) {
      text += 'для ' + guestsQuantity + ' гостей';
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

  // Создание псевдоданных

  var generateAdsList = function (quantity) {
    var ads = [];
    if (!quantity) {
      quantity = 8;
    }
    for (var i = 1; i <= quantity; i++) {
      var newAd = generateNewAd(i);
      ads.push(newAd);
    }
    return ads;
  };

  var generateNewAd = function (number) {
    var location = generateLocation();
    var type = chooseType();
    var newAd = {
      author: {
        avatar: 'img/avatars/user0' + number + '.png'
      },
      offer: {
        title: 'Уютное место №' + getRandomInt(MAX_PLACES, MIN_INT),
        address: location.x + ', ' + location.y,
        price: getPrice(type),
        type: type,
        rooms: getRandomInt(MAX_ROOMS, MIN_INT),
        guests: getRandomInt(MAX_GUESTS, MIN_INT),
        checkin: chooseCheckinCheckout(),
        checkout: chooseCheckinCheckout(),
        features: chooseFeatures(),
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam quis molestiae placeat architecto nihil temporibus repellendus rerum ut magni ducimus!',
        photos: generatePhotoCollection()
      },
      location: location
    };
    return newAd;
  };

  var chooseType = function () {
    return getRandomFromArr(TYPES);
  };

  var getPrice = function (type) {
    var minPrice;
    switch (type) {
      case 'bungalo':
        minPrice = 0;
        break;
      case 'flat':
        minPrice = 1000;
        break;
      case 'house':
        minPrice = 5000;
        break;
      case 'palace':
        minPrice = 10000;
    }
    return getRandomInt(MAX_PRICE, minPrice);
  };

  var chooseCheckinCheckout = function () {
    return getRandomFromArr(IN_OUT_HOURS);
  };

  var chooseFeatures = function () {
    var chosenFeatures = [];
    var chosenFeaturesQuantity = getRandomInt(FEATURES.length, MIN_INT);
    for (var i = 0; i < chosenFeaturesQuantity; i++) {
      var newFeature = chooseNewFeature();
      while (chosenFeatures.includes(newFeature)) {
        newFeature = chooseNewFeature();
      }
      chosenFeatures.push(newFeature);
    }
    return chosenFeatures;
  };

  var chooseNewFeature = function () {
    return getRandomFromArr(FEATURES);
  };

  var generatePhotoCollection = function () {
    PHOTO_URLS.length = getRandomInt(PHOTO_URLS.length, MIN_INT);
    return PHOTO_URLS;
  };

  var generateLocation = function () {
    return {
      x: getRandomInt(MAP_WIDTH),
      y: getRandomInt(MAX_LOCATION_Y, MIN_LOCATION_Y)
    };
  };

  var getRandomInt = function (max, min) {
    if (!min) {
      min = 0;
    }
    var randomInt = Math.random() * (max - min) + min;
    return Math.round(randomInt);
  };

  var getRandomFromArr = function (arr) {
    return arr[getRandomInt(arr.length - 1)];
  };

  map.classList.remove('map--faded');

  var cardTemplate = document.querySelector('#card').content;
  var filterContainer = map.querySelector('.map__filters-container');

  createPins();
})();
