'use strict';

(function () {
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
    TIMEOUT: 'Время ожидания выполнения запроса превышено.'
  };
  var ads = [];
  var errorMessage = '';

  var request = function (method, data) {
    var xhr = new XMLHttpRequest();

    var onSuccess = function (result) {
      if (method === Request.GET) {
        ads = result;
        return;
      }
      ads = [];
    };
    var onError = function (message) {
      errorMessage = message;
    };

    xhr.addEventListener('load', function () {
      if (Request.READY_STATE_LOAD && Request.OK_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }
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

    var requestResult = {
      ads: ads,
      errorMessage: errorMessage
    };

    return requestResult;
  };

  request('GET');

  // =================================================================
  // Экспорт:

  window.request = {
    request: request,
    RequestErrorText: RequestErrorText
  };

})();
