'use strict';

var map = document.querySelector('.map');

var MAP_WIDTH = +window.getComputedStyle(map).width.slice(0, -2);
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var MIN = 1;
var MAX_ROOMS = 10;
var MAX_GUESTS = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 10000;
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

map.classList.remove('map--faded');

var cardTemplate = document.querySelector('#card').content;
var filterContainer = map.querySelector('.map__filters-container');

var createCard = function (ads, i) {
  var newCard = cardTemplate.cloneNode(true);
  newCard.querySelector('.popup__title').textContent = ads[i].offer.title;
  newCard.querySelector('.popup__text--address').textContent = ads[i].offer.address;
  newCard.querySelector('.popup__text--price').textContent = ads[i].offer.price + '₽/ночь';

  var placeType = newCard.querySelector('.popup__type');
  switch (ads[i].offer.type) {
    case 'flat':
      placeType.textContent = 'Квартира';
      break;
    case 'bungalo':
      placeType.textContent = 'Бунгало';
      break;
    case 'house':
      placeType.textContent = 'Дом';
      break;
    case 'palace':
      placeType.textContent = 'Дворец';
  }
  var capacity = newCard.querySelector('.popup__text--capacity');
  capacity.textContent = formCapacityText(ads[i].offer.rooms, ads[i].offer.guests);
  var hours = newCard.querySelector('.popup__text--time');
  hours.textContent = 'Заезд после ' + ads[i].offer.checkin + ', выезд до ' + ads[i].offer.checkout;

  var features = newCard.querySelector('.popup__features');
  features.innerHTML = '';
  var newFeatures = createFeaturesList(ads[i].offer.features);
  features.appendChild(newFeatures);

  var description = newCard.querySelector('.popup__description');
  description.textContent = ads[i].offer.description;

  var photos = newCard.querySelector('.popup__photos');
  var photo = photos.querySelector('.popup__photo');
  photos.innerHTML = '';
  var newPhotos = createPhotoList(ads[i].offer.photos, photo);
  photos.appendChild(newPhotos);

  var avatar = newCard.querySelector('.popup__avatar');
  avatar.src = ads[i].author.avatar;

  return newCard;
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

var createPins = function () {
  var ads = generateAdsList();
  var pinsBlock = map.querySelector('.map__pins');

  for (var i = 0; i < ads.length; i++) {
    var newPin = createPin(ads, i);
    pinsBlock.appendChild(newPin);
  }
  map.insertBefore(createCard(ads, 0), filterContainer);
};

var createPin = function (ads, i) {
  var pinTemplate = document.querySelector('#pin').content;
  var newPin = pinTemplate.cloneNode(true);
  var pinButton = newPin.querySelector('.map__pin');

  pinButton.style = 'left: ' + (ads[i].location.x - PIN_WIDTH / 2) + 'px; top: ' + (ads[i].location.y - PIN_HEIGHT) + 'px;';
  var pinImg = newPin.querySelector('img');
  pinImg.src = ads[i].author.avatar;
  pinImg.alt = ads[i].offer.title;

  return newPin;
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
  var newAd = {
    author: {
      avatar: 'img/avatars/user0' + number + '.png'
    },
    offer: {
      title: 'Уютное место №' + getRandomInt(MAX_PLACES, MIN),
      address: location.x + ', ' + location.y,
      price: getRandomInt(MAX_PRICE, MIN_PRICE),
      type: chooseType(),
      rooms: getRandomInt(MAX_ROOMS, MIN),
      guests: getRandomInt(MAX_GUESTS, MIN),
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
  return TYPES[getRandomInt(TYPES.length - 1)];
};

var chooseCheckinCheckout = function () {
  return IN_OUT_HOURS[getRandomInt(IN_OUT_HOURS.length - 1)];
};

var chooseFeatures = function () {
  var chosenFeatures = [];
  var chosenFeaturesQuantity = getRandomInt(FEATURES.length, MIN);
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
  return FEATURES[getRandomInt(FEATURES.length - 1)];
};

var generatePhotoCollection = function () {
  PHOTO_URLS.length = getRandomInt(PHOTO_URLS.length, MIN);
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

createPins();

