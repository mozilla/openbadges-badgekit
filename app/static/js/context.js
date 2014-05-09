(function() {
  var App = Ember.Application.create({
    rootElement: '.js-ember-container'
  });

  App.IssuersController = Ember.ObjectController.extend({
    useProgram: false,
    selectedIssuer: null,
    showPrograms: function() {
      return this.get('useProgram') && this.get('selectedIssuer').programs.length;
    }.property('useProgram', 'selectedIssuer'),
  });

  App.ProgramsController = Ember.ObjectController.extend({
    selectedProgram: null
  });

  App.IndexController = Ember.Controller.extend({
    needs: ['issuers','programs'],
    systems: [],
    selectedSystem: null,
    useIssuer: false,

    preselect: function () {
      var issuer = this.get('selectedSystem.issuers.firstObject');
      this.set('controllers.issuers.selectedIssuer', issuer);
    }.observes('selectedSystem'),

    showIssuers: function() {
      return this.get('useIssuer') && this.get('selectedSystem').issuers.length;
    }.property('useIssuer', 'selectedSystem'),

    init: function() {
      var dataUrl = $('.js-ember-container').data('url');
      var controller = this;
      $.ajax({
        url: dataUrl,
        type: 'GET',
        dataType: 'json'
      }).done(function (data) {
        controller.set('systems', data.systems);
        controller.set('selectedSystem', controller.get('systems.firstObject'));
      })
    },

    actions: {
      submit: function(issuer) {
        var systemSelect = $('.js-system-select');
        var issuerSelect = $('.js-issuer-select');
        var programSelect = $('.js-program-select');
        var csrfToken = $('.js-ember-container').data('csrf');

        var data = { system: { slug: systemSelect.val(), name: systemSelect.find('option:selected').text() },
                     _csrf: csrfToken };

        if (this.get('showIssuers') && issuerSelect.val()) {
          data.issuer = { slug: issuerSelect.val(), name: issuerSelect.find('option:selected').text() };
          if (this.get('controllers.issuers').get('showPrograms') && programSelect.val()) { 
            data.program = { slug: programSelect.val(), name: programSelect.find('option:selected').text() };
          }
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
})();
