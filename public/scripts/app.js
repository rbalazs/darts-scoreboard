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
    HotkeyService: 'scripts/service/HotkeyService'
  }
});

requirejs(['jquery', 'knockout', 'knockstrap', 'GameModel', 'PlayerModel', 'CheckoutTable', 'HotkeyService'],
  function ($, ko, knockstrap, GameModel, PlayerModel, CheckoutTable, HotkeyService) {
    $(function () {
      var scoreLimit;
      var myLineChart = new Chart(document.getElementById("myChart").getContext("2d")).Line({
        labels: [],
        datasets: [
          {
            fillColor: "rgba(255,222,51,0.2)",
            strokeColor: "rgba(255,222,51,1)",
            pointColor: "rgba(255,222,51,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
          }
        ]
      });

      gameModel = new GameModel(ko, myLineChart);
      checkoutTable = new CheckoutTable();

      ko.components.register('darts-board-widget', {
        viewModel: {require: 'scripts/component/dartsboard/dartsBoardWidget'},
        template: {require: 'text!scripts/component/dartsboard/template/darts-board-widget.html'}
      });

      ko.bindingHandlers.status = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
          var value = valueAccessor();
          var valueUnwrapped = ko.unwrap(value);
          var element;

          element = $(element).parent();

          if (valueUnwrapped == 1) {
            element.parent().css('background-color', '#AFE1AB')
          } else if (valueUnwrapped == 0) {
            element.parent().css('background-color', '')
          } else {
            element.parent().css('background-color', '')
          }
        }
      };

      ko.applyBindings({
        players: gameModel.players,
        thrown: gameModel.thrown,
        _switch: gameModel.switchViewIndex,
        highestGameShotAll: ko.computed(function () {
          return gameModel.players().reduce(function (highest, player) {
            return (player.highestGameShot() > highest ? player.highestGameShot() : highest);
          }, 0);
        }, this),

        _switch_double: gameModel.switchToDoubleOut
      });

      HotkeyService.startListeningToKeyboard($, gameModel);

      scoreLimit = gameModel.games[gameModel.gameIndex];

      gameModel.players.push(new PlayerModel(ko, gameModel, 'Player', 1, scoreLimit, true, checkoutTable));

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
        gameModel.players.push(new PlayerModel(ko, gameModel, 'Player', 2, scoreLimit, false, checkoutTable));
        myLineChart.datasets.push(
          {
            fillColor: "rgba(" + hue + ",0.2)",
            strokeColor: "rgba(" + hue + ",1)",
            pointColor: "rgba(" + hue + ",1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(" + hue + ",1)",
            points: []
          });
        myLineChart.update();
      });
    });
  });