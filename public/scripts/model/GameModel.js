/* global define, $*/
define(function () {
  /**
   * @param ko
   * @param myLineChart
   * @param {GameShotDetectorService} GameShotDetectorService
   *
   * @exports GameModel
   *
   * @constructor
   */
  var GameModel = function (ko, myLineChart, GameShotDetectorService) {
    var self = this;

    this.games = [101, 301, 501];

    this.chart = myLineChart;
  
    /**
     * @type {GameShotDetectorService}
     */
    this.gameShotDetectorService = GameShotDetectorService;
    
    this.chartCount = 0;

    this.gameIndex = 1;

    this.players = ko.observableArray([]);

    this.thrown = ko.observable(0);

    this.switchViewIndex = ko.observable(0);

    this.isDoubleOut = ko.observable(false);

    this.isDoubleOut.subscribe(function (newValue) {
      ko.utils.arrayForEach(self.players(), function (player) {
        player.isDoubleOut(newValue);
      });
    });

    this.currentPlayerIndex = 0;

    this.nextPlayerToThrowFirst = 1;

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

    this.handleBust = function (currentPlayer) {
      self.thrown(self.thrown() + 1);
      currentPlayer.history.splice((0 - self.thrown()), self.thrown());
      self.jumpToNextPlayer(currentPlayer);
    };

    /**
     * Handles a leg winning shot.
     *
     * - Reset the scores;
     * - books the victory;
     * - sets the next player;
     */
    this.handleGameShot = function () {
      var currentPlayer = self.getCurrentPlayer();

      self.turnScore(currentPlayer);

      currentPlayer.victories(currentPlayer.victories() + 1);

      // If player never made won with higher score, set new highest game shot.
      if (currentPlayer.highestGameShot() < currentPlayer.requireByTurns) {
        currentPlayer.highestGameShot(currentPlayer.requireByTurns);
      }

      // Reset all players.
      ko.utils.arrayForEach(self.players(), function (player) {
        player.status(2);
        player.history([]);
        player.turnHistory([]);
        player.firstToThrow(false);
        player.requireByTurns = player.require();
      });

      self.thrown(0);

      // Move the to the next player.
      if (self.players().length > 1) {
        self.currentPlayerIndex = self.nextPlayerToThrowFirst;
        self.players()[self.currentPlayerIndex].status(1);
        self.players()[self.currentPlayerIndex].firstToThrow(true);

        // Count the first player for the next round.
        self.nextPlayerToThrowFirst++;
        if (self.nextPlayerToThrowFirst >= self.players().length) {
          self.nextPlayerToThrowFirst = 0;
        }
      }
    };

    this.handleThrow = function (score) {
      var pointsScored = parseInt(score.scoreOfThrow);
      var sectorId = score.scoreId;
      var currentPlayer = self.getCurrentPlayer();

      if (self.gameShotDetectorService.isGameShotAttempt(self.getCurrentPlayer().require(), self.thrown(), self.isDoubleOut())) {
        currentPlayer.gameShotAttempnts(currentPlayer.gameShotAttempnts() + 1);
      }

      currentPlayer.history.push(pointsScored);

      // Too much..
      if (currentPlayer.require() < 0) {
        self.handleBust(currentPlayer);
        return;
      }

      // Gameshot!
      if (currentPlayer.require() === 0 && !self.isDoubleOut()) {
        self.handleGameShot();
        return;
      }

      // Double out gameshot!
      if (currentPlayer.require() === 0 && self.isDoubleOut()) {
        // Hit.
        if (sectorId[0] === 'd' || sectorId === 'Bull') {
          self.handleGameShot();
          return;
        }
        // Hit remaining with simple shot.
        self.handleBust(currentPlayer);
        return;
      }

      // Double out with one point remaining.
      if (self.isDoubleOut() && currentPlayer.require() === 1) {
        self.handleBust(currentPlayer);
        return;
      }

      // Is last shot?
      if (self.thrown() === 2) {
        self.turnScore(currentPlayer);
        self.jumpToNextPlayer(currentPlayer);
      } else {
        self.thrown(self.thrown() + 1);
      }
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

  return GameModel;
});
