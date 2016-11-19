/* global define, $*/
define('GameModel', function () {
  return function GameModel(ko, myLineChart) {
    var self = this;

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

      ko.utils.arrayForEach(self.players(), function (item) {
        scoresToChart.push(item.roundAvg());
      });

      self.chart.addData(scoresToChart, '');
      self.chartCount++;

      if (self.chartCount >= 25) {
        self.chartCount--;
        self.chart.removeData();
      }

      currentPlayer.requireByTurns = currentPlayer.require();

      nextPlayerIndex = self.currentPlayerIndex + 1;

      if (nextPlayerIndex >= self.players().length) {
        nextPlayerIndex = 0;
      }

      self.thrown(0);
      currentPlayer.status(0);

      nextInLine = self.players()[nextPlayerIndex];
      nextInLine.status(1);

      self.currentPlayerIndex = nextPlayerIndex;
    };

    this.handleThrow = function (scoreOfThrow, id) {
      var currentPlayer;

      currentPlayer = self.getCurrentPlayer();

      var ifGameShot = self.checkForGameShot(currentPlayer, self.thrown(), self.switchToDoubleOut());

      if (ifGameShot) {
        currentPlayer.gameShotAttempnts(currentPlayer.gameShotAttempnts() + 1);
      }

      currentPlayer.history.push(parseInt(scoreOfThrow));

      if (currentPlayer.require() < 0) {
        self.thrown(self.thrown() + 1);
        currentPlayer.history.splice((0 - self.thrown()), self.thrown());
        self.jumpToNextPlayer(currentPlayer);
      } else if (currentPlayer.require() === 0) {
        if (!self.switchToDoubleOut()) {
          self.turnScore(currentPlayer);
          self.winner(currentPlayer);
        } else if (self.switchToDoubleOut()) {
          if (id[0] === 'd' || id === 'Bull') {
            self.turnScore(currentPlayer);
            self.winner(currentPlayer);
          } else {
            self.thrown(self.thrown() + 1);
            currentPlayer.history.splice((0 - self.thrown()), self.thrown());
            self.jumpToNextPlayer(currentPlayer);
          }
        }
      } else {
        if (self.switchToDoubleOut() === 1 && currentPlayer.require() === 1) {
          self.thrown(self.thrown() + 1);
          currentPlayer.history.splice((0 - self.thrown()), self.thrown());
          self.jumpToNextPlayer(currentPlayer);
        } else {
          if (self.thrown() === 2) {
            self.turnScore(currentPlayer);
            self.jumpToNextPlayer(currentPlayer);
          } else {
            self.thrown(self.thrown() + 1);
          }
        }
      }
    };

    this.winner = function (currentPlayer) {
      if (self.players().length === 1) {
        currentPlayer.victories(currentPlayer.victories() + 1);
        return;
      }

      if (currentPlayer.highestGameShot() < currentPlayer.requireByTurns) {
        currentPlayer.highestGameShot(currentPlayer.requireByTurns);
      }

      ko.utils.arrayForEach(self.players(), function (player) {
        player.status(2);
        player.history([]);
        player.turnHistory([]);
        player.firstToThrow(false);
        player.requireByTurns = player.require();
      });

      self.thrown(0);

      self.currentPlayerIndex = self.nextPlayerToThrowFirst;
      self.players()[self.currentPlayerIndex].status(1);
      self.players()[self.currentPlayerIndex].firstToThrow(true);

      self.nextPlayerToThrowFirst++;

      if (self.nextPlayerToThrowFirst >= self.players().length) {
        self.nextPlayerToThrowFirst = 0;
      }

      currentPlayer.victories(currentPlayer.victories() + 1);
    };

    this.turnScore = function (currentPlayer) {
      var countDarts = self.thrown() + 1;
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
      self.gameIndex++;

      if (self.gameIndex >= self.games.length) {
        self.gameIndex = 0;
      }

      ko.utils.arrayForEach(self.players(), function (player) {
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
      if (self.switchViewIndex() === 1) {
        style = link.replace('view', 'main');
        self.switchViewIndex(0);
      } else if (self.switchViewIndex() === 0) {
        style = link.replace('main', 'view');
        self.switchViewIndex(1);
      }
      $switchable.attr('href', style);
    };

    this.undo = function () {
      if (self.thrown() === 0) {
        self.getCurrentPlayer().status(2);

        self.currentPlayerIndex--;
        if (self.currentPlayerIndex < 0) {
          self.currentPlayerIndex = (self.players().length - 1);
        }

        self.getCurrentPlayer().history.splice(-3, 3);
        self.getCurrentPlayer().turnHistory.splice(-1, 1);
        self.getCurrentPlayer().allTurnHistory.splice(-1, 1);
      } else {
        self.getCurrentPlayer().history.splice((0 - self.thrown()), self.thrown());
        self.thrown(0);
      }

      self.getCurrentPlayer().status(1);
    };

    this.getCurrentPlayer = function () {
      return self.players()[self.currentPlayerIndex];
    };
  };
});
