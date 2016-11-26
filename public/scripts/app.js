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
    CheckoutTable: 'scripts/service/CheckoutTable',
    HotkeyService: 'scripts/service/HotkeyService',
    ChartWidget: 'scripts/service/ChartWidget',
    EventObserver: 'scripts/service/EventObserver'
  }
});

requirejs([
    'jquery', 'knockout', 'knockstrap', 'GameModel', 'PlayerModel',
    'CheckoutTable', 'HotkeyService', 'ChartWidget', 'EventObserver'
  ],

  /**
   * @param {jQuery} $
   * @param {ko} ko
   * @param {knockstrap} knockstrap
   * @param {GameModel} GameModel
   * @param {PlayerModel} PlayerModel
   * @param {CheckoutTable} CheckoutTable
   * @param {HotkeyService} HotkeyService
   * @param {ChartWidget} ChartWidget
   * @param {EventObserver} EventObserver
   */
  function (
    $, ko, knockstrap, GameModel, PlayerModel, CheckoutTable,
    HotkeyService, ChartWidget, EventObserver
  ) {
    var chartWidget = new ChartWidget();
    var gameModel = new GameModel(ko, chartWidget.getInstance());
    var checkoutTable = new CheckoutTable();
    var firstPlayer = new PlayerModel(ko, 1, gameModel.games[gameModel.gameIndex], true,
      checkoutTable);

    // Global variable on purpose.
    eventObserver = new EventObserver();

    ko.components.register('darts-board-widget', {
      viewModel: {
        require: 'scripts/component/dartsboard/dartsBoardWidget'
      },
      template: {
        require: 'text!scripts/component/dartsboard/template/darts-board-widget.html'
      }
    });

    ko.bindingHandlers.status = {
      update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        var parent = $(element).parent();
        if (valueUnwrapped === 1) {
          parent.parent().addClass('activePlayer');
        } else if (valueUnwrapped == 0) {
          parent.parent().removeClass('activePlayer');
        } else {
          parent.parent().removeClass('activePlayer');
        }
      }
    };

    ko.applyBindings({
      players: gameModel.players,
      thrown: gameModel.thrown,
      _switch: gameModel.switchViewIndex,
      highestGameShotAll: ko.computed(function () {
        return gameModel.players().reduce(function (highest, player) {
          return (player.highestGameShot() > highest ? player.highestGameShot() :
            highest);
        }, 0);
      }, this),

      _switch_double: gameModel.switchToDoubleOut
    });

    HotkeyService.startListeningToKeyboard($, gameModel);

    gameModel.players.push(firstPlayer);

    $('#hideHelper').click(function () {
      gameModel.activeHelper();
    });

    $('#switch_view_btn').click(function () {
      gameModel.switchView();
    });

    $('#up').click(function () {
      gameModel.swapScore();
    });

    $('#add-player').click(function () {
      var red = Math.floor(Math.random() * 256);
      var green = Math.floor(Math.random() * 256);
      var blue = Math.floor(Math.random() * 256);
      var hue = (red + ',' + green + ',' + blue);
      var newPlayer = new PlayerModel(ko, 2, gameModel.games[gameModel.gameIndex], false, checkoutTable);

      gameModel.players.push(newPlayer);

      chartWidget.getInstance().datasets.push({
        fillColor: "rgba(" + hue + ",0.2)",
        strokeColor: "rgba(" + hue + ",1)",
        pointColor: "rgba(" + hue + ",1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(" + hue + ",1)",
        points: []
      });
      chartWidget.getInstance().update();
    });

    eventObserver.subscribe('SCORE', gameModel.handleThrow);
  });
