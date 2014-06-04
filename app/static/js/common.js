$(document).ready(function() {
  nunjucks.configure('/static/templates', { autoescape: true });

  var tooltipButton = $('.js-tooltip');
  var tooltipDropdown = $('.js-tooltip-container');

  tooltipButton.click(function(e) {
    var thisTooltipDropdown = $(this).closest('.admin-btn-container').find('.js-tooltip-container');
    tooltipDropdown.not(thisTooltipDropdown).hide();
    thisTooltipDropdown.toggle();
    return false;
  });

  $('.js-import-template').on('click', function() {
    $('.js-import-template-modal').show();
  });

  $('.js-close').on('click', function() {
    $('.js-import-template-modal').hide();
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

  var badgeThumbs = $('.js-badgethumb');
    badgeThumbs.each(function() {
      var imageUrl = $(this).data('image');
      $(this).css('background-image', imageUrl);
  });
});