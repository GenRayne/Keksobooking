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
    block.classList.remove('hidden');
    if (block === Notification.ERROR && !document.querySelector('.error')) {
      mainBlock.appendChild(errorBlock);
    }
    if (block === Notification.SUCCESS && !document.querySelector('.success')) {
      mainBlock.appendChild(successBlock);
    }

    var onBlockClose = function (evt) {
      if (evt.button === Key.LEFT_MOUSE_BTN || evt.key === Key.ESCAPE) {
        block.classList.add('hidden');
        document.removeEventListener('keydown', onBlockClose);
        if (block === Notification.ERROR) {
          tryAgainBtn.removeEventListener('click', onBlockClose);
        }
      }
    };
    var onOutsideClick = function (evt) {
      if (evt.target !== errorMessage && evt.target !== successMessage) {
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

  // =================================================================
  // Экспорт:

  window.notification = {
    showNotification: showNotification,
    errorBlock: errorBlock,
    successBlock: successBlock
  };

})();
