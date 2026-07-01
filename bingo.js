const bingoTexts = [
  "SKUDD I TVERRLIGGER",
  "NOEN GRINER",
  "NOEN DANSER",
  "MÅL",
  "TO MÅL FRA SAMME SPILLER",
  "SELVMÅL",
  "STRAFFE",
  "GULT KORT",
  "TRENER VIFTER MED HENDENE",
  "SPILLER KLAPPER",
  "KAMERA ZOOMER INN PÅ EN I PUBLIKUM",
  "UTSPARK GÅR OVER MIDTBANEN",
  "STANG UT",
  "BOMMER PÅ STRAFFE",
  "TRENER RISTER PÅ HODET",
  "TEKNISKE PROBLEMER MED SENDINGEN",
  "BALLEN TREFFER DOMMEREN",
  "CORNER",
  "SPILLER BÆRES AV BANEN",
  "SPILLER KRANGLER MED DOMMER",
  "RØDT KORT",
  "MÅL ETTER CORNER",
  "KEEPER REDDER",
  "VAR-SJEKK",
  "SPILLER KNYTER SKOENE",
  "INNBYTTE",
  "OFFSIDE",
  "LANGSKUDD",
  "FRISPARK I MUREN",
  "PUBLIKUM TAR BØLGEN",
  "TRENER ER BORTI BALLEN",
  "KEEPER BOKSER BALLEN",
  "SPILLER FÅR KRAMPE",
  "KOMMENTATOR SIER 'FANTASTISK'",
  "INNKAST",
];

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");

const startButton = document.getElementById("startButton");
const finishButton = document.getElementById("finishButton");
const playAgainButton = document.getElementById("playAgainButton");
const backToBoardButton = document.getElementById("backToBoardButton");
const newGameButton = document.getElementById("newGameButton");

const playerNameInput = document.getElementById("playerNameInput");
const playerName = document.getElementById("playerName");

const fullBingoMessage = document.getElementById("fullBingoMessage");

const summaryTitle = document.getElementById("summaryTitle");
const summarySquares = document.getElementById("summarySquares");
const summaryLines = document.getElementById("summaryLines");
const summaryScore = document.getElementById("summaryScore");

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

finishButton.addEventListener("click", showSummary);

backToBoardButton.addEventListener("click", () => {
  summaryScreen.classList.remove("visible");
  gameScreen.classList.add("visible");
});

newGameButton.addEventListener("click", () => {
  summaryScreen.classList.remove("visible");
  gameScreen.classList.add("visible");
  resetGame();
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
  summaryScreen.classList.remove("visible");
  gameScreen.classList.add("visible");

  resetGame();
}

function resetGame() {
  completedLines = new Set();

  fullBingoMessage.classList.remove("visible");
  playAgainButton.classList.remove("visible");

  const oldLineMessage = document.querySelector(".line-message");
  if (oldLineMessage) {
    oldLineMessage.remove();
  }

  board.classList.add("generating");
  finishButton.disabled = true;

  const shuffledTexts = shuffleArray([...bingoTexts]).slice(0, 25);

  squares.forEach((square) => {
    square.classList.remove("active", "generated");
    square.disabled = true;
    square.textContent = "";
  });

  animateBoardGeneration(shuffledTexts);
}
function animateBoardGeneration(finalTexts) {
  const animationTime = 900;
  const intervalTime = 55;

  squares.forEach((square, index) => {
    let elapsed = 0;

    const interval = setInterval(() => {
      const randomText =
        bingoTexts[Math.floor(Math.random() * bingoTexts.length)];

      square.textContent = randomText;
      fitText(square);

      elapsed += intervalTime;
    }, intervalTime);

    setTimeout(() => {
      clearInterval(interval);

      square.textContent = finalTexts[index] || "";
      square.classList.add("generated");
      square.disabled = false;

      fitText(square);
    }, animationTime + index * 45);
  });

  const totalTime = animationTime + squares.length * 45 + 150;

  setTimeout(() => {
    board.classList.remove("generating");
    finishButton.disabled = false;
    requestAnimationFrame(fitAllText);
  }, totalTime);
}

function showSummary() {
  const markedSquares = squares.filter((square) =>
    square.classList.contains("active")
  ).length;

  const completedLineCount = completedLines.size;

  // Poeng
  const squarePoints = markedSquares * 10;
  const linePoints = completedLineCount * 100;
  const totalPoints = squarePoints + linePoints;

  // Finn tittel
  let rank = "";
  let emoji = "";

  if (totalPoints >= 1000) {
    emoji = "👑";
    rank = "Bingomester";
  } else if (totalPoints >= 750) {
    emoji = "🥇";
    rank = "Gull";
  } else if (totalPoints >= 500) {
    emoji = "🥈";
    rank = "Sølv";
  } else if (totalPoints >= 250) {
    emoji = "🥉";
    rank = "Bronse";
  } else if (totalPoints >= 100) {
    emoji = "⚽";
    rank = "Supporter";
  } else {
    emoji = "🌱";
    rank = "Nybegynner";
  }

  summaryTitle.textContent = `${currentPlayerName} sin poengsum`;

  summarySquares.textContent =
    `✅ Markerte ruter: ${markedSquares} (${squarePoints} poeng)`;

  summaryLines.textContent =
    `🏆 Bingo: ${completedLineCount} (${linePoints} poeng)`;

  summaryScore.innerHTML = `
    <div style="font-size:3rem;">${emoji}</div>
    <div style="font-size:2.2rem;font-weight:bold;">
      ${totalPoints} poeng
    </div>
    <div style="font-size:1.4rem;margin-top:10px;">
       <strong>${rank.toUpperCase()}</strong>!
    </div>
  `;

  gameScreen.classList.remove("visible");
  fullBingoMessage.classList.remove("visible");
  playAgainButton.classList.remove("visible");
  summaryScreen.classList.add("visible");
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
