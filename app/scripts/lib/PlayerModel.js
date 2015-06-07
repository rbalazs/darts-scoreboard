define("PlayerModel", function () {
        return function PlayerModel(ko, viewDatas, name, status, score, firstToThrow) {
            this.name = name;
            this.status = ko.observable(status);
            this.history = ko.observableArray([])
            this.turnHistory = ko.observableArray([])
            this.allTurnHistory = ko.observableArray([])
            this.victories = ko.observable(0)
            this.require = score;
            this.highestGameShot = ko.observable(0);
            this.hundredPlusCount = ko.observable(0);
            this.gameShotAttempnts = ko.observable(0);
            this.firstToThrow = ko.observable(firstToThrow || false);

            this.roundAvg = ko.computed(function () {
                var avg = Math.round(this.history().reduce(function (total, num) {
                    return total + num
                }, 0) / this.history().length);

                if (this.history().length >= 3) {
                    return avg * 3
                } else {
                    return 0;
                }
            }, this);

            this.totalAvg = ko.computed(function () {
                return Math.round(this.allTurnHistory().reduce(function (total, num) {
                    return total + num
                }, 0) / this.allTurnHistory().length)
            }, this);

            this.score = ko.computed(function () {
                return viewDatas.games[viewDatas.gameIndex] - this.history().reduce(function (total, num) {
                    return total + num
                }, 0)
            }, this);

            this.highestScore = ko.computed(function () {
                return this.allTurnHistory().reduce(function (p, v) {
                    return ( p > v ? p : v );
                }, 0)
            }, this);

            this.gameShotPercentage = ko.computed(function () {
                if (this.victories() == 0) {
                    return this.gameShotAttempnts() + '/0';
                }
                return Math.round((this.victories() / this.gameShotAttempnts()) *100) + '%';
            }, this);
        }
    }
);