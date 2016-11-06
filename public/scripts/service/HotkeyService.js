/* global define */
define('HotkeyService', function () {
  return {
    /**
     * Adds functionality to the keyboard.
     *
     * @param {jQuery} $ Jquery instance.
     * @param {GameModel} gameModel Main contorller of the game.
     *
     * @return {boolean} False for discarding the event.
     */
    startListeningToKeyboard: function ($, gameModel) {
      $(document).keydown(function (evt) {
        if (evt.keyCode === 32) {
          $('#t20').trigger('click');
        } else if (evt.keyCode === 16) {
          gameModel.handleThrow(0);
        } else if (evt.keyCode === 8) {
          gameModel.undo();
        } else if (evt.keyCode === 40) {
          $('#s20').trigger('click');
        } else if (evt.keyCode === 37) {
          $('#s5').trigger('click');
        } else if (evt.keyCode === 39) {
          $('#s1').trigger('click');
        } else if (evt.keyCode === 38) {
          $('#d20').trigger('click');
        } else if (evt.keyCode === 188) {
          $('#t1').trigger('click');
        } else if (evt.keyCode === 225) {
          $('#t5').trigger('click');
        } else if (evt.keyCode === 189) {
          $('#d1').trigger('click');
        } else if (evt.keyCode === 190) {
          $('#d5').trigger('click');
        }
      });
    }
  };
});
