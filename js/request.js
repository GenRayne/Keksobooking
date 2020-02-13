'use strict';

(function () {
  var REQUEST_TIMEOUT = 10000;
  var REQUEST_URL = 'https://js.dump.academy/keksobooking/data';
  var RequestStates = {
    LOAD: 4,
    OK_STATUS: 200
  };
  var RequestErrorTexts = {
    ERROR: 'Ошибка соединения. Проверьте подключение к сети.',
    TIMEOUT: 'Время ожидания выполнения запроса превышено.'
  };
  var ads = '';
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
      switch (xhr.status) {
        case RequestStates.LOAD:
        case RequestStates.OK_STATUS:
          onSuccess(xhr.response);
          break;
        default:
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
    xhr.timeout = REQUEST_TIMEOUT;
    xhr.open('GET', REQUEST_URL);
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
