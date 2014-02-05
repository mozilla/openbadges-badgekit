$(document).ready(function() {
  var actionButton = $('.action-btn');
  actionButton.click(function(e) {
    var target = $(e.target);

    actionButton = $(this);
    $('.action-dropdown').hide();
    var actionButtonOffset = actionButton.offset();
    var dropdownMenu = $('.action-dropdown', actionButton.parent());
    dropdownMenu.show();
    dropdownMenu.offset( { top: actionButtonOffset.top + actionButton.height(),left: actionButtonOffset.left } );
    return false;
  });

  $(document).click(function() {
    $('.action-dropdown').hide();
  });
});