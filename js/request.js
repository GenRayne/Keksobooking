'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var showNotification = window.notifications.showNotification;
  var successBlock = window.notifications.successBlock;
  var errorBlock = window.notifications.errorBlock;
  var createPins = window.pins.createPins;

  // ---------------- Переменные формы ----------------

  var Request = {
    TIMEOUT: 10000,
    GET: 'GET',
    POST: 'POST',
    READY_STATE_LOAD: 4,
    OK_STATUS: 200
  };
  var methodToUrl = {
    'GET': 'https://js.dump.academy/keksobooking/data',
    'POST': 'https://js.dump.academy/keksobooking',
  };
  var RequestErrorText = {
    ERROR: 'Ошибка соединения. Проверьте подключение к сети.',
    TIMEOUT: 'Время ожидания выполнения запроса превышено.',
    FAILED_UPLOAD: 'Ошибка загрузки объявления'
  };
  var requestResult = {
    ads: [],
    errorMessage: ''
  };

  window.request = function (method, data) {
    var xhr = new XMLHttpRequest();

    var onSuccess = function (result) {
      if (method === Request.GET) {
        createPins(result);
        requestResult.ads = result;
        requestResult.errorMessage = '';
        return;
      }
      showNotification(successBlock);
    };
    var onError = function (message) {
      requestResult.errorMessage = message;
      if (method === Request.POST) {
        showNotification(errorBlock, RequestErrorText.FAILED_UPLOAD);
      } else {
        showNotification(errorBlock, message);
      }
    };

    xhr.addEventListener('load', function () {
      if (Request.READY_STATE_LOAD && Request.OK_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }
      window.requestData = requestResult;
    });

    xhr.addEventListener('error', function () {
      onError(RequestErrorText.ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(RequestErrorText.TIMEOUT);
    });

    xhr.responseType = 'json';
    xhr.timeout = Request.TIMEOUT;
    xhr.open(method, methodToUrl[method]);
    xhr.send(data);

    return requestResult;
  };

})();
