const AUTOSAVE_INTERVAL_MS = 10000;
const SAVING_TEXT = 'Saving';

$(document).ready(function() {

  $(".js-modal").on("click", function() {
    $(".overlay").show();
    $(".modal-container").show();
  });

  $(".js-close").on("click", function() {
    $(".modal-container").hide();
    $(".overlay").hide();
  });

  var notification = $('.js-notification');

  $(document).ajaxError(function(event, jqXHR, ajaxSetting, thrownError) {
    if (jqXHR && jqXHR.responseText) {
      notification.html('<p>' + jqXHR.responseText + '</p>');
    }
    else {
      notification.html('<p>' + thrownError + '</p>');
    }
  });

  var tooltipButton = $('.js-tooltip');
  var tooltipDropdown = $('.js-tooltip-container');

  tooltipButton.click(function(e) {
    var thisTooltipDropdown = $(this).closest('label').find('.js-tooltip-container');
    tooltipDropdown.not(thisTooltipDropdown).hide();
    thisTooltipDropdown.toggle();
    return false;
  });

  $('body').click(function(e) {
    tooltipDropdown.hide();
  });

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

  function toggleNote() {
    $(this).closest('.js-criterion').find('.js-note-field-block').toggle();
    return false;
  }

  $('.js-add-note').click(toggleNote);

  var numCriteriaSelect = $('.js-num-criteria');

  numCriteriaSelect.change(function() {
    var criterionDivs = $('.js-criterion');
    var numCriteria = parseInt(numCriteriaSelect.val(),10);

    for (var i = criterionDivs.length-1; i >= 0; i--) {
      if (i+1 > numCriteria) {
        criterionDivs.eq(i).addClass('hidden');
      } else {
        criterionDivs.eq(i).removeClass('hidden');
      }
    }

    for (i = numCriteria-1; i >= criterionDivs.length; i--) {
      var newCriterionDiv = nunjucks.render('badge/criterion.html', { index: i });
      criterionDivs.last().after(newCriterionDiv);
    }

    $('.js-criterion').not(criterionDivs).find('.js-add-note').click(toggleNote);
  });

  var categoryAnchors = $('.js-category-anchor');
  var formPages = $('.js-form-page');

  categoryAnchors.click(function() {
    categoryAnchors.parent().removeClass('selected');
    $(this).parent().addClass('selected');
    formPages.addClass('hidden');
    var section = $(this).data('section');
    $('.js-section-' + section).removeClass('hidden');
    return false;
  });

  var saveButton = $('.js-save-btn');
  if (!saveButton.attr('disabled')) {
    var saveSpinner = $('.js-save-spinner');
    var form = $('.js-badge-form');
    var badgeImage = $('.badge-image');
    var badgeImageSrc = badgeImage.attr('src');
    form.ajaxForm();

    var saveButtonText = saveButton.val();

    var timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
    saveButton.click(function() {
      saveBadge(false);
      return false;
    });

    $('.js-save-and-exit-btn').click(function() {
      saveBadge(true);
      return false;
    });

    var uploadImage = $('.js-upload-image');
    uploadImage.change(function() {
      form.ajaxSubmit(function() {
        badgeImage.attr('src', badgeImageSrc + '?cachebust=' + Date.now());
      });
    });
  }

  (function () {
    var categoryContainer = $('#badge-categories');
    var dropdowns = categoryContainer.find('.form-dropdown');
    var model = dropdowns.first().clone();
    var defaultLabel = model.find('option').first().text();
    model.find('select')[0].selectedIndex = 0;
    dropdowns.first().find('select').attr('id', null);

    function eachDropdown (fn) {
      var dropdowns = categoryContainer.find('.form-dropdown');
      dropdowns.each(function (i) {
        var el = $(this);
        var select = el.find('select');
        var selectedIndex = select[0].selectedIndex;
        fn(i, el, select, selectedIndex, dropdowns);
      });
    }

    function checkAvailableOptions () {
      var selected = [];

      eachDropdown(function (i, el, select) {
        if (el[0] === model[0]) return;

        var selectedIndex = select[0].selectedIndex;
        selected.push(selectedIndex);
      });

      eachDropdown(function (i, el, select) {
        var options = select.find('option');
        var selectedIndex = select[0].selectedIndex;
        var isModel = el[0] === model[0];
        var offset = isModel ? 1 : 0;

        if (isModel)
          options.first().text(selected.length ? '' : defaultLabel);

        options.each(function (i) {
          var disabled = selectedIndex !== (i+offset) && selected.indexOf(i-offset) > -1;
          options[i].disabled = disabled;
        })
      });
    }

    eachDropdown(function (i, el, select, index) {
      if (index == 0) {
        el.next('br').remove();
        el.remove();
      } else {
        select.find('option').first().remove();
        el.after('<i class="fa fa-times-circle remove-option"></i>');
      }
    });

    model.on('change', 'select', function () {
      var row = model.clone();
      row.find('option').first().remove();
      row.find('select').attr('id', null)[0].selectedIndex = this.selectedIndex - 1;
      model.before(row);
      row.after('<i class="fa fa-times-circle remove-option"></i>');
      model.before(document.createElement('br'));
      this.selectedIndex = 0;
    });

    categoryContainer.append(model);
    categoryContainer.append(document.createElement('br'));

    categoryContainer.on('change', 'select', checkAvailableOptions);
    categoryContainer.on('click', '.remove-option', function () {
      var btn = $(this);
      btn.prev('.form-dropdown').remove();
      btn.next('br').remove();
      btn.remove();
      model.find('select').focus();

      checkAvailableOptions();
    });

    checkAvailableOptions();
  })();

  var nameField = $('.js-name-field');
  var hiddenNameField = $('.js-hidden-name-field');
  nameField.change(function() {
    hiddenNameField.val(nameField.val());
  });

  var publishButton = $('.js-publish-btn');
  if (!publishButton.attr('disabled')) {
    var publishUrl = publishButton.data('url');
    publishButton.click(function() {
      notification.empty();
      if (validateInput()) {
        $.post(publishUrl, form.serialize(), function(data, status) {
          window.location.href = data.location;
        });
      }
      return false;
    });
  }

  function validateField(inputName, error, test) {
    var val = $('[name=' + inputName + ']').val();
    if (test(val) == false) {
      notification.append('<p>' + error + '</p>');
      return false;
    }

    return true;
  }

  function validateCriteria() {
    var result = true;
    $('.js-criterion:not(.hidden) .js-criteria-description').each(function(index, element) {
      if (!(element.value.length >= 1)) {
        notification.append('<p>Criteria ' + (index+1) + ' Description must not be empty</p>');
        result = false;
      }
    });
    return result;
  }

  function validateInput() {
    var valid = true;
    valid = validateField('name', 'Name must be between 1 and 255 characters',
              function(val) { return (val.length >= 1 && val.length <= 255) })
            && valid;
    valid = validateField('description', 'Short Description must be between 1 and 140 characters',
              function(val) { return (val.length >= 1 && val.length <= 140) })
            && valid;
    valid = validateField('earnerDescription', 'Earner Description must not be empty',
              function(val) { return (val.length >= 1) })
            && valid;
    valid = validateField('consumerDescription', 'Consumer Description must not be empty',
              function(val) { return (val.length >= 1) })
            && valid;
    valid = validateCriteria() && valid;
    return valid;
  }
});

