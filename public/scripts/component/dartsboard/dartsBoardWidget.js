/* global define*/
define(['knockout', 'jquery'], function (ko, $) {
  return function () {
    var clickCount = 0;
    $('#dartboard').find('#areas g').children().click(function () {
      var id;
      var scoreOfThrow;
      var color;
      var _this = this;

      id = $(this).attr('id');

      if ($(this).css('fill') !== 'rgb(255, 255, 0)') {
        color = $(this).css('fill');
      } else {
        return;
      }

      clickCount++;

      if (clickCount === 1) {
        $(this).css('fill', 'yellow');
        singleClickTimer = setTimeout(function () {
          clickCount = 0;
          $(_this).css('fill', color);
        }, 250);
      } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
      }

      scoreOfThrow = id.substring(1);

      if (id[0] === 'd') {
        scoreOfThrow = scoreOfThrow * 2;
      }

      if (id[0] === 't') {
        scoreOfThrow = scoreOfThrow * 3;
      }

      if (id === 'Outer') {
        scoreOfThrow = 25;
      }

      if (id === 'Bull') {
        scoreOfThrow = 50;
      }

      gameModel.handleThrow(scoreOfThrow, id);
    });
  };
});
