'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var map = window.pins.map;
  var createPins = window.pins.createPins;
  var HouseType = window.util.HouseType;
  // ------------------ Начатое 7.3 ------------------
  // var RoomsQuantity = window.util.RoomsQuantity;
  // var GuestsNumber = window.util.GuestsNumber;

  // ---------------- Переменные формы ----------------

  var filterForm = map.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRooms = filterForm.querySelector('#housing-rooms');
  var filterFormCapacity = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = filterForm.querySelector('#housing-features');

  var filterFormInputs = [
    filterFormType,
    filterFormPrice,
    filterFormRooms,
    filterFormCapacity,
    filterFormFeatures
  ];

  // ------------------ Начатое 7.3 ------------------
  // var Price = {
  //   ANY: 'any',
  //   LOW: 'low',
  //   MIDDLE: 'middle',
  //   HIGH: 'high'
  // };
  // var PricingStep = {
  //   LOW: 10000,
  //   HIGH: 50000
  // };
  // ---------------------------------------------------------------

  var selected = {
    type: undefined,
    price: undefined,
    rooms: undefined,
    capacity: undefined
  };

  // =================================================================

  var updatePins = function () {

    var sameTypeAds = window.requestData.ads.filter(function (ad) {
      if (!selected.type || selected.type === HouseType.ANY) {
        return true;
      }
      return ad.offer.type === selected.type;
    });

    // ------------------ Начатая фильтрация для 7.3 ------------------

    // var samePriceAds = window.requestData.ads.filter(function (ad) {
    //   switch (selected.price) {
    //     case Price.LOW:
    //       return ad.offer.price < PricingStep.LOW;
    //     case Price.MIDDLE:
    //       return ad.offer.price > PricingStep.LOW &&
    //              ad.offer.price < PricingStep.HIGH;
    //     case Price.HIGH:
    //       return ad.offer.price > PricingStep.HIGH;
    //     default:
    //       return ad.offer.price;
    //   }
    // });

    // var sameRoomsAds = window.requestData.ads.filter(function (ad) {
    //   if (!selected.rooms || selected.rooms === RoomsQuantity.ANY) {
    //     return true;
    //   }
    //   return ad.offer.rooms === +selected.rooms;
    // });

    // var sameCapacityAds = window.requestData.ads.filter(function (ad) {
    //   if (!selected.capacity || selected.capacity === GuestsNumber.ANY) {
    //     return true;
    //   }
    //   return ad.offer.guests === +selected.capacity;
    // });

    // ---------------------------------------------------------------

    var filteredAds = sameTypeAds;

    // ------------------ Начатая фильтрация для 7.3 ------------------

    // .concat(samePriceAds).concat(sameRoomsAds).concat(sameCapacityAds)
    // .filter(function (item, i, arr) {
    //   return arr.indexOf(item) !== i;
    // })
    // .filter(function (item, i, arr) {
    //   return arr.indexOf(item) === i;
    // });
    // ---------------------------------------------------------------

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

  // =================================================================
  // Экспорт:

  window.filter = {
    filterFormInputs: filterFormInputs,
    filterForm: filterForm
  };
})();
