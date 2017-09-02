/* global define */
define('GameShotDetectorService', function () {
  /**
   * A module that is responsible for detecting whether game shot attempt was thrown.
   *
   * @exports GameShotDetectorService
   */
  var GameShotDetectorService = {
    /**
     * Return whether game shot attempt was thrown.
     *
     * @return {boolean}
     */
    isGameShotAttempt: function (currentPlayerScore, dartsThrown, isDoubleOut) {
      // If double out, then a game shot was thrown if:
      if (isDoubleOut) {
        // player has equal or under the score 40 with even numbers,
        return (currentPlayerScore <= 40 && currentPlayerScore % 2 === 0) ||
          // or has 50 with all darts thrown (if not last shot, maybe rounding).
          (currentPlayerScore === 50 && dartsThrown === 2);
      }

      // If simple out, then a game shot was thrown if:
      // player has equal or under the score 40 with even numbers,
      return (currentPlayerScore <= 40 && currentPlayerScore % 2 === 0) ||
        // or has 50 with all darts thrown (if not last shot, maybe rounding)
        (currentPlayerScore === 50 && dartsThrown === 2) ||
        // or has equal or under 60 throwable with a tripple
        (currentPlayerScore <= 60 && currentPlayerScore % 3 === 0) ||
        // player is under 20 (simple sector)
        (currentPlayerScore <= 20) ||
        // player has 25 after, and had 2 darts.
        (currentPlayerScore === 25 && dartsThrown === 1);
    }
  };

  return GameShotDetectorService;
});
