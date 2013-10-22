$(document).ready(function() {

});

//a function to create an alert box element and add to the DOM
function makeAlert(text,status) {
  if($('.alert-box').length != 0) {
    $('.alert-box').remove();
  }
  var alert = '<div data-alert class="alert-box ' + status + '"><span class="content">' + text + '</span><a href="#" class="close">&times;</a></div>';
  $(alert).prependTo($('body')).fadeIn('fast');
}

//a function to create a reveal and add to the DOM
function makeReveal(content){
  var reveal = $('<div id="reveal" class="reveal-modal"></div>');
  reveal.append(content).appendTo('body').foundation('reveal','open');
}
