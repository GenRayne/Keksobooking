'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');

  var MAP_WIDTH = +window.getComputedStyle(map).width.slice(0, -2);
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_ROUND_SIDE = 62;
  var MAIN_PIN_POINTER_HEIGHT = 22;
  var MAIN_PIN_HEIGHT = MAIN_PIN_ROUND_SIDE + MAIN_PIN_POINTER_HEIGHT;
  var MAIN_PIN_START_Y = +window.getComputedStyle(mainPin).top.slice(0, -2);

  var ADS_QUANTITY = 8;

  var MIN_INT = 1;
  var MAX_ROOMS = 10;
  var MAX_GUESTS = 10;
  var MAX_PRICE = 15000;
  var MAX_PLACES = 100;

  var LEFT_MOUSE_BTN = 0;
  var ENTER_KEY = 'Enter';

  var cardTemplate = document.querySelector('#card').content;
  var filterContainer = map.querySelector('.map__filters-container');

  var adForm = document.querySelector('.ad-form');
  var adFormAvatar = adForm.querySelector('#avatar');
  var adFormTitle = adForm.querySelector('#title');
  var adFormAddress = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormFeatures = adForm.querySelector('.features');
  var adFormDescription = adForm.querySelector('#description');
  var adFormPhotos = adForm.querySelector('#images');
  var adFormResetBtn = adForm.querySelector('.ad-form__reset');

  var filterForm = map.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRooms = filterForm.querySelector('#housing-rooms');
  var filterFormCapacity = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = filterForm.querySelector('#housing-features');

  var adFormInputs = [
    adFormAvatar, adFormTitle, adFormAddress, adFormType,
    adFormPrice, adFormTimein, adFormTimeout, adFormRooms,
    adFormCapacity, adFormFeatures, adFormDescription, adFormPhotos
  ];

  var filterFormInputs = [
    filterFormType, filterFormPrice, filterFormRooms,
    filterFormCapacity, filterFormFeatures
  ];

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
  var houseTypes = {
    bungalo: {
      type: 'bungalo',
      name: 'Бунгало',
      minPrice: 0,
      placeholder: '0'
    },
    flat: {
      type: 'flat',
      name: 'Квартира',
      minPrice: 1000,
      placeholder: '1000'
    },
    house: {
      type: 'house',
      name: 'Дом',
      minPrice: 5000,
      placeholder: '5000'
    },
    palace: {
      type: 'palace',
      name: 'Дворец',
      minPrice: 10000,
      placeholder: '10000'
    }
  };
  var guestsOptions = {
    1: adFormCapacity.querySelector('option[value="1"]'),
    2: adFormCapacity.querySelector('option[value="2"]'),
    3: adFormCapacity.querySelector('option[value="3"]'),
    0: adFormCapacity.querySelector('option[value="0"]')
  };

  var createPins = function () {
    var ads = generateAdsList(ADS_QUANTITY);
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

  // ============ Создание карточки ============

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
      case houseTypes.bungalo.type:
        type = houseTypes.bungalo.name;
        break;
      case houseTypes.flat.type:
        type = houseTypes.flat.name;
        break;
      case houseTypes.house.type:
        type = houseTypes.house.name;
        break;
      case houseTypes.palace.type:
        type = houseTypes.palace.name;
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

  // ============ Создание псевдоданных ============

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
      case houseTypes.bungalo.type:
        minPrice = houseTypes.bungalo.minPrice;
        break;
      case houseTypes.flat.type:
        minPrice = houseTypes.flat.minPrice;
        break;
      case houseTypes.house.type:
        minPrice = houseTypes.house.minPrice;
        break;
      case houseTypes.palace.type:
        minPrice = houseTypes.palace.minPrice;
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

  // ============ Активация карты и работа с формами ============

  var onMainPinMousedown = function (ev) {
    if (ev.button === LEFT_MOUSE_BTN) {
      activateMap();
    }
  };
  var onMainPinEnterPress = function (ev) {
    if (ev.key === ENTER_KEY) {
      activateMap();
    }
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    enableForms();
    setDefaultAddressValue('isActive');
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
    createPins();
  };

  var disableForms = function () {
    adForm.classList.add('ad-form--disabled');
    changeInputsState(adFormInputs, true);
    changeInputsState(filterFormInputs, true);
    setDefaultAddressValue();
    mainPin.addEventListener('mousedown', onMainPinMousedown);
    mainPin.addEventListener('keydown', onMainPinEnterPress);
  };
  var enableForms = function () {
    adForm.classList.remove('ad-form--disabled');
    changeInputsState(adFormInputs, false);
    changeInputsState(filterFormInputs, false);
  };

  var changeInputsState = function (inputsArr, isDisabled) {
    for (var i = 0; i < inputsArr.length; i++) {
      inputsArr[i].disabled = isDisabled;
      markAsValid(inputsArr[i]);
    }
  };

  var setDefaultAddressValue = function (isActive) {
    var pointerPinCoords = (MAP_WIDTH / 2) + ', ' + (MAIN_PIN_START_Y + MAIN_PIN_HEIGHT);
    var centerPinCoords = (MAP_WIDTH / 2) + ', ' + (MAIN_PIN_START_Y + MAIN_PIN_ROUND_SIDE / 2);
    adFormAddress.value = isActive ? pointerPinCoords : centerPinCoords;
  };

  var clearMap = function () {
    var pins = pinsBlock.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pinsBlock.removeChild(pins[i]);
      }
    }
    var card = map.querySelector('.map__card.popup');
    map.removeChild(card);
  };

  // ============ Валидация формы ============

  // Обработчики

  var onAdTypeChange = function () {
    setMinPrice(adFormType.value);
  };

  var onTimeoutChange = function () {
    adFormTimein.value = adFormTimeout.value;
  };
  var onTimeinChange = function () {
    adFormTimeout.value = adFormTimein.value;
  };

  var onRoomsChange = function () {
    switch (adFormRooms.value) {
      case '1':
        changeCapacityOptionsState('disabled');
        guestsOptions[1].disabled = false;
        if (adFormCapacity.value !== '1') {
          adFormCapacity.value = '1';
        }
        break;
      case '2':
        changeCapacityOptionsState('disabled');
        guestsOptions[1].disabled = false;
        guestsOptions[2].disabled = false;
        if (adFormCapacity.value !== '1' && adFormCapacity.value !== '2') {
          adFormCapacity.value = '2';
        }
        break;
      case '3':
        changeCapacityOptionsState(false);
        guestsOptions[0].disabled = true;
        if (adFormCapacity.value === '0') {
          adFormCapacity.value = '3';
        }
        break;
      case '100':
        changeCapacityOptionsState('disabled');
        guestsOptions[0].disabled = false;
        if (adFormCapacity.value !== '0') {
          adFormCapacity.value = '0';
        }
    }
  };

  var onAdFormSubmit = function (ev) {
    if (!checkFormValidity()) {
      ev.preventDefault();
    }
  };

  // Функции для обработки

  var changeCapacityOptionsState = function (isDisabled) {
    for (var i = 0; i < adFormCapacity.children.length; i++) {
      adFormCapacity.children[i].disabled = isDisabled;
    }
  };

  var setMinPrice = function (type) {
    switch (type) {
      case houseTypes.bungalo.type:
        adFormPrice.min = houseTypes.bungalo.minPrice;
        adFormPrice.placeholder = houseTypes.bungalo.placeholder;
        break;
      case houseTypes.flat.type:
        adFormPrice.min = houseTypes.flat.minPrice;
        adFormPrice.placeholder = houseTypes.flat.placeholder;
        break;
      case houseTypes.house.type:
        adFormPrice.min = houseTypes.house.minPrice;
        adFormPrice.placeholder = houseTypes.house.placeholder;
        break;
      case houseTypes.palace.type:
        adFormPrice.min = houseTypes.palace.minPrice;
        adFormPrice.placeholder = houseTypes.palace.placeholder;
    }
  };

  var checkInputValidity = function (input) {
    if (!input.validity.valid) {
      markAsInvalid(input);
      return false;
    } else {
      markAsValid(input);
      return true;
    }
  };

  var checkCapacityValidity = function () {
    switch (adFormRooms.value) {
      case '1':
        if (adFormCapacity.value !== '1') {
          markAsInvalid(adFormCapacity);
          return false;
        } else {
          markAsValid(adFormCapacity);
          return true;
        }
      case '2':
        if (adFormCapacity.value !== '1' || adFormCapacity.value !== '2') {
          markAsInvalid(adFormCapacity);
          return false;
        } else {
          markAsValid(adFormCapacity);
          return true;
        }
      case '3':
        if (adFormCapacity.value === '0') {
          markAsValid(adFormCapacity);
          return true;
        } else {
          markAsInvalid(adFormCapacity);
          return false;
        }
      case '100':
        if (adFormCapacity.value !== '0') {
          markAsInvalid(adFormCapacity);
          return false;
        } else {
          markAsValid(adFormCapacity);
          return true;
        }
      default:
        return true;
    }
  };

  var checkFormValidity = function () {
    var isTitleValid = checkInputValidity(adFormTitle);
    var isPriceValid = checkInputValidity(adFormPrice);
    var isCapacityValid = checkCapacityValidity();
    var isFormValid = isTitleValid && isPriceValid && isCapacityValid;
    return isFormValid ? true : false;
  };

  var markAsInvalid = function (input) {
    input.style.boxShadow = '0 0 5px 0 red';
  };
  var markAsValid = function (input) {
    input.style.boxShadow = '';
  };

  // ================================================================

  disableForms();
  changeCapacityOptionsState('disabled');
  adFormCapacity.children[2].disabled = false;
  onRoomsChange();

  adFormType.addEventListener('change', onAdTypeChange);
  adFormTimeout.addEventListener('change', onTimeoutChange);
  adFormTimein.addEventListener('change', onTimeinChange);
  adFormRooms.addEventListener('change', onRoomsChange);
  adForm.addEventListener('submit', onAdFormSubmit);

  adFormResetBtn.addEventListener('click', function (ev) {
    ev.preventDefault();
    adForm.reset();
    disableForms();
    clearMap();
    map.classList.add('map--faded');
  });
})();
