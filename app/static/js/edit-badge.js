$(document).ready(function() {

  var categoryAnchors = $('.categories > a');

  categoryAnchors.click(function() {
    categoryAnchors.removeClass('highlighted');
    $(this).addClass('highlighted');

    $('.form-page').addClass('hidden');

    var section = $(this).data('section');

    $('.section-' + section).removeClass('hidden');

    return false;
  });
});