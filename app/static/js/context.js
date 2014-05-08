(function() {
  var dataUrl = $('.js-ember-container').data('url');
  $.ajax({
    url: dataUrl,
    type: 'GET',
    dataType: 'json'
  }).done(function (data) {
    $('.js-ember-container').html('');
    setupEmberApp(data.systems);
  })
})();

function setupEmberApp(systems) {
  var App = Ember.Application.create({
    rootElement: '.js-ember-container'
  });

  App.IssuersController = Ember.ObjectController.extend({
    useIssuer: false,
    selectedIssuer: null,
  });


  App.ProgramsController = Ember.ObjectController.extend({
    useProgram: false,
    selectedProgram: null
  });

  App.IndexController = Ember.Controller.extend({
    needs: ['issuers', 'programs'],
    systems: function() {
      return systems;
    }.property(),

    selectedSystem: null,

    actions: {
      submit: function(issuer) {
        var systemSelect = $('.js-system-select');
        var issuerSelect = $('.js-issuer-select');
        var programSelect = $('.js-program-select');
        var csrfToken = $('.js-ember-container').data('csrf');

        var data = { system: { slug: systemSelect.val(), name: systemSelect.find('option:selected').text() },
                     _csrf: csrfToken };

        if (issuerSelect.val()) { 
          data.issuer = { slug: issuerSelect.val(), name: issuerSelect.find('option:selected').text() };
        }

        if (programSelect.val()) { 
          data.program = { slug: programSelect.val(), name: programSelect.find('option:selected').text() };
        }

        $.ajax({
          type: 'POST',
          data: data,
        }).done(function (data) {
          window.location.href = data.location;
        })
      }
    }
  });

}