const gameObject = document.querySelector('.game-object');
const yesButton = document.querySelector('.yes-button');
const noButton = document.querySelector('.no-button');
const noButton2 = document.querySelectorAll('.no-button')[1];
const noButton3 = document.querySelectorAll('.no-button')[2];
const noButton4 = document.querySelectorAll('.no-button')[3];
const speechBubble = document.querySelector('.speech-bubble');
const newCharacter = document.querySelector('.new-character');
const gameOverImage = document.getElementById('gameOverImage');
const gameContainerWidth = document.querySelector('.game-container').clientWidth;
const gameObjectWidth = gameObject.clientWidth;
let positionX = 0;
const moveSpeed = 3;
const stopPositionX = gameContainerWidth * 0.6;
const characterImageM1 = new Image();
const characterImageM2 = new Image();
const characterImageF1 = new Image();
const characterImageF2 = new Image();

loadAssets(() => console.log('Assets loaded'));

function loadAssets(callback) {
  let assetsLoaded = 0;
  
  function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === 4) {
      callback();
    }
  }
  
  characterImageM1.src = 'Character_images/M_char_a.png';
  characterImageM1.onload = assetLoaded;

  characterImageM2.src = 'Character_images/M_char_b.png';
  characterImageM2.onload = assetLoaded;

  characterImageF1.src = 'Character_images/F_char_a.png';
  characterImageF1.onload = assetLoaded;

  characterImageF2.src = 'Character_images/F_char_b.png';
  characterImageF2.onload = assetLoaded;
};

let hasClickedYes = false;
let currentSpeechBubble;
let score = 0;
let selectedCharacter;
let isGameRunning = false;

const speechBubbles = {
  'Bekanntlich haben die Elben ein besonderes Auge für Schönheit. Ergänze die Figur zu einer achsensymmetrischen Figur. Bestimme die Koordinaten der drei Eckpunkte.': 'yes-button',
  'Gollum hat seinen einen Ring versteckt. Ermittle die Koordinaten, an denen der Ring versteckt hast.': 'yes-button',
  'Aragorn benötigt seine mittlere Sprintzeit:': 'yes-button',
  'Der Sieger zwischen Legolas und Gimli hat einen Trefferdurchschnitt von…': 'yes-button',
  'Pippin sind die Schnipsel eines wichtigen Textes von Gandalf heruntergefallen. Hilf Pippin die Wortbausteine wieder in die richtige Reihenfolge zu bringen.': 'yes-button',
  'Die Tore von Moria sind versperrt. Um in das Zwergenreich eindringen zu können, hilf den Gefährten den Lösungscode zu bestimmen.': 'yes-button',
  'Legolas und Gimli konnten nicht berechnen, wer erfolgreicher war. Hilf ihnen, indem du die richtige Gleichung auswählst.': 'yes-button',
  'König Theodin möchte wissen, wie die Schlacht verlief. Erstatte ihm Bericht, indem du die richtigen Zahlen nennst.': 'yes-button',
  'Nenne die Konstruktion, die sich hinter dem Hilfssymbol verbirgt:': 'yes-button',
  'Finde den blinden Fleck von Saurons Auge. An welchen Stationen können sich die Gefährten treffen, ohne beobachtet zu werden?': 'yes-button',
};

const buttonLabels = {
  'Bekanntlich haben die Elben ein besonderes Auge für Schönheit. Ergänze die Figur zu einer achsensymmetrischen Figur. Bestimme die Koordinaten der drei Eckpunkte.': ['(2,5|0), (4|0,5), (4|2,5)', '(2|0), (4,5|0,5), (4|2)','(2,5|0,5), (4,5|0,5), (4,5|2,5)','(2,5|0), (4|1), (4|2,5)','(2|0), (4|1,5), (4|2,5)'],
  'Gollum hat seinen einen Ring versteckt. Ermittle die Koordinaten, an denen der Ring versteckt hast.': ['(3,5|3)', '(3|2,5)', '(3|3)','(4|3)','(4|2,5)'],
  'Aragorn benötigt seine mittlere Sprintzeit:': ['39,12s', '38,97s', '39,27s','40,42s','39,99s'],
  'Der Sieger zwischen Legolas und Gimli hat einen Trefferdurchschnitt von…': ['2,75', '2,5', '3,0','3,2','2,8'],
  'Pippin sind die Schnipsel eines wichtigen Textes von Gandalf heruntergefallen. Hilf Pippin die Wortbausteine wieder in die richtige Reihenfolge zu bringen.': ['GY3F79A', '79FGY3A', 'GY3A79F','7YGA39F','G73FY9A'],
  'Die Tore von Moria sind versperrt. Um in das Zwergenreich eindringen zu können, hilf den Gefährten den Lösungscode zu bestimmen.': ['83VP1', '86ZS1', 'Z3VP2','83ZS2','Z3VLE'],
  'Legolas und Gimli konnten nicht berechnen, wer erfolgreicher war. Hilf ihnen, indem du die richtige Gleichung auswählst.': ['4g = l', '4l = g', 'g + 4 = l','g = l + 4','4 = lg'],
  'König Theodin möchte wissen, wie die Schlacht verlief. Erstatte ihm Bericht, indem du die richtigen Zahlen nennst.': ['A = 400, B = 13,33%', 'A = 500, B = 13,33%', 'A = 400, B = 15,00%','A = 500, B = 17,33%','A = 400, B = 17,33%'],
  'Nenne die Konstruktion, die sich hinter dem Hilfssymbol verbirgt:': ['Inkreis', 'Gleichseitiges Dreieck', 'Umkreis','Gleichschenkliges Dreieck','Außenkreis'],
  'Finde den blinden Fleck von Saurons Auge. An welchen Stationen können sich die Gefährten treffen, ohne beobachtet zu werden?': ['8,3,5,7', '2,6,5,3', '1,4,7,9','2,4,8,6','3,7,1,5'],
};


function startGame(character) {
  const characterSelection = document.getElementById('characterSelection');
  characterSelection.style.display = 'none';
  gameObject.style.backgroundImage = `url('Character_images/${character}.png')`;
  gameObject.style.backgroundSize = 'cover';
  document.querySelector('.new-character').style.display = 'block';
  document.querySelector('.speech-bubble').style.display = 'none';
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
  noButton2.style.display = 'none';
  noButton3.style.display = 'none';
  noButton4.style.display = 'none';
  selectedCharacter = character;
  gameLoop();
}

document.querySelectorAll('.character-option').forEach(option => {
  option.addEventListener('click', () => {
    const selectedCharacter = option.dataset.character;
    startGame(selectedCharacter);
  });
});

yesButton.addEventListener('click', () => {
  if (!hasClickedYes) {
    hasClickedYes = true;
    currentSpeechBubble = chooseBubble();
    speechBubble.textContent = currentSpeechBubble;
    yesButton.textContent = buttonLabels[currentSpeechBubble][0];
    noButton.textContent = buttonLabels[currentSpeechBubble][1];
    noButton2.textContent = buttonLabels[currentSpeechBubble][2]; // Updated line
    noButton3.textContent = buttonLabels[currentSpeechBubble][3]; // Updated line
    noButton4.textContent = buttonLabels[currentSpeechBubble][4]; // Updated line
  } else {
    checkAnswer('yes-button');
  }
});

noButton.addEventListener('click', () => {
  if (!hasClickedYes) {
    speechBubble.textContent = 'Dann ruhe dich eine Nacht im Gasthaus aus, bevor die Reise beginnt.';
    yesButton.style.display = 'none';
    noButton.textContent = 'Auf ins Abenteuer!';
    noButton.addEventListener('click', () => {
      hasClickedYes = true;
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = buttonLabels[currentSpeechBubble][0];
      noButton.textContent = buttonLabels[currentSpeechBubble][1];
      noButton2.textContent = buttonLabels[currentSpeechBubble][2]; // Updated line
      noButton3.textContent = buttonLabels[currentSpeechBubble][3]; // Updated line
      noButton4.textContent = buttonLabels[currentSpeechBubble][4]; // Updated line
    }, { once: true });
  } else {
    checkAnswer('no-button');
  }
});

noButton2.addEventListener('click', () => {
  if (!hasClickedYes) {
    speechBubble.textContent = 'Dann ruhe dich eine Nacht im Gasthaus aus, bevor die Reise beginnt.';
    yesButton.style.display = 'Auf ins Abenteuer!';
    noButton.textContent = 'Continue';
    noButton.addEventListener('click', () => {
      hasClickedYes = true;
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = buttonLabels[currentSpeechBubble][0];
      noButton.textContent = buttonLabels[currentSpeechBubble][1];
      noButton2.textContent = buttonLabels[currentSpeechBubble][2]; // Updated line
      noButton3.textContent = buttonLabels[currentSpeechBubble][3]; // Updated line
      noButton4.textContent = buttonLabels[currentSpeechBubble][4]; // Updated line
    }, { once: true });
  } else {
    checkAnswer('no-button');
  }
});

noButton3.addEventListener('click', () => {
  if (!hasClickedYes) {
    speechBubble.textContent = 'Dann ruhe dich eine Nacht im Gasthaus aus, bevor die Reise beginnt.';
    yesButton.style.display = 'Auf ins Abenteuer!';
    noButton.textContent = 'Continue';
    noButton.addEventListener('click', () => {
      hasClickedYes = true;
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = buttonLabels[currentSpeechBubble][0];
      noButton.textContent = buttonLabels[currentSpeechBubble][1];
      noButton2.textContent = buttonLabels[currentSpeechBubble][2]; // Updated line
      noButton3.textContent = buttonLabels[currentSpeechBubble][3]; // Updated line
      noButton4.textContent = buttonLabels[currentSpeechBubble][4]; // Updated line
    }, { once: true });
  } else {
    checkAnswer('no-button');
  }
});

noButton4.addEventListener('click', () => {
  if (!hasClickedYes) {
    speechBubble.textContent = 'Dann ruhe dich eine Nacht im Gasthaus aus, bevor die Reise beginnt.';
    yesButton.style.display = 'Auf ins Abenteuer!';
    noButton.textContent = 'Continue';
    noButton.addEventListener('click', () => {
      hasClickedYes = true;
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = buttonLabels[currentSpeechBubble][0];
      noButton.textContent = buttonLabels[currentSpeechBubble][1];
      noButton2.textContent = buttonLabels[currentSpeechBubble][2]; // Updated line
      noButton3.textContent = buttonLabels[currentSpeechBubble][3]; // Updated line
      noButton4.textContent = buttonLabels[currentSpeechBubble][4]; // Updated line
    }, { once: true });
  } else {
    checkAnswer('no-button');
  }
});

let currentIndex = 0;
const keys = Object.keys(speechBubbles);

function chooseBubble() {
  if (keys.length === 0) {
    return null;
  }

  const selectedKey = keys[currentIndex];
  currentIndex = (currentIndex + 1) % keys.length;
  
  return selectedKey;
}


function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = 'Score: ' + score;

  // check score and update background image and new character image accordingly
  if (score >= 0 && score <= 100) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene1.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char.png');
  } if (score >= 100 && score < 200) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene2.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char2.png');
  } else if (score >= 200 && score < 300) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene3.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char3.png');
    removeImageElement(900);
  } else if (score >= 300 && score < 400) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene4.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char4.png');
  } else if (score >= 400 && score < 500) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene5.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char5.png');
    removeImageElement(2000);
  } else if (score >= 500 && score < 600) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene6.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char6.png');
    removeImageElement(3200);
  } else if (score >= 600 && score < 700) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene7.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char7.png');
    removeImageElement(2000);
  } else if (score >= 700 && score < 800) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene8.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char8.png');
    removeImageElement(2000);
  } else if (score >= 800 && score < 900) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene9.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char9.png');
    removeImageElement(2000);
  } else if (score >= 900 && score < 1000) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene10.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char10.png');
    removeImageElement(2000);
  } else if (score >= 1000) {
    // Display the winning image when the score is over 1000
    document.querySelector('.game-container').style.backgroundImage = 'url("Win_image/gewonnen.png")';
 // Create a new div
 var div = document.createElement('div');

 // Set the id to 'winningScreen'
 div.id = 'winningScreen';

 // Append the div to the game container
 document.querySelector('.game-container').appendChild(div);
}
  
  // add images at 1200, 2000, 3200, 4300 and 5600 points
  if (score === 1200) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/1to2world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(900);
  } else if (score === 2000) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/4to5world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(2000);
  } else if (score === 3200) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/2to3world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(3200);
  } else if (score === 4300) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/3to4world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(4300);
  } else if (score === 5600) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/5to6world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(5600);
  }
}

function removeImageElement(scoreValue) {
  if (scoreValue === 1000 || scoreValue === 2100 || scoreValue === 3300 || scoreValue === 4400 || scoreValue === 5600) {
    const transitionImage1 = document.querySelector('.game-container img[src$="1to2world.png"]');
    if (transitionImage1) {
      transitionImage1.remove();
    }

    const transitionImage2 = document.querySelector('.game-container img[src$="4to5world.png"]');
    if (transitionImage2) {
      transitionImage2.remove();
    }

    const transitionImage3 = document.querySelector('.game-container img[src$="2to3world.png"]');
    if (transitionImage3) {
      transitionImage3.remove();
    }

    const transitionImage4 = document.querySelector('.game-container img[src$="3to4world.png"]');
    if (transitionImage4) {
      transitionImage4.remove();
    }

    const transitionImage5 = document.querySelector('.game-container img[src$="5to6world.png"]');
    if (transitionImage5) {
      transitionImage5.remove();
    }
  }
}

function addContinueButton(scoreValue) {
  const continueButton = document.createElement('button');
  continueButton.textContent = 'Continue';
  continueButton.classList.add('continue-button');
  continueButton.addEventListener('click', () => {
    score += 100; // Update the global score variable
    updateScoreDisplay();
    removeImageElement(score); // Call the removeImageElement function with the updated global score
    continueButton.remove();
  });

  if (scoreValue === 900 || scoreValue === 2000 || scoreValue === 3200 || scoreValue === 4300 || scoreValue === 5600) {
    document.querySelector('.game-container').appendChild(continueButton);
  }
}

function showGameOverImage() {
  const gameOverImage = document.createElement('img');
  gameOverImage.setAttribute('id', 'gameOverImage');

  if (selectedCharacter === 'F_char') {
    gameOverImage.setAttribute('src', 'Finish_images/F_char_lose.png');
  } else if (selectedCharacter === 'M_char') {
    gameOverImage.setAttribute('src', 'Finish_images/M_char_lose.png');
  }

  document.querySelector('.game-over-container').appendChild(gameOverImage);
}

function showWinGameImage() {
  const winGameImage = document.createElement('img');
  winGameImage.setAttribute('id', 'winGameImage');

  if (selectedCharacter === 'F_char') {
    winGameImage.setAttribute('src', 'Finish_images/F_char_win.png');
  } else if (selectedCharacter === 'M_char') {
    winGameImage.setAttribute('src', 'Finish_images/M_char_win.png');
  }

  document.querySelector('.game-over-container').appendChild(gameOverImage);
}

function checkAnswer(clickedButton) {
  if (speechBubbles[currentSpeechBubble] === clickedButton) {
    score += 100;
    updateScoreDisplay();

    speechBubble.textContent = 'Correct!';
    currentSpeechBubble = chooseBubble();
    if (currentSpeechBubble) {
      setTimeout(() => {
        speechBubble.textContent = currentSpeechBubble;
        yesButton.textContent = buttonLabels[currentSpeechBubble][0];
        noButton.textContent = buttonLabels[currentSpeechBubble][1];
        noButton2.textContent = buttonLabels[currentSpeechBubble][2];
        noButton3.textContent = buttonLabels[currentSpeechBubble][3];
        noButton4.textContent = buttonLabels[currentSpeechBubble][4];
      }, 1500);
    } else {
      gameOver(true);
    }
  } else {
    gameOver(false);
  }
}

function gameOver(isWin) {
  if (isWin) {
    speechBubble.textContent = 'Congratulations, you have completed the game!';
  } else {
    speechBubble.textContent = 'Incorrect! Game Over.';
  }

  yesButton.style.display = 'none';
  noButton.style.display = 'none';
  noButton2.style.display = 'none';
  noButton3.style.display = 'none';
  noButton4.style.display = 'none';
  document.querySelector('.game-container').style.display = 'none';
  document.querySelector('.game-over-container').style.display = 'block';

  showGameOverImage();
  showFinalScore();
  document.getElementById('replayButton').style.display = 'block'; // Show the "Replay" button
}

function showFinalScore() {
  const finalScoreElement = document.createElement('div');
  finalScoreElement.setAttribute('id', 'finalScore');
  finalScoreElement.textContent = 'Final Score: ' + score;
  document.querySelector('.game-over-container').appendChild(finalScoreElement);
}

function resetGame() {
  document.querySelector('.game-container').style.display = 'block';
  document.querySelector('.game-over-container').style.display = 'none';
  document.getElementById('gameOverImage').style.display = 'none';
  document.getElementById('finalScore').remove();

  positionX = 0;
  score = 0;
  updateScoreDisplay();
  hasClickedYes = false;
  currentSpeechBubble = Object.keys(speechBubbles)[0];
  yesButton.textContent = 'Ja';
  noButton.textContent = 'Nein';
  noButton2.textContent = '';
  noButton3.textContent = '';
  noButton4.textContent = '';
  yesButton.style.display = 'block';
  noButton.style.display = 'block';
  noButton2.style.display = 'block';
  noButton3.style.display = 'block';
  noButton4.style.display = 'block';
  speechBubble.textContent = 'Die Gefährten brauchen deine Hilfe um Sauron zu besiegen. Bist du bereit?';

  resetUsedKeys(); // Add this line to reset usedKeys array when the game is reset
  isGameRunning = false;
  moveSpeed = 3; // reset the moveSpeed to its initial value
  gameLoop();
}

let frameCounter = 0;
const framesPerSwitch = 15;

function gameLoop() {
  if (!isGameRunning) {
    isGameRunning = true;
  }

  positionX += moveSpeed;

  if (positionX > stopPositionX) {
    positionX = stopPositionX;
    document.querySelector('.speech-bubble').style.display = 'block';
    yesButton.style.display = 'block';
    noButton.style.display = 'block';
    noButton2.style.display = 'block';
    noButton3.style.display = 'block';
    noButton4.style.display = 'block';
  } else {
    // Increment the frame counter
    frameCounter++;

    // Switch the character image based on the frame counter
    if (frameCounter >= framesPerSwitch * 2) {
      frameCounter = 0;
    }

    if (selectedCharacter === 'F_char') {
      gameObject.style.backgroundImage = `url('Character_images/${frameCounter < framesPerSwitch ? 'F_char_a' : 'F_char_b'}.png')`;
    } else if (selectedCharacter === 'M_char') {
      gameObject.style.backgroundImage = `url('Character_images/${frameCounter < framesPerSwitch ? 'M_char_a' : 'M_char_b'}.png')`;
    }
  }

  gameObject.style.left = positionX + 'px';
  gameObject.style.bottom = '5%';
  requestAnimationFrame(gameLoop);
}

document.getElementById('replayButton').addEventListener('click', () => {
  resetGame();
});

