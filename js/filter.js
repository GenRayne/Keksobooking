'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var map = window.pins.map;
  var renderPins = window.pins.render;
  var HouseType = window.util.HouseType;

  var RoomsQuantity = window.util.RoomsQuantity;
  var GuestsNumber = window.util.GuestsNumber;

  var notify = window.notification.notify;
  var errorBlock = window.notification.errorBlock;

  // ---------------- Переменные модуля ----------------

  var Price = {
    ANY: 'any',
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var PricingStep = {
    LOW: 10000,
    HIGH: 50000
  };

  var filterForm = map.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRooms = filterForm.querySelector('#housing-rooms');
  var filterFormCapacity = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = filterForm.querySelector('#housing-features');
  var filterFeaturesFields = filterFormFeatures.querySelectorAll('.map__checkbox');

  var filterFormInputs = [
    filterFormType,
    filterFormPrice,
    filterFormRooms,
    filterFormCapacity,
    filterFormFeatures
  ];

  // ---------------------------------------------------------------

  var ads = [];

  var selected = {
    type: undefined,
    price: undefined,
    rooms: undefined,
    capacity: undefined,
    features: []
  };

  var onRequestError = function (message) {
    notify(errorBlock, message);
  };
  var onRequestSuccess = function (data) {
    ads = data;
  };

  // =================================================================

  var updatePins = function () {
    // Сравниваем у всех доступных после разных этапов фильтрации объявлений:

    // ----------- 1. Типы -----------

    var filteredAds = ads.filter(function (ad) {
      if (!selected.type || selected.type === HouseType.ANY) {
        return true;
      }
      return ad.offer.type === selected.type;
    })

    // ----------- 2. Цены -----------

    .filter(function (ad) {
      switch (selected.price) {
        case Price.LOW:
          return ad.offer.price < PricingStep.LOW;
        case Price.MIDDLE:
          return ad.offer.price > PricingStep.LOW &&
                 ad.offer.price < PricingStep.HIGH;
        case Price.HIGH:
          return ad.offer.price > PricingStep.HIGH;
        default:
          return ad.offer.price;
      }
    })

    // ----------- 3. Комнаты -----------

    .filter(function (ad) {
      if (!selected.rooms || selected.rooms === RoomsQuantity.ANY) {
        return true;
      }
      return ad.offer.rooms === +selected.rooms;
    })

    // ----------- 4. Вместимость -----------

    .filter(function (ad) {
      if (!selected.capacity || selected.capacity === GuestsNumber.ANY) {
        return true;
      }
      return ad.offer.guests === +selected.capacity;
    })

    // ----------- 5. Удобства -----------

    .filter(function (ad) {
      var selectedCounter = 0;
      selected.features.forEach(function (feature) {
        if (ad.offer.features.includes(feature)) {
          selectedCounter += 1;
        }
      });
      return ad.offer.features.length >= selectedCounter &&
             selected.features.length === selectedCounter;
    });

    renderPins(filteredAds);
  };

  // --------------------- Обработчики ---------------------

  var onTypeChange = window.debounce(function () {
    selected.type = filterFormType.value;
    updatePins();
  });
  var onPriceChange = window.debounce(function () {
    selected.price = filterFormPrice.value;
    updatePins();
  });
  var onRoomsChange = window.debounce(function () {
    selected.rooms = filterFormRooms.value;
    updatePins();
  });
  var onCapacityChange = window.debounce(function () {
    selected.capacity = filterFormCapacity.value;
    updatePins();
  });
  var onFeatureChange = window.debounce(function (checkbox) {
    // Формируем массив выбранных удобств
    if (checkbox.checked) {
      selected.features.push(checkbox.value);
    } else {
      var i = selected.features.findIndex(function (feature) {
        return feature === checkbox.value;
      });
      selected.features.splice(i, 1);
    }
    updatePins();
  });

  // --------------------- Слушатели ---------------------

  filterFormType.addEventListener('input', onTypeChange);
  filterFormPrice.addEventListener('input', onPriceChange);
  filterFormRooms.addEventListener('input', onRoomsChange);
  filterFormCapacity.addEventListener('input', onCapacityChange);
  filterFeaturesFields.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      onFeatureChange(checkbox);
    });
  });

  // =================================================================

  window.load('GET', onRequestSuccess, onRequestError);

  // =================================================================
  // Экспорт:

  window.filter = {
    inputs: filterFormInputs,
    form: filterForm,
    onRequestError: onRequestError
  };
})();
