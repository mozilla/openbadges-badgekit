const AUTOSAVE_INTERVAL_MS = 10000;
const SAVING_TEXT = 'Saving';

$(document).ready(function() {
  var canvas = $('.js-big-badge-canvas');
  var canvasContext = canvas[0].getContext('2d');

  var smallCanvas = $('.js-badge-canvas');
  var smallCanvasContext = smallCanvas[0].getContext('2d');

  var colorCanvas = $('.js-color-canvas');
  var colorCanvasContext = colorCanvas[0].getContext('2d');

  var shapeDiv = $('.js-visual-shape');
  var backgroundDiv = $('.js-visual-background');
  var textDiv = $('.js-visual-text');
  var iconDiv = $('.js-visual-icon');
  var colorDiv = $('.js-visual-color');

  var backgroundUrl = backgroundDiv.data('url');
  var textUrl = textDiv.data('url');
  var iconUrl = iconDiv.data('url');
  var colorUrl = colorDiv.data('url');

  var shapeId, backgroundId, textId, iconId, colorId;
  var shapeImg, backgroundImg, textImg, textValue, iconImg, colorImg;
  var shapeRadio = $('.js-shape-radio');

  var savedBackground = backgroundDiv.data('saved-background');
  var savedTextType = textDiv.data('saved-text-type');
  var savedTextContents = textDiv.data('saved-text-contents');
  var savedIcon = iconDiv.data('saved-icon');
  var savedColor = colorDiv.data('saved-color');

  var submitBtn = $('.js-save-and-exit-btn');

  function saveBadge(doRedirect) {
    clearTimeout(timeoutID);
    saveButton.attr('disabled', true);
    saveButton.val(SAVING_TEXT);
    saveSpinner.removeClass('hidden');

    $.post(form.attr('action'), form.serialize(), function(data) {
      saveButton.removeAttr('disabled');
      saveButton.val(saveButtonText);
      saveSpinner.addClass('hidden');
      timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
      if (doRedirect) {
        window.location.href = data.location;
      }
    });
  }

  function renderBadge() {
    canvasContext.save();
    canvasContext.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));
    canvasContext.drawImage(shapeImg, 0, 0, canvas.attr('width'), canvas.attr('height'));
    canvasContext.globalCompositeOperation = 'source-atop';

    if (backgroundImg) {
      canvasContext.drawImage(backgroundImg, 0, 0, canvas.attr('width'), canvas.attr('height'));
    }

    if (textImg) {
      canvasContext.drawImage(textImg, 0, 0, canvas.attr('width'), canvas.attr('height'));
    }

    if (iconImg) {
      canvasContext.drawImage(iconImg, 60, 30, 280, 280 * iconImg.height / iconImg.width);
    }

    var textColor = 'black';

    if (colorImg) {
      colorCanvasContext.drawImage(colorImg, 0, 0, colorCanvas.attr('width'), colorCanvas.attr('height'));
      var oldColors = [[0,0,0],[0,255,255],[235,235,235]];
      var newColors = [];

      for (var i = 0; i < 3; i++) {
        newColors.push(colorCanvasContext.getImageData(i * 10, 0, 1, 1).data);
      }

      var imageData = canvasContext.getImageData(0, 0, canvas.attr('width'), canvas.attr('height'));

      for (var i = 0; i < imageData.data.length; i += 4) {
        for (var colorIndex = 0; colorIndex < 3; colorIndex++) {
          if (imageData.data[i] == oldColors[colorIndex][0] &&
              imageData.data[i+1] == oldColors[colorIndex][1] &&
              imageData.data[i+2] == oldColors[colorIndex][2]) {
            imageData.data[i] = newColors[colorIndex][0];
            imageData.data[i+1] = newColors[colorIndex][1];
            imageData.data[i+2] = newColors[colorIndex][2];
            break;
          }
        }
      }

      canvasContext.putImageData(imageData, 0, 0);

      textColor = 'rgb(' + newColors[0][0] + ',' + newColors[0][1] + ',' + newColors[0][2] + ')';
    }

    var textVal = $('.js-text-contents').val();
    if (textVal) {
      canvasContext.font = '20pt open-sans';
      canvasContext.textAlign = 'center';
      canvasContext.fillStyle = textColor;
      canvasContext.fillText(textVal, 200, 325);
    }

    canvasContext.restore();
    smallCanvasContext.clearRect(0, 0, smallCanvas.attr('width'), smallCanvas.attr('height'));
    smallCanvasContext.drawImage(canvas[0], 0, 0);
  }

  shapeRadio.change(function() {
    backgroundDiv.add(textDiv).add(iconDiv).add(colorDiv).empty();

    shapeImg = $(this).prev('img')[0];
    backgroundImg = textImg = iconImg = colorImg = null;
    submitBtn.addClass('hidden');
    renderBadge();

    shapeId = $(this).val();
    var query = { shapeId: shapeId };
    $.get(backgroundUrl, query, function(data) {
      data.savedBackground = savedBackground;
      var backgroundOptions = nunjucks.render('studio/background-options.html', data);
      backgroundDiv.html(backgroundOptions);
      $('.js-visual-background-anchor').removeClass('disabled');
      setupBackgroundChange();
    });
  });

  shapeRadio.filter(':checked').change();

  function setupBackgroundChange() {
    var backgroundRadio = $('.js-background-radio');

    backgroundRadio.change(function() {
      textDiv.add(iconDiv).add(colorDiv).empty();

      backgroundImg = $(this).prev('img')[0];
      textImg = iconImg = colorImg = null;
      submitBtn.addClass('hidden');
      renderBadge();

      savedBackground = backgroundId = $(this).val();
      var query = { shapeId: shapeId, backgroundId: backgroundId };
      $.get(textUrl, query, function(data) {
        data.savedTextType = savedTextType;
        data.savedTextContents = savedTextContents;
        var textOptions = nunjucks.render('studio/text-options.html', data);
        textDiv.html(textOptions);
        $('.js-visual-text-anchor').removeClass('disabled');
        setupTextChange();
          $.get(iconUrl, query, function(data) {
          data.savedIcon = savedIcon;
          var iconOptions = nunjucks.render('studio/icon-options.html', data);
          iconDiv.html(iconOptions);
          $('.js-visual-icon-anchor').removeClass('disabled');
          setupIconChange();
          $.get(colorUrl, query, function(data) {
            data.savedColor = savedColor;
            var colorOptions = nunjucks.render('studio/color-options.html', data);
            console.log(colorDiv);
            colorDiv.html(colorOptions);
            $('.js-visual-color-anchor').removeClass('disabled');
            setupColorChange();
          });
        });
      });
    });

    backgroundRadio.filter(':checked').change();
  }

  function setupTextChange() {
    var textRadio = $('.js-text-radio');

    textRadio.change(function() {
      iconDiv.add(colorDiv).empty();

      textImg = $(this).prev('img')[0];
      iconImg = colorImg = null;
      submitBtn.addClass('hidden');
      renderBadge();

      savedTextType = textId = $(this).val();
    });

    $('.js-text-contents').change(function() {
      savedTextContents = $(this).val();
      renderBadge();
    });

    textRadio.filter(':checked').change();
  }

  function setupIconChange() {
    var iconRadio = $('.js-icon-radio');

    iconRadio.change(function() {
      iconImg = $(this).prev('img')[0];
      submitBtn.addClass('hidden');
      renderBadge();

      savedIcon = iconId = $(this).val();
    });

    iconRadio.filter(':checked').change();
  }

  function setupColorChange() {
    var colorRadio = $('.js-color-radio');

    colorRadio.change(function() {
      colorImg = $(this).prev('img')[0];
      submitBtn.removeClass('hidden');
      renderBadge();

      savedColor = colorId = $(this).val();
    });

    colorRadio.filter(':checked').change();
  }

  var form = $('.js-badge-form');

  submitBtn.click(function() {
    var href = $(this).attr('href');
    canvas[0].toBlob(function(blob) {
      var formData = new FormData(form[0]);
      formData.append('studioImage', blob, 'canvasimage.png');

      var request = new XMLHttpRequest();
      request.onload = function () {
        window.location.href = href;
      };
      request.open("POST", form.attr('action'));
      request.send(formData);
    });
    return false;
  });

  var saveButton = $('.js-save-btn');
  if (!saveButton.attr('disabled')) {
    var saveSpinner = $('.js-save-spinner');
    var form = $('.js-badge-form');
    form.ajaxForm();

    var saveButtonText = saveButton.val();

    var timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
    saveButton.click(function() {
      saveBadge(false);
      return false;
    });

    var uploadImage = $('.js-upload-image');
    uploadImage.change(function() {
      form.ajaxSubmit();
    });
  }

  var sectionAnchors = $('.js-visual-section-anchor');
  var sections = $('.js-visual-section');

  sectionAnchors.click(function() {
    if ($(this).hasClass('disabled')) {
      return false;
    }

    sections.addClass('hidden');
    var section = $(this).data('section');
    $('.js-visual-' + section).removeClass('hidden');
    return false;
  });

});