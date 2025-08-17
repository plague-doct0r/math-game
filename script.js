/*
 * Interactive logic for the math game.
 *
 * Children can choose their preferred arithmetic operation and answer
 * questions presented as colourful emoji groupings. Each correct answer
 * contributes to the player’s rank and eventually unlocks new animal
 * stages. A skip button is offered on particularly difficult questions
 * (“Extra Hard” or “Einstein”), allowing kids to avoid frustration and
 * keep the experience fun. The stage thresholds grow progressively
 * larger, making higher stages more challenging to reach.
 */

document.addEventListener('DOMContentLoaded', () => {
  /*
   * Define the list of base animals. The order of this array
   * corresponds roughly to a perceived increase in complexity or
   * intelligence, starting from simple creatures like worms and
   * snails up to intelligent mammals and sea creatures. Each base
   * animal will appear twice in the 100‑stage list—once with a
   * simpler adjective and again with a more prestigious one.
   */
  const animals = [
    'Worm', 'Snail', 'Caterpillar', 'Ant', 'Bee', 'Butterfly', 'Ladybug',
    'Dragonfly', 'Grasshopper', 'Frog', 'Fish', 'Turtle', 'Mouse', 'Rabbit',
    'Squirrel', 'Cat', 'Dog', 'Pig', 'Goat', 'Sheep', 'Cow', 'Horse',
    'Deer', 'Fox', 'Raccoon', 'Kangaroo', 'Leopard', 'Tiger', 'Lion',
    'Zebra', 'Giraffe', 'Rhino', 'Hippo', 'Panda', 'Elephant', 'Gorilla',
    'Orangutan', 'Baboon', 'Meerkat', 'Wolf', 'Bear', 'Eagle', 'Hawk',
    'Owl', 'Crow', 'Raven', 'Parrot', 'Octopus', 'Dolphin', 'Whale'
  ];

  // First set of adjectives for early stages: descriptive but modest.
  const adjectives1 = [
    'Tiny', 'Slow', 'Wiggly', 'Busy', 'Buzzing', 'Fluttering', 'Chirping',
    'Quacking', 'Happy', 'Leaping', 'Friendly', 'Curious', 'Cheerful',
    'Squeaky', 'Playful', 'Loyal', 'Sniffing', 'Bleating', 'Woolly',
    'Mooing', 'Trotting', 'Clever', 'Cunning', 'Graceful', 'Bounding',
    'Spotted', 'Roaring', 'Purring', 'Striped', 'Tall', 'Massive',
    'Chubby', 'Gentle', 'Strong', 'Swinging', 'Sneaky', 'Alert', 'Brave',
    'Bold', 'Soaring', 'Swift', 'Wise', 'Intelligent', 'Astute', 'Crafty',
    'Smart', 'Giant', 'Gigantic', 'Soft', 'Splendid'
  ];

  // Second set of adjectives for later stages: grand and impressive.
  const adjectives2 = [
    'Thoughtful', 'Brilliant', 'Genius', 'Mastermind', 'Legendary',
    'Mythical', 'Majestic', 'Spectacular', 'Incredible', 'Wondrous',
    'Amazing', 'Fantastic', 'Remarkable', 'Exceptional', 'Extraordinary',
    'Magnificent', 'Marvelous', 'Stupendous', 'Phenomenal', 'Astounding',
    'Astonishing', 'Impressive', 'Awesome', 'Outstanding', 'Supreme',
    'Ultimate', 'Dynamic', 'Fabulous', 'Superb', 'Terrific', 'Wonderful',
    'Radiant', 'Sparkling', 'Dazzling', 'Illustrious', 'Noble', 'Virtuous',
    'Honorable', 'Eminent', 'Prestigious', 'Renowned', 'Acclaimed',
    'Celebrated', 'Famous', 'Respected', 'Esteemed', 'Distinguished',
    'Visionary', 'Sage', 'Omniscient'
  ];

  // Generate 100 stage names by pairing each animal with a pair of adjectives.
  const stageNames = [];
  for (let i = 0; i < animals.length; i++) {
    stageNames[i] = `${adjectives1[i]} ${animals[i]}`;
    stageNames[i + animals.length] = `${adjectives2[i]} ${animals[i]}`;
  }
  // Explicitly set some iconic stages mentioned in the prompt.
  const owlIndex = animals.indexOf('Owl');
  if (owlIndex >= 0) {
    stageNames[owlIndex] = 'Wise Owl';
  }
  const elephantIndex = animals.indexOf('Elephant');
  if (elephantIndex >= 0) {
    stageNames[elephantIndex + animals.length] = 'Thoughtful Elephant';
  }

  // Difficulty categories as specified by the prompt.
  const difficultyCategories = [
    'Super Easy', 'Easy', 'Simple', 'Normal', 'Hard', 'Extra Hard', 'Einstein'
  ];

  // A selection of emoji used to visualise operands. The list includes
  // various animals and foods to keep the display fresh. Duplicates are
  // acceptable since emojis may repeat across sessions.
  const emojiList = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐤', '🦆', '🦅',
    '🦉', '🦇', '🐺', '🐗', '🐴', '🦓', '🦒', '🐢', '🐍', '🐊',
    '🐙', '🦑', '🦀', '🐠', '🐟', '🐬', '🐳', '🦈', '🦭', '🐋',
    '🐌', '🐛', '🦋', '🐞', '🐜', '🪲', '🐝', '🐞', '🦗', '🕷️',
    '🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🥕', '🍉', '🍊',
    '🍪', '🍩', '🍰', '🍦', '🍫', '🍬', '🍿', '🍔', '🍟', '🍕'
  ];

  /*
   * Stage progression. Each entry in stageDiff represents the
   * difference (in ranks) between two consecutive stages. The sequence
   * begins with the values supplied in the prompt and then grows
   * gradually. Larger stages require increasingly more ranks to reach.
   */
  const stageDiff = [3, 5, 10, 15, 22, 28];
  for (let i = stageDiff.length; i < 100; i++) {
    const prev = stageDiff[i - 1];
    // Increase the difference by a base of 6 plus a small term tied to the index
    const increment = 6 + Math.floor(i / 5);
    stageDiff[i] = prev + increment;
  }
  // Convert differences into cumulative thresholds.
  const stageThresholds = [];
  let cumulative = 0;
  for (let i = 0; i < stageDiff.length; i++) {
    cumulative += stageDiff[i];
    stageThresholds.push(cumulative);
  }

  // State variables. These track the chosen operation, number of correct answers,
  // the current rank points and stage, and the current question/difficulty.
  let selectedOperation = '+';
  let correctAnswersCount = 0;
  let rankPoints = 0;
  let stageIndex = 0;
  let currentQuestion = null;
  let currentCategory = null;

  /**
   * Helper to set a cookie with an expiry. Cookies are used alongside
   * localStorage so that progress persists even if localStorage is
   * unavailable. The value is URI‑encoded to handle special characters.
   * @param {string} name Name of the cookie
   * @param {string} value Value to store
   * @param {number} days Number of days before the cookie expires
   */
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }

  /**
   * Retrieve a cookie value by name. If the cookie is not found, returns
   * an empty string. Decodes URI‑encoded values.
   * @param {string} name Name of the cookie
   * @returns {string} The cookie value or an empty string
   */
  function getCookie(name) {
    const cname = name + '=';
    const decoded = decodeURIComponent(document.cookie);
    const parts = decoded.split(';');
    for (let i = 0; i < parts.length; i++) {
      let c = parts[i].trim();
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return '';
  }

  /**
   * Load persisted progress from localStorage or cookies. If available,
   * restore the correct answer count and last selected operation so
   * progress persists across sessions. Use parseInt to convert stored
   * values back to numbers.
   */
  function loadProgress() {
    // Prefer localStorage if available; fall back to cookies
    let savedCount = localStorage.getItem('correctAnswers');
    if (savedCount === null || savedCount === undefined) {
      savedCount = getCookie('correctAnswers');
    }
    const countNum = parseInt(savedCount || '0', 10);
    if (!isNaN(countNum) && countNum > 0) {
      correctAnswersCount = countNum;
    }
    let savedOp = localStorage.getItem('selectedOperation');
    if (!savedOp) {
      savedOp = getCookie('selectedOperation');
    }
    if (savedOp) {
      selectedOperation = savedOp;
    }
  }

  /**
   * Save progress to both localStorage and cookies so that the device
   * remembers the player’s progress and preferred operation. This
   * function should be called whenever the correct answer count or
   * selected operation changes.
   */
  function saveProgress() {
    const countStr = correctAnswersCount.toString();
    // Save to localStorage
    try {
      localStorage.setItem('correctAnswers', countStr);
      localStorage.setItem('selectedOperation', selectedOperation);
    } catch (err) {
      // Ignore errors from private browsing modes
    }
    // Persist as cookies for long‑term retention
    setCookie('correctAnswers', countStr, 365);
    setCookie('selectedOperation', selectedOperation, 365);
  }

  // Cache DOM elements for efficiency.
  const stageInfoEl = document.getElementById('stageInfo');
  const rankProgressBar = document.getElementById('rankProgressBar');
  const rankProgressText = document.getElementById('rankProgressText');
  const stageProgressBar = document.getElementById('stageProgressBar');
  const stageProgressText = document.getElementById('stageProgressText');
  const emojiBox1 = document.getElementById('emojiBox1');
  const numberLabel1 = document.getElementById('numberLabel1');
  const emojiBox2 = document.getElementById('emojiBox2');
  const numberLabel2 = document.getElementById('numberLabel2');
  const operatorSignEl = document.getElementById('operatorSign');
  const answerInput = document.getElementById('answerInput');
  const submitButton = document.getElementById('submitButton');
  const skipButton = document.getElementById('skipButton');
  const difficultyLabelEl = document.getElementById('difficultyLabel');

  // Additional DOM references for enhancements
  const rankEmojiContainer = document.getElementById('rankEmojiContainer');
  const confettiContainer = document.getElementById('confettiContainer');
  const questionContainer = document.getElementById('questionContainer');

  // Preload royalty‑free audio files for correct and wrong answers and background music.
  // These audio clips come from Mixkit’s free sound effects library and are
  // distributed under a royalty‑free licence. The preview MP3s are small and
  // appropriate for quick playback in a browser. If these URLs ever change,
  // simply update the paths below.
  const correctAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
  const wrongAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/948/948-preview.mp3');
  const backgroundAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/667/667-preview.mp3');
  backgroundAudio.loop = true;

  // Kick off background music upon the user's first interaction with the page.
  document.body.addEventListener('click', () => {
    // Reset playback in case it has played before and ended
    backgroundAudio.currentTime = 0;
    backgroundAudio.play().catch(() => {
      /* Ignored – browsers may block autoplay without user interaction */
    });
  }, { once: true });

  /**
   * Determine how many points to award for a given difficulty category.
   * Harder questions yield more points, helping kids progress faster when
   * tackling challenging problems. Easy levels return just one point.
   * @param {string} category Difficulty label (e.g. 'Super Easy', 'Hard')
   * @returns {number} Points to add to the rank counter
   */
  function getPointsForDifficulty(category) {
    switch (category) {
      case 'Super Easy':
      case 'Easy':
      case 'Simple':
        return 1;
      case 'Normal':
        return 2;
      case 'Hard':
        return 3;
      case 'Extra Hard':
      case 'Einstein':
        return 4;
      default:
        return 1;
    }
  }

  /**
   * Spawn a burst of confetti particles that fall from the top of the screen.
   * Confetti pieces have random colours, sizes and durations.
   */
  function triggerConfetti() {
    if (!confettiContainer) return;
    const count = 20;
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      const size = 6 + Math.random() * 10;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.left = `${Math.random() * 100}%`;
      const hue = Math.floor(Math.random() * 360);
      confetti.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
      const duration = 1.5 + Math.random();
      confetti.style.animationDuration = `${duration}s`;
      confettiContainer.appendChild(confetti);
      setTimeout(() => confetti.remove(), duration * 1000);
    }
  }

  /**
   * Update the row of star emojis indicating rank progress within a stage.
   * The bar scales to at most 10 characters regardless of the actual
   * difference between stages. Filled stars represent completed ranks
   * within the current stage, while empty stars show remaining ranks.
   * @param {number} ranksIntoStage Ranks already completed in current stage
   * @param {number} ranksNeeded Total ranks required to advance to next stage
   */
  function updateRankEmojis(ranksIntoStage, ranksNeeded) {
    if (!rankEmojiContainer) return;
    const totalSlots = Math.min(ranksNeeded, 10);
    // Prevent division by zero
    const filled = ranksNeeded > 0 ? Math.min(totalSlots, Math.round((ranksIntoStage / ranksNeeded) * totalSlots)) : totalSlots;
    const unfilled = totalSlots - filled;
    rankEmojiContainer.textContent = '⭐'.repeat(filled) + '☆'.repeat(unfilled);
  }

  /**
   * Choose a random emoji from the list. Optionally avoid selecting the same
   * emoji twice for two operands in the same question.
   * @param {string|null} exclude An emoji to exclude from the selection.
   * @returns {string} A random emoji.
   */
  function randomEmoji(exclude) {
    let emoji;
    do {
      emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    } while (emoji === exclude);
    return emoji;
  }

  /**
   * Generate operands based on the currently selected operation. The ranges
   * are designed to be appropriate for children aged 6–8. Division
   * questions always produce integer results.
   * @returns {[number, number]} A tuple containing (a, b) where the result of a op b is the answer.
   */
  function generateOperands() {
    let a, b;
    switch (selectedOperation) {
      case '+':
        a = Math.floor(Math.random() * 31); // 0–30
        b = Math.floor(Math.random() * 31);
        break;
      case '-':
        a = Math.floor(Math.random() * 31);
        b = Math.floor(Math.random() * 31);
        if (b > a) {
          // Swap to avoid negative results
          [a, b] = [b, a];
        }
        break;
      case '×':
        a = Math.floor(Math.random() * 11); // 0–10
        b = Math.floor(Math.random() * 11);
        break;
      case '÷':
        // Create a division question with an integer result.
        const divisor = Math.floor(Math.random() * 10) + 1; // 1–10
        const quotient = Math.floor(Math.random() * 10) + 1; // 1–10
        b = divisor;
        a = divisor * quotient;
        break;
      default:
        a = Math.floor(Math.random() * 31);
        b = Math.floor(Math.random() * 31);
    }
    return [a, b];
  }

  /**
   * Determine the difficulty category for a given question. The category
   * boundaries are chosen so that most questions remain accessible while
   * still allowing for a few tougher “Extra Hard” or “Einstein” problems.
   * @param {number} a The first operand.
   * @param {number} b The second operand.
   * @param {string} op The operation symbol.
   * @returns {string} A difficulty label from the difficultyCategories array.
   */
  function getDifficultyCategory(a, b, op) {
    let value;
    if (op === '+') {
      value = a + b;
      // classify by the larger operand rather than the sum to avoid huge ranges
      const maxOperand = Math.max(a, b);
      if (maxOperand <= 5) return difficultyCategories[0];
      if (maxOperand <= 8) return difficultyCategories[1];
      if (maxOperand <= 12) return difficultyCategories[2];
      if (maxOperand <= 16) return difficultyCategories[3];
      if (maxOperand <= 20) return difficultyCategories[4];
      if (maxOperand <= 25) return difficultyCategories[5];
      return difficultyCategories[6];
    } else if (op === '-') {
      value = a - b;
      if (value <= 5) return difficultyCategories[0];
      if (value <= 8) return difficultyCategories[1];
      if (value <= 12) return difficultyCategories[2];
      if (value <= 16) return difficultyCategories[3];
      if (value <= 20) return difficultyCategories[4];
      if (value <= 25) return difficultyCategories[5];
      return difficultyCategories[6];
    } else if (op === '×') {
      value = a * b;
      if (value <= 10) return difficultyCategories[0];
      if (value <= 20) return difficultyCategories[1];
      if (value <= 30) return difficultyCategories[2];
      if (value <= 40) return difficultyCategories[3];
      if (value <= 50) return difficultyCategories[4];
      if (value <= 60) return difficultyCategories[5];
      return difficultyCategories[6];
    } else if (op === '÷') {
      // For division, classify by the divisor: small divisors are easier.
      if (b <= 2) return difficultyCategories[0];
      if (b <= 3) return difficultyCategories[1];
      if (b <= 4) return difficultyCategories[2];
      if (b <= 5) return difficultyCategories[3];
      if (b <= 6) return difficultyCategories[4];
      if (b <= 7) return difficultyCategories[5];
      return difficultyCategories[6];
    }
    return difficultyCategories[0];
  }

  /**
   * Update the UI elements that reflect the user’s current rank and stage.
   */
  function updateStageAndRanks() {
    rankPoints = Math.floor(correctAnswersCount / 10);
    // Determine which stage the user is on based on rankPoints
    stageIndex = 0;
    for (let i = 0; i < stageThresholds.length; i++) {
      if (rankPoints >= stageThresholds[i]) {
        stageIndex = i + 1;
      } else {
        break;
      }
    }
    // Bound stageIndex to the number of available stage names
    if (stageIndex >= stageNames.length) {
      stageIndex = stageNames.length - 1;
    }
    // Update stage label
    stageInfoEl.textContent = `Stage ${stageIndex + 1}: ${stageNames[stageIndex]}`;
    // Update rank progress bar (out of 10 questions per rank)
    const progressRank = correctAnswersCount % 10;
    rankProgressBar.style.width = `${(progressRank / 10) * 100}%`;
    rankProgressText.textContent = `${progressRank} / 10`;
    // Update stage progress bar (ranks within the current stage)
    let ranksBefore = stageIndex === 0 ? 0 : stageThresholds[stageIndex - 1];
    let ranksNeeded;
    if (stageIndex < stageThresholds.length) {
      ranksNeeded = stageThresholds[stageIndex] - ranksBefore;
    } else {
      // If user is beyond defined thresholds, set needed equal to previous difference
      ranksNeeded = stageDiff[stageDiff.length - 1];
    }
    const ranksIntoStage = rankPoints - ranksBefore;
    const stageProgressRatio = ranksNeeded > 0 ? Math.min(ranksIntoStage / ranksNeeded, 1) : 1;
    stageProgressBar.style.width = `${stageProgressRatio * 100}%`;
    stageProgressText.textContent = `${ranksIntoStage} / ${ranksNeeded}`;

    // Update the star indicators for ranks within the current stage
    updateRankEmojis(ranksIntoStage, ranksNeeded);
  }

  /**
   * Render a new question on the page. This selects random operands,
   * determines the difficulty and sets up the emoji boxes and numbers.
   */
  function generateQuestion() {
    const [a, b] = generateOperands();
    const op = selectedOperation;
    currentQuestion = { a, b, op };
    currentCategory = getDifficultyCategory(a, b, op);
    // Populate emoji boxes
    const emoji1 = randomEmoji(null);
    const emoji2 = randomEmoji(emoji1);
    // Clear previous emojis
    emojiBox1.innerHTML = '';
    for (let i = 0; i < a; i++) {
      const span = document.createElement('span');
      span.textContent = emoji1;
      emojiBox1.appendChild(span);
    }
    numberLabel1.textContent = a;
    emojiBox2.innerHTML = '';
    for (let i = 0; i < b; i++) {
      const span = document.createElement('span');
      span.textContent = emoji2;
      emojiBox2.appendChild(span);
    }
    numberLabel2.textContent = b;
    operatorSignEl.textContent = op;
    // Reset difficulty message
    difficultyLabelEl.textContent = '';
    difficultyLabelEl.style.color = '#333';
    // Show skip button on extra hard or Einstein questions
    if (currentCategory === 'Extra Hard' || currentCategory === 'Einstein') {
      skipButton.style.display = 'inline-block';
    } else {
      skipButton.style.display = 'none';
    }
    // Reset answer input
    answerInput.value = '';
    answerInput.focus();
  }

  /**
   * Compute the correct answer for the current question.
   * @param {number} a
   * @param {number} b
   * @param {string} op
   * @returns {number}
   */
  function evaluateAnswer(a, b, op) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return a / b;
      default:
        return a + b;
    }
  }

  /**
   * Handle answer submission. If the answer is correct the user’s
   * progress is incremented and a new question is generated. Incorrect
   * answers prompt the player to try again without moving on.
   */
  function handleSubmit() {
    const userValue = parseFloat(answerInput.value);
    if (isNaN(userValue)) {
      return;
    }
    const { a, b, op } = currentQuestion;
    const correctVal = evaluateAnswer(a, b, op);
    // Use a tolerance for floating point comparisons (for division)
    if (Math.abs(userValue - correctVal) < 0.0001) {
      // Correct answer: award points based on difficulty and celebrate
      const points = getPointsForDifficulty(currentCategory);
      correctAnswersCount += points;
      difficultyLabelEl.textContent = `Correct! That was ${currentCategory}.`;
      difficultyLabelEl.style.color = '#28a745';
      // Reset audio to the start and play the correct answer sound
      try {
        correctAudio.currentTime = 0;
        correctAudio.play();
      } catch (e) {
        /* Some browsers may prevent playback if not triggered by user */
      }
      triggerConfetti();
      // Add a temporary animation class to the question container
      if (questionContainer) {
        questionContainer.classList.add('correct');
        setTimeout(() => {
          questionContainer.classList.remove('correct');
        }, 600);
      }
      // Persist progress after a correct answer
      saveProgress();
      updateStageAndRanks();
      generateQuestion();
    } else {
      // Wrong answer: prompt to try again
      difficultyLabelEl.textContent = 'Oops! Try again.';
      difficultyLabelEl.style.color = '#c0392b';
      try {
        wrongAudio.currentTime = 0;
        wrongAudio.play();
      } catch (e) {
        /* ignore playback errors */
      }
    }
  }

  // Event listeners for submit button and Enter key.
  submitButton.addEventListener('click', handleSubmit);
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  // Skip button simply regenerates a new question without updating progress.
  skipButton.addEventListener('click', () => {
    generateQuestion();
  });

  /**
   * Update the visual state of the operation selection buttons.
   */
  function updateOperationButtons() {
    const buttons = document.querySelectorAll('.operationButton');
    buttons.forEach((btn) => {
      if (btn.getAttribute('data-operation') === selectedOperation) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Assign click handlers to operation buttons.
  document.querySelectorAll('.operationButton').forEach((btn) => {
    btn.addEventListener('click', function () {
      selectedOperation = this.getAttribute('data-operation');
      updateOperationButtons();
      // Save selected operation so the choice persists across sessions
      saveProgress();
      generateQuestion();
    });
  });

  // Initialise the interface. Load any saved progress from the browser and
  // apply it before rendering the first question. This restores the
  // correct answer count and last chosen operation for continuity across sessions.
  loadProgress();
  updateOperationButtons();
  updateStageAndRanks();
  generateQuestion();
});