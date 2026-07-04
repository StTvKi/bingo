const MATCH = {
  homeTeam: "Norge",
  awayTeam: "Brasil",
};

const STORAGE_KEY = "footballBingoGame";

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
  "SPILLER SKLIR PÅ KNÆRNE",
  "PUBLIKUM 'ROR'",
  "KEEPERBYTTE",
  "KOMMENTATOR LER",
  "NOE BLIR KASTET INN PÅ BANEN",
  "PUBLIKUM SYNGER",
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

const homeScoreInput = document.getElementById("homeScoreInput");
const awayScoreInput = document.getElementById("awayScoreInput");

const actualHomeTeamName = document.getElementById("actualHomeTeamName");
const actualAwayTeamName = document.getElementById("actualAwayTeamName");

const actualHomeMinusButton = document.getElementById("actualHomeMinusButton");
const actualHomePlusButton = document.getElementById("actualHomePlusButton");
const actualAwayMinusButton = document.getElementById("actualAwayMinusButton");
const actualAwayPlusButton = document.getElementById("actualAwayPlusButton");

const actualHomeScoreDisplay = document.getElementById("actualHomeScoreDisplay");
const actualAwayScoreDisplay = document.getElementById("actualAwayScoreDisplay");

const playerName = document.getElementById("playerName");

const fullBingoMessage = document.getElementById("fullBingoMessage");

const summaryTitle = document.getElementById("summaryTitle");
const summaryMatch = document.getElementById("summaryMatch");
const summaryPrediction = document.getElementById("summaryPrediction");
const summaryActualResult = document.getElementById("summaryActualResult");
const summaryPredictionPoints = document.getElementById("summaryPredictionPoints");
const summarySquares = document.getElementById("summarySquares");
const summaryLines = document.getElementById("summaryLines");
const summaryScore = document.getElementById("summaryScore");

const board = document.getElementById("board");

homeScoreInput.placeholder = MATCH.homeTeam;
awayScoreInput.placeholder = MATCH.awayTeam;

actualHomeTeamName.textContent = MATCH.homeTeam;
actualAwayTeamName.textContent = MATCH.awayTeam;

document.title = `Bingo - ${MATCH.homeTeam} mot ${MATCH.awayTeam}`;

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
  [4, 8, 12, 16, 20],
];

let squares = [];
let completedLines = new Set();
let currentPlayerName = "";
let currentPrediction = "";
let actualHomeScore = 0;
let actualAwayScore = 0;
let isRestoringSavedGame = false;

createBoard();
loadSavedGame();

startButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    homeScoreInput.focus();
  }
});

homeScoreInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    awayScoreInput.focus();
  }
});

awayScoreInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});

actualHomeMinusButton.addEventListener("click", () => {
  changeActualScore("home", -1);
});

actualHomePlusButton.addEventListener("click", () => {
  changeActualScore("home", 1);
});

actualAwayMinusButton.addEventListener("click", () => {
  changeActualScore("away", -1);
});

actualAwayPlusButton.addEventListener("click", () => {
  changeActualScore("away", 1);
});

finishButton.addEventListener("click", showSummary);

backToBoardButton.addEventListener("click", () => {
  summaryScreen.classList.remove("visible");
  gameScreen.classList.add("visible");
  saveGame();
});

newGameButton.addEventListener("click", () => {
  clearSavedGame();

  summaryScreen.classList.remove("visible");
  gameScreen.classList.remove("visible");
  startScreen.classList.remove("hidden");

  playerNameInput.value = "";
  homeScoreInput.value = "";
  awayScoreInput.value = "";

  currentPlayerName = "";
  currentPrediction = "";
  actualHomeScore = 0;
  actualAwayScore = 0;

  updateActualScoreDisplay();
  resetGame(false);
});

playAgainButton.addEventListener("click", () => {
  clearSavedGame();

  startScreen.classList.remove("hidden");
  gameScreen.classList.remove("visible");
  summaryScreen.classList.remove("visible");

  playerNameInput.value = "";
  homeScoreInput.value = "";
  awayScoreInput.value = "";

  currentPlayerName = "";
  currentPrediction = "";
  actualHomeScore = 0;
  actualAwayScore = 0;

  updateActualScoreDisplay();
  resetGame(false);
});

window.addEventListener("resize", () => {
  fitAllText();
});

window.addEventListener("beforeunload", () => {
  saveGame();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saveGame();
  }
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
      saveGame();
    });

    board.appendChild(square);
    squares.push(square);
  }
}

function startGame() {
  const name = playerNameInput.value.trim();
  const homeScore = homeScoreInput.value.trim();
  const awayScore = awayScoreInput.value.trim();

  if (name === "") {
    playerNameInput.focus();
    return;
  }

  if (homeScore === "") {
    homeScoreInput.focus();
    return;
  }

  if (awayScore === "") {
    awayScoreInput.focus();
    return;
  }

  currentPlayerName = name;
  currentPrediction = `${homeScore}-${awayScore}`;

  actualHomeScore = 0;
  actualAwayScore = 0;
  updateActualScoreDisplay();

  playerName.textContent = `${name} sitt bingobrett`;

  startScreen.classList.add("hidden");
  summaryScreen.classList.remove("visible");
  gameScreen.classList.add("visible");

  resetGame(true);
}

function resetGame(shouldGenerateNewBoard = true) {
  completedLines = new Set();

  fullBingoMessage.classList.remove("visible");
  playAgainButton.classList.remove("visible");

  const oldLineMessage = document.querySelector(".line-message");
  if (oldLineMessage) {
    oldLineMessage.remove();
  }

  squares.forEach((square) => {
    square.classList.remove("active", "generated", "bingo-line");
    square.disabled = false;
    square.textContent = "";
  });

  if (!shouldGenerateNewBoard) {
    saveGame();
    return;
  }

  board.classList.add("generating");
  finishButton.disabled = true;

  const shuffledTexts = shuffleArray([...bingoTexts]).slice(0, 25);

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
    saveGame();
  }, totalTime);
}

function changeActualScore(team, change) {
  const isGoalAdded = change > 0;

  if (team === "home") {
    actualHomeScore = Math.max(0, actualHomeScore + change);
  }

  if (team === "away") {
    actualAwayScore = Math.max(0, actualAwayScore + change);
  }

  updateActualScoreDisplay();
  saveGame();

  if (isGoalAdded) {
    launchConfetti();
  }
}

function updateActualScoreDisplay() {
  actualHomeScoreDisplay.textContent = actualHomeScore;
  actualAwayScoreDisplay.textContent = actualAwayScore;
}

function showSummary() {
  saveGame();

  const markedSquares = squares.filter((square) =>
    square.classList.contains("active")
  ).length;

  const completedLineCount = completedLines.size;

  const squarePoints = markedSquares * 10;
  const linePoints = completedLineCount * 100;
  const predictionPoints = calculatePredictionPoints();

  const totalPoints = squarePoints + linePoints + predictionPoints;

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

  summaryMatch.textContent =
    `Kamp: ${MATCH.homeTeam} mot ${MATCH.awayTeam}`;

  summaryPrediction.textContent =
    `⚽ Tippet resultat: ${MATCH.homeTeam} ${currentPrediction} ${MATCH.awayTeam}`;

  summaryActualResult.textContent =
    `📍 Faktisk resultat: ${getActualResultText()}`;

  summaryPredictionPoints.textContent =
    `🎯 Resultatbonus: ${predictionPoints} poeng`;

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

function calculatePredictionPoints() {
  const [predictedHome, predictedAway] = currentPrediction
    .split("-")
    .map(Number);

  let points = 0;

  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHomeScore, actualAwayScore);

  if (predictedWinner === actualWinner) {
    points += 100;
  }

  if (predictedHome === actualHomeScore) {
    points += 50;
  }

  if (predictedAway === actualAwayScore) {
    points += 50;
  }

  if (predictedHome === actualHomeScore && predictedAway === actualAwayScore) {
    points += 100;
  }

  return points;
}

function getWinner(homeScore, awayScore) {
  if (homeScore > awayScore) {
    return "home";
  }

  if (awayScore > homeScore) {
    return "away";
  }

  return "draw";
}

function getActualResultText() {
  return `${MATCH.homeTeam} ${actualHomeScore}-${actualAwayScore} ${MATCH.awayTeam}`;
}

function saveGame() {
  if (isRestoringSavedGame) {
    return;
  }

  const gameIsStarted =
    currentPlayerName !== "" &&
    currentPrediction !== "" &&
    gameScreen.classList.contains("visible");

  const summaryIsVisible = summaryScreen.classList.contains("visible");

  if (!gameIsStarted && !summaryIsVisible) {
    return;
  }

  const savedGame = {
    match: MATCH,
    playerName: currentPlayerName,
    prediction: currentPrediction,
    actualHomeScore,
    actualAwayScore,
    squareTexts: squares.map((square) => square.textContent),
    activeSquares: squares.map((square) => square.classList.contains("active")),
    screen: summaryIsVisible ? "summary" : "game",
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGame));
}

function loadSavedGame() {
  const savedGameText = localStorage.getItem(STORAGE_KEY);

  if (!savedGameText) {
    return;
  }

  try {
    const savedGame = JSON.parse(savedGameText);

    if (!savedGame || !savedGame.playerName || !savedGame.prediction) {
      clearSavedGame();
      return;
    }

    isRestoringSavedGame = true;

    currentPlayerName = savedGame.playerName;
    currentPrediction = savedGame.prediction;
    actualHomeScore = Number(savedGame.actualHomeScore || 0);
    actualAwayScore = Number(savedGame.actualAwayScore || 0);

    playerNameInput.value = currentPlayerName;

    const [predictedHome, predictedAway] = currentPrediction.split("-");
    homeScoreInput.value = predictedHome || "";
    awayScoreInput.value = predictedAway || "";

    playerName.textContent = `${currentPlayerName} sitt bingobrett`;
    updateActualScoreDisplay();

    startScreen.classList.add("hidden");
    gameScreen.classList.add("visible");
    summaryScreen.classList.remove("visible");

    if (Array.isArray(savedGame.squareTexts) && savedGame.squareTexts.length === 25) {
      squares.forEach((square, index) => {
        square.textContent = savedGame.squareTexts[index] || "";
        square.disabled = false;
        square.classList.add("generated");

        if (savedGame.activeSquares && savedGame.activeSquares[index]) {
          square.classList.add("active");
        } else {
          square.classList.remove("active");
        }

        fitText(square);
      });
    }

    board.classList.remove("generating");
    finishButton.disabled = false;

    checkForBingo();

    if (savedGame.screen === "summary") {
      showSummary();
    }

    isRestoringSavedGame = false;
  } catch (error) {
    isRestoringSavedGame = false;
    clearSavedGame();
  }
}

function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEY);
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
  const oldCompletedLineCount = completedLines.size;

  completedLines = new Set();

  squares.forEach((square) => {
    square.classList.remove("bingo-line");
  });

  winningLines.forEach((line, lineIndex) => {
    const hasLine = line.every((index) =>
      squares[index].classList.contains("active")
    );

    if (hasLine) {
      completedLines.add(lineIndex);

      line.forEach((index) => {
        squares[index].classList.add("bingo-line");
      });
    }
  });

  if (completedLines.size > oldCompletedLineCount) {
    showLineMessage();
    launchConfetti();
  }

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