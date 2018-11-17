/* global eventObserver, define */

define(
    [
        'jquery', 'knockout', 'knockstrap', 'models/GameModel',
        'models/PlayerModel', 'services/HotkeyService',
        'services/ChartWidget', 'services/GameShotDetectorService'
    ],
    function ($, ko, knockstrap, GameModel, PlayerModel, HotkeyService, ChartWidget, GameShotDetectorService) {
        /**
         * @constructor
         */
        return function GameController() {

            var self = this;

            this.chartWidget = new ChartWidget();

            this.gameModel = new GameModel(ko, self.chartWidget.getInstance(), GameShotDetectorService);

            this.loadEncounter = function() {
                $.ajax({
                    type: 'GET',
                    url: 'http://127.0.0.1:8080/api/encounters/1',
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        data.players.forEach(function (playerAPIResource) {
                            $.ajax({
                                type: 'GET',
                                url: 'http://127.0.0.1:8080' + playerAPIResource,
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    var player = new PlayerModel(ko, 1, self.gameModel.games[self.gameModel.gameIndex], true, data.name);
                                    var hue = self.chartWidget.generateRandomHue();

                                    self.gameModel.players.push(player);
                                    self.chartWidget.getInstance().datasets.push({
                                        fillColor: 'rgba(' + hue + ',0.2)',
                                        strokeColor: 'rgba(' + hue + ',1)',
                                        pointColor: 'rgba(' + hue + ',1)',
                                        pointStrokeColor: '#fff',
                                        pointHighlightFill: '#fff',
                                        pointHighlightStroke: 'rgba(' + hue + ',1)',
                                        points: []
                                    });

                                    self.chartWidget.getInstance().update();
                                },
                                error: function (jq, st, error) {
                                    console.log(error);
                                }
                            });
                        });
                    },
                    error: function (jq, st, error) {
                        console.log(error);
                    }
                });
            };

            /**
             * Starts up the application.
             */
            this.execute = function () {
                this.loadEncounter();
                this.initKoBindings();

                HotkeyService.init($);

                eventObserver.subscribe('SCORE', self.gameModel.handleThrow);
                eventObserver.subscribe('UNDO', self.gameModel.undo);
            };

            /**
             * Sets the necessery knockout default bindings.
             */
            this.initKoBindings = function () {
                ko.components.register('darts-board-widget', {
                    viewModel: {
                        require: 'scripts/component/dartsboard/dartsBoardWidget'
                    },
                    template: {
                        require: 'text!scripts/component/dartsboard/template/darts-board-widget.html'
                    }
                });

                ko.bindingHandlers.status = {
                    update: function (element, valueAccessor) {
                        var value = valueAccessor();
                        var valueUnwrapped = ko.unwrap(value);
                        var parent = $(element).parent();
                        if (valueUnwrapped === 1) {
                            parent.parent().addClass('activePlayer');
                        } else if (valueUnwrapped === 0) {
                            parent.parent().removeClass('activePlayer');
                        } else {
                            parent.parent().removeClass('activePlayer');
                        }
                    }
                };

                ko.applyBindings({
                    players: self.gameModel.players,
                    thrown: self.gameModel.thrown,
                    _switch: self.gameModel.switchViewIndex,
                    highestGameShotAll: ko.computed(function () {
                        return self.gameModel.players().reduce(function (highest, player) {
                            return (player.highestGameShot() > highest ? player.highestGameShot() :
                                highest);
                        }, 0);
                    }, this),

                    switchDobuleOut: self.gameModel.isDoubleOut
                });
            };
        };
    });
