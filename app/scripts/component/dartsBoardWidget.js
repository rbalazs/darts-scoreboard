/* global define*/
define(['knockout', 'jquery'], function (ko, $) {
  return function () {
    $(function () {
      var clickCount = 0;
      $("#dartboard").find("#areas g").children().click(function () {
        var id;
        var scoreOfThrow;
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

        scoreOfThrow = id.substring(1);

        if (id[0] == 'd') {
          scoreOfThrow = scoreOfThrow * 2
        }

        if (id[0] == 't') {
          scoreOfThrow = scoreOfThrow * 3
        }

        if (id == 'Outer') {
          scoreOfThrow = 25;
        }

        if (id == 'Bull') {
          scoreOfThrow = 50;
        }

        viewDatas.handleThrow(scoreOfThrow, id);
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
        else if (evt.keyCode == 188) {
          $('#t1').trigger("click");
          return false;
        }
        else if (evt.keyCode == 225) {
          $('#t5').trigger("click");
          return false;
        }
        else if (evt.keyCode == 189) {
          $('#d1').trigger("click");
          return false;
        }
        else if (evt.keyCode == 190) {
          $('#d5').trigger("click");
          return false;
        }
      });
    });
  };
});