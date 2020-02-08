'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');

  var MAP_WIDTH = +window.getComputedStyle(map).width.slice(0, -2);
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;

  var ADS_QUANTITY = 8;

  var MIN_INT = 1;
  var MAX_PRICE = 15000;
  var MAX_PLACES = 100;

  var cardTemplate = document.querySelector('#card').content;
  var filterContainer = map.querySelector('.map__filters-container');

  var adForm = document.querySelector('.ad-form');
  var adFormAvatar = adForm.querySelector('#avatar');
  var adFormAvatarLabel = adForm.querySelector('.ad-form-header__drop-zone');
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
  var adFormPhotosLabel = adForm.querySelector('.ad-form__drop-zone');
  var adFormResetBtn = adForm.querySelector('.ad-form__reset');
  var adFormSubmitBtn = adForm.querySelector('.ad-form__submit');

  var invalidPriceMessageBox = adForm.querySelector('#price + p');
  var invalidTitleMessageBox = adForm.querySelector('#title + p');

  var filterForm = map.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRooms = filterForm.querySelector('#housing-rooms');
  var filterFormCapacity = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = filterForm.querySelector('#housing-features');

  var adFormInputs = [
    adFormAvatar,
    adFormTitle,
    adFormAddress,
    adFormType,
    adFormPrice,
    adFormTimein,
    adFormTimeout,
    adFormRooms,
    adFormCapacity,
    adFormFeatures,
    adFormDescription,
    adFormPhotos,
    adFormSubmitBtn,
    adFormResetBtn
  ];

  var filterFormInputs = [
    filterFormType,
    filterFormPrice,
    filterFormRooms,
    filterFormCapacity,
    filterFormFeatures
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
  var ROOMS = [1, 2, 3, 100];
  var GUESTS = [1, 2, 3, 0];
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
  var Keys = {
    LEFT_MOUSE_BTN: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70,
    main: {
      ROUND_SIDE: 62,
      HEIGHT: 84,
      START_Y: parseInt(window.getComputedStyle(mainPin).top, 10)
    }
  };

  // ================================================================

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

  // ============== Активация карты и работа с формами ==============

  var onMainPinMousedown = function (ev) {
    if (ev.button === Keys.LEFT_MOUSE_BTN) {
      activateMap();
    }
  };
  var onMainPinEnterPress = function (ev) {
    if (ev.key === Keys.ENTER) {
      activateMap();
    }
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    enableForms();
    setDefaultAddressValue(true);
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
    createPinsAndCards();
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
    changeInputsState(adFormInputs);
    changeInputsState(filterFormInputs);
  };

  var changeInputsState = function (inputsArr, isDisabled) {
    for (var i = 0; i < inputsArr.length; i++) {
      inputsArr[i].disabled = isDisabled;
      markAsValid(inputsArr[i]);
    }
  };

  var setDefaultAddressValue = function (isActive) {
    var pointerPinCoords = (MAP_WIDTH / 2) + ', ' + (Pin.main.START_Y + Pin.main.HEIGHT);
    var centerPinCoords = (MAP_WIDTH / 2) + ', ' + (Pin.main.START_Y + Pin.main.ROUND_SIDE / 2);
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

  // ======================= Валидация формы =======================

  // --------------------- Обработчики ---------------------

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
      case Rooms[1].amount:
        changeCapacityOptionsState(true);
        Guests[1].option.disabled = false;
        if (adFormCapacity.value !== Guests[1].amount) {
          adFormCapacity.value = Guests[1].amount;
        }
        break;
      case Rooms[2].amount:
        changeCapacityOptionsState(true);
        Guests[1].option.disabled = false;
        Guests[2].option.disabled = false;
        if (adFormCapacity.value !== Guests[1].amount
            && adFormCapacity.value !== Guests[2].amount) {
          adFormCapacity.value = Guests[2].amount;
        }
        break;
      case Rooms[3].amount:
        changeCapacityOptionsState(false);
        Guests[0].option.disabled = true;
        if (adFormCapacity.value === Guests[0].amount) {
          adFormCapacity.value = Guests[3].amount;
        }
        break;
      case Rooms[100].amount:
        changeCapacityOptionsState(true);
        Guests[0].option.disabled = false;
        if (adFormCapacity.value !== Guests[0].amount) {
          adFormCapacity.value = Guests[0].amount;
        }
        break;
      default:
        throw new Error(ErrorTexts.ROOMS);
    }
  };

  var onAdFormSubmit = function (ev) {
    if (!checkFormValidity()) {
      ev.preventDefault();
    }
  };

  // ------------------ Функции для обработки ------------------

  var changeCapacityOptionsState = function (isDisabled) {
    for (var i = 0; i < adFormCapacity.children.length; i++) {
      adFormCapacity.children[i].disabled = isDisabled;
    }
  };

  var setMinPrice = function (type) {
    switch (type) {
      case HouseTypes.BUNGALO.type:
        adFormPrice.min = HouseTypes.BUNGALO.minPrice;
        adFormPrice.placeholder = HouseTypes.BUNGALO.placeholder;
        break;
      case HouseTypes.FLAT.type:
        adFormPrice.min = HouseTypes.FLAT.minPrice;
        adFormPrice.placeholder = HouseTypes.FLAT.placeholder;
        break;
      case HouseTypes.HOUSE.type:
        adFormPrice.min = HouseTypes.HOUSE.minPrice;
        adFormPrice.placeholder = HouseTypes.HOUSE.placeholder;
        break;
      case HouseTypes.PALACE.type:
        adFormPrice.min = HouseTypes.PALACE.minPrice;
        adFormPrice.placeholder = HouseTypes.PALACE.placeholder;
        break;
      default:
        throw new Error(ErrorTexts.TYPE);
    }
    return adFormPrice.placeholder;
  };

  var checkInputValidity = function (input) {
    if (!input.validity.valid) {
      markAsInvalid(input);
      return false;
    }
    markAsValid(input);
    return true;
  };

  var checkTitleValidity = function () {
    if (!adFormTitle.validity.valid) {
      markAsInvalid(adFormTitle);
      invalidTitleMessageBox.classList.remove('hidden');

      if (adFormTitle.validity.valueMissing) {
        invalidTitleMessageBox.textContent = ErrorTexts.INVALID.empty;
      } else if (adFormTitle.validity.tooShort || adFormTitle.validity.tooLong) {
        invalidTitleMessageBox.textContent = ErrorTexts.INVALID.titleLength;
      }
      adFormTitle.addEventListener('input', onTitleInput);
      return false;
    }
    adFormTitle.removeEventListener('input', onTitleInput);
    invalidTitleMessageBox.classList.add('hidden');
    markAsValid(adFormTitle);
    return true;
  };

  var checkPriceValidity = function () {
    if (!adFormPrice.validity.valid) {
      markAsInvalid(adFormPrice);
      invalidPriceMessageBox.classList.remove('hidden');

      if (adFormPrice.validity.valueMissing) {
        invalidPriceMessageBox.textContent = ErrorTexts.INVALID.empty;
      } else if (adFormPrice.validity.rangeUnderflow) {
        invalidPriceMessageBox.textContent =
          ErrorTexts.INVALID.priceMin + setMinPrice() + '.';
      } else if (adFormPrice.validity.rangeOverflow) {
        invalidPriceMessageBox.textContent =
          ErrorTexts.INVALID.priceMax;
      }
      adFormPrice.addEventListener('input', onPriceInput);
      return false;
    }
    adFormPrice.removeEventListener('input', onPriceInput);
    invalidPriceMessageBox.classList.add('hidden');
    markAsValid(adFormPrice);
    return true;
  };

  var onTitleInput = function () {
    checkTitleValidity();
  };
  var onPriceInput = function () {
    checkPriceValidity();
  };

  var checkIfImage = function (input, label) {
    var imageRegExp = /.jpg$|.jpeg$|.png$/i;
    if (input.value && !imageRegExp.test(input.value)) {
      markAsInvalid(label);
      return false;
    }
    markAsValid(label);
    return true;
  };

  var checkFormValidity = function () {
    var isTitleValid = checkTitleValidity();
    var isPriceValid = checkPriceValidity();
    var isAddressValid = checkInputValidity(adFormAddress);
    var isAvatarValid = checkIfImage(adFormAvatar, adFormAvatarLabel);
    var isPhotosValid = checkIfImage(adFormPhotos, adFormPhotosLabel);
    return isTitleValid && isPriceValid && isAddressValid && isAvatarValid && isPhotosValid;
  };

  var markAsInvalid = function (input) {
    input.style.boxShadow = '0 0 5px 0 red';
  };
  var markAsValid = function (input) {
    input.style.boxShadow = '';
  };

  // ================================================================

  disableForms();
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
    invalidTitleMessageBox.classList.add('hidden');
    invalidPriceMessageBox.classList.add('hidden');
    clearMap();
    map.classList.add('map--faded');
  });
})();
