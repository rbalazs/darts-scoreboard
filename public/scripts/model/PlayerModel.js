/* global define*/
define('PlayerModel', ['CheckoutAdviser'], function (CheckoutAdviser) {
  /**
   * @param ko
   * @param status
   * @param scoreLimit
   * @param firstToThrow
   * @constructor
   */
  var PlayerModel =  function (ko, status, scoreLimit, firstToThrow) {
    this.name = ko.observable('PhillTaylor');
    this.status = ko.observable(status);
    this.history = ko.observableArray([]);
    this.turnHistory = ko.observableArray([]);
    this.allTurnHistory = ko.observableArray([]);
    this.victories = ko.observable(0);
    this.requireByTurns = scoreLimit;
    this.highestGameShot = ko.observable(0);
    this.hundredPlusCount = ko.observable(0);
    this.gameShotAttempnts = ko.observable(0);
    this.firstToThrow = ko.observable(firstToThrow || false);
    this.isDoubleOut = ko.observable(false);

    this.require = ko.computed(function () {
      return scoreLimit - this.history().reduce(
          function (total, num) {
            return total + num;
          }, 0);
    }, this);

    this.advise = ko.computed(function () {
      if (this.isDoubleOut()) {
        return CheckoutAdviser.advise(this.require());
      }
      return this.require();
    }, this);

    this.roundAvg = ko.computed(function () {
      var avg = this.history().reduce(
          function (total, num) {
            return total + num;
          }, 0)
        / this.history().length;

      if (this.history().length >= 3) {
        return Math.round(((avg * 3) + 0.00001) * 100) / 100;
      }

      return 0;
    }, this);

    this.totalAvg = ko.computed(function () {
      return Math.round(this.allTurnHistory().reduce(
          function (total, num) {
            return total + num;
          }, 0)
        / this.allTurnHistory().length);
    }, this);

    this.highestScore = ko.computed(function () {
      return this.allTurnHistory().reduce(
        function (p, v) {
          return ( p > v ? p : v );
        }, 0);
    }, this);

    this.gameShotPercentage = ko.computed(
      function () {
        if (this.victories() === 0) {
          return this.gameShotAttempnts() + '/0';
        }
        return Math.round((this.victories() / this.gameShotAttempnts()) * 100) + '%';
      }, this);
  };
  
  return PlayerModel;
});
