'use strict';

(function () {
  var Request = {
    TIMEOUT: 10000,
    URL: 'https://js.dump.academy/keksobooking/data',
    READY_STATE_LOAD: 4,
    OK_STATUS: 200
  };
  var RequestErrorTexts = {
    ERROR: 'Ошибка соединения. Проверьте подключение к сети.',
    TIMEOUT: 'Время ожидания выполнения запроса превышено.'
  };
  var ads = [];
  var requestMessage = '';

  var requestData = function () {
    var xhr = new XMLHttpRequest();

    var onSuccess = function (data) {
      ads = data;
    };
    var onError = function (message) {
      requestMessage = message;
    };

    xhr.addEventListener('load', function () {
      if (Request.READY_STATE_LOAD && Request.OK_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(RequestErrorTexts.ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(RequestErrorTexts.TIMEOUT);
    });

    xhr.responseType = 'json';
    xhr.timeout = Request.TIMEOUT;
    xhr.open('GET', Request.URL);
    xhr.send();

    var request = {
      ads: ads,
      requestMessage: requestMessage
    };

    return request;
  };

  requestData();

  // =================================================================
  // Экспорт:

  window.request = {
    requestData: requestData,
  };

})();
