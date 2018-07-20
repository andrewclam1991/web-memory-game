/*
 * 1. Create a list that holds all of your cards
 */
const NUM_CARDS = 16;

// list to store all currently matched cards
let mOpenCards = new Array(0);

// list to store the open card pending checks
let mMatchedCards = new Array(0);

// instance var to store the number of moves
let mMoves = 0;

// Allow player to reset game
let mResetGameBtn = document.querySelector(".restart");
mResetGameBtn.addEventListener('click',initGame());

/*
 * 2. Display the cards on the page
 *   - shuffle the list of cards content using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
initGame();

// TODO test
// showGameWonModal();

/**
 * Function that initializes the memory game
 * responsible for shuffling the cards and generate the 
 * game baord.
 */
function initGame(){
    // get the list of existing cards
    let cards = new Array(NUM_CARDS);
    cards = document.getElementsByClassName("card");
    
    // Creates a list to store each cards' content
    let cardContents = new Array();
    for(let i = 0; i < cards.length; i++){
        let cardContent = cards[i].getElementsByTagName("i")[0];
        cardContents.push(cardContent);
    }   

    // shuffle the card contents
    cardContents = shuffle(cardContents);
    for (let j = 0; j < cards.length; j++) {
        cards[j].appendChild(cardContents[j]);
        hideCard(cards[j]);
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
}

/**
 * Function the handles shuffling an array
 * a function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
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
const deck = document.getElementById('main-deck');
deck.addEventListener('click', handleClick);

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
function updateMoves(moves){
    const movesSpan = document.getElementsByClassName('moves')[0];
    movesSpan.innerHTML = moves; 
}

/**
 * function to update ui stars, more moves, less stars
 * @param {Number} moves current instance of moves
 */
function updateStars(moves){
    const firstStar = document.getElementById("first-star");
    const secondStar = document.getElementById("second-star");
    const thirdStar = document.getElementById("third-star");

    const TWO_STAR_MOVES = 32; 
    const ONE_STAR_MOVES = 64;
    const NO_STAR_MOVES = 128;

    if (moves < TWO_STAR_MOVES){
        // still good or resets
        firstStar.style.visibility = "visible";
        secondStar.style.visibility = "visible";
        thirdStar.style.visibility = "visible";
    }else if(moves >= TWO_STAR_MOVES && moves < ONE_STAR_MOVES){
        // remove a star (hide the third star)
        thirdStar.style.visibility = "hidden";
        console.log("third star gone");
    }else if(moves >= ONE_STAR_MOVES && moves < NO_STAR_MOVES){
        // remove another star (hide the second star)
        secondStar.style.visibility = "hidden";
        console.log("second star gone");
    }else if(moves >= NO_STAR_MOVES){
        // remove the last star (hide the first star)
        firstStar.style.visibility = "hidden";
        console.log("last star gone");
    }
}

/**
 * function to update ui to show the card
 * @param {Node} card to be shown
 */
function showCard(card) {
    card.classList.add("open");
    card.classList.add("show");
}

/**
 * function to update ui to hide the card 
 * @param {Node} card to be hidden
 */
function hideCard(card) {
    card.classList.remove("match");
    card.classList.remove("open");
    card.classList.remove("show");
}

/**
 * function to update ui to show the card is matched
 * @param {Node} card to mark as matched
 */
function matchCard(card) {
    card.classList.remove("open");
    card.classList.remove("show");
    card.classList.add("match");
}

/**
 * Function to update ui to show user has won the game
 * and allows user to reset the game
 */
function showGameWonModal(){
    let modal = document.querySelector("#modal-game-win");
    let modalClose = document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    // Allows user to dimiss the modal message
    modalClose.onclick = function(){
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    console.log("win game!");
}