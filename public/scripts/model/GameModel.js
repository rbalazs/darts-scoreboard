/* global define, $*/
define('GameModel', function () {
  return function GameModel(ko, myLineChart) {
    var _this = this;

    this.games = [101, 301, 501];

    this.chart = myLineChart;

    this.chartCount = 0;

    this.gameIndex = 1;

    this.players = ko.observableArray([]);

    this.thrown = ko.observable(0);

    this.switchViewIndex = ko.observable(0);

    this.switchToDoubleOut = ko.observable(false);

    this.currentPlayerIndex = 0;

    this.nextPlayerToThrowFirst = 1;

    this.activeHelper = function () {
      if (this.switchToDoubleOut()) {
        $('#helper').css('visibility', 'visible');
      } else if (!this.switchToDoubleOut()) {
        $('#helper').css('visibility', 'hidden');
      }
      return 0;
    };

    this.jumpToNextPlayer = function (currentPlayer) {
      var nextPlayerIndex;
      var nextInLine;

      var scoresToChart = [];

      ko.utils.arrayForEach(_this.players(), function (item) {
        scoresToChart.push(item.roundAvg());
      });

      _this.chart.addData(scoresToChart, '');
      _this.chartCount++;

      if (_this.chartCount >= 25) {
        _this.chartCount--;
        _this.chart.removeData();
      }

      currentPlayer.requireByTurns = currentPlayer.require();

      nextPlayerIndex = _this.currentPlayerIndex + 1;

      if (nextPlayerIndex >= _this.players().length) {
        nextPlayerIndex = 0;
      }

      _this.thrown(0);
      currentPlayer.status(0);

      nextInLine = _this.players()[nextPlayerIndex];
      nextInLine.status(1);

      _this.currentPlayerIndex = nextPlayerIndex;
    };

    this.handleThrow = function (scoreOfThrow, id) {
      var currentPlayer;

      currentPlayer = _this.getCurrentPlayer();

      var ifGameShot = _this.checkForGameShot(currentPlayer, _this.thrown(), _this.switchToDoubleOut());

      if (ifGameShot) {
        currentPlayer.gameShotAttempnts(currentPlayer.gameShotAttempnts() + 1);
      }

      currentPlayer.history.push(parseInt(scoreOfThrow));

      if (currentPlayer.require() < 0) {
        _this.thrown(_this.thrown() + 1);
        currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
        _this.jumpToNextPlayer(currentPlayer);
      } else if (currentPlayer.require() === 0) {
        if (!_this.switchToDoubleOut()) {
          _this.turnScore(currentPlayer);
          _this.winner(currentPlayer);
        } else if (_this.switchToDoubleOut()) {
          if (id[0] === 'd' || id === 'Bull') {
            _this.turnScore(currentPlayer);
            _this.winner(currentPlayer);
          } else {
            _this.thrown(_this.thrown() + 1);
            currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
            _this.jumpToNextPlayer(currentPlayer);
          }
        }
      } else {
        if (_this.switchToDoubleOut() === 1 && currentPlayer.require() === 1) {
          _this.thrown(_this.thrown() + 1);
          currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
          _this.jumpToNextPlayer(currentPlayer);
        } else {
          if (_this.thrown() === 2) {
            _this.turnScore(currentPlayer);
            _this.jumpToNextPlayer(currentPlayer);
          } else {
            _this.thrown(_this.thrown() + 1);
          }
        }
      }
    };

    this.winner = function (currentPlayer) {
      if (_this.players().length === 1) {
        currentPlayer.victories(currentPlayer.victories() + 1);
        return;
      }

      if (currentPlayer.highestGameShot() < currentPlayer.requireByTurns) {
        currentPlayer.highestGameShot(currentPlayer.requireByTurns);
      }

      ko.utils.arrayForEach(_this.players(), function (player) {
        player.status(2);
        player.history([]);
        player.turnHistory([]);
        player.firstToThrow(false);
        player.requireByTurns = player.require();
      });

      _this.thrown(0);

      _this.currentPlayerIndex = _this.nextPlayerToThrowFirst;
      _this.players()[_this.currentPlayerIndex].status(1);
      _this.players()[_this.currentPlayerIndex].firstToThrow(true);

      _this.nextPlayerToThrowFirst++;

      if (_this.nextPlayerToThrowFirst >= _this.players().length) {
        _this.nextPlayerToThrowFirst = 0;
      }

      currentPlayer.victories(currentPlayer.victories() + 1);
    };

    this.turnScore = function (currentPlayer) {
      var countDarts = _this.thrown() + 1;
      var turnThrows = currentPlayer.history.slice(-countDarts);
      var turnSum = 0;
      for (var i = 0; i < countDarts; i++) {
        turnSum += turnThrows[i];
      }
      if (turnSum !== 0) {
        currentPlayer.turnHistory.push(turnSum);
        currentPlayer.allTurnHistory.push(turnSum);
      }
      if (turnSum >= 100) {
        currentPlayer.hundredPlusCount((currentPlayer.hundredPlusCount() + 1));
      }
    };

    this.checkForGameShot = function (currentPlayer, dartCount, doubleFlag) {
      var score = currentPlayer.require();
      if (doubleFlag) {
        if ((score <= 40 && score % 2 === 0) || score === 50 && dartCount === 2) {
          return true;
        }
      } else {
        if ((score <= 40 && score % 2 === 0) || (score === 50 && dartCount === 2) ||
          (score <= 60 && score % 3 === 0) ||
          (score <= 20) ||
          (score === 25 && dartCount === 1)) {
          return true;
        }
      }
      return false;
    };

    this.swapScore = function () {
      _this.gameIndex++;

      if (_this.gameIndex >= _this.games.length) {
        _this.gameIndex = 0;
      }

      ko.utils.arrayForEach(_this.players(), function (player) {
        player.status(2);
        player.history([]);
        player.turnHistory([]);
        player.requireByTurns = player.require();
      });
    };

    this.switchView = function () {
      var style;
      var $switchable = $('#switchable');
      var link = $switchable.attr('href');
      if (_this.switchViewIndex() === 1) {
        style = link.replace('view', 'main');
        _this.switchViewIndex(0);
      } else if (_this.switchViewIndex() === 0) {
        style = link.replace('main', 'view');
        _this.switchViewIndex(1);
      }
      $switchable.attr('href', style);
    };

    this.undo = function () {
      if (_this.thrown() === 0) {
        _this.getCurrentPlayer().status(2);

        _this.currentPlayerIndex--;
        if (_this.currentPlayerIndex < 0) {
          _this.currentPlayerIndex = (_this.players().length - 1);
        }

        _this.getCurrentPlayer().history.splice(-3, 3);
        _this.getCurrentPlayer().turnHistory.splice(-1, 1);
        _this.getCurrentPlayer().allTurnHistory.splice(-1, 1);
      } else {
        _this.getCurrentPlayer().history.splice((0 - _this.thrown()), _this.thrown());
        _this.thrown(0);
      }

      _this.getCurrentPlayer().status(1);
    };

    this.getCurrentPlayer = function () {
      return _this.players()[_this.currentPlayerIndex];
    };
  };
});
