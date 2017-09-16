/* global define, Chart */
define(function () {
  /**
   * Provides acces for a {Chart} instance.
   *
   * @exports ChartWidget
   */
  var ChartWidget = function () {
    /**
     * @type {ChartWidget}
     */
    var self = this;

    /**
     * @type {Chart}
     */
    this.instance = null;

    /**
     * Returns a chart instance.
     *
     * @return {Chart}
     */
    this.getInstance = function () {
      if (self.instance === null) {
        // noinspection JSUnresolvedFunction
        self.instance = new Chart(document.getElementById('myChart').getContext('2d')).Line({
          labels: [],
          datasets: [
            {
              fillColor: 'rgba(255,222,51,0.2)',
              strokeColor: 'rgba(255,222,51,1)',
              pointColor: 'rgba(255,222,51,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: []
            }
          ]
        });
      }

      return self.instance;
    };

    /**
     * Generates a random hue value.
     *
     * @return {string}
     */
    this.generateRandomHue = function () {
      var red = Math.floor(Math.random() * 256);
      var green = Math.floor(Math.random() * 256);
      var blue = Math.floor(Math.random() * 256);
      return (red + ',' + green + ',' + blue);
    };
  };

  return ChartWidget;
});
