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

  function hookupActions(elementSet) {
    elementSet.find('.js-system-select').change(systemChange);
    elementSet.find('.js-system-users-btn').click(systemUsersLink);
    elementSet.find('.js-edit-system-user-btn').click(systemUserLink);
    elementSet.find('.js-delete-system-user-btn').click(systemUserDelete);
    elementSet.find('.js-save-system-user-btn').click(systemUserSave);
    elementSet.find('.js-add-system-user-btn').click(systemUserAdd);
    elementSet.find('.js-issuer-select').change(issuerChange);
    elementSet.find('.js-issuer-profile-btn').click(issuerProfileLink);
    elementSet.find('.js-issuer-users-btn').click(issuerUsersLink);
    elementSet.find('.js-edit-issuer-user-btn').click(issuerUserLink);
    elementSet.find('.js-delete-issuer-user-btn').click(issuerUserDelete);
    elementSet.find('.js-save-issuer-user-btn').click(issuerUserSave);
    elementSet.find('.js-add-issuer-user-btn').click(issuerUserAdd);
    elementSet.find('.js-program-select').change(programChange);
    elementSet.find('.js-program-profile-btn').click(programProfileLink);
    elementSet.find('.js-program-users-btn').click(programUsersLink);
    elementSet.find('.js-edit-program-user-btn').click(programUserLink);
    elementSet.find('.js-delete-program-user-btn').click(programUserDelete);
    elementSet.find('.js-save-program-user-btn').click(programUserSave);
    elementSet.find('.js-add-program-user-btn').click(programUserAdd);
    elementSet.find('.js-issuer-save-btn').click(issuerSaveButton);
    elementSet.find('.js-issuer-cancel-btn').click(issuerCancelButton);
    elementSet.find('.js-program-save-btn').click(programSaveButton);
    elementSet.find('.js-program-cancel-btn').click(programCancelButton);
    elementSet.find('.js-back-btn').click(returnToMenu);
  }

  $('.js-system-select').prop('selectedIndex',0);

  const permissionSettings = $('.js-settings-permissions');
  hookupActions(permissionSettings);

  function currentSystem(newVal) {
    if (newVal)
      return permissionSettings.data('current-system', newVal);
    else
      return permissionSettings.data('current-system');
  }

  function currentIssuer(newVal) {
    if (newVal)
      return permissionSettings.data('current-issuer', newVal);
    else
      return permissionSettings.data('current-issuer');
  }

  function currentProgram(newVal) {
    if (newVal)
      return permissionSettings.data('current-program', newVal);
    else
      return permissionSettings.data('current-program');
  }
  const systemsUrl = permissionSettings.data('systems-url');
  const issuersUrl = permissionSettings.data('issuers-url');
  const programsUrl = permissionSettings.data('programs-url');
  const usersUrl = permissionSettings.data('users-url');
  const csrfToken = permissionSettings.data('csrf');

  function systemChange() {
    var selectedOption = $(this.options[this.selectedIndex]);
    currentSystem({ slug: selectedOption.val(), name: selectedOption.html() });
    if (this.selectedIndex > 0) {
      $('.js-issuer-select').disabled = true;
      $('.js-program-select').disabled = true;
      $.ajax({
        url: issuersUrl,
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

          hookupActions($('.js-issuer-column'));
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
    var selectedOption = $(this.options[this.selectedIndex]);
    currentIssuer({ slug: selectedOption.val(), name: selectedOption.html() });
    if (this.selectedIndex > 0) {
      $('.js-program-select').disabled = true;

      $.ajax({
        url: programsUrl,
        data: { systemSlug: currentSystem().slug, issuerSlug: selectedOption.val() },
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

          hookupActions($('.js-program-column'));
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
    currentProgram({ slug: selectedOption.val(), name: selectedOption.html() });
    if (selectedOption.data('admin')) {
      $('.js-program-admin-options').show();
    }
    else {
      $('.js-program-admin-options').hide();
    }
  }

  function issuerProfileLink() {
    $.ajax({
      url: issuersUrl,
      data: { systemSlug: currentSystem().slug,
              issuerSlug: currentIssuer().slug },
      success: function(data, textStatus, jqXHR) {
        data.profileActive = true;
        var issuerProfileHtml = nunjucks.render('settings/issuer-profile.html', data);
        permissionSettings.html(issuerProfileHtml);

        hookupActions(permissionSettings);
      }
    });

    return false;
  }

  function programProfileLink() {
    $.ajax({
      url: programsUrl,
      data: { systemSlug: currentSystem().slug, 
              issuerSlug: currentIssuer().slug, 
              programSlug: currentProgram().slug },
      success: function(data, textStatus, jqXHR) {
        data.profileActive = true;
        var programProfileHtml = nunjucks.render('settings/program-profile.html', data);
        permissionSettings.html(programProfileHtml);

        hookupActions(permissionSettings);
      }
    });

    return false;
  }

  function returnToMenu() {
    $.ajax({
      url: systemsUrl,
      success: function(data, textStatus, jqXHR) {
        var navHtml = nunjucks.render('settings/nav.html', data);
        permissionSettings.html(navHtml);
        hookupActions(permissionSettings);
      }
    });
    return false;
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
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug },
      success: function(data, textStatus, jqXHR) {
        data.system = currentSystem();
        data.usersActive = true;
        var systemUsersHtml = nunjucks.render('settings/system-users.html', data);
        permissionSettings.html(systemUsersHtml);
        hookupActions(permissionSettings);
      }
    });

    return false;
  }

  function renderEditSystemUser(data, textStatus, jqXHR) {
    data.system = currentSystem();
    data.csrfToken = csrfToken;
    data.usersActive = true;
    var systemUserHtml = nunjucks.render('settings/system-user.html', data);
    permissionSettings.html(systemUserHtml);
    hookupActions(permissionSettings);
  }

  function systemUserLink() {
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug,
              email: $(this).html() },
      success: renderEditSystemUser
    });

    return false;
  }

  function systemUserSave() {
    $.ajax({
      url: usersUrl,
      type: 'POST',
      data: $('.js-user-form').serialize(),
      success: systemUsersLink
    });

    return false;
  }


  function systemUserDelete() {
    $.ajax({
      url: usersUrl,
      type: 'DELETE',
      data: $('.js-user-form').serialize(),
      success: systemUsersLink
    });

    return false;
  }

  function systemUserAdd() {
    var email = $('.js-email-input').val();
    if (!validateEmail(email)) {
      $('.js-email-error').show();
    }
    else {
      $.ajax({
        url: usersUrl,
        type: 'POST',
        data: { systemSlug: currentSystem().slug,
                email: email,
                _csrf: csrfToken },
        success: renderEditSystemUser
      });
    }

    return false;
  }


  function issuerUsersLink() {
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug, 
              issuerSlug: currentIssuer().slug },
      success: function(data, textStatus, jqXHR) {
        data.issuer = currentIssuer();
        data.usersActive = true;
        var issuerUsersHtml = nunjucks.render('settings/issuer-users.html', data);
        permissionSettings.html(issuerUsersHtml);
        hookupActions(permissionSettings);
      }
    });

    return false;
  }

  function renderEditIssuerUser(data, textStatus, jqXHR) {
    data.system = currentSystem();
    data.issuer = currentIssuer();
    data.csrfToken = csrfToken;
    data.usersActive = true;
    var issuerUserHtml = nunjucks.render('settings/issuer-user.html', data);
    permissionSettings.html(issuerUserHtml);
    hookupActions(permissionSettings);
  }

  function issuerUserLink() {
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug,
              issuerSlug: currentIssuer().slug,
              email: $(this).html() },
      success: renderEditIssuerUser
    });

    return false;
  }

  function issuerUserSave() {
    $.ajax({
      url: usersUrl,
      type: 'POST',
      data: $('.js-user-form').serialize(),
      success: issuerUsersLink
    });

    return false;
  }


  function issuerUserDelete() {
    $.ajax({
      url: usersUrl,
      type: 'DELETE',
      data: $('.js-user-form').serialize(),
      success: issuerUsersLink
    });

    return false;
  }

  function issuerUserAdd() {
    var email = $('.js-email-input').val();
    if (!validateEmail(email)) {
      $('.js-email-error').show();
    }
    else {
      $.ajax({
        url: usersUrl,
        type: 'POST',
        data: { systemSlug: currentSystem().slug,
                issuerSlug: currentIssuer().slug,
                email: email,
                _csrf: csrfToken },
        success: renderEditIssuerUser
      });
    }

    return false;
  }

  function programUsersLink() {
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug, 
              issuerSlug: currentIssuer().slug, 
              programSlug: currentProgram().slug },
      success: function(data, textStatus, jqXHR) {
        data.program = currentProgram();
        data.usersActive = true;
        var programUsersHtml = nunjucks.render('settings/program-users.html', data);
        permissionSettings.html(programUsersHtml);
        hookupActions(permissionSettings);
      }
    });

    return false;
  }

  function renderEditProgramUser(data, textStatus, jqXHR) {
    data.system = currentSystem();
    data.issuer = currentIssuer();
    data.program = currentProgram();
    data.csrfToken = csrfToken;
    data.usersActive = true;
    var programUserHtml = nunjucks.render('settings/program-user.html', data);
    permissionSettings.html(programUserHtml);
    hookupActions(permissionSettings);
  }

  function programUserLink() {
    $.ajax({
      url: usersUrl,
      data: { systemSlug: currentSystem().slug,
              issuerSlug: currentIssuer().slug,
              programSlug: currentProgram().slug,
              email: $(this).html() },
      success: renderEditProgramUser
    });

    return false;
  }

  function programUserSave() {
    $.ajax({
      url: usersUrl,
      type: 'POST',
      data: $('.js-user-form').serialize(),
      success: programUsersLink
    });

    return false;
  }


  function programUserDelete() {
    $.ajax({
      url: usersUrl,
      type: 'DELETE',
      data: $('.js-user-form').serialize(),
      success: programUsersLink
    });

    return false;
  }

  function programUserAdd() {
    var email = $('.js-email-input').val();
    if (!validateEmail(email)) {
      $('.js-email-error').show();
    }
    else {
      $.ajax({
        url: usersUrl,
        type: 'POST',
        data: { systemSlug: currentSystem().slug,
                issuerSlug: currentIssuer().slug,
                programSlug: currentProgram().slug,
                email: email,
                _csrf: csrfToken },
        success: renderEditProgramUser
      });
    }

    return false;
  }
});


function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}
