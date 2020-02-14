'use strict';

(function () {
  // --------------------- Импорт ---------------------
  var HouseTypes = window.data.HouseTypes;
  var HouseNames = window.data.HouseNames;
  var ErrorTexts = window.data.ErrorTexts;

  // ---------------- Переменные формы ----------------
  var SINGULAR_AMOUNT = 1;
  var singularDeclAmounts = {MIN: 1, MAX: 5};
  var PLURAL_1 = 11;

  var cardTemplate = document.querySelector('#card').content;
  var cardContainer = cardTemplate.querySelector('.map__card');

  // ======================= Создание карточки =======================

  var createCard = function (ad) {
    var newCard = cardContainer.cloneNode(true);
    newCard.querySelector('.popup__title').textContent = ad.offer.title;
    newCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    newCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

    var placeType = newCard.querySelector('.popup__type');
    placeType.textContent = choosePlaceType(ad.offer.type);
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

  var choosePlaceType = function (place) {
    var type;
    switch (place) {
      case HouseTypes.BUNGALO:
        type = HouseNames.BUNGALO;
        break;
      case HouseTypes.FLAT:
        type = HouseNames.FLAT;
        break;
      case HouseTypes.HOUSE:
        type = HouseNames.HOUSE;
        break;
      case HouseTypes.PALACE:
        type = HouseNames.PALACE;
        break;
      default:
        throw new Error(ErrorTexts.TYPE);
    }
    return type;
  };

  var formCapacityText = function (roomsQuantity, guestsQuantity) {
    var text = roomsQuantity;

    if (roomsQuantity === SINGULAR_AMOUNT) {
      text += ' комната ';
    } else if (roomsQuantity.toString().slice(-1) > singularDeclAmounts.MIN &&
               roomsQuantity.toString().slice(-1) < singularDeclAmounts.MAX) {
      text += ' комнаты ';
    } else {
      text += ' комнат ';
    }
    if (guestsQuantity === SINGULAR_AMOUNT || (guestsQuantity > PLURAL_1 &&
        guestsQuantity.toString().slice(-1) === SINGULAR_AMOUNT &&
        guestsQuantity.toString().slice(-2) !== PLURAL_1)) {
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
