'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var adForm = window.util.adForm;

  // ---------------- Переменные модуля ----------------

  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';
  var imageRegExp = /.jpg$|.jpeg$|.png$/i;

  var adFormAvatar = adForm.querySelector('#avatar');
  var avatarPreviewImg = adForm.querySelector('.ad-form-header__preview img');

  var adFormPhotos = adForm.querySelector('#images');
  var photosBlock = adForm.querySelector('.ad-form__photo-container');
  var photoPreview = photosBlock.querySelector('.ad-form__photo');

  // =================================================================

  var isImage = function (file) {
    return file.name.match(imageRegExp);
  };

  var resetAvatar = function () {
    avatarPreviewImg.src = DEFAULT_AVATAR_SRC;
  };

  var resetPhotos = function () {
    var previews = photosBlock.querySelectorAll('.ad-form__photo');

    var files = adFormPhotos.files;
    for (var i = 0; i < previews.length; i++) {
      photosBlock.removeChild(previews[i]);
    }

    if (!files.length) {
      photosBlock.appendChild(photoPreview);
    }
  };

  var photoPreviewImg = document.createElement('img');
  photoPreviewImg.classList.add('ad-form__photo-preview');
  photoPreviewImg.alt = 'Фотография жилья';

  adFormAvatar.addEventListener('change', function () {
    var file = adFormAvatar.files[0];

    if (isImage(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  adFormPhotos.addEventListener('change', function () {
    var files = adFormPhotos.files;
    resetPhotos();

    for (var j = 0; j < files.length; j++) {
      if (isImage(files[j])) {
        (function (file) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var previewBox = photoPreview.cloneNode();
            var preview = photoPreviewImg.cloneNode();
            preview.src = reader.result;
            previewBox.appendChild(preview);
            photosBlock.appendChild(previewBox);
          });

          reader.readAsDataURL(file);
        })(files[j]);
      }
    }
  });

  // =================================================================
  // Экспорт:
  window.previews = {
    adFormAvatar: adFormAvatar,
    adFormPhotos: adFormPhotos,
    imageRegExp: imageRegExp,
    resetAvatar: resetAvatar,
    resetPhotos: resetPhotos
  };
})();
