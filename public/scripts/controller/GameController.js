/* global eventObserver, define */

define(
  [
    'jquery', 'knockout', 'knockstrap', 'models/GameModel',
    'models/PlayerModel', 'services/HotkeyService',
    'services/ChartWidget', 'services/GameShotDetectorService'
  ],
  function ($, ko, knockstrap, GameModel, PlayerModel, HotkeyService, ChartWidget, GameShotDetectorService) {
    /**
     * @constructor
     */
    var GameController = function () {
      /**
       * Starts up the application.
       */
      this.execute = function () {
        var chartWidget = new ChartWidget();
        var gameModel = new GameModel(ko, chartWidget.getInstance(), GameShotDetectorService);
        var firstPlayer = new PlayerModel(ko, 1, gameModel.games[gameModel.gameIndex], true);

        gameModel.players.push(firstPlayer);

        this.initKoBindings(gameModel);
        this.initBasicEventListeners(gameModel, chartWidget);

        HotkeyService.init($);

        eventObserver.subscribe('SCORE', gameModel.handleThrow);
        eventObserver.subscribe('UNDO', gameModel.undo);
      };

      /**
       * Sets the necessery knockout default bindings.
       *
       * @param gameModel
       */
      this.initKoBindings = function (gameModel) {
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
            } else if (valueUnwrapped === 0) {
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

          switchDobuleOut: gameModel.isDoubleOut
        });
      };

      /**
       * Sets the basic event listeners:
       *  - Add player
       *  - Etc.
       *
       * @param gameModel
       * @param chartWidget
       */
      this.initBasicEventListeners = function (gameModel, chartWidget) {
        $('#add-player').click(function () {
          var red = Math.floor(Math.random() * 256);
          var green = Math.floor(Math.random() * 256);
          var blue = Math.floor(Math.random() * 256);
          var hue = (red + ',' + green + ',' + blue);
          var newPlayer = new PlayerModel(ko, 2, gameModel.games[gameModel.gameIndex], false);

          gameModel.players.push(newPlayer);

          chartWidget.getInstance().datasets.push({
            fillColor: 'rgba(' + hue + ',0.2)',
            strokeColor: 'rgba(' + hue + ',1)',
            pointColor: 'rgba(' + hue + ',1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(' + hue + ',1)',
            points: []
          });

          chartWidget.getInstance().update();
        });
      };
    };

    return GameController;
  });
