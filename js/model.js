import View from "./view";

/**
 * Holds app states and data, notifies {@link View} class 
 * when app states and data changes.
 */
export default class Model {

  constructor(view) {
      this.mNumCards = 16;
      this.mOpenCards = new Array(0);
      this.mMatchedCards = new Array(0);
      this.mStars = 3;
      this.mMoves = 0;
      this.mElapsedTime = 0;
      this.mTimerHandle;

      this.mMovesObservers = new Array(0);
      this.mStarsObservers = new Array(0);
      this.mTimerObservers = new Array(0);

      // Register view observer(s)
      this.addMovesObserver(view);
      this.addStarsObserver(view);
      this.addTimerObserver(view);
  }

  // Cards
  clearOpenCards() {
      this.mOpenCards = new Array(0);
  }

  clearMatchedCards() {
      this.mMatchedCards = new Array(0);
  }

  // Moves
  resetMoves() {
      this.mMoves = 0;
      this.notifyMovesObservers(this.mMoves);
  }

  addMove() {
      this.mMoves++;
      this.notifyMovesObservers(this.mMoves);
      return this.mMoves;
  }

  addMovesObserver(observer) {
      this.mMovesObservers.push(observer);
  }

  notifyMovesObservers(currentMoves) {
      // TODO implement for each move updated, update the observers (view)
      // this.mMovesObservers.forEach();
  }

  // Stars
  /**
   * Resets game stars back to default number
   */
  resetStars() {
      this.mStars = 3;
      this.notifyStarsObservers(this.mStars);
  }

  /**
   * Removes a game star 
   */
  removeStar() {
      if (this.mStars != 0) {
          this.mStars--;
      }
      this.notifyStarsObservers(this.mStars);
  }

  /**
   * Adds an observer to be notified of game star update
   * @param {View} observer 
   */
  addStarsObserver(observer) {
      this.mStarsObservers.push(observer);
  }

  /**
   * Notifies all observers of game star update
   * @param {Number} currentTime 
   */
  notifyStarsObservers(currentStars) {
      console.log("notifyStarsObservers() called")
      console.log(`number of observers ${this.mStarsObservers.length}`)
      this.mStarsObservers.forEach(function (observer) {
          console.log(`observer notified of time update, current time: ${currentStars} seconds`)
          observer.showStars(currentStars);
      });
  }

  // Timer
  /**
   * Starts the game timer
   */
  startTimer() {
      console.log("startTimer() called")
      const model = this;
      const handler = function () {
          model.mElapsedTime++;
          model.notifyTimerObservers(model.mElapsedTime);
      }
      this.mElapsedTime = 0;
      this.mTimerHandle = window.setInterval(handler, 1000);
  }

  /**
   * Stops the game timer.
   */
  stopTimer() {
      console.log(`stopTimer() called, clears timed window interval with handle id: ${this.mTimerHandle}`)
      window.clearInterval(this.mTimerHandle);
  }

  /**
   * Resets the game timer.
   */
  resetTimer() {
      console.log("resetTimer() called, timer instance set back to 0");
      this.mElapsedTime = 0;
      this.stopTimer();
      this.notifyTimerObservers(this.mElapsedTime);
  }

  /**
   * Adds an observer to be notified of game time update
   * @param {View} observer 
   */
  addTimerObserver(observer) {
      console.log("addTimerObserver() called, an observer is added.")
      this.mTimerObservers.push(observer);
  }

  /**
   * Notifies all observers of game time update
   * @param {Number} currentTime 
   */
  notifyTimerObservers(currentTime) {
      console.log("notifyTimerObservers() called")
      console.log(`number of observers ${this.mTimerObservers.length}`)
      this.mTimerObservers.forEach(function (observer) {
          console.log(`observer notified of time update, current time: ${currentTime} seconds`)
          observer.showElapsedTime(currentTime);
      });
  }

  /**
   * Clears all observers from the list
   */
  clearTimerObservers() {
      console.log("clearTimerObservers() called")
      delete this.mTimerObservers;
      this.mTimerObservers = new Array(0);
  }

}