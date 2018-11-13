/**
 * Global interval id 
 * Used specifically for the clearing timer interval
 * TODO fix this
 */
let mTimerIntervalId

/**
 * Handles view presentation, delegates user 
 * events to {@link Controller}
 */
class View {

    // view references
    constructor(document) {
        this.mResetButton = document.getElementById("restart-view");
        this.mElapsedTimeTextView = document.getElementById("elapsed-time-view");
        this.mFirstStarView = document.getElementById("first-star-view");
        this.mSecondStarView = document.getElementById("second-star-view");
        this.mThirdStarView = document.getElementById("third-star-view");
        this.mCardViews = document.getElementsByClassName("card-view");
        this.mDeckView = document.getElementById('main-deck');
        this.mMoves = document.getElementById('moves-view');
    }

    /**
     * Main method of execution
     */
    start() {
        const mController = new Controller(this);

        // start the game
        mController.handleStartGame();

        // handles user click to restart game
        this.mResetButton.addEventListener('click', function () {
            console.log('reset button clicked');
            mController.handleRestartGame()
        });

        // handles user click on a card
        this.mDeckView.addEventListener('click', function (event) {
            console.log('card clicked');
            mController.handleOnCardClicked(event)
        });

        console.log("game started");
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
     * @param {Node} cardView a particular card in view
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
        this.mElapsedTimeTextView.innerText = formatTime(seconds);
    }

    /**
     * Shows current player's star rating per game
     * @param {Number} stars rates the player, the more the better.
     */
    showStars(stars) {
        console.log(`showing game stars: ${stars}`);
        this.mFirstStarView.style.visibility = stars >= 1 ? "visible" : "hidden";
        this.mSecondStarView.style.visibility = stars >= 2 ? "visible" : "hidden";
        this.mThirdStarView.style.visibility = stars >= 3 ? "visible" : "hidden";
    }

    /**
     * Shows current player's current moves
     * @param {Number} moves 
     */
    showMoves(moves) {
        console.log(`showing game moves: ${moves}`);
        this.mMoves.innerText = moves;
    }

    /**
     * Shows the player has won the game
     * @param {Number} finishTime the amount of time to finish, in seconds
     * @param {Number} moves the number of moves it took
     */
    showGameWonModal(finishTime, moves) {
        let modalView = document.getElementById("modal-container-view");
        let finishTimeView = document.getElementById("modal-finish-time-text-view");
        let finishMovesView = document.getElementById("modal-finish-moves-text-view");
        let modalCloseBtn = document.getElementById("modal-close-btn");
        modalView.style.display = "flex";

        // Shows user the amount of time it took to win the game
        finishTimeView.innerText = formatTime(finishTime);
        finishMovesView.innerText = moves;

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
    }

    /**
     * Starts the game
     */
    handleStartGame() {
        // shuffles the cards
        this.handleShuffleCards();
        // initializes the model
        this.mModel = new Model(this.mView);
    }

    /**
     * Restarts the game
     */
    handleRestartGame() {
        this.handleStartGame();
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
     * Handle on card clicked event
     */
    handleOnCardClicked(event) {
        const card = event.target;
        // skip and return if event target is not li or 
        // if it is already open
        // if it is already matched
        if (card.nodeName.toLowerCase() !== 'li' ||
            this.mModel.mOpenCards.includes(card) ||
            this.mModel.mMatchedCards.includes(card)) {
            console.log('skipped click handling')
            return;
        }

        // add move, and then check resulting moves
        this.checkStars(this.mModel.addMove());

        // add card to the list of open cards
        this.mModel.addCardToOpenCards(card);
    }

    /**
     * Checks number of moves to determine whether to deduct stars
     * @param {Number} moves 
     */
    checkStars(moves) {
        const TWO_STAR_MOVES = 32;
        const ONE_STAR_MOVES = 64;
        const ZERO_STAR_MOVES = 96;

        console.log(`current moves: ${moves}`);

        // If the current moves touches any of the following cases
        // tell model to remove a star, ignore otherwise.
        /* example steps: 
         * moves == 1  ignore, still has 3 stars
         * moves == 12 ignore, still has 3 stars
         * ...
         * moves == 32 match TWO_STAR_MOVES, remove a star (now has 2 stars)
         * ...
         * moves == 63 ignore, still has 2 stars
         * moves == 64 match ONE_STAR_MOVES, remove a star (now has 1 star)
         * ... 
         * moves == 95 ignore, still has 1 star
         * moves == 96 match ZERO_STAR_MOVES, remove a star (now has 0 star)
         * ...
         * moves == 2018 ignore, still has 0 star
         */
        switch (moves) {
            case TWO_STAR_MOVES:  // fall though
            case ONE_STAR_MOVES:  // fall though
            case ZERO_STAR_MOVES: // fall though
                this.mModel.removeStar();
                break;
        }
    }

}

/**
 * Holds app states and data, notifies observers 
 * (eg.{@link View} classes) when app states and data 
 * changes.
 */
class Model {
    /**
     * Constructs and initializes a Model class
     * @param {Observer} view 
     */
    constructor(view) {
        // class constants
        this.DEFAULT_NUM_STARS = 3;
        this.WINNING_MATCHED_CARDS = 16;

        this.mView = view;
        this.mOpenCards = [];
        this.mMatchedCards = [];
        this.mStars = this.DEFAULT_NUM_STARS;
        this.mMoves = 0;
        this.mElapsedTime = 0;

        this.mMovesObservers = new Set();
        this.mStarsObservers = new Set();
        this.mTimerObservers = new Set();

        // Register observer(s)
        this.addMovesObserver(view);
        this.addStarsObserver(view);
        this.addTimerObserver(view);

        // Reset
        this.resetMoves();
        this.resetStars();
        this.resetTimer();

        // initialize to allow input
        this.isInputEnabled = true;
    }

    /**
     * Resets and clears the list of open cards
     */
    clearOpenCards() {
        this.mOpenCards = [];
    }

    /**
     * Resets and clears the list of matched cards
     */
    clearMatchedCards() {
        this.mMatchedCards = [];
    }

    /**
     * add card to the list of open cards, for comparison
     * Note: there can only be 2 cards open at a time, ignore 
     * add card request during compare
     * 
     * @param {Node} card to be added to the list of open cards 
     */
    addCardToOpenCards(card) {
        if (!this.isInputEnabled){
            return;
        }

        console.log(`card ${card} added to the list of open cards.`)
        this.mOpenCards.push(card);
        this.mView.setCardVisibility(card, true);

        async function waitAsync(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve("delay done!"), ms)
            });
        }

        if (this.mOpenCards.length == 2) {
            // disable user input during comparison
            this.isInputEnabled = false;

            // get the first and second card
            let cardA = this.mOpenCards.pop();
            let cardB = this.mOpenCards.pop();

            // compare these cards
            if (cardA.isEqualNode(cardB)) {
                console.log(`cards match: card A ${cardA}, card B ${cardB}`)
                this.addCardToMatchedCards(cardA)
                this.addCardToMatchedCards(cardB)
                this.isInputEnabled = true;
            } else {
                console.log(`cards mismatch: card A ${cardA}, card B ${cardB}`)
                waitAsync(1000).then(r => {
                    console.log(r);
                    this.mView.setCardVisibility(cardA, false);
                    this.mView.setCardVisibility(cardB, false);
                    this.isInputEnabled = true;
                }); 
            }

            // after comparison, clear the array
            this.clearOpenCards()
        }
    }

    /**
     * Adds a card to the list of matched card
     * Note: there can only be as many card as WINNING_MATCHED_CARDS
     * @param {Node} card to be added to the list of matched cards
     */
    addCardToMatchedCards(card) {
        console.log(`card ${card} added to the list of matched cards.`)
        this.mMatchedCards.push(card)
        if (this.mMatchedCards.length == this.WINNING_MATCHED_CARDS) {
            this.stopTimer();
            this.mView.showGameWonModal(this.mElapsedTime, this.mMoves);
            this.clearMatchedCards()
        }
    }

    /**
     * Resets the games move back to zero
     */
    resetMoves() {
        this.mMoves = 0;
        this.notifyMovesObservers(this.mMoves);
    }

    /**
     * Adds a move
     */
    addMove() {
        if (!this.isInputEnabled){
            return;
        }
        this.mMoves++;
        this.notifyMovesObservers(this.mMoves);
        return this.mMoves;
    }

    /**
     * Adds an observer to the moves
     * @param {*} observer 
     */
    addMovesObserver(observer) {
        this.mMovesObservers.add(observer);
    }

    /**
     * Notifies the observers that there is an update to the
     * number of moves.
     * 
     * @param {Number} currentMoves 
     */
    notifyMovesObservers(currentMoves) {
        this.mMovesObservers.forEach(function (observer) {
            console.log(`observer notified of moves update, current moves: ${currentMoves} moves`);
            observer.showMoves(currentMoves);
        });
    }

    /**
     * Clears all game move observers from the list
     */
    clearMovesObservers() {
        console.log("clearMovesObservers() called")
        this.mMovesObservers.clear();
    }

    /**
     * Resets game stars back to default number
     */
    resetStars() {
        this.mStars = this.DEFAULT_NUM_STARS;
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
     * @param {Observer} observer 
     */
    addStarsObserver(observer) {
        this.mStarsObservers.add(observer);
    }

    /**
     * Notifies all observers of game star update
     * @param {Number} currentStars the current number of stars the player has 
     */
    notifyStarsObservers(currentStars) {
        console.log("notifyStarsObservers() called")
        this.mStarsObservers.forEach(function (observer) {
            console.log(`observer notified of time update, current time: ${currentStars} seconds`)
            observer.showStars(currentStars);
        });
    }

    /**
     * Clears all stars observers from the list
     */
    clearStarsObservers() {
        console.log("clearStarsObservers() called")
        this.mStarsObservers.clear();
    }

    // ================================== Timer ==================================== //

    /**
     * Stops the timer
     * TODO fix usage of global timer interval id
     */
    stopTimer() {
        console.log('stopTimer() called, timer instance is stopped.');
        window.clearInterval(mTimerIntervalId);
    }

    /**
     * Stops the current instance of the game timer starts a new game timer, 
     * increments the elapsed time every second.
     * 
     * Note: 
     * Implementation uses the window.setInterval(callback, timeout)
     * and window.clearInterval(id) to do periodic timer clock update
     * 
     * TODO fix usage of global timer interval id
     */
    resetTimer() {
        this.stopTimer();
        console.log("resetTimer() called, timer instance restarts from 0.");
        this.mElapsedTime = 0;
        this.notifyTimerObservers(this.mElapsedTime);
        const handler = function () {
            this.mElapsedTime++;
            this.notifyTimerObservers(this.mElapsedTime);
        }
        this.mElapsedTime = 0;
        mTimerIntervalId = window.setInterval(handler.bind(this), 1000);
    }

    /**
     * Adds an observer to list of game time update observers
     * @param {View} observer 
     */
    addTimerObserver(observer) {
        console.log("addTimerObserver() called, an observer is added.")
        this.mTimerObservers.add(observer);
    }

    /**
     * Notifies all observers of game time update
     * @param {Number} currentTime 
     */
    notifyTimerObservers(currentTime) {
        console.log("notifyTimerObservers() called")
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
        this.mTimerObservers.clear();
    }

}

/** Main Block */
let mView = new View(document);
mView.start();

/** debug only */
mView.showGameWonModal(111,23)


/**
 * static helper method to format seconds into 
 * readable time
 * @param {Number} seconds the time lapsed in seconds 
 */
function formatTime(seconds){
    hh = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    mm = Math.floor(seconds / 60);
    ss = seconds % 60;
    if (hh < 10){
        hh = "0" + hh
    }
    if (mm < 10){
        mm = "0" + mm
    }
    if (ss < 10){
        ss = "0" + ss
    }
    return `${hh}:${mm}:${ss}`;
}