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

var createPins = function () {
  var ads = generateAdsList();
  var pinsBlock = map.querySelector('.map__pins');

  for (var i = 0; i < ads.length; i++) {
    var newPin = createPin(ads, i);
    pinsBlock.appendChild(newPin);
  }
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
