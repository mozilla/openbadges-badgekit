$(document).ready(function() {
  $('.js-delete-btn').click(function() {
    $('.js-delete-confirm-text').show();
    return false;
  });

  $('.js-delete-confirm-btn').click(function() {
    $.post(this.href, { _csrf: $(this).data('csrf') }, function(data) {
      window.location.href = data.location;
    });
    return false;
  });

  $('.js-view-tab').click(function() {
    $(this).addClass('selected');
    $('.js-action-tab').removeClass('selected');
    $('.js-badge-actions').hide();
    $('.js-badge-info').show();
  });

  $('.js-action-tab').click(function() {
    $(this).addClass('selected');
    $('.js-view-tab').removeClass('selected');
    $('.js-badge-actions').show();
    $('.js-badge-info').hide();
  });

  $('.js-copy-btn, .js-archive-btn').click(function() {
    var copyUrl = $(this).data('url');
    var copyPostData = { _csrf: $(this).data('csrf') };
    $.post(copyUrl, copyPostData, function(data) {
      if (data.location) {
        window.location.href = data.location;
      }
      else {
        location.reload(false);
      }
    });
    return false;
  });

});