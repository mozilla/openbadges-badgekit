$(document).ready(function() {
  $('.js-delete-btn').click(function() {
    $('.js-delete-confirm-text').show();
  });

  $('.js-delete-confirm-btn').click(function() {
    $.post(this.href, { _csrf: $(this).data('csrf') }, function(data) {
      window.location.href = data.location;
    });
    return false;
  });
});