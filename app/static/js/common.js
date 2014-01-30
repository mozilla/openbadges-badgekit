$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });

  var userDropdown = $('.js-user-dropdown');

  userDropdown.change(function() {
    var selectedOption = userDropdown.find('option:selected');

    if (selectedOption.hasClass('js-navigate')) {
      window.location.href = selectedOption.val();
      return false;
    }
    return true;
  });

});