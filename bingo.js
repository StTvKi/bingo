const bingoTexts = [
  "SPILLER KLAPPER",
  "GULT KORT",
  "MÅL",
  "OFFSIDE",
  "NOEN GRINER",
  "STRAFFE",
  "SPILLER DANSER",
  "KAMERA ZOOMER INN PÅ EN I PUBLIKUM",
  "TRENER VIFTER MED HENDENE",
  "SPILLER TAR AV TRØYEN",
  "TRENER RISTER PÅ HODET",
  "NOEN KLEMMER",
  "VAR-KONTROLL",
  "BOMMER PÅ STRAFFE",
  "STANG INN",
  "TO MÅL FRA SAMME SPILLER",
  "CORNER",
  "SKUDD I TVERRLIGGER",
  "TAKLING",
  "SPILLER MÅ BÆRES AV BANEN",
  "TEKNISKE PROBLEMER MED SENDINGEN",
  "UTSPARK GÅR OVER MIDTBANEN",
  "SELVMÅL",
  "SPILLER KRANGLER MED DOMMEREN",
  "FRISPARK"
];

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const playerNameInput = document.getElementById("playerNameInput");
const playerName = document.getElementById("playerName");
const fullBingoMessage = document.getElementById("fullBingoMessage");

const squares = document.querySelectorAll(".board button");

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

let completedLines = new Set();

startButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});

playAgainButton.addEventListener("click", resetGame);

squares.forEach((square) => {
  square.addEventListener("click", () => {
    square.classList.toggle("active");
    checkForBingo();
  });
});

window.addEventListener("resize", () => {
  squares.forEach(fitText);
});

function startGame() {
  const name = playerNameInput.value.trim();

  if (name === "") {
    playerNameInput.focus();
    return;
  }

  playerName.textContent = name;
  startScreen.classList.add("hidden");
  gameScreen.classList.add("visible");

  resetGame();
}

function resetGame() {
  completedLines = new Set();

  fullBingoMessage.classList.remove("visible");
  playAgainButton.classList.remove("visible");

  squares.forEach((square) => {
    square.classList.remove("active");
  });

  const shuffledTexts = shuffleArray([...bingoTexts]);

  squares.forEach((square, index) => {
    square.textContent = shuffledTexts[index];
    fitText(square);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

function fitText(square) {
  let size = window.innerWidth <= 600 ? 12 : 16;
  const minSize = window.innerWidth <= 600 ? 5.5 : 8;

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
      launchConfetti();
    }

    if (!hasLine && completedLines.has(lineIndex)) {
      completedLines.delete(lineIndex);
    }
  });

  if (completedLines.size === winningLines.length) {
    fullBingoMessage.classList.add("visible");
    playAgainButton.classList.add("visible");
    launchConfetti();
    launchConfetti();
  }
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
