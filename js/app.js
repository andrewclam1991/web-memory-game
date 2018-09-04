/**
 * Class responsible for binding views
 */
class View {
    // view references
    constructor() {
        this.mResetButton = document.getElementById("restart-view");
        this.mElapsedTimeTextView = document.getElementById("elapsed-time-view");
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
        this.mResetButton.addEventListener('click', mController.handleRestartGame);

        // handles user click on a card
        this.mDeckView.addEventListener('click', mController.handleOnCardClicked(event));
    }

    /**
     * Sets a card's content by its index
     * @param {Number} index index of the card in the cardViews
     * @param {String} content html content  
     */
    setCardContentByIndex(index, content) {
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
     * Sets a card's visibility by its index
     * @param {Number} index index of the card in the cardViews
     * @param {Boolean} isVisible flags whether this card is visible
     */
    setCardVisibility(index, isVisible) {
        const cardView = this.mCardViews[index];
        if (isVisible) {
            cardView.classList.add("open");
            cardView.classList.add("show");
        } else {
            cardView.classList.remove("open");
            cardView.classList.remove("show");
        }
    }

    /**
     * Sets the game's elapsed time since the start
     * @param {Number} seconds current game's elapsed time in seconds
     */
    showElapsedTime(seconds) {
        mElapsedTimeTextView.innerText = seconds;
    }

}

/**
 * Class responsible for handling user events from {@link View} class
 * and changing {@link Model} states
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
        // reset the moves.
        this.mModel.resetMoves();
        // reset the stars
        this.mModel.resetStars();
    }

    /**
     * Restarts the game
     */
    handleRestartGame() {
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
            this.mView.setCardVisibility(j, false)
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

        this.mView.setCardContentByIndex(0, true);
    }
}


/**
 * Responsible for holding app states and data
 */
class Model {
    constructor(view) {
        this.mNumCards = 16;
        this.mOpenCards = new Array(0);
        this.mMatchedCards = new Array(0);
        this.mStars = 3;
        this.mMoves = 0;
        this.mElapsedTime = 0;

        this.mMovesObservers = new Array(0);
        this.mStarsObservers = new Array(0);
        this.mTimerObservers = new Array(0);

        // Register Model observer(s)
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
    }

    addMovesObserver(observer) {
        this.mMovesObservers.push(observer);
    }

    notifyMovesObservers(currentMoves) {
        // TODO implement for each move updated, update the observers (view)
        // this.mMovesObservers.forEach();
    }

    // Stars
    resetStars() {
        this.mStars = 3;
        this.notifyStarsObservers(this.mStars);
    }

    removeStar() {
        this.mStars--;
        this.notifyStarsObservers(this.mStars);
    }

    addStarsObserver(observer) {
        this.mStarsObservers.push(observer);
    }

    notifyStarsObservers(currentStars) {
        // TODO implement for each stars updated, update the observers (view)
        // this.mStarsObservers.forEach();
    }

    // Timer
    startTimer() {

    }

    stopTimer() {

    }

    addTimerObserver(observer) {
        this.mTimerObservers.push(observer);
    }

    notifyTimerObservers(currentTime) {
        // TODO implement when timer updates, update the observer (view)
        // this.mTimerObservers.forEach();
    }

}


/** Execution Block */
const view = new View();
view.main();





















/**
 * Function that initializes the memory game
 * responsible for shuffling the cards and generate the 
 * game baord.
 */
function main() {

    startTimer();

    // reset open cards
    mOpenCards = new Array(0);

    // reset match cards
    mMatchedCards = new Array(0);

    // reset instance moves
    mMoves = 0;

    // reset moves ui
    updateMoves(0);

    // reset stars ui
    updateStars(0);
}

/*
 * 3. set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// create the method to run when clicked
const handleClick = function (event) {
    let card = event.target;
    // skip and return if event target is not li or 
    // if it is already open
    // if it is already matched
    if (card.nodeName.toLowerCase() !== 'li') return;
    if (mOpenCards.includes(card)) return;
    if (mMatchedCards.includes(card)) return;

    // show the card
    showCard(card);

    // add card to the list of open cards
    addCardToCheckList(card);

    // increment the moves
    updateMoves(++mMoves);

    // check moves and update the stars
    updateStars(mMoves);

    // end game is reached if matched card is at numCards
    if (mMatchedCards.length === NUM_CARDS) {
        // TODO win state
        showGameWonModal();

        // stop the timer
        stopTimer();
    }
};

// delegate click event to each child li element
const deckView = document.getElementById('main-deck');
deckView.addEventListener('click', handleClick);

/**
 * function to add card to open list.
 * @param {Node} card to be added and checked
 */
function addCardToCheckList(card) {
    mOpenCards.push(card);
    console.log("pushed card(), current size: " + mOpenCards.length);

    if (mOpenCards.length === 2) {
        // open cards stack has two cards now, check if matches
        let firstCard = mOpenCards[0];
        let secondCard = mOpenCards[1];
        if (firstCard.isEqualNode(secondCard)) {
            // card match, add them to matched cards stack
            console.log("matched!");
            matchCard(firstCard);
            matchCard(secondCard);
            mMatchedCards.push(firstCard);
            mMatchedCards.push(secondCard);
        } else {
            // card mismatch
            console.log("mismatch");
            // TODO show when mismatch
            hideCard(firstCard);
            hideCard(secondCard);
        }
        // clear the open card stack
        mOpenCards = new Array();
    }
}

/**
 * function to update ui moves
 * @param {Number} moves current instance of moves
 */
function updateMoves(moves) {
    const movesView = document.getElementById("moves-view");
    movesView.innerText = moves;
}

/**
 * function to update ui stars, more moves, less stars
 * @param {Number} moves current instance of moves
 */
function updateStars(moves) {
    const firstStarView = document.getElementById("first-star-view");
    const secondStarView = document.getElementById("second-star-view");
    const thirdStarView = document.getElementById("third-star-view");

    const TWO_STAR_MOVES = 32;
    const ONE_STAR_MOVES = 64;

    if (moves < TWO_STAR_MOVES) {
        // still good, or resets to three stars
        firstStarView.style.visibility = "visible";
        secondStarView.style.visibility = "visible";
        thirdStarView.style.visibility = "visible";
    } else if (moves >= TWO_STAR_MOVES && moves < ONE_STAR_MOVES) {
        // remove a star, shows only two stars
        thirdStarView.style.visibility = "hidden";
        console.log("third star gone");
    } else if (moves >= ONE_STAR_MOVES) {
        // remover a star, shows only one star
        secondStarView.style.visibility = "hidden";
        console.log("second star gone");
    }
}

/**
 * function to update ui to show the card
 * @param {Node} cardView to be shown
 */
function showCard(cardView) {
    cardView.classList.add("open");
    cardView.classList.add("show");
}

/**
 * function to update ui to hide the card 
 * @param {Node} cardView to be hidden
 */
function hideCard(cardView) {
    cardView.classList.remove("match");
    cardView.classList.remove("open");
    cardView.classList.remove("show");
}

/**
 * function to update ui to show the card is matched
 * @param {Node} cardView to mark as matched
 */
function matchCard(cardView) {
    cardView.classList.remove("open");
    cardView.classList.remove("show");
    cardView.classList.add("match");
}

/**
 * Function to update ui to show user has won the game
 * and allows user to reset the game
 */
function showGameWonModal() {
    let modalView = document.getElementById("modal-game-win-view");
    let modalCloseBtn = document.getElementById("modal-close-btn");
    modalView.style.display = "block";

    // Allows user to dimiss the modal message
    modalCloseBtn.onclick = function () {
        modalView.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modalView) {
            modalView.style.display = "none";
        }
    }

    console.log("game won!");
}

/**
 * Function to start the timer
 */
function startTimer() {
    const handler = function () {
        console.log("handler() triggered, current time: " + mElapsedSeconds);
        mElapsedSeconds++;
        setElapsedTime(mElapsedSeconds);
    }
    console.log("timer started: " + mElapsedSeconds);
    mElapsedSeconds = 0;
    mTimerIntervalId = setInterval(handler, 1000);
}

/**
 * Function to show the current elasped time in the ui
 * @param {number} seconds elapsed time in seconds
 */
function setElapsedTime(seconds) {
    const elapsedTimeView = document.getElementById("elapsed-time-view");
    elapsedTimeView.innerText = seconds;
}

/**
 * Function to stop the timer, and resets the
 * elapsed time.
 */
function stopTimer() {
    window.clearInterval(mTimerIntervalId);
}