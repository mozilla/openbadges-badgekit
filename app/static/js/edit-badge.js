const AUTOSAVE_INTERVAL_MS = 10000;
const SAVING_TEXT = 'Saving';

$(document).ready(function() {

  function saveBadge() {
    clearTimeout(timeoutID);
    saveButton.attr('disabled', true);
    saveButton.val(SAVING_TEXT);
    saveSpinner.removeClass('hidden');

    $.post(form.attr('action'), allData.serialize(), function(data) {
      saveButton.removeAttr('disabled');
      saveButton.val(saveButtonText);
      saveSpinner.addClass('hidden');
      timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
    });
  }

  var hamburgerButton = $('.js-hamburger-btn');
  var hamburgerDropdown = $('.js-hamburger-dropdown');
  var hamburgerDropdownArrow = $('.js-hamburger-dropdown-arrow');

  hamburgerButton.click(function() {
    hamburgerDropdown.toggle();
    var arrowSize = -hamburgerDropdownArrow.position().top;
    var hamburgerDropdownOffset = { top: hamburgerButton.offset().top + hamburgerButton.height() + arrowSize,
                                    left: hamburgerButton.offset().left - hamburgerDropdownArrow.position().left + (hamburgerButton.width())/2 - arrowSize};
    console.log(hamburgerDropdownArrow.width());
    hamburgerDropdown.offset(hamburgerDropdownOffset);
    return false;
  });

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
    formPages.addClass('hidden');
    var section = $(this).data('section');
    $('.js-section-' + section).removeClass('hidden');
    hamburgerDropdown.hide();
    return false;
  });

  var saveButton = $('.js-save-btn');
  if (!saveButton.attr('disabled')) {
    var saveSpinner = $('.js-save-spinner');
    var form = $('.js-badge-form');
    var allData = $('.js-badge-form, .js-name-field');

    var saveButtonText = saveButton.val();
    // a possibly totally weird way to maintain the submit button's size after being initially auto-sized.
    saveButton.width(saveButton.width());

    var timeoutID = setTimeout(saveBadge, AUTOSAVE_INTERVAL_MS);
    saveButton.click(function() {
      saveBadge();
      return false;
    });

    $('.js-save-and-exit-btn').click(saveBadge);
  }

  var publishButton = $('.js-publish-btn');
  if (!publishButton.attr('disabled')) {
    var publishUrl = publishButton.data('url');
    publishButton.click(function() {
      $.post(publishUrl, allData.serialize(), function(data) {
        window.location.href = data.location;
      });
      return false;
    });
  }

  $(document).click(function() {
    hamburgerDropdown.hide();
  });
});

