$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });

  var mobileButton = $('.js-small-screen-dropdown');
  var mobileDropdown = $('.js-small-screen-menu');

  mobileButton.on("click", function(e) {
    mobileDropdown.toggle();
    e.preventDefault();
  });

  var formButton = $('.js-email-expandable');
  var formDropdown = $('.js-expandable-section');

  formButton.on("click", function(e) {
    e.preventDefault();
    formDropdown.toggle();
  });

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

  var badgeThumbs = $('.js-badgethumb');
    badgeThumbs.each(function() {
      var imageUrl = $(this).data('image');
      $(this).css('background-image', imageUrl);
  });
});