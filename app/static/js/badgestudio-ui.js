(function () {
  function addImageLoader ($container) {
    if (!window.FileReader)
      return false;

    var loaderId = 'studio_' + $container.attr('id') + '_load';
    var $loader;
    var $optionsContainer = $container.find('.options');
    var $addButton = $(
      '<li class="option">' +
      '  <label for="' + loaderId + '">' +
      '    <i class="fa fa-plus fa-3x"></i><br>Add' +
      '  </label>' +
      '</li>');

    addLoader();

    $optionsContainer.append($addButton);

    function addLoader () {
      if ($loader) $loader.remove();

      $loader = $(document.createElement('input'));

      $loader
        .attr('type', 'file')
        .attr('accept', 'image/*')
        .attr('id', loaderId)
        .addClass('hidden');

      $loader.on('change', function () {
        addLoader();
        var file = this.files[0];
        if (!file.type.match('image.*'))
          return false;

        var reader = new FileReader();
        reader.onload = function (evt) {
          if (evt.type !== 'load')
            return;

          var data = reader.result;
          var optionName = $container.attr('id');
          var optionId = 'studio_' + optionName + '_' + Date.now();
          var $option = $(
            '<li class="option">' +
            '  <input type="radio" class="hidden" name="' + optionName + '" id="' + optionId + '" value="' + data + '">' +
            '  <label for="' + optionId + '">' +
            '    <img src="' + data + '" alt="' + escape(file.name) + '" title="' + escape(file.name) + '">' +
            '  </label>' +
            '</li>');
          $container.trigger('add', data, $option);
          $addButton.before($option);
          $option.find('input').trigger('click');
        }
        reader.onerror = function () {
          alert('Failed to load file ' + file.name);
        }
        reader.readAsDataURL(this.files[0]);

        return false;
      });

      $addButton.prepend($loader);
    }
  }

  function createComponent (containerId, options) {
    if (!options)
      options = {}

    var container = document.getElementById(containerId);
    var $container = $(container);

    if (options.canAdd)
      addImageLoader($container);

    function init () {
      setTimeout(function () {
        $container.find('input:checked').trigger('change');
      }, 0);
    }

    $(init);
    $(container.form).on('reset', init);

    var proto = {
      on: function (event, handler) {
        var context = this;
        $container.on(event, function (evt) {
          var args = Array.prototype.slice.call(arguments, 1);

          if (!args.length) {
            if (evt.target.hasAttribute('data-value')) {
              args = [evt.target.getAttribute('data-value')];
            } else {
              args = [evt.target.value];
            }
          }

          handler.apply(context, args);
        });
      }
    }

    function Component () {};
    Component.prototype = proto;
    return new Component();
  }

  function BadgeStudioUI (studio, config) {
    config = config || {};

    this.shape = createComponent('shape');
    this.background = createComponent('background', {canAdd: !!config.canAddBackgrounds});
    this.graphic = createComponent('graphic', {canAdd: !!config.canAddGraphics});
    this.color = createComponent('color');
    this.branding = createComponent('branding', {canAdd: !!config.canAddBranding});

    this.shape.on('change', function (shape) {
      studio.setShape(shape);
    });

    this.background.on('change', function (background) {
      studio.setBackgroundImage(background);
    });

    this.graphic.on('change', function (graphic) {
      studio.setGlyphFromURL(graphic);
    });

    this.color.on('change', function (color) {
      var swatchElement = document.querySelector('label[for="studio_palette_' + color + '"] > .swatch');
      if (swatchElement) {
        var colorElements = swatchElement.querySelectorAll('*[data-color]');
        if (colorElements.length > 1) {
          studio.setBackgroundColor(colorElements[0].getAttribute('data-color'));
          studio.setGlyphColor(colorElements[1].getAttribute('data-color'));
        }
      }
    });

    this.branding.on('change', function (branding) {
      // TO DO
      console.log('Branding:', branding);
    });

    $('#studio').submit(function () {
      var form = $(this).find('form')[0];
      form.image.value = studio.toDataURL();
    });
  }

  window.BadgeStudioUI = BadgeStudioUI;
})();

// Initialise UI
(function() {
  $(function () {
    function selectTab (selectedTab) {
      if (!selectedTab)
        return

      selectedTab.focus();

      $tabs.each(function (i, tab) {
        var isCurrent = (tab === selectedTab);
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        $(tab)
          .attr('aria-selected', isCurrent ? 'true' : 'false')
          .toggleClass('selected', isCurrent);
        $(panel)
          .attr('aria-hidden', isCurrent ? 'false' : 'true')
          .toggleClass('hidden', !isCurrent);
      });
    }

    var $tabs = $('.tab', '.tabs')
      .click(function () {
        selectTab(this);
        this.blur();
      })
      .keyup(function (evt) {
        if (evt.keyCode === 32 || evt.keyCode === 13) // space/enter
          return selectTab(this);
        if (evt.keyCode === 37) // left
          return selectTab($(this).prev('.tab')[0]);
        if (evt.keyCode === 39) // right
          return selectTab($(this).next('.tab')[0]);
        if (evt.keyCode === 38) // up
          $(document.getElementById(this.getAttribute('aria-controls')))
            .find('input:checked').first().focus();
      });
  });

  $(function () {
    $('#studio-reset-btn').click(function (evt) {
      return confirm('Are you sure you want to reset this design? All changes will be lost.');
    });
  });
})();


