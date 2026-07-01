const bingoTexts = [
  "SKUDD I TVERRLIGGER",
  "NOEN GRINER",
  "TAKLING",
  "MÅL",
  "TO MÅL FRA SAMME SPILLER",
  "SELV MÅL",
  "STRAFFE",
  "GULT KORT",
  "TRENER VIFTER MED HENDENE",
  "SPILLER KLAPPER",
  "KAMERA ZOOMER INN PÅ EN I PUBLIKUM",
  "UTSPARK GÅR OVER MIDTBANEN",
  "STANG INN",
  "BOMMER PÅ STRAFFE",
  "TRENER RISTER PÅ HODET",
  "TEKNISKE PROBLEMER MED SENDINGEN",
  "OFFSIDE",
  "CORNER",
  "SPILLER BÆRES AV BANEN",
  "SPILLER KRANGLER MED DOMMER",
  "RØDT KORT",
  "MÅL ETTER CORNER",
  "KEEPER REDDER",
  "VAR-SJEKK",
  "EKSTRAOMGANGER"
];

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const playerNameInput = document.getElementById("playerNameInput");
const playerName = document.getElementById("playerName");
const fullBingoMessage = document.getElementById("fullBingoMessage");
const board = document.getElementById("board");

const winningLines = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],

  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

let squares = [];
let completedLines = new Set();
let currentPlayerName = "";

createBoard();

startButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});

playAgainButton.addEventListener("click", resetGame);

window.addEventListener("resize", () => {
  fitAllText();
});

function createBoard() {
  board.innerHTML = "";
  squares = [];

  for (let i = 0; i < 25; i++) {
    const square = document.createElement("button");
    square.type = "button";

    square.addEventListener("click", () => {
      square.classList.toggle("active");
      checkForBingo();
    });

    board.appendChild(square);
    squares.push(square);
  }
}

function startGame() {
  const name = playerNameInput.value.trim();

  if (name === "") {
    playerNameInput.focus();
    return;
  }

  currentPlayerName = name;
  playerName.textContent = `${name} sitt bingobrett`;

  startScreen.classList.add("hidden");
  gameScreen.classList.add("visible");

  resetGame();
}

function resetGame() {
  completedLines = new Set();

  fullBingoMessage.classList.remove("visible");
  playAgainButton.classList.remove("visible");

  const shuffledTexts = shuffleArray([...bingoTexts]);

  squares.forEach((square, index) => {
    square.classList.remove("active");
    square.textContent = shuffledTexts[index] || "";
  });

  requestAnimationFrame(fitAllText);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

function fitAllText() {
  squares.forEach(fitText);
}

function fitText(square) {
  let size = window.innerWidth < 600 ? 13 : 16;
  const minSize = window.innerWidth < 600 ? 6 : 8;

  square.style.fontSize = size + "px";

  while (
    (square.scrollHeight > square.clientHeight ||
      square.scrollWidth > square.clientWidth) &&
    size > minSize
  ) {
    size -= 0.5;
    square.style.fontSize = size + "px";
  }
}

function checkForBingo() {
  winningLines.forEach((line, lineIndex) => {
    const hasLine = line.every((index) =>
      squares[index].classList.contains("active")
    );

    if (hasLine && !completedLines.has(lineIndex)) {
      completedLines.add(lineIndex);
      showLineMessage();
      launchConfetti();
    }

    if (!hasLine && completedLines.has(lineIndex)) {
      completedLines.delete(lineIndex);
    }
  });

  if (completedLines.size === winningLines.length) {
    fullBingoMessage.textContent = `🎉 Gratulerer ${currentPlayerName}!!!`;
    fullBingoMessage.classList.add("visible");
    playAgainButton.classList.add("visible");
    launchConfetti();
    launchConfetti();
  }
}

function showLineMessage() {
  const oldMessage = document.querySelector(".line-message");
  if (oldMessage) {
    oldMessage.remove();
  }

  const message = document.createElement("div");
  message.className = "line-message";

  const count = completedLines.size;
  message.textContent = `🎉 Bingo! ${count} av 12 linjer`;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 1800);
}

function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.4 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2500);
  }
}
