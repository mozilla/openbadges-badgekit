var browserHeight, scrollPct;

$(document).ready(function() {

browserHeight = ($( window ).height() - 15);

$('.section').height(browserHeight);
$('.section-1 img').css('margin-top',((browserHeight/2) - 260) + 'px');
$('.section-2 ul').css('margin-top',((browserHeight/2) - 50) + 'px');

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

$(document).scroll(function(){

var scrollPos = $(this).scrollTop();

    if ($(this).scrollTop()>(browserHeight) && ($(this).scrollTop()<(browserHeight) * 2)){
        // animate fixed div to small size:
       scrollPos -= browserHeight;
    } else if (($(this).scrollTop()>(browserHeight) * 2) && ($(this).scrollTop()<(browserHeight) * 3)){
        //  animate fixed div to original size
        //$('.animate').stop().animate({ height: 175 },100);
       //console.log(3);
      scrollPos -= (browserHeight * 2);
    } else {
        var fontSize = (9 + scrollPct);
        if (fontSize > 80) {fontSize = 80;}
        if (fontSize < 9) {fontSize = 9;}
        $('.section-2 p').stop().animate({ fontSize: fontSize + 'px' },500);
        $('.section-2 .bgimg').stop().animate({ opacity: scrollPct/100 },250);

    }
    scrollPct = ((scrollPos / browserHeight) * 100);
    console.log(scrollPct);
}); 
