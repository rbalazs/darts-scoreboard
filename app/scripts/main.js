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
        var viewDatas = new ViewDatas(ko);

        ko.bindingHandlers.status = {
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor();
                var valueUnwrapped = ko.unwrap(value);
                var element;

                element = $(element).parent().children('span.name');

                if (valueUnwrapped == 1) {
                    element.css('background-color', '#AFE1AB')
                } else if (valueUnwrapped == 0) {
                    element.css('background-color', '')
                } else {
                    element.css('background-color', '')
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

            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Eszti', 1, scoreLimit));
            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Apa', 2, scoreLimit));
            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Balu', 2, scoreLimit));
            viewDatas.players.push(new PlayerModel(ko, viewDatas, 'Csé', 2, scoreLimit));

            $('#switch_double_btn').click(function () {
                viewDatas.switchDoubleOut();
            });

            $('#switch_view_btn').click(function () {
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
                if (evt.keyCode == 32) {
                    $('#s20').trigger("click");
                    return false;
                }
                else if (evt.keyCode == 16) {
                    $('#zero').trigger("click");
                    return false;
                }

            });

        });


    });
