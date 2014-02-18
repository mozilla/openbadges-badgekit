$(document).ready(function() {
  var canvas = $('.js-badge-canvas');
  var canvasContext = canvas[0].getContext('2d');

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

  var submitBtn = $('.js-save-image');

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
      canvasContext.drawImage(iconImg, 20, 0, 140, 140 * iconImg.height / iconImg.width);
    }

    var textColor = 'black';

    if (colorImg) {
      colorCanvasContext.drawImage(colorImg, 0, 0, colorCanvas.attr('width'), colorCanvas.attr('height'));
      var oldColors = [[0,0,0],[146,146,146],[235,235,235]];
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
      canvasContext.fillText(textVal, 90, 153);
    }

    canvasContext.restore();
  }

  shapeRadio.change(function() {
    backgroundDiv.add(textDiv).add(iconDiv).add(colorDiv).empty();
    
    shapeImg = $(this).next('img')[0];
    backgroundImg = textImg = iconImg = colorImg = null;
    submitBtn.addClass('hidden');
    renderBadge();

    shapeId = $(this).val();
    var query = { shapeId: shapeId };
    $.get(backgroundUrl, query, function(data) {
      var backgroundOptions = nunjucks.render('studio/background-options.html', data);
      backgroundDiv.html(backgroundOptions);
      setupBackgroundChange();
    });
  });

  function setupBackgroundChange() {
    var backgroundRadio = $('.js-background-radio');

    backgroundRadio.change(function() {
      textDiv.add(iconDiv).add(colorDiv).empty();

      backgroundImg = $(this).next('img')[0];
      textImg = iconImg = colorImg = null;
      submitBtn.addClass('hidden');
      renderBadge();

      backgroundId = $(this).val();
      var query = { shapeId: shapeId, backgroundId: backgroundId };
      $.get(textUrl, query, function(data) {
        var textOptions = nunjucks.render('studio/text-options.html', data);
        textDiv.html(textOptions);
        setupTextChange();
      });
    });
  }

  function setupTextChange() {
    var textRadio = $('.js-text-radio');

    textRadio.change(function() {
      iconDiv.add(colorDiv).empty();

      textImg = $(this).next('img')[0];
      iconImg = colorImg = null;
      submitBtn.addClass('hidden');
      renderBadge();

      textId = $(this).val();
      var query = { shapeId: shapeId, backgroundId: backgroundId, textId: textId };
      $.get(iconUrl, query, function(data) {
        var iconOptions = nunjucks.render('studio/icon-options.html', data);
        iconDiv.html(iconOptions);
        setupIconChange();
      });
    });

    $('.js-text-contents').change(renderBadge);
  }

  function setupIconChange() {
    var iconRadio = $('.js-icon-radio');

    iconRadio.change(function() {
      colorDiv.empty();

      iconImg = $(this).next('img')[0];
      colorImg = null;
      submitBtn.addClass('hidden');
      renderBadge();

      iconId = $(this).val();
      var query = { shapeId: shapeId, backgroundId: backgroundId, textId: textId, iconId: iconId };
      $.get(colorUrl, query, function(data) {
        var colorOptions = nunjucks.render('studio/color-options.html', data);
        colorDiv.html(colorOptions);
        setupColorChange();
      });
    });
  }

  function setupColorChange() {
    var colorRadio = $('.js-color-radio');

    colorRadio.change(function() {
      colorImg = $(this).next('img')[0];
      submitBtn.removeClass('hidden');
      renderBadge();

      colorId = $(this).val();
    });
  }

  var form = $('.js-badge-form');

  submitBtn.click(function() {
    canvas[0].toBlob(function(blob) {
      var formData = new FormData(form[0]);
      formData.append('studioImage', blob, 'canvasimage.png');

      var request = new XMLHttpRequest();
      request.open("POST", form.attr('action'));
      request.send(formData);
    });
  });
});