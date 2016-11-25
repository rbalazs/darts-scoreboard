/* global define */
define('EventObserver', function () {
  return function EventObserver() {
    var self = this;

    this.subscriptions = [];

    this.subscribe = function (eventEnum, callback) {
      self.subscriptions.push({
        'eventEnum': eventEnum,
        'callback': callback
      });
    };

    this.notify = function (eventEnum, args) {
      self.subscriptions.forEach(function (item) {
        if (item.eventEnum === eventEnum) {
          item.callback(args);
        }
      });
    };
  };
});
