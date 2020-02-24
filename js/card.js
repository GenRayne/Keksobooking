'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var HouseTypeToName = window.util.HouseTypeToName;

  // ---------------- Переменные модуля ----------------

  var NumberForDeclension = {
    SINGULAR: 1,
    SINGULAR_DECLINED_MIN: 1,
    SINGULAR_DECLINED_MAX: 5,
    PLURAL_1: 11
  };

  var cardTemplate = document.querySelector('#card').content;
  var cardContainer = cardTemplate.querySelector('.map__card');

  // ======================= Создание карточки =======================

  var createCard = function (ad) {
    var newCard = cardContainer.cloneNode(true);
    newCard.querySelector('.popup__title').textContent = ad.offer.title;
    newCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    newCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

    var placeType = newCard.querySelector('.popup__type');
    placeType.textContent = HouseTypeToName[ad.offer.type];
    var capacity = newCard.querySelector('.popup__text--capacity');
    capacity.textContent = formCapacityText(ad.offer.rooms, ad.offer.guests);
    var hours = newCard.querySelector('.popup__text--time');
    hours.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var features = newCard.querySelector('.popup__features');
    features.innerHTML = '';
    if (ad.offer.features.length) {
      features.appendChild(createFeaturesList(ad.offer.features));
    } else {
      features.classList.add('hidden');
    }

    var description = newCard.querySelector('.popup__description');
    if (ad.offer.description) {
      description.textContent = ad.offer.description;
    } else {
      description.classList.add('hidden');
    }

    var photos = newCard.querySelector('.popup__photos');
    var photo = photos.querySelector('.popup__photo');
    photos.innerHTML = '';
    if (ad.offer.photos.length) {
      photos.appendChild(createPhotoList(ad.offer.photos, photo));
    } else {
      photos.classList.add('hidden');
    }

    var avatar = newCard.querySelector('.popup__avatar');
    avatar.src = ad.author.avatar;

    return newCard;
  };

  var formCapacityText = function (roomsQuantity, guestsQuantity) {
    var text = roomsQuantity;

    if (roomsQuantity === NumberForDeclension.SINGULAR) {
      text += ' комната ';
    } else if (roomsQuantity.toString().slice(-1) > NumberForDeclension.SINGULAR_DECLINED_MIN &&
               roomsQuantity.toString().slice(-1) < NumberForDeclension.SINGULAR_DECLINED_MAX) {
      text += ' комнаты ';
    } else {
      text += ' комнат ';
    }
    if (guestsQuantity === NumberForDeclension.SINGULAR ||
       (guestsQuantity > NumberForDeclension.PLURAL_1 &&
        guestsQuantity.toString().slice(-1) === NumberForDeclension.SINGULAR &&
        guestsQuantity.toString().slice(-2) !== NumberForDeclension.PLURAL_1)) {
      text += 'для ' + guestsQuantity + ' гостя';
    } else {
      text += 'для ' + guestsQuantity + ' гостей';
    }
    return text;
  };

  var createFeaturesList = function (features) {
    var newFeatures = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature');
      newFeature.classList.add('popup__feature--' + features[i]);
      newFeatures.appendChild(newFeature);
    }
    return newFeatures;
  };

  var createPhotoList = function (photos, photo) {
    var newPhotos = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      var newPhoto = photo.cloneNode();
      newPhoto.src = photos[i];
      newPhotos.appendChild(newPhoto);
    }
    return newPhotos;
  };

  // =================================================================
  // Экспорт:

  window.card = {
    createCard: createCard
  };

})();
