var ViewDatas = function() {
    var _this = this;

    this.games = [101, 301, 501];

    this.gameIndex = 1;

    this.players = ko.observableArray([]);

    this.thrown = ko.observable(0);

    this.scoreAtStepIn = _this.games[_this.gameIndex];

    this.currentPlayerIndex = 0;

    this.nextPlayerToThrowFirst = 1;

    this.jumpToNextPlayer = function (currentPlayer) {
        var nextPlayerIndex;

        currentPlayer.avg(((currentPlayer.sum / currentPlayer.throwsNum ) * 3).toFixed(2));

        nextPlayerIndex = _this.currentPlayerIndex + 1;

        if (nextPlayerIndex >= _this.players().length) {
            nextPlayerIndex = 0;
        } 

        _this.thrown(0);  
        currentPlayer.status(0);

        nextInLine = _this.players()[nextPlayerIndex];
        nextInLine.status(1);
        _this.scoreAtStepIn = nextInLine.score();

        _this.currentPlayerIndex = nextPlayerIndex;
    }

    this.handleThrow = function(score) {
        var nextInLine;
        var currentPlayer;

        currentPlayer = _this.players()[_this.currentPlayerIndex];

        if (_this.thrown() == 0) {
            currentPlayer.lastScore = 0;
        }

        currentPlayer.sum = parseInt(currentPlayer.sum) + parseInt(score);
        currentPlayer.throwsNum++;
        currentPlayer.lastScore += parseInt(score);

        if (currentPlayer.score() - score < 0) {
            currentPlayer.score(_this.scoreAtStepIn);
            _this.jumpToNextPlayer(currentPlayer);
        } else if (currentPlayer.score() - score == 0) {
            _this.winner(currentPlayer);
        } else {
            currentPlayer.score(currentPlayer.score() - score);

            if (_this.thrown() == 2) {
                _this.jumpToNextPlayer(currentPlayer);
            } else {
                _this.thrown(_this.thrown() + 1);
            }
        }
    };

    this.winner = function (currentPlayer) {
        ko.utils.arrayForEach(_this.players(), function(player) {
            player.score(_this.games[_this.gameIndex]);
            player.status(2);
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

    this.swapScore = function () {
        _this.gameIndex++;

        if (_this.gameIndex >= _this.games.length) {
            _this.gameIndex = 0;
        }

        ko.utils.arrayForEach(_this.players(), function(player) {
            player.score(_this.games[_this.gameIndex]);
            player.status(2);
        });
    };

    this.undo = function () {
        var previusScore;
        if  (_this.thrown() == 0) {
            _this.getCurrentPlayer().status(2);
            _this.currentPlayerIndex--;
            if (_this.currentPlayerIndex < 0) {
                _this.currentPlayerIndex = (_this.players().length - 1);
            }

            previusScore = _this.getCurrentPlayer().score() + _this.getCurrentPlayer().lastScore;
            _this.getCurrentPlayer().score(previusScore)
        } else {
            _this.getCurrentPlayer().score(_this.scoreAtStepIn);
            _this.thrown(0);    
        }

        _this.getCurrentPlayer().status(1);
    };

    this.getCurrentPlayer = function () {
        return _this.players()[_this.currentPlayerIndex]
    };
}

var playerModel = function(name, status, score, victories) {
    this.name = name;
    this.status = ko.observable(status);
    this.score = ko.observable(score);
    this.victories = ko.observable(victories || 0)
    var zero = 0;
    this.avg = ko.observable(zero.toFixed(3));
    this.throwsNum = 0;
    this.sum = 0;
    this.lastScore = 0;
}

var viewDatas = new ViewDatas();

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
        thrown: viewDatas.thrown
    });

    scoreLimit = viewDatas.games[viewDatas.gameIndex];

    viewDatas.players.push(new playerModel('Eszti', 1, scoreLimit));
    viewDatas.players.push(new playerModel('Balázs', 2, scoreLimit));
    viewDatas.players.push(new playerModel('Csaba', 2, scoreLimit));

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
