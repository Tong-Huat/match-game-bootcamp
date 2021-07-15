// boardSize has to be an even number
const boardSize = 2;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let cardMatched = 0;
let ref = '';
const gameInfo = document.createElement('div');
const output = (message) => {
  gameInfo.innerText = message;
};
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['❤️', '♦️', '♣️', '♠️'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// create win message when all the cards are matched
const showWinMessage = () => {
  if (cardMatched === 2) {
    const winMessage = document.createElement('h2');
    winMessage.innerText = 'CONGRATS! YOU WON!';
    winMessage.className = 'winMessage';
    document.body.appendChild(winMessage);
    clearInterval(ref);
    setTimeout(() => {
      winMessage.innerText = '';
    }, 2000);
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', () => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(square, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.name} <br> ${firstCard.suit}`;

    output('Click your 2nd card!');
    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      output('You found a match! Click on another square!');
      setTimeout(() => {
        output('');
      }, 1000);
      // turn this card over
      cardElement.innerHTML = `${clickedCard.name} <br> ${clickedCard.suit}`;
      cardMatched += 1;
      showWinMessage();
    } else {
      console.log('NOT a match');
      output('Not a match! Click on another square!');
      // need to set timer for next line
      cardElement.innerHTML = `${clickedCard.name} <br> ${clickedCard.suit}`;

      // turn this card back over
      setTimeout(() => {
        firstCardElement.innerText = '';
        cardElement.innerText = ''; }, 1000);
    }

    // reset the first card
    firstCard = null;
  }
};
// create countdown timer
const timer = () => {
  const hThree = document.createElement('h3');
  hThree.className = 'h3';
  document.body.appendChild(hThree);

  const countdownText = document.createElement('div');
  countdownText.innerText = 'TIME LEFT: ';
  document.body.appendChild(countdownText);

  // set countdown
  let milliseconds = 3000;
  const decreaseInMilliseconds = 1;
  const clockOutput = document.createElement('div');
  clockOutput.innerText = milliseconds;
  document.body.appendChild(clockOutput);

  hThree.appendChild(countdownText);
  hThree.appendChild(clockOutput);

  ref = setInterval(() => {
    clockOutput.innerText = milliseconds;

    if (milliseconds <= 0) {
      clearInterval(ref);
      const gameOverText = document.createElement('div');
      gameOverText.innerText = '!!!GAME OVER!!!';
      gameOverText.className = 'gameover';
      document.body.appendChild(gameOverText);
      output('');
    }
    milliseconds -= 1;
  }, decreaseInMilliseconds);
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);

  // fill game info div with starting instructions
  gameInfo.innerText = 'Click on 1 of the square to start Matching Game! Good luck!';
  document.body.appendChild(gameInfo);
  timer();
};

initGame();

// // create reset button
// const resetButton = document.createElement('button');
// resetButton.innerText = 'Reset Game';
// resetButton.className = 'reset';
// document.body.appendChild(resetButton);

// resetButton.addEventListener('click', initGame);
