(function () {
  function ColorPalette (r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;

    this.asHex = function asHex () {
      var r = this.r.toString(16);
      var g = this.g.toString(16);
      var b = this.b.toString(16);

      return ('#'
        + (this.r < 16 ? '0' : '') + r
        + (this.g < 16 ? '0' : '') + g
        + (this.b < 16 ? '0' : '') + b).toUpperCase();
    }

    this.asRGB = function asRGB () {
      return 'rgb(' + [this.r, this.g, this.b].join(',') + ')';
    }

    this.toString = function toString () {
      return this.asHex();
    }
  }

  function getCurrentColorPalette() {
    function parseHexStr (str) {
      str = (''+str).replace(/^#/, '');
      if (!str)
        return 0;
      if (str.length === 1)
        return parseInt(str + str, 16);
      if (str.length === 2)
        return parseInt(str, 16);

      var colors = str.match(/^([0-9a-f][0-9a-f]?)([0-9a-f][0-9a-f]?)([0-9a-f][0-9a-f]?)$/i) || [];

      return {
        r: parseHexStr(colors[1]),
        g: parseHexStr(colors[2]),
        b: parseHexStr(colors[3])
      };
    }

    function parseColor (colorStr) {
      if (colorStr.charAt(0) === '#')
        return parseHexStr(colorStr);

      colors = colors.split(',');
      return {
        r: parseInt(colors[0]) || 0,
        g: parseInt(colors[1]) || 0,
        b: parseInt(colors[2]) || 0
      };
    }

    var palette = [];
    $('input:checked + .swatch', '#color').find('.swatch-item').map(function (i, item) {
      var color = parseColor(item.getAttribute('data-color'));
      palette.push(new ColorPalette(color.r, color.g, color.b));
    });
    return palette;
  }

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
