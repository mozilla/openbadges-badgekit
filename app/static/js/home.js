
$(document).ready(function(){


  // form handler
  var sendForm = function(event){
    var form = $(".js-sign-up-form");
    event.preventDefault();
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr('method'),
      dataType: "json",
      success: function(data, textStatus, jqXHR){
        var successMessage = '<h2>Thanks for signing up!</h2>' +
                             '<p>' +
                             'We will contact you soon.  In the meantime learn more about <a href="http://openbadges.org/">Mozilla Open Badges</a>' +
                             '</p>';
      },
      error: function(jqXHR, textStatus, errorThrown){
        $(".js-thanks-for-signup").html("<p>Uh oh, something went wrong! Please try inputting your information again.</p>");
      },
      complete: function(jqXHR,textStatus){
        $(".js-sign-up-form").hide();
        $(".js-thanks-for-signup").show();
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }
    });
  };

  // if there's any missing field, unbind the submit handler
  if (  !validateForm( $(".js-sign-up-form") )  ){
    $(".js-sign-up-form").unbind("submit", sendForm);
  }

  // expand the form when the e-mail field is in focus
  $(".js-sign-up-form input[name='EMAIL']").focus(function(){
    $(".js-expandable-section").slideDown(300,function(){
      $(".js-privacy").show();
    });
  });

  // validate the from as user types
  $(".js-sign-up-form").keyup(function(event){
     if ( validateForm($(this)) ){
      $(".js-sign-up-form").unbind("submit", sendForm).bind("submit", sendForm);
     }
  });

  $(".js-privacy-check").click(function(event){
    if ( validateForm($(".js-sign-up-form")) ){
      $(".js-sign-up-form").unbind("submit", sendForm).bind("submit", sendForm);
     }
  });

  // form validator
  function validateForm(form){
    var fields = form.find("input");
    $.each(fields,function(i,field){
      var validation = $(field);
      // checkbox validation
      if ( ($(field).attr("type") == "checkbox") ){
        if ( !$(field).is(":checked") ){
          $(".js-privacy label").addClass("invalid-field");
          form.find("button[type='submit']").attr("disabled","");
        }else {
          $(".js-privacy label").removeClass("invalid-field");
        }
      }else{ // validation for other fields
        if( !field.value || ( $(field).attr("type") == "email" && !validateEmail(field.value) ) ){
            validation.addClass("invalid-field");
            form.find("button[type='submit']").attr("disabled","");
        }else {
          $(field).removeClass("invalid-field");
        }
      }
    });

    if ( $(".invalid-field").length == 0 ){
      form.find("button[type='submit']").removeAttr("disabled");
      return true;
    }else{
      return false;
    }
  }

  function validateEmail(email) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

});
