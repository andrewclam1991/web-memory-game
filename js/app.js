/*
 * 1. Create a list that holds all of your cards
 */
const deck = document.getElementById("main-deck");
const numCards = 16;
let cards = new Array(numCards);

/*
 * 2. Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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

cards = document.getElementsByClassName("card");
cards = shuffle(cards);
for(let i = 0; i < numCards; i++){
    deck.appendChild(cards[i]);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// list to store all currently matched cards
let openCards = new Array(0);

// list to store the open card pending checks
let matchedCards = new Array();

// create the method to run when clicked
const handleClick = function(event){
    let card = event.target;
    // skip and return if event target is not li or 
    // if it is already open
    // if it is already matched
    if (card.nodeName.toLowerCase() !== 'li') return;
    if (openCards.includes(card))             return;
    if (matchedCards.includes(card))          return;

    // show the card
    showCard(card);

    // add card to the list of open cards
    addCardToCheckList(card);

    // end game is reached if matched card is at numCards
    if (matchedCards.length === numCards){
        // TODO win state
        // show message
        // reset game
    }
};

// delegate click event to each child li element
// const deck = document.getElementById('main-deck');
deck.addEventListener('click',handleClick);

/**
 * function to show the card
 * @param {*} card 
 */
function showCard(card){
    card.classList.add("open");
    card.classList.add("show");
}

/**
 * function to add card to open list.
 */
function addCardToCheckList(card){
    openCards.push(card);
    console.log("pushed card(), current size: " + openCards.length);

    if(openCards.length === 2){
        let firstCard = openCards[0];
        let secondCard = openCards[1];
        if (firstCard.isEqualNode(secondCard)){
            // card match, add them to matched cards stack
            console.log("matched!");
            matchCard(firstCard);
            matchCard(secondCard);
            matchedCards.push(firstCard);
            matchedCards.push(secondCard);
        }else{
            // card mismatch
            console.log("mismatch");
            hideCard(firstCard);
            hideCard(secondCard);
        }
        // reset the open cards
        openCards = new Array();
    }
}

/**
 * function to hide the card 
 * @param {*} card 
 */
function hideCard(card){
    card.classList.remove("open");
    card.classList.remove("show");
} 

/**
 * function to show the card is matched
 * @param {*} card 
 */
function matchCard(card){
    card.classList.remove("open");
    card.classList.remove("show");
    card.classList.add("match");
}