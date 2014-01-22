$(document).ready(function() {

  var dropdownNavButton = $('.dropdown-nav');

  dropdownNavButton.click(function() {
    var navButtonOffset = dropdownNavButton.offset();
    var dropdownMenu = $('.sort-dropdown');
    dropdownMenu.toggle();
    dropdownMenu.offset( { top: navButtonOffset.top + dropdownNavButton.height(),left: navButtonOffset.left } );

    return false;
  });

  var actionButton = $('.action-btn');
  actionButton.click(function(e) {
    var target = $(e.target);

    if (!target.is('a')) {
      actionButton = $(this);
      $('.action-dropdown').hide();
      var actionButtonOffset = actionButton.offset();
      var dropdownMenu = $('.action-dropdown', actionButton);
      dropdownMenu.show();
      dropdownMenu.offset( { top: actionButtonOffset.top + actionButton.height(),left: actionButtonOffset.left } );
      return false;
    }
  });

  $(document).click(function() {
    $('.sort-dropdown').hide();
    $('.action-dropdown').hide();
  });
});