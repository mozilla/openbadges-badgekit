$(document).ready(function() {
  $('.js-criterion-met').removeAttr('checked');

  $('.js-criterion-met').click(function() {
    var criterionId = $(this).data('criterion-id');
    var criterionMarker = $('.js-criterion-' + criterionId + '-marker');
    criterionMarker.removeClass('fa-check-circle fa-times-circle fa-circle-o');
    if ($(this).val() == 'yes') {
      criterionMarker.addClass('fa-check-circle');
    }
    else {
      criterionMarker.addClass('fa-times-circle');
    }
  });
});