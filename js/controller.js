import Model from './model';
import View from './view';

/**
 * Handles user events from {@link View} class
 * and modifies {@link Model} states and data
 */
export default class Controller {

  /**
   * Constructs a Controller for the parameter view
   * @param {View} view 
   */
  constructor(view) {
      this.mView = view;
      this.mModel = new Model(view);
  }

  /**
   * Starts the game
   */
  handleStartGame() {
      // shuffles the cards
      this.handleShuffleCards();
      // resets the moves.
      this.mModel.resetMoves();
      // resets the stars
      this.mModel.resetStars();
      // resets the timer
      this.mModel.resetTimer();
      // start the timer
      this.mModel.startTimer();
  }

  /**
   * Restarts the game
   */
  handleRestartGame() {
      this.mModel.stopTimer();
      this.mView.main();
  }

  /**
   * Shuffes the cards
   */
  handleShuffleCards() {
      // Creates a list to store each cards' content
      let cardContentArray = new Array();
      for (let i = 0; i < this.mView.mCardViews.length; i++) {
          let cardContent = this.mView.getCardContentByIndex(i);
          cardContentArray.push(cardContent);
      }

      // Notifies the view to update the card positions
      cardContentArray = shuffleCards(cardContentArray);
      function shuffleCards(array) {
          let currentIndex = array.length;
          let temporaryValue, randomIndex;

          while (currentIndex !== 0) {
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
          }
          return array;
      }

      for (let j = 0; j < this.mView.mCardViews.length; j++) {
          this.mView.setCardContentByIndex(j, cardContentArray[j]);
          this.mView.setCardVisibilityByIndex(j, false);
      }
  }

  /**
   * Handle on card clicked
   */
  handleOnCardClicked(event) {
      const card = event.target;
      // skip and return if event target is not li or 
      // if it is already open
      // if it is already matched
      if (card.nodeName.toLowerCase() !== 'li' ||
          this.mModel.mOpenCards.includes(card) ||
          this.mModel.mMatchedCards.includes(card)) {
          return;
      }

      this.mView.setCardVisibility(card, true);

      // add move, and then check resulting moves
      this.mapMovesToRemoveStar(this.mModel.addMove());
  }

  /**
   * Checks number of moves to determine whether to deduct stars
   * @param {*} moves 
   */
  mapMovesToRemoveStar(moves) {
      const TWO_STAR_MOVES = 32;
      const ONE_STAR_MOVES = 64;
      const ZERO_STAR_MOVES = 96;

      console.log(`current moves: ${moves}`);
      switch (moves) {
          case TWO_STAR_MOVES:
          case ONE_STAR_MOVES:
          case ZERO_STAR_MOVES:
              this.mModel.removeStar();
              break;
      }
  }

}