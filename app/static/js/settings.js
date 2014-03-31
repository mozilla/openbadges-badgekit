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

  function hookupActions() {
    $('.js-system-select').change(systemChange);
    $('.js-system-users-link').click(systemUsersLink);
    $('.js-issuer-select').change(issuerChange);
    $('.js-issuer-profile-link').click(issuerProfileLink);
    $('.js-issuer-users-link').click(issuerUsersLink);
    $('.js-program-select').change(programChange);
    $('.js-program-profile-link').click(programProfileLink);
    $('.js-program-users-link').click(programUsersLink);
    $('.js-issuer-save-btn').click(issuerSaveButton);
    $('.js-issuer-cancel-btn').click(issuerCancelButton);
    $('.js-program-save-btn').click(programSaveButton);
    $('.js-program-cancel-btn').click(programCancelButton);
  }

  hookupActions();

  function systemChange() {
    if (this.selectedIndex > 0) {
      $('.js-issuer-select').disabled = true;
      $('.js-program-select').disabled = true;
      var selectedOption = $(this.options[this.selectedIndex]);
      var url = $('.js-settings-permissions').data('issuers-url');
      $.ajax({
        url: url,
        data: { systemSlug: selectedOption.val() },
        success: function(data, textStatus, jqXHR){
          var issuerHtml = nunjucks.render('settings/issuer-nav.html', data);
          var issuerColumn = $('.js-issuer-column');
          $('.js-program-column').replaceWith('');
          if (issuerColumn.length) {
            issuerColumn.replaceWith(issuerHtml);
          }
          else {
            $('.js-system-column').after(issuerHtml);
          }

          if (selectedOption.data('admin')) {
            $('.js-system-admin-options').show();
          }
          else {
            $('.js-system-admin-options').hide();
          }

          hookupActions();
        }
      });
    }
    else {
      $('.js-issuer-column').replaceWith('');
      $('.js-program-column').replaceWith('');
      $('.js-system-admin-options').hide();
    }
  }

  function issuerChange() {
    if (this.selectedIndex > 0) {
      $('.js-program-select').disabled = true;
      var selectedOption = $(this.options[this.selectedIndex]);
      var systemSlug = $('.js-system-select').val();
      var url = $('.js-settings-permissions').data('programs-url');
      $.ajax({
        url: url,
        data: { systemSlug: systemSlug, issuerSlug: selectedOption.val() },
        type: 'GET',
        success: function(data, textStatus, jqXHR) {
          var programHtml = nunjucks.render('settings/program-nav.html', data);
          var programColumn = $('.js-program-column');
          if (programColumn.length) {
            programColumn.replaceWith(programHtml);
          }
          else {
            $('.js-issuer-column').after(programHtml);
          }

          if (selectedOption.data('admin')) {
            $('.js-issuer-admin-options').show();
          }
          else {
            $('.js-issuer-admin-options').hide();
          }

          hookupActions();
        }
      });
    }
    else {
      $('.js-program-column').replaceWith('');
      $('.js-issuer-admin-options').hide();
    }
  }

  function programChange() {
    var selectedOption = $(this.options[this.selectedIndex]);
    if (selectedOption.data('admin')) {
      $('.js-program-admin-options').show();
    }
    else {
      $('.js-program-admin-options').hide();
    }
  }

  function issuerProfileLink() {
    $.ajax({
      url: $('.js-settings-permissions').data('issuers-url'),
      data: { systemSlug: $('.js-system-select').val(), issuerSlug: $('.js-issuer-select').val() },
      success: function(data, textStatus, jqXHR) {
        var issuerProfileHtml = nunjucks.render('settings/issuer-profile.html', data);
        $('.js-settings-permissions').html(issuerProfileHtml);

        hookupActions();
      }
    });

    return false;
  }

  function programProfileLink() {
    $.ajax({
      url: $('.js-settings-permissions').data('programs-url'),
      data: { systemSlug: $('.js-system-select').val(), 
              issuerSlug: $('.js-issuer-select').val(), 
              programSlug: $('.js-program-select').val() },
      success: function(data, textStatus, jqXHR) {
        var programProfileHtml = nunjucks.render('settings/program-profile.html', data);
        $('.js-settings-permissions').html(programProfileHtml);

        hookupActions();
      }
    });

    return false;
  }

  function returnToMenu() {
    $.ajax({
      url: $('.js-settings-permissions').data('systems-url'),
      success: function(data, textStatus, jqXHR) {
        var navHtml = nunjucks.render('settings/nav.html', data);
        $('.js-settings-permissions').html(navHtml);
        hookupActions();
      }
    });
  }

  function programSaveButton() {
    returnToMenu();
    return false;
  }

  function issuerSaveButton() {
    returnToMenu();
    return false;
  }

  function programCancelButton() {
    returnToMenu();
    return false;
  }

  function issuerCancelButton() {
    returnToMenu();
    return false;
  }

  function systemUsersLink() {
    var systemUsersHtml = nunjucks.render('settings/system-users.html');
    $('.js-settings-permissions').html(systemUsersHtml);
    hookupActions();
    return false;
  }

  function issuerUsersLink() {
    var issuerUsersHtml = nunjucks.render('settings/issuer-users.html');
    $('.js-settings-permissions').html(issuerUsersHtml);
    hookupActions();
    return false;
  }

  function programUsersLink() {
    var programUsersHtml = nunjucks.render('settings/program-users.html');
    $('.js-settings-permissions').html(programUsersHtml);
    hookupActions();
    return false;
  }
});