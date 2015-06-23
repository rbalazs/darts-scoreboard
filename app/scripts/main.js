requirejs.config({
    baseUrl: '..',
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        knockout: 'bower_components/knockout/dist/knockout',
        knockstrap: 'bower_components/knockstrap/build/knockstrap',
        ViewDatas: 'scripts/lib/ViewDatas',
        PlayerModel: 'scripts/lib/PlayerModel'
    }
});

requirejs(['jquery', 'knockout', 'knockstrap', 'ViewDatas', 'PlayerModel'],
    function ($, ko, knockstrap, ViewDatas, PlayerModel) {
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
            var clickCount = 0;

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

            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Player', 1, scoreLimit, true));

            $('#switch_double_btn').click(function () {
                viewDatas.switchDoubleOut();
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
                viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Player', 2, scoreLimit, false));
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


            $("#dartboard #areas g").children().click(function () {
                var id;
                var score;
                var color;
                var _this = this;

                id = $(this).attr('id');

                if ($(this).css('fill') != "rgb(255, 255, 0)") {
                    color = $(this).css('fill');
                } else {
                    return;
                }

                clickCount++;

                if (clickCount === 1) {
                    $(this).css('fill', 'yellow')
                    singleClickTimer = setTimeout(function () {
                        clickCount = 0;
                        $(_this).css('fill', color)
                    }, 250);
                } else if (clickCount === 2) {
                    clearTimeout(singleClickTimer);
                    clickCount = 0;
                }

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

                viewDatas.handleThrow(score, id);
            });

            $(document).keydown(function (evt) {
                console.log(evt.keyCode);
                if (evt.keyCode == 32) {
                    $('#t20').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 16) {
                    viewDatas.handleThrow(0);
                    return false;
                }
                else if (evt.keyCode == 8) {
                    viewDatas.undo();
                    return false;
                }
                else if (evt.keyCode == 40) {
                    $('#s20').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 37) {
                    $('#s5').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 39) {
                    $('#s1').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 38) {
                    $('#d20').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 225) {
                    $('#t5').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 17) {
                    $('#t1').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 190) {
                    $('#d5').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 189) {
                    $('#d1').trigger("click");
                    return false;
                }
            });
        });
    });
