'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var MainPin = window.pins.MainPin;
  var mainPinEl = window.pins.mainPinEl;
  var Keys = window.pins.Keys;
  var createPins = window.pins.createPins;

  var HouseTypes = window.data.HouseTypes;
  var HouseMinPrices = window.data.HouseMinPrices;
  var HousePlaceholders = window.data.HousePlaceholders;
  var Rooms = window.data.Rooms;
  var Guests = window.data.Guests;
  var GuestsOptions = window.data.GuestsOptions;
  var ErrorTexts = window.data.ErrorTexts;
  var InvalidTexts = window.data.InvalidTexts;
  var MAP_WIDTH = window.data.MAP_WIDTH;

  var requestData = window.request.requestData;

  // ---------------- Переменные формы ----------------

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var imageRegExp = /.jpg$|.jpeg$|.png$/i;

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
    mainPinEl.removeEventListener('mousedown', onMainPinMousedown);
    mainPinEl.removeEventListener('keydown', onMainPinEnterPress);
    createPins(requestData().ads);
  };

  var disableForms = function () {
    adForm.classList.add('ad-form--disabled');
    changeInputsState(adFormInputs, true);
    changeInputsState(filterFormInputs, true);
    setDefaultAddressValue();
    mainPinEl.addEventListener('mousedown', onMainPinMousedown);
    mainPinEl.addEventListener('keydown', onMainPinEnterPress);
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
    var pointerPinCoords = (MAP_WIDTH / 2) + ', ' + (MainPin.START_Y + MainPin.HEIGHT);
    var centerPinCoords = (MAP_WIDTH / 2) + ', ' + (MainPin.START_Y + MainPin.ROUND_SIDE / 2);
    adFormAddress.value = isActive ? pointerPinCoords : centerPinCoords;
  };

  var clearMap = function () {
    var pins = pinsBlock.querySelectorAll('.map__pin');
    var cards = map.querySelectorAll('.map__card.popup');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pinsBlock.removeChild(pins[i]);
      }
      if (cards[i]) {
        map.removeChild(cards[i]);
      }
    }
  };

  // ======================= Валидация формы =======================

  // --------------------- Обработчики ---------------------

  var onAdTypeChange = function () {
    setMinPrice();
  };

  var onTimeoutChange = function () {
    adFormTimein.value = adFormTimeout.value;
  };
  var onTimeinChange = function () {
    adFormTimeout.value = adFormTimein.value;
  };

  var onRoomsChange = function () {
    switch (adFormRooms.value) {
      case Rooms[1]:
        changeCapacityOptionsState(true);
        GuestsOptions[1].disabled = false;
        if (adFormCapacity.value !== Guests[1]) {
          adFormCapacity.value = Guests[1];
        }
        break;
      case Rooms[2]:
        changeCapacityOptionsState(true);
        GuestsOptions[1].disabled = false;
        GuestsOptions[2].disabled = false;
        if (adFormCapacity.value !== Guests[1]
            && adFormCapacity.value !== Guests[2]) {
          adFormCapacity.value = Guests[2];
        }
        break;
      case Rooms[3]:
        changeCapacityOptionsState(false);
        GuestsOptions[0].disabled = true;
        if (adFormCapacity.value === Guests[0]) {
          adFormCapacity.value = Guests[3];
        }
        break;
      case Rooms[100]:
        changeCapacityOptionsState(true);
        GuestsOptions[0].disabled = false;
        if (adFormCapacity.value !== Guests[0]) {
          adFormCapacity.value = Guests[0];
        }
        break;
      default:
        throw new Error(ErrorTexts.ROOMS);
    }
  };

  var onAdFormSubmit = function (ev) {
    adFormTitle.removeEventListener('input', onTitleInput);
    adFormPrice.removeEventListener('input', onPriceInput);
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

  var setMinPrice = function () {
    switch (adFormType.value) {
      case HouseTypes.BUNGALO:
        adFormPrice.min = HouseMinPrices.BUNGALO;
        adFormPrice.placeholder = HousePlaceholders.BUNGALO;
        break;
      case HouseTypes.FLAT:
        adFormPrice.min = HouseMinPrices.FLAT;
        adFormPrice.placeholder = HousePlaceholders.FLAT;
        break;
      case HouseTypes.HOUSE:
        adFormPrice.min = HouseMinPrices.HOUSE;
        adFormPrice.placeholder = HousePlaceholders.HOUSE;
        break;
      case HouseTypes.PALACE:
        adFormPrice.min = HouseMinPrices.PALACE;
        adFormPrice.placeholder = HousePlaceholders.PALACE;
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
        invalidTitleMessageBox.textContent = InvalidTexts.EMPTY;
      } else if (adFormTitle.validity.tooShort || adFormTitle.validity.tooLong) {
        invalidTitleMessageBox.textContent = InvalidTexts.TITLE_LENGTH;
      }
      adFormTitle.addEventListener('input', onTitleInput);
      return false;
    }
    invalidTitleMessageBox.classList.add('hidden');
    markAsValid(adFormTitle);
    return true;
  };

  var checkPriceValidity = function () {
    if (!adFormPrice.validity.valid) {
      markAsInvalid(adFormPrice);
      invalidPriceMessageBox.classList.remove('hidden');

      if (adFormPrice.validity.valueMissing) {
        invalidPriceMessageBox.textContent = InvalidTexts.EMPTY;
      } else if (adFormPrice.validity.rangeUnderflow) {
        invalidPriceMessageBox.textContent =
          InvalidTexts.PRICE_MIN + setMinPrice() + '.';
      } else if (adFormPrice.validity.rangeOverflow) {
        invalidPriceMessageBox.textContent =
          InvalidTexts.PRICE_MAX;
      }
      adFormPrice.addEventListener('input', onPriceInput);
      return false;
    }
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
    if (input.value && !input.value.match(imageRegExp)) {
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

  // =================================================================

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
