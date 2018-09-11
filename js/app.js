/**
 * Handles view presentation, delegates user events 
 * to {@link Controller}
 */
class View {
    // view references
    constructor() {
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
        const mController = new Controller(this);

        // start the game
        mController.handleStartGame();

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
    setCardContentByIndex(index, content) {
        console.log(`setCardContentByIndex called to update card content at index ${index} with ${content}`)
        this.mCardViews[index].appendChild(content);
    }

    /**
     * Gets a card's content by its index
     * @param {Number} index index of the card in the cardViews
     */
    getCardContentByIndex(index) {
        return this.mCardViews[index].getElementsByTagName("i")[0];
    }

    /**
     * Sets a card's visibility
     * @param {Node} cardView
     * @param {Boolean} isVisible flags whether this card is visible
     */
    setCardVisibility(cardView, isVisible) {
        console.log(`show the ${cardView.classList}? ${isVisible}`)
        if (isVisible) {
            cardView.classList.add("open");
            cardView.classList.add("show");
        } else {
            cardView.classList.remove("open");
            cardView.classList.remove("show");
        }
    }

    setCardMatched(cardView, isMatched) {
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
    setCardVisibilityByIndex(index, inVisible) {
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

    showStars(stars) {
        console.log(`showing game stars: ${stars}`);
        switch (stars) {
            case 0:
                this.mFirstStarView.style.visibility = "hidden";
                this.mSecondStarView.style.visibility = "hidden";
                this.mThirdStarView.style.visibility = "hidden";
                break;
            case 1:
                this.mFirstStarView.style.visibility = "visible";
                this.mSecondStarView.style.visibility = "hidden";
                this.mThirdStarView.style.visibility = "hidden";
                break;
            case 2:
                this.mFirstStarView.style.visibility = "visible";
                this.mSecondStarView.style.visibility = "visible";
                this.mThirdStarView.style.visibility = "hidden";
                break;
            case 3:
                this.mFirstStarView.style.visibility = "visible";
                this.mSecondStarView.style.visibility = "visible";
                this.mThirdStarView.style.visibility = "visible";
                break;
            default:
                break;
        }
    }

}

/**
 * Handles user events from {@link View} class
 * and modifies {@link Model} states and data
 */
class Controller {

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
        this.mapMovesToStars(this.mModel.addMove());
    }

    /**
     * Checks number of moves to determine whether to deduct stars
     * @param {*} moves 
     */
    mapMovesToStars(moves) {
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


/**
 * Holds app states and data, notifies {@link View} class 
 * when app states and data changes.
 */
class Model {
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


/** Execution Block */
const mView = new View();
mView.main();





















/**
 * Function that initializes the memory game
 * responsible for shuffling the cards and generate the 
 * game baord.
 */
// function main() {

//     startTimer();

//     // reset open cards
//     mOpenCards = new Array(0);

//     // reset match cards
//     mMatchedCards = new Array(0);

//     // reset instance moves
//     mMoves = 0;

//     // reset moves ui
//     updateMoves(0);

//     // reset stars ui
//     updateStars(0);
// }

// /*
//  * 3. set up the event listener for a card. If a card is clicked:
//  *  - display the card's symbol (put this functionality in another function that you call from this one)
//  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
//  *  - if the list already has another card, check to see if the two cards match
//  *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
//  *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
//  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
//  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
//  */

// // create the method to run when clicked
// const handleClick = function (event) {
//     let card = event.target;
//     // skip and return if event target is not li or 
//     // if it is already open
//     // if it is already matched
//     if (card.nodeName.toLowerCase() !== 'li') return;
//     if (mOpenCards.includes(card)) return;
//     if (mMatchedCards.includes(card)) return;

//     // show the card
//     showCard(card);

//     // add card to the list of open cards
//     addCardToCheckList(card);

//     // increment the moves
//     updateMoves(++mMoves);

//     // check moves and update the stars
//     updateStars(mMoves);

//     // end game is reached if matched card is at numCards
//     if (mMatchedCards.length === NUM_CARDS) {
//         // TODO win state
//         showGameWonModal();

//         // stop the timer
//         stopTimer();
//     }
// };

// // delegate click event to each child li element
// const deckView = document.getElementById('main-deck');
// deckView.addEventListener('click', handleClick);

// /**
//  * function to add card to open list.
//  * @param {Node} card to be added and checked
//  */
// function addCardToCheckList(card) {
//     mOpenCards.push(card);
//     console.log("pushed card(), current size: " + mOpenCards.length);

//     if (mOpenCards.length === 2) {
//         // open cards stack has two cards now, check if matches
//         let firstCard = mOpenCards[0];
//         let secondCard = mOpenCards[1];
//         if (firstCard.isEqualNode(secondCard)) {
//             // card match, add them to matched cards stack
//             console.log("matched!");
//             matchCard(firstCard);
//             matchCard(secondCard);
//             mMatchedCards.push(firstCard);
//             mMatchedCards.push(secondCard);
//         } else {
//             // card mismatch
//             console.log("mismatch");
//             // TODO show when mismatch
//             hideCard(firstCard);
//             hideCard(secondCard);
//         }
//         // clear the open card stack
//         mOpenCards = new Array();
//     }
// }

// /**
//  * function to update ui moves
//  * @param {Number} moves current instance of moves
//  */
// function updateMoves(moves) {
//     const movesView = document.getElementById("moves-view");
//     movesView.innerText = moves;
// }

// /**
//  * function to update ui stars, more moves, less stars
//  * @param {Number} moves current instance of moves
//  */
// function updateStars(moves) {
//     const firstStarView = document.getElementById("first-star-view");
//     const secondStarView = document.getElementById("second-star-view");
//     const thirdStarView = document.getElementById("third-star-view");

//     const TWO_STAR_MOVES = 32;
//     const ONE_STAR_MOVES = 64;

//     if (moves < TWO_STAR_MOVES) {
//         // still good, or resets to three stars
//         firstStarView.style.visibility = "visible";
//         secondStarView.style.visibility = "visible";
//         thirdStarView.style.visibility = "visible";
//     } else if (moves >= TWO_STAR_MOVES && moves < ONE_STAR_MOVES) {
//         // remove a star, shows only two stars
//         thirdStarView.style.visibility = "hidden";
//         console.log("third star gone");
//     } else if (moves >= ONE_STAR_MOVES) {
//         // remover a star, shows only one star
//         secondStarView.style.visibility = "hidden";
//         console.log("second star gone");
//     }
// }

// /**
//  * function to update ui to show the card
//  * @param {Node} cardView to be shown
//  */
// function showCard(cardView) {
//     cardView.classList.add("open");
//     cardView.classList.add("show");
// }

// /**
//  * function to update ui to hide the card 
//  * @param {Node} cardView to be hidden
//  */
// function hideCard(cardView) {
//     cardView.classList.remove("match");
//     cardView.classList.remove("open");
//     cardView.classList.remove("show");
// }

// /**
//  * function to update ui to show the card is matched
//  * @param {Node} cardView to mark as matched
//  */
// function matchCard(cardView) {
//     cardView.classList.remove("open");
//     cardView.classList.remove("show");
//     cardView.classList.add("match");
// }

// /**
//  * Function to update ui to show user has won the game
//  * and allows user to reset the game
//  */
// function showGameWonModal() {
//     let modalView = document.getElementById("modal-game-win-view");
//     let modalCloseBtn = document.getElementById("modal-close-btn");
//     modalView.style.display = "block";

//     // Allows user to dimiss the modal message
//     modalCloseBtn.onclick = function () {
//         modalView.style.display = "none";
//     }

//     // When the user clicks anywhere outside of the modal, close it
//     window.onclick = function (event) {
//         if (event.target == modalView) {
//             modalView.style.display = "none";
//         }
//     }

//     console.log("game won!");
// }

// /**
//  * Function to start the timer
//  */
// function startTimer() {
//     const handler = function () {
//         console.log("handler() triggered, current time: " + mElapsedSeconds);
//         mElapsedSeconds++;
//         setElapsedTime(mElapsedSeconds);
//     }
//     console.log("timer started: " + mElapsedSeconds);
//     mElapsedSeconds = 0;
//     mTimerIntervalId = setInterval(handler, 1000);
// }

// /**
//  * Function to show the current elasped time in the ui
//  * @param {number} seconds elapsed time in seconds
//  */
// function setElapsedTime(seconds) {
//     const elapsedTimeView = document.getElementById("elapsed-time-view");
//     elapsedTimeView.innerText = seconds;
// }

// /**
//  * Function to stop the timer, and resets the
//  * elapsed time.
//  */
// function stopTimer() {
//     window.clearInterval(mTimerIntervalId);
// }