import Controller from './controller';

/**
 * Handles view presentation, delegates user events 
 * to {@link Controller}
 */
export default class View {
  // view references
  constructor(document) {
      this.mResetButton = document.getElementById("restart-view");
      this.mElapsedTimeTextView = document.getElementById("elapsed-time-view");
      this.mFirstStarView = document.getElementById("first-star-view");
      this.mSecondStarView = document.getElementById("second-star-view");
      this.mThirdStarView = document.getElementById("third-star-view");
      this.mCardViews = document.getElementsByClassName("card-view");
      this.mDeckView = document.getElementById('main-deck');
  }

  /**
   * Main method of execution
   */
  main() {
      this.mController = new Controller(this);

      // start the game
      this.mController.handleStartGame();

      // allow user to restart game
      this.mResetButton.addEventListener('click', function () {
          mController.handleRestartGame()
      });

      // handles user click on a card
      this.mDeckView.addEventListener('click', function (event) {
          mController.handleOnCardClicked(event)
      });

      console.log("main() started");
  }

  /**
   * Sets a card's content by its index
   * @param {Number} index index of the card in the cardViews
   * @param {String} content html content  
   */
  set setCardContentByIndex(index, content) {
      console.log(`setCardContentByIndex called to update card content at index ${index} with ${content}`)
      this.mCardViews[index].appendChild(content);
  }

  /**
   * Gets a card's content by its index
   * @param {Number} index index of the card in the cardViews
   */
  get getCardContentByIndex(index) {
      return this.mCardViews[index].getElementsByTagName("i")[0];
  }

  /**
   * Sets a card's visibility
   * @param {Node} cardView
   * @param {Boolean} isVisible flags whether this card is visible
   */
  set setCardVisibility(cardView, isVisible) {
      console.log(`show the ${cardView.classList}? ${isVisible}`)
      if (isVisible) {
          cardView.classList.add("open");
          cardView.classList.add("show");
      } else {
          cardView.classList.remove("open");
          cardView.classList.remove("show");
      }
  }

  set setCardMatched(cardView, isMatched) {
      console.log(`show the ${cardView.classList} as matched? ${isMatched}`)
      if (isMatched) {
          cardView.classList.add('match');
      } else {
          cardView.classList.remove('match');
      }
  }

  /**
   * Set's a card's visibility base on its index in the collection
   * @param {Number} index of the card in the cards collection
   * @param {Boolean} inVisible flags whether the card is visible
   */
  set setCardVisibilityByIndex(index, inVisible) {
      console.log(`set visibility at index: ${index}`);
      const cardView = this.mCardViews[index];
      this.setCardVisibility(cardView, inVisible);
  }

  /**
   * Sets the game's elapsed time since the start
   * @param {Number} seconds current game's elapsed time in seconds
   */
  showElapsedTime(seconds) {
      console.log(`showing elapsed time: ${seconds} seconds`);
      this.mElapsedTimeTextView.innerText = seconds;
  }

  /**
   * Shows current player's star rating per game
   * @param {Number} stars rates the player, the more the better.
   */
  showStars(stars) {
      console.log(`showing game stars: ${stars}`);
      this.mFirstStarView.style.visibility = stars >= 1? "visible" : "hidden";
      this.mSecondStarView.style.visibility = stars >= 2? "visible" : "hidden";
      this.mThirdStarView.style.visibility = stars >= 3? "visible" : "hidden";
  }

}