/* global requirejs */
requirejs.config({
  baseUrl: '..',
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    text: 'bower_components/requirejs-text/text',
    knockout: 'bower_components/knockout/dist/knockout',
    knockstrap: 'bower_components/knockstrap/build/knockstrap',

    models: 'scripts/model/',
    services: 'scripts/service/',

    GameController: 'scripts/controller/GameController'
  }
});

requirejs(['GameController', 'services/EventObserver'],
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

    // Config global variables, to be refactored.
    BACKEND_API_URL = 'http://127.0.0.1:8080';

    gameController.execute();
  });
