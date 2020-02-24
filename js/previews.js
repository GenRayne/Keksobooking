'use strict';

(function () {
  // --------------------- Импорт ---------------------

  var adForm = window.util.adForm;
  var adFormAvatar = window.form.adFormAvatar;
  var adFormPhotos = window.form.adFormPhotos;
  var imageRegExp = window.form.imageRegExp;

  // ---------------- Переменные модуля ----------------

  var MAX_FILES_NUMBER = 16;

  var avatarPreviewImg = adForm.querySelector('.ad-form-header__preview img');
  var photosBlock = adForm.querySelector('.ad-form__photo-container');
  var photoPreview = photosBlock.querySelector('.ad-form__photo');

  // =================================================================

  var isImage = function (file) {
    return file.name.toLowerCase().match(imageRegExp);
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

    var previews = photosBlock.querySelectorAll('.ad-form__photo');
    for (var i = 0; i < previews.length; i++) {
      photosBlock.removeChild(previews[i]);
    }

    if (!files.length) {
      photosBlock.appendChild(photoPreview);
    }

    for (var j = 0; j < Math.min(files.length, MAX_FILES_NUMBER); j++) {
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
})();
