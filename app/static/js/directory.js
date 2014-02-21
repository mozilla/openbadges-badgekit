$(document).ready(function() {
  var actionButtons = $('.js-action-btn');
  actionButtons.click(function(e) {
    var target = $(e.target);

    var actionButton = $(this);
    $('.js-action-dropdown').hide();
    var actionButtonOffset = actionButton.offset();
    var dropdownMenu = $('.js-action-dropdown', actionButton.parent());
    dropdownMenu.show();
    dropdownMenu.offset( { top: actionButtonOffset.top + actionButton.height(),left: actionButtonOffset.left } );
    return false;
  });

  var archiveButtons = $('.js-archive-btn');
  archiveButtons.click(function() {
    var archiveButton = $(this);
    var archiveUrl = archiveButton.data('url');
    var archivePostData = { _csrf: archiveButton.data('csrf') };
    $.post(archiveUrl, archivePostData, function(data) {
      location.reload(false);
    });
    return false;
  });

  var copyButtons = $('.js-copy-btn');
  copyButtons.click(function() {
    var copyButton = $(this);
    var copyUrl = copyButton.data('url');
    var copyPostData = { _csrf: copyButton.data('csrf') };
    $.post(copyUrl, copyPostData, function(data) {
      window.location.href = data.location;
    });
    return false;
  });

  $(document).click(function() {
    $('.js-action-dropdown').hide();
  });
});