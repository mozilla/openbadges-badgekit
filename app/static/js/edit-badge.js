const AUTOSAVE_INTERVAL_MS = 10000;
const SAVING_TEXT = 'Saving';

$(document).ready(function() {

  function saveBadge() {
    clearTimeout(timeoutID);
    submitButton.attr('disabled', true);
    submitButton.val(SAVING_TEXT);
    saveSpinner.removeClass('hidden');

    $.post(form.attr('action'), form.serialize(), function(data) {
      submitButton.removeAttr('disabled');
      submitButton.val(submitButtonText);
      saveSpinner.addClass('hidden');
      timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
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

  var categoryAnchors = $('.js-categories > a');
  var formPages = $('.js-form-page');

  categoryAnchors.click(function() {
    categoryAnchors.removeClass('highlighted');
    $(this).addClass('highlighted');

    formPages.addClass('hidden');

    var section = $(this).data('section');

    $('.js-section-' + section).removeClass('hidden');

    return false;
  });

  var submitButton = $('.js-submit-btn');
  var saveSpinner = $('.js-save-spinner');
  var form = $('.js-badge-form');
  var submitButtonText = submitButton.val();
  // a possibly totally weird way to maintain the submit button's size after being initially auto-sized.
  submitButton.width(submitButton.width());

  var timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
  submitButton.click(function() {
    saveBadge();
    return false;
  });
});

