'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var map = window.pins.map;
  var createPins = window.pins.createPins;
  var HouseType = window.util.HouseType;

  var RoomsQuantity = window.util.RoomsQuantity;
  var GuestsNumber = window.util.GuestsNumber;

  var showNotification = window.notifications.showNotification;
  var errorBlock = window.notifications.errorBlock;

  // ---------------- Переменные формы ----------------

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
    showNotification(errorBlock, message);
  };
  var onRequestSuccess = function (data) {
    ads = data;
  };

  // =================================================================

  var updatePins = function () {
    // Сравниваем у всех доступных после разных этапов фильтрации объявлений:
    // ----------- 1. Типы -----------
    var sameTypeAds = ads.filter(function (ad) {
      if (!selected.type || selected.type === HouseType.ANY) {
        return true;
      }
      return ad.offer.type === selected.type;
    });

    // ----------- 2. Цены -----------
    var samePriceAds = sameTypeAds.filter(function (ad) {
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
    });

    // ----------- 3. Комнаты -----------
    var sameRoomsAds = samePriceAds.filter(function (ad) {
      if (!selected.rooms || selected.rooms === RoomsQuantity.ANY) {
        return true;
      }
      return ad.offer.rooms === +selected.rooms;
    });

    // ----------- 4. Вместимость -----------
    var sameCapacityAds = sameRoomsAds.filter(function (ad) {
      if (!selected.capacity || selected.capacity === GuestsNumber.ANY) {
        return true;
      }
      return ad.offer.guests === +selected.capacity;
    });

    // ----------- 5. Удобства -----------
    var filteredAds = sameCapacityAds
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

    createPins(filteredAds);
  };

  // --------------------- Слушатели ---------------------

  filterFormType.addEventListener('input', function () {
    selected.type = filterFormType.value;
    updatePins();
  });
  filterFormPrice.addEventListener('input', function () {
    selected.price = filterFormPrice.value;
    updatePins();
  });
  filterFormRooms.addEventListener('input', function () {
    selected.rooms = filterFormRooms.value;
    updatePins();
  });
  filterFormCapacity.addEventListener('input', function () {
    selected.capacity = filterFormCapacity.value;
    updatePins();
  });
  filterFeaturesFields.forEach(function (checkbox) {
    // Формируем массив выбранных удобств
    checkbox.addEventListener('change', function () {
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
  });

  // =================================================================

  window.request('GET', onRequestSuccess, onRequestError);

  // =================================================================
  // Экспорт:

  window.filter = {
    filterFormInputs: filterFormInputs,
    filterForm: filterForm
  };
})();
