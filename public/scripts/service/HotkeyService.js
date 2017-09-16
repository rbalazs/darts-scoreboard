/* global define, eventObserver */
define(function () {
  /**
   * A module that is responsible for providing hot key service to the appilcation.
   *
   * @exports HotkeyService
   */
  var HotkeyService = {
    /**
     * Adds functionality to the keyboard.
     *
     * @param {jQuery} $ Jquery instance.
     *
     * @return {boolean} False for discarding the event.
     */
    init: function ($) {
      $(document).keydown(function (evt) {
        var handled = true;
        switch (evt.keyCode) {
        case 32:
          $('#t20').trigger('click');
          break;
        case 16:
          eventObserver.notify('SCORE', {
            scoreOfThrow: 0,
            scoreId: 0
          });
          break;
        case 8:
          eventObserver.notify('UNDO');
          break;
        case 40:
          $('#s20').trigger('click');
          break;
        case 37:
          $('#s5').trigger('click');
          break;
        case 38:
          $('#d20').trigger('click');
          break;
        case 188:
          $('#t1').trigger('click');
          break;
        case 225:
          $('#t5').trigger('click');
          break;
        case 189:
          $('#d1').trigger('click');
          break;
        case 190:
          $('#d5').trigger('click');
          break;
        default:
          handled = false;
        }

        // If we handle it, it should prevent default actions.
        return !handled;
      });
    }
  };

  return HotkeyService;
});
