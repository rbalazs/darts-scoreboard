define("PlayerModel", function () {
        return function PlayerModel(ko, viewDatas, name, status, score, victories) {
            this.name = name;
            this.status = ko.observable(status);
            this.history = ko.observableArray([])
            this.victories = ko.observable(victories || 0)
            this.roundAvg = ko.computed(function () {
                return Math.round(this.history().reduce(function (total, num) {
                    return total + num
                }, 0) / this.history().length)
            }, this);
            this.require = score;
            this.score = ko.computed(function () {
                return viewDatas.games[viewDatas.gameIndex] - this.history().reduce(function (total, num) {
                    return total + num
                }, 0)
            }, this);
            this.turnHistory = ko.observableArray([])
            this.allTurnHistory = ko.observableArray([])
            this.highestScore = ko.computed(function () {
                return this.allTurnHistory().reduce(function (p, v) {
                    return ( p > v ? p : v );
                }, 0)
            }, this);
            this.highestGameShot = ko.observable(0);
        }
    }
);