/* global requirejs*/
requirejs.config({
  baseUrl: '..',
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    text: 'bower_components/requirejs-text/text',
    knockout: 'bower_components/knockout/dist/knockout',
    knockstrap: 'bower_components/knockstrap/build/knockstrap',
    GameModel: 'scripts/model/GameModel',
    PlayerModel: 'scripts/model/PlayerModel',
    CheckoutAdviser: 'scripts/service/CheckoutAdviser',
    HotkeyService: 'scripts/service/HotkeyService',
    ChartWidget: 'scripts/service/ChartWidget',
    EventObserver: 'scripts/service/EventObserver',
    GameController: 'scripts/controller/GameController'
  }
});

requirejs(['GameController', 'EventObserver'],
  /**
   * Executes application main logic.
   *
   * @param GameController
   * @param EventObserver
   */
  function main(GameController, EventObserver) {
    var gameController = new GameController();

    // Global variable on purpose.
    eventObserver = new EventObserver();

    gameController.execute();
  });
