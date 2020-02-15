'use strict';

(function () {
  var map = document.querySelector('.map');
  var MAP_WIDTH = map.offsetWidth;
  var MIN_INT = 1;
  var MAX_PRICE = 15000;
  var MAX_PLACES = 100;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;

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
  var ROOMS = [1, 2, 3, 100];
  var GUESTS = [1, 2, 3, 0];

  var adForm = document.querySelector('.ad-form');
  var adFormCapacity = adForm.querySelector('#capacity');

  var HouseType = {
    BUNGALO: 'bungalo',
    FLAT: 'flat',
    HOUSE: 'house',
    PALACE: 'palace'
  };
  var HouseName = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var HouseMinPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };
  var HousePlaceholder = {
    BUNGALO: HouseMinPrice.BUNGALO.toString(),
    FLAT: HouseMinPrice.FLAT.toString(),
    HOUSE: HouseMinPrice.HOUSE.toString(),
    PALACE: HouseMinPrice.PALACE.toString()
  };
  var RoomsAmount = {
    1: '1',
    2: '2',
    3: '3',
    100: '100'
  };
  var GuestsAmount = {
    1: '1',
    2: '2',
    3: '3',
    0: '0'
  };
  var GuestsOption = {
    1: adFormCapacity.querySelector('option[value="1"]'),
    2: adFormCapacity.querySelector('option[value="2"]'),
    3: adFormCapacity.querySelector('option[value="3"]'),
    0: adFormCapacity.querySelector('option[value="0"]')
  };

  var ErrorText = {
    TYPE: 'Неверный тип жилья.',
    ROOMS: 'Неверное количество комнат.',
    GUESTS: 'Неверное количество гостей.'
  };
  var InvalidText = {
    EMPTY: 'Это поле обязательно для заполнения.',
    TITLE_LENGTH: 'Длина заголовка должна составлять не менее 30 и не более 100 символов.',
    PRICE_MIN: 'Цена для выбранного типа жилья не может быть ниже ',
    PRICE_MAX: 'Цена для выбранного типа жилья не может быть выше 1 000 000.'
  };

  // =================================================================

  var generateAdsList = function (quantity) {
    var ads = [];
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
        rooms: getRooms(),
        guests: getGuests(),
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

  var getRooms = function () {
    return getRandomFromArr(ROOMS);
  };
  var getGuests = function () {
    return getRandomFromArr(GUESTS);
  };

  var chooseType = function () {
    return getRandomFromArr(TYPES);
  };

  var getPrice = function (type) {
    var minPrice;
    switch (type) {
      case HouseType.BUNGALO:
        minPrice = HouseMinPrice.BUNGALO;
        break;
      case HouseType.FLAT:
        minPrice = HouseMinPrice.FLAT;
        break;
      case HouseType.HOUSE:
        minPrice = HouseMinPrice.HOUSE;
        break;
      case HouseType.PALACE:
        minPrice = HouseMinPrice.PALACE;
        break;
      default:
        throw new Error(ErrorText.TYPE);
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

  // =================================================================
  // Экспорт:

  window.data = {
    map: map,
    getRandomInt: getRandomInt,
    getRandomFromArr: getRandomFromArr,
    HouseType: HouseType,
    HouseName: HouseName,
    HouseMinPrice: HouseMinPrice,
    HousePlaceholder: HousePlaceholder,
    RoomsAmount: RoomsAmount,
    GuestsAmount: GuestsAmount,
    GuestsOption: GuestsOption,
    generateAdsList: generateAdsList,
    ErrorTexts: ErrorText,
    InvalidText: InvalidText,
    MAP_WIDTH: MAP_WIDTH
  };
})();
