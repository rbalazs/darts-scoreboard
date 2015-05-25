var ViewDatas = function() {
    var _this = this;

    this.players = ko.observableArray([]);

    this.thrown = 0;

    this.handleThrow = function(score) {
        var nextInLine;

        var match = ko.utils.arrayFirst(this.players(), function(item) {
            return 1 === item.status();
        });

        if (match) {
            match.score(match.score() - score)
            if (_this.thrown == 2) {
                _this.thrown = 0;  
                match.status(0);   
                nextInLine = ko.utils.arrayFirst(this.players(), function(item) {
                    return 2 === item.status();
                })
                if (nextInLine) {
                    nextInLine.status(1)
                } else {
                  ko.utils.arrayForEach(this.players(), function(player) {
                    player.status(2)
                });
                  ko.utils.arrayFirst(this.players(), function(player) {
                    return 2 === player.status()
                }).status(1);
              }
          } else {
            _this.thrown += 1;
        }
    }
}
};

var playerModel = function(name, status, score) {
    this.name = name;
    this.status = ko.observable(status);
    this.score = ko.observable(score)
}

var viewDatas = new ViewDatas();

ko.bindingHandlers.status = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        if (valueUnwrapped == 1) {
            $(element).css('background-color', '#AFE1AB')
        } else {
            $(element).css('background-color', '')
        }
    }
};


$(function() {
    ko.applyBindings({
        players: viewDatas.players
    });

    viewDatas.players.push(new playerModel('Eszti', 1, 301));
    viewDatas.players.push(new playerModel('Balázs', 2, 301));
    viewDatas.players.push(new playerModel('Csaba', 2, 301));

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

        viewDatas.handleThrow(score);
    });
});
