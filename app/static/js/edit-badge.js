const AUTOSAVE_INTERVAL_MS = 10000;
const SAVING_TEXT = 'Saving';

$(document).ready(function() {
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
  }

  var publishButton = $('.js-publish-btn');
  if (!publishButton.attr('disabled')) {
    var publishUrl = publishButton.data('url');
    publishButton.click(function() {
      $.post(publishUrl, form.serialize(), function(data) {
        window.location.href = data.location;
      });
      return false;
    });
  }

  var uploadImage = $('.js-upload-image');
  uploadImage.change(function() {
    form.submit();
  });

  var nameField = $('.js-name-field');
  var hiddenNameField = $('.js-hidden-name-field');
  nameField.change(function() {
    hiddenNameField.val(nameField.val());
  });
});

