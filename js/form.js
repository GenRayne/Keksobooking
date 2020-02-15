'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var MainPin = window.pins.MainPin;
  var mainPinEl = window.pins.mainPinEl;
  var pinsBlock = window.pins.pinsBlock;
  var Key = window.pins.Key;
  var createPins = window.pins.createPins;

  var map = window.data.map;
  var HouseType = window.data.HouseType;
  var HouseMinPrice = window.data.HouseMinPrice;
  var HousePlaceholder = window.data.HousePlaceholder;
  var RoomsAmount = window.data.RoomsAmount;
  var GuestsAmount = window.data.GuestsAmount;
  var GuestsOptions = window.data.GuestsOption;
  var ErrorText = window.data.ErrorText;
  var InvalidText = window.data.InvalidText;
  var MAP_WIDTH = window.data.MAP_WIDTH;

  var request = window.request.request;

  // ---------------- Переменные формы ----------------

  var imageRegExp = /.jpg$|.jpeg$|.png$/i;
  var mainContent = document.querySelector('main');

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

  var errorTemplate = document.querySelector('#error').content;
  var errorBlock = errorTemplate.querySelector('.error').cloneNode(true);
  var errorMessage = errorBlock.querySelector('.error__message');
  var tryAgainBtn = errorBlock.querySelector('.error__button');

  var successTemplate = document.querySelector('#success').content;
  var successBlock = successTemplate.querySelector('.success').cloneNode(true);
  var successMessage = successBlock.querySelector('.success__message');

  var Notification = {
    ERROR: errorBlock,
    SUCCESS: successBlock
  };

  // ============== Активация карты и работа с формами ==============

  var onMainPinMousedown = function (ev) {
    if (ev.button === Key.LEFT_MOUSE_BTN) {
      activateMap();
    }
  };
  var onMainPinEnterPress = function (ev) {
    if (ev.key === Key.ENTER) {
      activateMap();
    }
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    enableForms();
    setDefaultAddressValue(true);
    mainPinEl.removeEventListener('mousedown', onMainPinMousedown);
    mainPinEl.removeEventListener('keydown', onMainPinEnterPress);
    createPins(request('GET').ads);
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
      case RoomsAmount[1]:
        changeCapacityOptionsState(true);
        GuestsOptions[1].disabled = false;
        if (adFormCapacity.value !== GuestsAmount[1]) {
          adFormCapacity.value = GuestsAmount[1];
        }
        break;
      case RoomsAmount[2]:
        changeCapacityOptionsState(true);
        GuestsOptions[1].disabled = false;
        GuestsOptions[2].disabled = false;
        if (adFormCapacity.value !== GuestsAmount[1]
            && adFormCapacity.value !== GuestsAmount[2]) {
          adFormCapacity.value = GuestsAmount[2];
        }
        break;
      case RoomsAmount[3]:
        changeCapacityOptionsState(false);
        GuestsOptions[0].disabled = true;
        if (adFormCapacity.value === GuestsAmount[0]) {
          adFormCapacity.value = GuestsAmount[3];
        }
        break;
      case RoomsAmount[100]:
        changeCapacityOptionsState(true);
        GuestsOptions[0].disabled = false;
        if (adFormCapacity.value !== GuestsAmount[0]) {
          adFormCapacity.value = GuestsAmount[0];
        }
        break;
      default:
        throw new Error(ErrorText.ROOMS);
    }
  };

  var onAdFormSubmit = function (ev) {
    adFormTitle.removeEventListener('input', onTitleInput);
    adFormPrice.removeEventListener('input', onPriceInput);
    ev.preventDefault();
    if (checkFormValidity()) {
      var adFormData = new FormData(adForm);
      var res = request('POST', adFormData);
      if (res.errorMessage) {
        showNotification(errorBlock);
      } else {
        showNotification(successBlock);
      }
    }
  };

  // ============== Уведомления по результатам отправки формы ==============

  var showNotification = function (block) {
    block.classList.remove('hidden');
    if (block === Notification.ERROR && !document.querySelector('.error')) {
      mainContent.appendChild(errorBlock);
    }
    if (block === Notification.SUCCESS && !document.querySelector('.success')) {
      mainContent.appendChild(successBlock);
    }

    var onBlockClose = function (ev) {
      if (ev.button === Key.LEFT_MOUSE_BTN || ev.key === Key.ESCAPE) {
        block.classList.add('hidden');
        document.removeEventListener('keydown', onBlockClose);
        if (block === Notification.ERROR) {
          tryAgainBtn.removeEventListener('click', onBlockClose);
        }
      }
    };
    var onOutsideClick = function (ev) {
      if (ev.target !== errorMessage && ev.target !== successMessage) {
        block.classList.add('hidden');
        block.removeEventListener('click', onOutsideClick);
      }
    };

    document.addEventListener('keydown', onBlockClose);
    block.addEventListener('click', onOutsideClick);
    if (block === Notification.ERROR) {
      tryAgainBtn.addEventListener('click', onBlockClose);
    }
  };

  // ------------------ Функции для валидации ------------------

  var changeCapacityOptionsState = function (isDisabled) {
    for (var i = 0; i < adFormCapacity.children.length; i++) {
      adFormCapacity.children[i].disabled = isDisabled;
    }
  };

  var setMinPrice = function () {
    switch (adFormType.value) {
      case HouseType.BUNGALO:
        adFormPrice.min = HouseMinPrice.BUNGALO;
        adFormPrice.placeholder = HousePlaceholder.BUNGALO;
        break;
      case HouseType.FLAT:
        adFormPrice.min = HouseMinPrice.FLAT;
        adFormPrice.placeholder = HousePlaceholder.FLAT;
        break;
      case HouseType.HOUSE:
        adFormPrice.min = HouseMinPrice.HOUSE;
        adFormPrice.placeholder = HousePlaceholder.HOUSE;
        break;
      case HouseType.PALACE:
        adFormPrice.min = HouseMinPrice.PALACE;
        adFormPrice.placeholder = HousePlaceholder.PALACE;
        break;
      default:
        throw new Error(ErrorText.TYPE);
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
        invalidTitleMessageBox.textContent = InvalidText.EMPTY;
      } else if (adFormTitle.validity.tooShort || adFormTitle.validity.tooLong) {
        invalidTitleMessageBox.textContent = InvalidText.TITLE_LENGTH;
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
        invalidPriceMessageBox.textContent = InvalidText.EMPTY;
      } else if (adFormPrice.validity.rangeUnderflow) {
        invalidPriceMessageBox.textContent =
          InvalidText.PRICE_MIN + setMinPrice() + '.';
      } else if (adFormPrice.validity.rangeOverflow) {
        invalidPriceMessageBox.textContent =
          InvalidText.PRICE_MAX;
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
