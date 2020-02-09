'use strict';

(function () {
  // --------------------- Импорт ---------------------
  var HouseTypes = window.data.HouseTypes;
  var Rooms = window.data.Rooms;
  var Guests = window.data.Guests;
  var ErrorTexts = window.data.ErrorTexts;

  // ---------------- Переменные формы ----------------
  var cardTemplate = document.querySelector('#card').content;

  // ======================= Создание карточки =======================

  var createCard = function (ad) {
    var cardContainer = cardTemplate.querySelector('.map__card');
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
    if (ad.offer.photos.length) {
      var photo = photos.querySelector('.popup__photo');
      photos.innerHTML = '';
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
      case HouseTypes.BUNGALO.type:
        type = HouseTypes.BUNGALO.name;
        break;
      case HouseTypes.FLAT.type:
        type = HouseTypes.FLAT.name;
        break;
      case HouseTypes.HOUSE.type:
        type = HouseTypes.HOUSE.name;
        break;
      case HouseTypes.PALACE.type:
        type = HouseTypes.PALACE.name;
        break;
      default:
        throw new Error(ErrorTexts.TYPE);
    }
    return type;
  };

  var formCapacityText = function (roomsQuantity, guestsQuantity) {
    var text = '';
    switch (roomsQuantity) {
      case +Rooms[1].amount:
        text = Rooms[1].text;
        break;
      case +Rooms[2].amount:
        text = Rooms[2].text;
        break;
      case +Rooms[3].amount:
        text = Rooms[3].text;
        break;
      case +Rooms[100].amount:
        text = Rooms[100].text;
        break;
      default:
        text = ErrorTexts.ROOMS;
    }

    switch (guestsQuantity) {
      case +Guests[1].amount:
        text += ' ' + Guests[1].text;
        break;
      case +Guests[2].amount:
        text += ' ' + Guests[2].text;
        break;
      case +Guests[3].amount:
        text += ' ' + Guests[3].text;
        break;
      case +Guests[0].amount:
        text += ' ' + Guests[0].text;
        break;
      default:
        text += ' ' + ErrorTexts.GUESTS;
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
