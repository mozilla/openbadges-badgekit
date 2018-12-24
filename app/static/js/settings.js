$(document).ready(function() {
  var settingsTabs = $('.js-tab');

  settingsTabs.click(function() {
    var clickedTab = $(this);
    $('.js-tab').removeClass('selected');
    clickedTab.addClass('selected');

    var section = clickedTab.data('section');

    $('.js-settings').addClass('hidden');
    $('.js-settings-' + section).removeClass('hidden');
  });

});