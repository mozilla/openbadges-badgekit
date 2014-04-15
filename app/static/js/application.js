$(document).ready(function() {
  $('.js-criterion-met').removeAttr('checked');

  $('.js-criterion-met').click(function() {
    var criterionId = $(this).closest('.js-criterion-section').data('criterion-id');
    var criterionMarker = $('.js-criterion-' + criterionId + '-marker');
    criterionMarker.removeClass('fa-check-circle fa-times-circle fa-circle-o');
    if ($(this).val() == '1') {
      criterionMarker.addClass('fa-check-circle');
    }
    else {
      criterionMarker.addClass('fa-times-circle');
    }
  });

  $('.js-submit-review').click(function() {
    var form = $('.js-review-form');
    var href = $(this).attr('href');
    var data = {};

    data.comment = $('.js-comment').val();
    data._csrf = form.find('input[name="_csrf"]').val();
    data.reviewItems = [];

    $('.js-criterion-section').each(function() {
      var reviewItem = {};
      reviewItem.criterionId = $(this).data('criterion-id');
      reviewItem.satisfied = $(this).find('.js-criterion-met:checked').val() || '0';
      reviewItem.comment = $(this).find('.js-criterion-comment').val() || '';

      data.reviewItems.push(reviewItem);
    });

    $.ajax({
      url: form.attr('action'),
      data: data,
      type: form.attr('method'),
      success: function(data, textStatus, jqXHR) {
        window.location.href = href;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('.js-notification').html('<p>' + errorThrown + '</p>');
      }
    });
    return false;
  });
});