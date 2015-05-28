var ViewDatas = function() {
    var _this = this;

    this.games = [101, 301, 501];

    this.gameIndex = 1;

    this.players = ko.observableArray([]);

    this.thrown = ko.observable(0);

    this.highestGameShot = ko.observableArray([0,'']);

    this.switchViewIndex = ko.observable(0);

    this.currentPlayerIndex = 0;

    this.nextPlayerToThrowFirst = 1;

    this.jumpToNextPlayer = function (currentPlayer) {
        var nextPlayerIndex;

        var sum = currentPlayer.history().reduce( function(total, num){ return total + num }, 0);

        currentPlayer.avg(((sum / currentPlayer.history().length) * 3).toFixed(2));

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

    this.handleThrow = function(score) {
        var currentPlayer;

        currentPlayer = _this.getCurrentPlayer()
        currentPlayer.history.push(parseInt(score));

        if (currentPlayer.score() < 0) {
            _this.thrown(_this.thrown() + 1);
            currentPlayer.history.splice((0 - _this.thrown()), _this.thrown());
            _this.jumpToNextPlayer(currentPlayer);
        } else if (currentPlayer.score() == 0) {
            _this.turnScore(currentPlayer)
            _this.winner(currentPlayer);
        } else {
            if (_this.thrown() == 2) {
                _this.turnScore(currentPlayer)
                _this.jumpToNextPlayer(currentPlayer);
            } else {
                _this.thrown(_this.thrown() + 1);
            }
        }
    };

    this.winner = function (currentPlayer) {
        if(_this.players().length == 1) {
            currentPlayer.victories(currentPlayer.victories() + 1);
            return;
        }

        ko.utils.arrayForEach(_this.players(), function(player) {
            player.status(2);
            player.history([]);
        });

        if (_this.highestGameShot()[0] < currentPlayer.require) {
            _this.highestGameShot([currentPlayer.require, currentPlayer.name]);
        }

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
    };

    this.swapScore = function () {
        _this.gameIndex++;

        if (_this.gameIndex >= _this.games.length) {
            _this.gameIndex = 0;
        }

        ko.utils.arrayForEach(_this.players(), function(player) {
            player.status(2);
            player.history([])
        });
    };

    this.switchView = function () {
        var style;
        var link = $("#switchable").attr("href");
        if(_this.switchViewIndex() == 1) {
            style = link.replace("view","main")
            _this.switchViewIndex(0);
        } else if(_this.switchViewIndex() == 0) {
            style = link.replace("main","view")
            _this.switchViewIndex(1);
        }
        console.log(style)
        $("#switchable").attr("href", style);
    };

    this.undo = function () {
        if  (_this.thrown() == 0) {
            _this.getCurrentPlayer().status(2);
            
            _this.currentPlayerIndex--;
            if (_this.currentPlayerIndex < 0) {
                _this.currentPlayerIndex = (_this.players().length - 1);
            }

            _this.getCurrentPlayer().history.splice(-3, 3);
            _this.getCurrentPlayer().turnHistory.splice(-1, 1);
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

var viewDatas = new ViewDatas();

var playerModel = function(name, status, score, victories) {
    this.name = name;
    this.status = ko.observable(status);
    this.victories = ko.observable(victories || 0)
    var zero = 0;
    this.avg = ko.observable(zero.toFixed(3));
    this.history = ko.observableArray([])
    this.require = score;
    this.score = ko.computed(function() {
        return viewDatas.games[viewDatas.gameIndex] - this.history().reduce(function(total, num){ return total + num }, 0)
    }, this);
    this.turnHistory = ko.observableArray([])
    this.highestScore = ko.computed(function() {
        return this.turnHistory().reduce(function(p, v){ return ( p > v ? p : v ); }, 0)
    }, this);
}

ko.bindingHandlers.status = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        if (valueUnwrapped == 1) {
            $(element).css('background-color', '#AFE1AB')
        } else if (valueUnwrapped == 0) {
            $(element).css('background-color', '')
        } else {
            $(element).css('background-color', '')
        }
    }
};


$(function() {
    var scoreLimit;

    ko.applyBindings({
        players: viewDatas.players,
        thrown: viewDatas.thrown,
        _switch: viewDatas.switchViewIndex,
        highestGameShot: viewDatas.highestGameShot
    });

    scoreLimit = viewDatas.games[viewDatas.gameIndex];

    viewDatas.players.push(new playerModel('Márki', 1, scoreLimit));
    viewDatas.players.push(new playerModel('Csé', 2, scoreLimit));

    $('#switch-btn').click(function() {
        viewDatas.switchView();
    });

    $('#zero').click(function () {
        viewDatas.handleThrow(0);        
    });

    $('#up').click(function () {
        viewDatas.swapScore();        
    });

    $('#undo').click(function () {
        viewDatas.undo();        
    });

    $("#dartboard #areas g").children().click(function(){
        var id;
        var score;
        var color;
        var _this = this;

        id = $(this).attr('id');

        color = $(this).css('fill');

        $(this).css('fill', 'yellow')

        setTimeout(function () {
            $(_this).css('fill', color)            
        }, 250)

        score = id.substring(1);
        
        if (id[0] == 'd') {
            score = score * 2
        }

        if (id[0] == 't') {
            score = score * 3
        }

        if (id == 'Outer') {
            score = 25;
        }

        if (id == 'Bull') {
            score = 50;
        }

        viewDatas.handleThrow(score);
    });
});
