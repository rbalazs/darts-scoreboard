requirejs.config({
    baseUrl: '..',
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        text: 'bower_components/requirejs-text/text',
        knockout: 'bower_components/knockout/dist/knockout',
        knockstrap: 'bower_components/knockstrap/build/knockstrap',
        ViewDatas: 'scripts/lib/ViewDatas',
        PlayerModel: 'scripts/lib/PlayerModel',
        CheckoutTable: 'scripts/lib/CheckoutTable'
    }
});

requirejs(['jquery', 'knockout', 'knockstrap', 'ViewDatas', 'PlayerModel', 'CheckoutTable'],
    function ($, ko, knockstrap, ViewDatas, PlayerModel, CheckoutTable) {
        var myLineChart = new Chart(document.getElementById("myChart").getContext("2d")).Line({
            labels: [],
            datasets: [
                {
                    fillColor: "rgba(255,222,51,0.2)",
                    strokeColor: "rgba(255,222,51,1)",
                    pointColor: "rgba(255,222,51,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ]
        });

        viewDatas = new ViewDatas(ko, myLineChart);

        checkoutTable = new CheckoutTable();

        ko.components.register('darts-board-widget', {
            viewModel: { require: 'scripts/component/dartsBoardWidget' },
            template: { require: 'text!scripts/component/template/darts-board-widget.html' }
        });

        ko.bindingHandlers.status = {
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor();
                var valueUnwrapped = ko.unwrap(value);
                var element;

                element = $(element).parent();

                if (valueUnwrapped == 1) {
                    element.parent().css('background-color', '#AFE1AB')
                } else if (valueUnwrapped == 0) {
                    element.parent().css('background-color', '')
                } else {
                    element.parent().css('background-color', '')
                }
            }
        };

        $(function () {
            var scoreLimit;
            ko.applyBindings({
                players: viewDatas.players,
                thrown: viewDatas.thrown,
                _switch: viewDatas.switchViewIndex,
                highestGameShotAll: ko.computed(function () {
                    return viewDatas.players().reduce(function (highest, player) {
                        return (player.highestGameShot() > highest ? player.highestGameShot() : highest);
                    }, 0);
                }, this),

                _switch_double: viewDatas.switchToDoubleOut
            });

            scoreLimit = viewDatas.games[viewDatas.gameIndex];

            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Player', 1, scoreLimit, true, checkoutTable));

            $('#hideHelper').click(function () {
                viewDatas.activeHelper();
            });

            $('#switch_view_btn').click(function () {
                viewDatas.switchView();
            });

            $('#up').click(function () {
                viewDatas.swapScore();
            });

            $('#add-player').click(function () {
                var red = Math.floor(Math.random() * 256);
                var green = Math.floor(Math.random() * 256);
                var blue = Math.floor(Math.random() * 256);
                /* THIS IS AN UNFINISHED IDEA
                var checkColorsDifference = true;
                while (checkColorsDifference) {
                    if ( (red - green > 50)   ||
                         (red - blue > 50)    ||
                         (blue - green > 50) ) {
                        
                        checkColorsDifference = false;
                    } else {
                        red = Math.floor(Math.random() * 256);
                        green = Math.floor(Math.random() * 256);
                        blue = Math.floor(Math.random() * 256);    
                    }
                }
                */
                var hue = (red + ',' + green + ',' + blue);
                viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Player', 2, scoreLimit, false, checkoutTable));
                myLineChart.datasets.push(
                    {
                        fillColor: "rgba(" + hue + ",0.2)",
                        strokeColor: "rgba(" + hue + ",1)",
                        pointColor: "rgba(" + hue + ",1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(" + hue + ",1)",
                        points: []
                    });
                myLineChart.update();
            });
        });
    });
