/*
 * 1. Create a list that holds all of your cards
 */
// instance constant number of cards
const NUM_CARDS = 16;

// instance list to store all currently matched cards
let mOpenCards = new Array(0);

// instance list to store the open card pending checks
let mMatchedCards = new Array(0);

// instance var to store the number of moves
let mMoves = 0;

// instance var to track the on/off state of the timer
let isTimerStarted = false;

// instance var to track the total elapsed seconds
let mElapsedSeconds = 0;

// Allow player to reset game
let mResetGameBtn = document.getElementById("restart-view");
mResetGameBtn.addEventListener('click', initGame);

/*
 * 2. Display the cards on the page
 *   - shuffle the list of cards content using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
initGame();

/**
 * Function that initializes the memory game
 * responsible for shuffling the cards and generate the 
 * game baord.
 */
function initGame() {
    // get the list of existing cards
    let cardViews = new Array(NUM_CARDS);
    cardViews = document.getElementsByClassName("card-view");

    // Creates a list to store each cards' content
    let cardContentViews = new Array();
    for (let i = 0; i < cardViews.length; i++) {
        let cardContentView = cardViews[i].getElementsByTagName("i")[0];
        cardContentViews.push(cardContentView);
    }

    // shuffle the card contents
    cardContentViews = shuffleCards(cardContentViews);
    for (let j = 0; j < cardViews.length; j++) {
        cardViews[j].appendChild(cardContentViews[j]);
        hideCard(cardViews[j]);
    }

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

    // reset timer
    stopTimer();
}

/**
 * Function the handles shuffling an array
 * a function from http://stackoverflow.com/a/2450976
 */
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

    startTimer();

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
    let modalCloseBtn = document.getElementById("modal-close-btn")[0];
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
    isTimerStarted = true;
    mElapsedSeconds = 0;
    setInterval(countUp(), 1000);
}

function countUp() {
    if (isTimerStarted) {
        mElapsedSeconds++;
        setElapsedTime(mElapsedSeconds);
    }
}

/**
 * Function to show the current elasped time in the ui
 * @param {number} seconds elapsed time in seconds
 */
function setElapsedTime(seconds) {
    const timeView = document.getElementById("elapsed-time-view");
    timeView.innerText = seconds;
}

/**
 * Function to stop the timer, and resets the
 * elapsed time.
 */
function stopTimer() {
    isTimerStarted = false;
    mElapsedSeconds = 0;
    setElapsedTime(mElapsedSeconds);
}