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
    useProgram: false,
    selectedIssuer: null,

    showPrograms: function() {
      return this.get('useProgram') && this.get('selectedIssuer').programs.length;
    }.property('useProgram', 'selectedIssuer'),

    preselect: function () {
      var issuer = this.get('issuers.firstObject');
      this.set('selectedIssuer', issuer);
    }.observes('issuers.@each')
  });

  App.ProgramsController = Ember.ObjectController.extend({
    selectedProgram: null
  });

  App.IndexController = Ember.Controller.extend({
    systems: function() {
      return systems;
    }.property(),

    selectedSystem: null,
    useIssuer: false,

    showIssuers: function() {
      return this.get('useIssuer') && this.get('selectedSystem').issuers.length;
    }.property('useIssuer', 'selectedSystem'),

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