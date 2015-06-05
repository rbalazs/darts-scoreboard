define("ViewDatas", function () {

    return function ViewDatas(ko) {
        var _this = this;

        this.games = [101, 301, 501];

        this.gameIndex = 1;

        this.players = ko.observableArray([]);

        this.thrown = ko.observable(0);

        this.switchViewIndex = ko.observable(0);

        this.switchToDoubleOut = ko.observable(false);

        this.currentPlayerIndex = 0;

        this.nextPlayerToThrowFirst = 1;

        this.jumpToNextPlayer = function (currentPlayer) {
            var nextPlayerIndex,
                nextInLine;

            _this.updateAvg(currentPlayer);

            currentPlayer.require = currentPlayer.score();

            nextPlayerIndex = _this.currentPlayerIndex + 1;

            if (nextPlayerIndex >= _this.players().length) {
                nextPlayerIndex = 0;
            }

            _this.thrown(0);
            currentPlayer.status(0);

            nextInLine = _this.players()[nextPlayerIndex];
            nextInLine.status(1);

            _this.currentPlayerIndex = nextPlayerIndex;
        }

        this.handleThrow = function (score, id) {
            var currentPlayer;

            currentPlayer = _this.getCurrentPlayer()
            currentPlayer.history.push(parseInt(score));

            if (currentPlayer.score() < 0) {
                _this.thrown(_this.thrown() + 1);
                currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
                _this.jumpToNextPlayer(currentPlayer);
            } else if (currentPlayer.score() == 0) {
                if (_this.switchToDoubleOut() == 0) {
                    _this.turnScore(currentPlayer)
                    _this.winner(currentPlayer);
                } else if (_this.switchToDoubleOut() == 1) {
                    if (id[0] == 'd' || id == 'Bull') {
                        _this.turnScore(currentPlayer)
                        _this.winner(currentPlayer);
                    } else {
                        _this.thrown(_this.thrown() + 1);
                        currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
                        _this.jumpToNextPlayer(currentPlayer);
                    }
                }
            } else {
                if (_this.switchToDoubleOut() == 1 && currentPlayer.score() == 1) {
                    _this.thrown(_this.thrown() + 1);
                    currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
                    _this.jumpToNextPlayer(currentPlayer);
                } else {
                    if (_this.thrown() == 2) {
                        _this.turnScore(currentPlayer)
                        _this.jumpToNextPlayer(currentPlayer);
                    } else {
                        _this.thrown(_this.thrown() + 1);
                    }
                }
            }
        };

        this.winner = function (currentPlayer) {
            if (_this.players().length == 1) {
                currentPlayer.victories(currentPlayer.victories() + 1);
                return;
            }

            if (currentPlayer.highestGameShot() < currentPlayer.require) {
                currentPlayer.highestGameShot(currentPlayer.require);
            }

            _this.updateAvg(currentPlayer);

            ko.utils.arrayForEach(_this.players(), function (player) {
                player.status(2);
                player.history([]);
                player.turnHistory([]);
                player.require = player.score();
            });

            _this.thrown(0);

            _this.currentPlayerIndex = _this.nextPlayerToThrowFirst;
            _this.players()[_this.currentPlayerIndex].status(1);

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
            currentPlayer.turnHistory.push(turnSum);
            currentPlayer.allTurnHistory.push(turnSum);
            console.log("...tHis: " + currentPlayer.turnHistory().toString())
            console.log("allTHis: " + currentPlayer.allTurnHistory().toString())
        };

        this.updateAvg = function (currentPlayer) {
            var sum = currentPlayer.turnHistory().reduce(function (total, num) {
                return total + num
            }, 0);

            currentPlayer.avg(((sum / currentPlayer.turnHistory().length)).toFixed(2));
        }

        this.swapScore = function () {
            _this.gameIndex++;

            if (_this.gameIndex >= _this.games.length) {
                _this.gameIndex = 0;
            }

            ko.utils.arrayForEach(_this.players(), function (player) {
                player.status(2);
                player.history([])
                player.turnHistory([])
                player.require = player.score();
            });
        };

        this.switchDoubleOut = function () {

            if (_this.switchToDoubleOut() == 1) {
                console.log(_this.switchToDoubleOut())
                _this.switchToDoubleOut(false)
            } else if (_this.switchToDoubleOut() == 0) {
                console.log(_this.switchToDoubleOut())
                _this.switchToDoubleOut(true)
            }
            console.log("asd")

        };

        this.switchView = function () {
            var style;
            var link = $("#switchable").attr("href");
            if (_this.switchViewIndex() == 1) {
                style = link.replace("view", "main")
                _this.switchViewIndex(0);
            } else if (_this.switchViewIndex() == 0) {
                style = link.replace("main", "view")
                _this.switchViewIndex(1);
            }
            $("#switchable").attr("href", style);
        };

        this.undo = function () {
            if (_this.thrown() == 0) {
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
            return _this.players()[_this.currentPlayerIndex]
        };
    }
});