/* global define */
define([], function () {
  /**
   * A module that is responsible for notifyng event handlers.
   *
   * @exports EventObserver
   */
  var EventObserver = function () {
    var self = this;

    /**
     * @type {Array}
     */
    this.subscriptions = [];

    /**
     * Subscribes given callback for givent event.
     *
     * @param eventEnum
     * @param callback
     */
    this.subscribe = function (eventEnum, callback) {
      self.subscriptions.push({
        'eventEnum': eventEnum,
        'callback': callback
      });
    };

    /**
     * Notifys given events subscribers with given arguments.
     *
     * @param eventEnum
     * @param args
     */
    this.notify = function (eventEnum, args) {
      self.subscriptions.forEach(function (item) {
        if (item.eventEnum === eventEnum) {
          item.callback(args);
        }
      });
    };
  };

  return EventObserver;
});
