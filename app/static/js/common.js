$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });
  var masonryContainer = document.querySelector('.js-masonry-container');
  var masonry = new Masonry(masonryContainer, {
    itemSelector: '.item',
    gutter: 30
  });

  var mobileButton = $('.js-small-screen-dropdown');
  var mobileDropdown = $('.js-small-screen-menu');

  mobileButton.on("click", function(e) {
    mobileDropdown.toggle();
    e.preventDefault();
  });

  var tooltipButton = $('.js-tooltip');
  var tooltipDropdown = $('.js-tooltip-container');

  tooltipButton.on("click", function(e) {
    e.preventDefault();
    tooltipDropdown.toggle();
  });

  var addButton = $('.js-add-note');
  var noteDropdown = $('.js-note-field-block');

  addButton.on("click", function(e) {
    e.preventDefault();
    noteDropdown.toggle();
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