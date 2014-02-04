$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });

  var userDropdown = $('.js-user-dropdown');

  userDropdown.change(function() {
    var selectedOption = userDropdown.find('option:selected');

    if (selectedOption.hasClass('js-navigate')) {
      window.location.href = selectedOption.val();
    }

    if (selectedOption.hasClass('js-login')) {
      navigator.id.request();
    }

    if (selectedOption.hasClass('js-logout')) {
      navigator.id.logout();
    }
  });

  var badgeThumbContainer = $('.badge-thumb-container');

  function resizeBadgeThumbContainer() {
    var container = $(this);
    container.width(container.height());

    var plusCircle = $('.fa-plus-circle', container);
    var fontHeight = parseInt(plusCircle.css('font-size'),10);
    var newPadding = (container.height() - fontHeight)/2;

    plusCircle.css('padding-top', newPadding);
    plusCircle.css('padding-bottom', newPadding);
  }

  badgeThumbContainer.resize(resizeBadgeThumbContainer);
  badgeThumbContainer.each(resizeBadgeThumbContainer);
});