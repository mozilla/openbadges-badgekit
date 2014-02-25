$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });
  var masonryContainer = document.querySelector('.js-masonry-container');
  var masonry = new Masonry(masonryContainer, {
    itemSelector: '.item'
  });

  var mobileButton = $('.js-small-screen-dropdown');
  var mobileDropdown = $('.js-small-screen-menu');

  mobileButton.on("click", function(e) {
    mobileDropdown.toggle();
    e.preventDefault();
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

});