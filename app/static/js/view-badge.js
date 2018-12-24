$(document).ready(function() {
    var notification = $('.js-notification');

  $(document).ajaxError(function(event, jqXHR, ajaxSetting, thrownError) {
    if (jqXHR && jqXHR.responseText) {
      notification.html('<p>' + jqXHR.responseText + '</p>');
    }
    else {
      notification.html('<p>' + thrownError + '</p>');
    }
  });

  $('.js-delete-btn').click(function() {
    notification.html($('.js-delete-confirm-text').html());
    notification.find('.js-delete-confirm-btn').click(function() {
      $.ajax({ url: this.href, 
               type: 'DELETE',
               data: { _csrf: $(this).data('csrf') }, 
               success: function(data) {
                window.location.href = data.location;
               }
      });
      return false;
    });

    return false;
  });

  $('.js-view-tab').click(function() {
    $(this).addClass('selected');
    $('.js-action-tab').removeClass('selected');
    $('.js-badge-actions').hide();
    $('.js-badge-info').show();
  });

  $('.js-action-tab').click(function() {
    $(this).addClass('selected');
    $('.js-view-tab').removeClass('selected');
    $('.js-badge-actions').show();
    $('.js-badge-info').hide();
  });

  $('.js-copy-btn, .js-archive-btn').click(function() {
    var url = $(this).data('url');
    var postData = { _csrf: $(this).data('csrf') };
    $.post(url, postData, function(data) {
      if (data.location) {
        window.location.href = data.location;
      }
      else {
        location.reload(false);
      }
    });
    return false;
  });

  $('.js-publish-btn').click(function() {
    notification.empty();
    if (validateInput()) { 
      var url = $(this).data('url');
      var postData = { _csrf: $(this).data('csrf'), skipSave: true };
      $.post(url, postData, function(data) {
        if (data.location) {
          window.location.href = data.location;
        }
        else {
          location.reload(false);
        }
      });
      return false;
    }
  });

  function validateField(inputName, error, test) {
    var val = $('[name=' + inputName + ']').val();
    if (test(val) == false) {
      notification.append('<p>' + error + '</p>');
      return false;
    }

    return true;
  }

  function validateCriteria() {
    var result = true;
    $('[name=criterionDescription]').each(function(index, element) {
      if (!(element.value.length >= 1)) {
        notification.append('<p>Criteria ' + (index+1) + ' Description must not be empty</p>');
        result = false;
      }
    });
    return result;
  }

  function validateAlignments() {
    var result = true;
    $('[name=alignmentName]').each(function(index, element) {
      if (!(element.value.length >= 1)) {
        notification.append('<p>Alignment ' + (index+1) + ' Name must not be empty</p>');
        result = false;
      }
    });
    $('[name=alignmentUrl]').each(function(index, element) {
      if (!(element.value.length >= 1)) {
        notification.append('<p>Alignment ' + (index+1) + ' URL must not be empty</p>');
        result = false;
      }
    });

    return result;
  }

  function validateInput() {
    var valid = true;
    valid = validateField('name', 'Name must be between 1 and 255 characters',
              function(val) { return (val.length >= 1 && val.length <= 255) })
            && valid;
    valid = validateField('description', 'Short Description must be between 1 and 140 characters',
              function(val) { return (val.length >= 1 && val.length <= 140) })
            && valid;
    valid = validateField('earnerDescription', 'Earner Description must not be empty',
              function(val) { return (val.length >= 1) })
            && valid;
    valid = validateField('consumerDescription', 'Consumer Description must not be empty',
              function(val) { return (val.length >= 1) })
            && valid;
    valid = validateCriteria() && valid;
    valid = validateAlignments() && valid;
    return valid;
  }

});