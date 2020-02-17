'use strict';

(function () {
  var Key = {
    LEFT_MOUSE_BTN: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
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

  window.util = {
    Key: Key,
    getRandomInt: getRandomInt,
    getRandomFromArr: getRandomFromArr,
    ErrorTexts: ErrorText,
    InvalidText: InvalidText
  };
})();
