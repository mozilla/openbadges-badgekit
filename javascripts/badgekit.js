var browserHeight, scrollPct;

$(document).ready(function() {

browserHeight = ($( window ).height());

$('.section').height(browserHeight);

$('#emsubmit').click(function(){
  makeReveal('blah!');
});

$('.notifywrap').stop().animate({ bottom: '0px' },250);

});

//a function to create an alert box element and add to the DOM
function makeAlert(text,status) {
  if($('.alert-box').length != 0) {
    $('.alert-box').remove();
  }
  var alert = '<div data-alert class="alert-box ' + status + '"><span class="content">' + text + '</span><a href="#" class="close">&times;</a></div>';
  $(alert).prependTo($('body')).fadeIn('fast');
}

  function makeReveal(content){
    var reveal = $('<div id="reveal" class="reveal-modal"></div>');
    reveal.append(content).appendTo('body').foundation('reveal','open');
  }
