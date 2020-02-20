'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormCapacity = adForm.querySelector('#capacity');

  var Key = {
    LEFT_MOUSE_BTN: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var InvalidText = {
    EMPTY: 'Это поле обязательно для заполнения.',
    TITLE_LENGTH: 'Длина заголовка должна составлять не менее 30 и не более 100 символов.',
    PRICE_MIN: 'Цена для выбранного типа жилья не может быть ниже ',
    PRICE_MAX: 'Цена для выбранного типа жилья не может быть выше 1 000 000.'
  };

  var HouseType = {
    ANY: 'any',
    BUNGALO: 'bungalo',
    FLAT: 'flat',
    HOUSE: 'house',
    PALACE: 'palace'
  };
  var HouseTypeToName = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  var HouseTypeToMinPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var RoomsQuantity = {
    ANY: 'any',
    1: '1',
    2: '2',
    3: '3',
    100: '100'
  };
  var GuestsNumber = {
    ANY: 'any',
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

  // =================================================================
  // Экспорт:

  window.util = {
    Key: Key,
    HouseType: HouseType,
    HouseTypeToName: HouseTypeToName,
    HouseTypeToMinPrice: HouseTypeToMinPrice,
    RoomsQuantity: RoomsQuantity,
    GuestsNumber: GuestsNumber,
    GuestsOption: GuestsOption,
    InvalidText: InvalidText
  };
})();
