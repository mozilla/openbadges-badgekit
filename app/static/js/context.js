(function() {
  var PAGE_SIZE = 10;
  var FIXTURES = [{
        name: 'zahra',
        issuers: [{
          name: "Flatiron School"
        }, {
          name: "Tom Dale",
          programs: [{
            name: "A",
          }, {
            name: "B",
          }, {
            name: "C",
          }, {
            name: "D",
          }, {
            name: "E",
          }, {
            name: "F",
          }, {
            name: "G",
          }, {
            name: "H",
          }, {
            name: "I",
          }, {
            name: "J",
          }, {
            name: "Z",
          }
          ]
        }, {
          name: "Mozilla",
          programs: [{
            name: "Open Badges"
          }, {
            name: "~~~DISCOVERY~~~"
          }]
        }, {
          name: "Iran"
        }, {
          name: "JSConf"
        }, {
          name: "Magical"
        }, {
          name: "Chelsea"
        }, {
          name: "Bumblebee"
        }, {
          name: "Optimus Prime"
        }, {
          name: "Doogh"
        }, {
          name: "Ghormeh Sabzi"
        }, {
          name: "Lavashak"
        }]
      }, {
        name: "Tom Dale",
        issuers: [{
          name: "Apple"
        }, {
          name: "Tilde"
        }, {
          name: "Zeejab"
        }]
      }];

  var App = Ember.Application.create({
    rootElement: '.container'
  });

  App.IndexController = Ember.Controller.extend({
    systems: function() {
      return FIXTURES;
    }.property(),

    selectedSystem: null
  });

  App.Paginated = Ember.Mixin.create({
    filterString: '',
    page: 1,

    maxPage: function() {
      return Math.ceil(this.get('filteredContent.length') / PAGE_SIZE);
    }.property('filteredContent.length'),

    filterDidChange: function() {
      this.set('page', 1);
    }.observes('filterString'),

    contentDidChange: function() {
      this.set('filterString', '');
      this.set('page', 1);
    }.observes('content'),

    filteredContent: function() {
      var model = this.get('model');
      var filter = this.get('filterString');

      return model.filter(function(item) {
        return item.name.match(new RegExp(filter, 'i'));
      });
    }.property('model', 'filterString'),

    arrangedContent: function() {
      var page = this.get('page'),
          pageIndex = PAGE_SIZE * (page-1),
          content = this.get('filteredContent');

      return content.slice(pageIndex, pageIndex+PAGE_SIZE);
    }.property('filteredContent', 'page'),

    actions: {
      goToFirstPage: function() {
        this.set('page', 1);
      },

      goToNextPage: function() {
        var currentPage = this.get('page');
        if (currentPage < this.get('maxPage')) {
          this.incrementProperty('page');
        }
      },

      goToPreviousPage: function() {
        var currentPage = this.get('page');
        if (currentPage > 1) {
          this.decrementProperty('page');
        }
      },

      goToLastPage: function() {
        this.set('page', this.get('maxPage'));
      }
    }
  });

  App.IssuersController = Ember.ArrayController.extend(App.Paginated, {
    itemController: 'issuersItem',

    selectedPrograms: function() {
      return this.filterBy('isSelected').reduce(function(prev, item) {
        if (item.get('programs')) {
          return prev.concat(item.get('programs'));
        }
        return prev;
      }, []);
    }.property('@each.isSelected'),

    areAllSelected: function() {
      return this.everyProperty('isSelected', true);
    }.property('@each.isSelected'),

    actions: {
      selectAll: function() {
        this.setEach('isSelected', true);
      },

      deselectAll: function() {
        this.setEach('isSelected', false);
      }
    }
  });

  App.IssuersItemController = Ember.ObjectController.extend({
    isSelected: false
  });

  App.ProgramsController = Ember.ArrayController.extend(App.Paginated);
})();