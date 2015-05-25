var ViewDatas = function() {
    var _this = this;

    this.players = ko.observableArray([]);

    this.refreshPlayer = function(playerScore) {
        var match = ko.utils.arrayFirst(this.players(), function(item) {
            return playerScore.name === item.name;
        });

        if (match) {
            match.score(match.score() - playerScore.score)
        }
    }
};

var playerModel = function(name, status, score) {
    this.name = name;
    this.status = status;
    this.score = ko.observable(score)
}

var viewDatas = new ViewDatas();

$(function() {
    ko.applyBindings({
        players: viewDatas.players
    });

    viewDatas.players.push(new playerModel('Eszti', 1, 301));
    viewDatas.players.push(new playerModel('Balázs', 0, 301));

    $("#dartboard #areas g").children().click(function(){
        var id;
        var score;
        var color;
        var _this = this;


        id = $(this).attr('id');
            
        color = $(this).css('fill');

        $(this).css('fill', 'red')

        setTimeout(function () {
            $(_this).css('fill', color)            
        }, 500)

        score = id.substring(1);
        
        if (id[0] == 'd') {
            score = score * 2
        }

        if (id[0] == 't') {
            score = score * 3
        }

        viewDatas.refreshPlayer({name: "Eszti", score:score});

    });
});
