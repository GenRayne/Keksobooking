'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var Key = window.util.Key;

  // ---------------- Переменные модуля ----------------

  var mainBlock = document.querySelector('main');
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

  // ============== Уведомления по результатам отправки формы ==============

  var showNotification = function (block, message) {
    if (message) {
      errorMessage.textContent = message;
    }

    if (block.classList.contains('hidden')) {
      block.classList.remove('hidden');
    } else {
      mainBlock.appendChild(block);
    }

    // ------------------ Обработчики ------------------

    var onButtonClick = function (evt) {
      if (evt.button === Key.LEFT_MOUSE_BTN) {
        block.classList.add('hidden');
        removeListeners();
      }
    };

    var onEscPress = function (evt) {
      if (evt.key === Key.ESCAPE) {
        block.classList.add('hidden');
        removeListeners();
      }
    };

    var onOutsideClick = function (evt) {
      if (evt.target !== errorMessage && evt.target !== successMessage) {
        block.classList.add('hidden');
        removeListeners();
      }
    };

    // ------------------------------------------------

    var removeListeners = function () {
      block.removeEventListener('click', onOutsideClick);
      document.removeEventListener('keydown', onEscPress);
      if (block === Notification.ERROR) {
        tryAgainBtn.removeEventListener('click', onButtonClick);
      }
    };

    document.addEventListener('keydown', onEscPress);
    block.addEventListener('click', onOutsideClick);
    if (block === Notification.ERROR) {
      tryAgainBtn.addEventListener('click', onButtonClick);
    }
  };

  // =================================================================
  // Экспорт:

  window.notification = {
    showNotification: showNotification,
    errorBlock: errorBlock,
    successBlock: successBlock
  };

})();
