'use strict';

(function () {
  var map = document.querySelector('.map');
  var MAP_WIDTH = +window.getComputedStyle(map).width.slice(0, -2);
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

  var HouseTypes = {
    BUNGALO: {
      type: 'bungalo',
      name: 'Бунгало',
      minPrice: 0,
      placeholder: '0'
    },
    FLAT: {
      type: 'flat',
      name: 'Квартира',
      minPrice: 1000,
      placeholder: '1000'
    },
    HOUSE: {
      type: 'house',
      name: 'Дом',
      minPrice: 5000,
      placeholder: '5000'
    },
    PALACE: {
      type: 'palace',
      name: 'Дворец',
      minPrice: 10000,
      placeholder: '10000'
    }
  };
  var Rooms = {
    1: {
      amount: '1',
      text: '1 комната'
    },
    2: {
      amount: '2',
      text: '2 комнаты'
    },
    3: {
      amount: '3',
      text: '3 комнаты'
    },
    100: {
      amount: '100',
      text: '100 комнат'
    }
  };
  var Guests = {
    1: {
      amount: '1',
      text: 'для 1 гостя',
      option: adFormCapacity.querySelector('option[value="1"]')
    },
    2: {
      amount: '2',
      text: 'для 2 гостей',
      option: adFormCapacity.querySelector('option[value="2"]')
    },
    3: {
      amount: '3',
      text: 'для 3 гостей',
      option: adFormCapacity.querySelector('option[value="3"]')
    },
    0: {
      amount: '0',
      text: 'не для гостей',
      option: adFormCapacity.querySelector('option[value="0"]')
    }
  };

  var ErrorTexts = {
    TYPE: 'Неверный тип жилья.',
    ROOMS: 'Неверное количество комнат.',
    GUESTS: 'Неверное количество гостей.',
    INVALID: {
      empty: 'Это поле обязательно для заполнения.',
      titleLength: 'Длина заголовка должна составлять не менее 30 и не более 100 символов.',
      priceMin: 'Цена для выбранного типа жилья не может быть ниже ',
      priceMax: 'Цена для выбранного типа жилья не может быть выше 1 000 000.'
    }
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
      case HouseTypes.BUNGALO.type:
        minPrice = HouseTypes.BUNGALO.minPrice;
        break;
      case HouseTypes.FLAT.type:
        minPrice = HouseTypes.FLAT.minPrice;
        break;
      case HouseTypes.HOUSE.type:
        minPrice = HouseTypes.HOUSE.minPrice;
        break;
      case HouseTypes.PALACE.type:
        minPrice = HouseTypes.PALACE.minPrice;
        break;
      default:
        throw new Error(ErrorTexts.TYPE);
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
    getRandomInt: getRandomInt,
    getRandomFromArr: getRandomFromArr,
    HouseTypes: HouseTypes,
    Rooms: Rooms,
    Guests: Guests,
    generateAdsList: generateAdsList,
    ErrorTexts: ErrorTexts,
    MAP_WIDTH: MAP_WIDTH
  };
})();
