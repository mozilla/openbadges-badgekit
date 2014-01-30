$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });

  var numCriteriaSelect = $('.js-num-criteria');

  numCriteriaSelect.change(function(e) {
    var criterionDivs = $('.js-criterion');
    var numCriteria = parseInt(numCriteriaSelect.val(),10);

    for (var i = criterionDivs.length-1; i >= 0; i--) {
      if (i+1 > numCriteria) {
        criterionDivs.eq(i).addClass('hidden');
      } else {
        criterionDivs.eq(i).removeClass('hidden');
      }        
    }

    for (var i = numCriteria-1; i >= criterionDivs.length; i--) {
      var newCriterionDiv = nunjucks.render('badge/criterion.html', { index: i });
      criterionDivs.last().after(newCriterionDiv);
    }
  });

  var categoryAnchors = $('.js-categories > a');

  categoryAnchors.click(function() {
    categoryAnchors.removeClass('highlighted');
    $(this).addClass('highlighted');

    $('.js-form-page').addClass('hidden');

    var section = $(this).data('section');

    $('.js-section-' + section).removeClass('hidden');

    return false;
  });
});