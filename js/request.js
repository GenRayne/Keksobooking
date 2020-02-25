'use strict';

(function () {
  // ---------------- Переменные модуля ----------------

  var Request = {
    TIMEOUT: 10,
    GET: 'GET',
    POST: 'POST',
    READY_STATE_LOAD: 4,
    OK_STATUS: 200
  };

  var RequestErrorText = {
    ERROR: 'Ошибка соединения. Проверьте подключение к сети',
    TIMEOUT: 'Время ожидания выполнения запроса превышено',
    FAILED_UPLOAD: 'Ошибка загрузки объявления'
  };

  var methodToUrl = {
    'GET': 'https://js.dump.academy/keksobooking/data',
    'POST': 'https://js.dump.academy/keksobooking',
  };

  // =================================================================

  window.request = function (method, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.readyState === Request.READY_STATE_LOAD &&
          xhr.status === Request.OK_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      if (method === Request.GET) {
        onError(RequestErrorText.ERROR);
      } else {
        onError(RequestErrorText.FAILED_UPLOAD);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError(RequestErrorText.TIMEOUT);
    });

    xhr.responseType = 'json';
    xhr.timeout = Request.TIMEOUT;
    xhr.open(method, methodToUrl[method]);
    xhr.send(data);
  };

})();
