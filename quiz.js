// ===== PERFECT QUIZ GAME LOGIC =====

document.addEventListener('DOMContentLoaded', function() {
    // Game State
    const gameState = {
        currentLevel: 1,
        currentQuestion: 0,
        score: 0,
        correctAnswers: 0,
        totalTime: 0,
        timer: 30,
        selectedOption: null,
        isAnswerSubmitted: false,
        wrongAttempts: 0,
        hintsUsed: 0,
        isSoundOn: true
    };

    // Questions Database
    const questions = [{
            question: "5 + 0 = ?",
            options: ["0", "5", "6", "4"],
            correct: 1,
            visual: "5️⃣ + 0️⃣ = ?",
            hint: "Remember! Adding zero to any number gives the same number!"
        },
        {
            question: "Which number comes between 6 and 8?",
            options: ["5", "7", "9", "8"],
            correct: 1,
            visual: "6️⃣ ❓ 8️⃣",
            hint: "Count from 6 to 8: 6... 7... 8!"
        },
        {
            question: "10 - 10 = ?",
            options: ["10", "1", "0", "5"],
            correct: 2,
            visual: "🔟 - 🔟 = ?",
            hint: "If you have 10 candies and eat all 10, how many are left?"
        },
        {
            question: "Which is an odd number?",
            options: ["2", "4", "6", "5"],
            correct: 3,
            visual: "Odd Number? 🤔",
            hint: "Odd numbers are like 1, 3, 5, 7... They can't be divided equally!"
        },
        {
            question: "Count the apples: 🍎🍎🍎🍎🍎",
            options: ["4", "5", "6", "3"],
            correct: 1,
            visual: "🍎🍎🍎🍎🍎",
            hint: "Let's count together: 1, 2, 3, 4, 5!"
        },
        {
            question: "Which number is BIGGER?",
            options: ["9", "3", "1", "0"],
            correct: 0,
            visual: "Biggest Number? 🎈",
            hint: "9 is bigger than 3, 1, and 0!"
        },
        {
            question: "What comes BEFORE 10?",
            options: ["8", "9", "11", "7"],
            correct: 1,
            visual: "? → 🔟",
            hint: "Count backwards from 10: 10, 9, 8..."
        },
        {
            question: "2 + 3 = ?",
            options: ["6", "4", "5", "3"],
            correct: 2,
            visual: "2️⃣ + 3️⃣ = ?",
            hint: "You can use your fingers: 2 fingers + 3 fingers = ? fingers!"
        },
        {
            question: "Which number is smallest?",
            options: ["4", "2", "5", "3"],
            correct: 1,
            visual: "Smallest Number? 📏",
            hint: "2 is smaller than 3, 4, and 5!"
        },
        {
            question: "How many legs does a dog have?",
            options: ["2", "3", "4", "5"],
            correct: 2,
            visual: "🐕 = ? Legs",
            hint: "Most animals like dogs and cats have 4 legs!"
        }
    ];

    // DOM Elements
    const elements = {
        // Screens
        welcomeScreen: document.getElementById('welcomeScreen'),
        gameScreen: document.getElementById('gameScreen'),
        resultScreen: document.getElementById('resultScreen'),

        // Welcome Screen
        countdownNumber: document.getElementById('countdownNumber'),
        countdownText: document.getElementById('countdownText'),

        // Game Screen
        currentLevel: document.getElementById('currentLevel'),
        currentScore: document.getElementById('currentScore'),
        progressDots: document.getElementById('progressDots'),
        timerValue: document.getElementById('timerValue'),
        timerProgress: document.querySelector('.timer-progress'),
        questionNumber: document.getElementById('questionNumber'),
        questionText: document.getElementById('questionText'),
        questionVisual: document.getElementById('questionVisual'),
        optionsGrid: document.getElementById('optionsGrid'),
        characterFeedback: document.getElementById('characterFeedback'),
        floatingSpeech: document.getElementById('floatingSpeech'),
        skipBtn: document.getElementById('skipBtn'),
        submitBtn: document.getElementById('submitBtn'),
        soundToggle: document.getElementById('soundToggle'),
        volumeSlider: document.getElementById('volumeSlider'),

        // Result Screen
        correctAnswers: document.getElementById('correctAnswers'),
        totalTime: document.getElementById('totalTime'),
        finalScore: document.getElementById('finalScore'),
        meterFill: document.getElementById('meterFill'),
        meterText: document.getElementById('meterText'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        homeBtn: document.getElementById('homeBtn')
    };

    // Audio Elements
    const audio = {
        bgMusic: document.getElementById('bgMusic'),
        correctSound: document.getElementById('correctSound'),
        wrongSound: document.getElementById('wrongSound'),
        hintSound: document.getElementById('hintSound'),
        levelUpSound: document.getElementById('levelUpSound')
    };

    // Game Variables
    let timerInterval;
    let countdownInterval;

    // Initialize Game
    function initGame() {
        setupEventListeners();
        startWelcomeCountdown();
        setupAudio();
    }

    // Start Welcome Countdown
    function startWelcomeCountdown() {
        let count = 3;
        updateCountdown(count);

        countdownInterval = setInterval(() => {
            count--;
            updateCountdown(count);

            if (count === 0) {
                clearInterval(countdownInterval);
                startGame();
            }
        }, 1000);
    }

    // Update Countdown Display
    function updateCountdown(count) {
        elements.countdownNumber.textContent = count;
        elements.countdownText.textContent = count;

        // Animation
        elements.countdownNumber.parentElement.style.animation = 'none';
        setTimeout(() => {
            elements.countdownNumber.parentElement.style.animation = 'pulse 1s infinite';
        }, 10);
    }

    // Start Game
    function startGame() {
        // Switch screens
        elements.welcomeScreen.style.display = 'none';
        elements.gameScreen.style.display = 'block';

        // Initialize game state
        resetGame();

        // Start background music
        if (gameState.isSoundOn) {
            audio.bgMusic.volume = elements.volumeSlider.value / 100;
            audio.bgMusic.play().catch(e => {
                console.log("Background music requires user interaction");
            });
        }

        // Speak welcome message
        speak("Welcome to Math Adventure! Let's start with the first question!");

        // Load first question
        setTimeout(() => {
            loadQuestion();
            startTimer();
        }, 1000);
    }

    // Reset Game
    function resetGame() {
        gameState.currentQuestion = 0;
        gameState.score = 0;
        gameState.correctAnswers = 0;
        gameState.totalTime = 0;
        gameState.wrongAttempts = 0;
        gameState.hintsUsed = 0;

        updateScore();
        updateLevel();
        updateProgressDots();
    }

    // Load Question
    function loadQuestion() {
        if (gameState.currentQuestion >= questions.length) {
            showResults();
            return;
        }

        const question = questions[gameState.currentQuestion];

        // Reset state
        gameState.selectedOption = null;
        gameState.isAnswerSubmitted = false;
        gameState.wrongAttempts = 0;
        gameState.timer = 30;

        // Update UI
        elements.questionNumber.textContent = gameState.currentQuestion + 1;
        elements.questionText.textContent = question.question;

        // Update question visual
        elements.questionVisual.innerHTML = '';
        if (question.visual) {
            const visualItems = question.visual.split(' ');
            visualItems.forEach((item, index) => {
                const visualElement = document.createElement('div');
                visualElement.className = 'visual-item';
                visualElement.textContent = item;
                visualElement.style.setProperty('--i', index);
                elements.questionVisual.appendChild(visualElement);
            });
        }

        // Update question number
        elements.questionNumber.textContent = gameState.currentQuestion + 1;

        // Load options
        loadOptions(question);

        // Update submit button
        elements.submitBtn.disabled = true;

        // Update progress dots
        updateCurrentProgressDot();

        // Auto hint after 15 seconds
        setTimeout(() => {
            if (!gameState.isAnswerSubmitted && gameState.selectedOption === null) {
                giveHint();
            }
        }, 15000);

        // Speak question after 1 second
        setTimeout(() => {
            speak(`Question ${gameState.currentQuestion + 1}: ${question.question}`);
        }, 1000);
    }

    // Load Options
    function loadOptions(question) {
        elements.optionsGrid.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        question.options.forEach((option, index) => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.style.animationDelay = `${index * 0.1}s`;
            optionCard.dataset.index = index;

            optionCard.innerHTML = `
                <div class="option-letter">${letters[index]}</div>
                <div class="option-text">${option}</div>
            `;

            optionCard.addEventListener('click', () => selectOption(optionCard, index));
            elements.optionsGrid.appendChild(optionCard);
        });
    }

    // Select Option
    function selectOption(optionCard, index) {
        if (gameState.isAnswerSubmitted) return;

        // Remove selection from all options
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Select clicked option
        optionCard.classList.add('selected');
        gameState.selectedOption = index;
        elements.submitBtn.disabled = false;

        // Add selection animation
        optionCard.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            optionCard.style.animation = '';
        }, 500);
    }

    // Submit Answer
    elements.submitBtn.addEventListener('click', submitAnswer);

    function submitAnswer() {
        if (gameState.selectedOption === null || gameState.isAnswerSubmitted) return;

        gameState.isAnswerSubmitted = true;
        clearInterval(timerInterval);

        const question = questions[gameState.currentQuestion];
        const isCorrect = gameState.selectedOption === question.correct;

        // Mark correct/incorrect options
        document.querySelectorAll('.option-card').forEach((card, index) => {
            if (index === question.correct) {
                card.classList.add('correct');
            } else if (index === gameState.selectedOption && !isCorrect) {
                card.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }
    }

    // Handle Correct Answer
    function handleCorrectAnswer() {
        // Update score
        gameState.correctAnswers++;
        let pointsEarned = 10;

        // Time bonus
        if (gameState.timer > 20) pointsEarned += 5;
        else if (gameState.timer > 10) pointsEarned += 3;

        // No wrong attempts bonus
        if (gameState.wrongAttempts === 0) pointsEarned += 5;

        gameState.score += pointsEarned;

        // Play sound
        if (gameState.isSoundOn) {
            audio.correctSound.currentTime = 0;
            audio.correctSound.play();
        }

        // Update UI
        updateScore();
        updateProgressDotStatus(true);

        // Speak encouragement
        const messages = [
            "Excellent! You got it right! 🎉",
            "Perfect answer! You're so smart! 🧠",
            "Wow! That's correct! ⭐",
            "Amazing! You're a math genius! 🌟"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        speak(message);

        // Update feedback
        updateFeedback(message);

        // Move to next question after delay
        setTimeout(() => {
            gameState.currentQuestion++;
            loadQuestion();
            startTimer();
        }, 2000);
    }

    // Handle Wrong Answer
    function handleWrongAnswer() {
        gameState.wrongAttempts++;

        // Play sound
        if (gameState.isSoundOn) {
            audio.wrongSound.currentTime = 0;
            audio.wrongSound.play();
        }

        // Update feedback
        updateFeedback("Let's try the next one! 💪");

        // If this is the second wrong attempt, show correct answer and move on
        if (gameState.wrongAttempts >= 2) {
            showCorrectAnswer();
            setTimeout(() => {
                gameState.currentQuestion++;
                loadQuestion();
                startTimer();
            }, 2000);
        } else {
            // Allow retry after 1 second
            speak("Not quite right. Try again!");
            setTimeout(() => {
                document.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('incorrect');
                    card.classList.remove('selected');
                });
                gameState.selectedOption = null;
                gameState.isAnswerSubmitted = false;
                elements.submitBtn.disabled = true;
                startTimer();
            }, 1000);
        }
    }

    // Show Correct Answer
    function showCorrectAnswer() {
        const question = questions[gameState.currentQuestion];

        // Mark correct option
        document.querySelectorAll('.option-card').forEach((card, index) => {
            if (index === question.correct) {
                card.classList.add('correct');
            }
        });

        // Update progress dot
        updateProgressDotStatus(false);

        // Speak correct answer
        speak(`The correct answer was ${question.options[question.correct]}. ${question.hint}`);
    }

    // Give Hint
    function giveHint() {
        if (gameState.isAnswerSubmitted || gameState.hintsUsed >= 3) return;

        const question = questions[gameState.currentQuestion];
        gameState.hintsUsed++;

        // Update hint bubbles
        updateHintBubbles();

        // Play hint sound
        if (gameState.isSoundOn) {
            audio.hintSound.currentTime = 0;
            audio.hintSound.play();
        }

        // Speak hint
        speak(question.hint);
        updateFeedback(question.hint);
    }

    // Skip Question
    elements.skipBtn.addEventListener('click', function() {
        if (gameState.isAnswerSubmitted) return;

        gameState.score = Math.max(0, gameState.score - 5);
        updateScore();

        speak("Skipping to next question!");

        gameState.currentQuestion++;
        loadQuestion();
        startTimer();
    });

    // Start Timer
    function startTimer() {
        clearInterval(timerInterval);
        gameState.timer = 30;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            gameState.timer--;
            updateTimerDisplay();

            if (gameState.timer <= 10) {
                elements.timerValue.style.color = 'var(--danger)';
            }

            if (gameState.timer <= 0) {
                clearInterval(timerInterval);
                timeUp();
            }
        }, 1000);
    }

    // Update Timer Display
    function updateTimerDisplay() {
        elements.timerValue.textContent = gameState.timer;

        // Update progress circle
        const progress = (gameState.timer / 30) * 100;
        elements.timerProgress.style.background =
            `conic-gradient(var(--primary) ${progress}%, #FFE5E5 ${progress}%)`;
    }

    // Time Up
    function timeUp() {
        if (!gameState.isAnswerSubmitted) {
            showCorrectAnswer();
            speak("Time's up! Let's see the correct answer!");

            setTimeout(() => {
                gameState.currentQuestion++;
                loadQuestion();
                startTimer();
            }, 2000);
        }
    }

    // Show Results
    function showResults() {
        clearInterval(timerInterval);

        // Switch to result screen
        elements.gameScreen.style.display = 'none';
        elements.resultScreen.style.display = 'flex';

        // Calculate results
        const accuracy = (gameState.correctAnswers / questions.length) * 100;
        const performancePercent = Math.min(accuracy + (gameState.score / 20), 100);

        // Update result display
        elements.correctAnswers.textContent = `${gameState.correctAnswers}/${questions.length}`;
        elements.totalTime.textContent = `${(questions.length * 30) - gameState.totalTime}s`;
        elements.finalScore.textContent = gameState.score;

        // Update performance meter
        setTimeout(() => {
            elements.meterFill.style.width = `${performancePercent}%`;
        }, 500);

        // Set performance text
        let performanceText = "";
        if (accuracy === 100) {
            performanceText = "Perfect Score! You're a Math Superhero! 🦸‍♂️";
        } else if (accuracy >= 80) {
            performanceText = "Excellent Work! You're Amazing! 🌟";
        } else if (accuracy >= 60) {
            performanceText = "Good Job! Keep Practicing! 🎯";
        } else {
            performanceText = "Great Start! Try Again! 💪";
        }
        elements.meterText.textContent = performanceText;

        // Play celebration sound
        if (gameState.isSoundOn) {
            audio.levelUpSound.currentTime = 0;
            audio.levelUpSound.play();
        }

        // Speak results
        setTimeout(() => {
            speak(`Quiz complete! You got ${gameState.correctAnswers} out of ${questions.length} correct! ${performanceText}`);
        }, 1000);
    }

    // Speech Synthesis
    function speak(text) {
        if (!gameState.isSoundOn) return;

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();

            const speech = new SpeechSynthesisUtterance(text);
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1.5; // Child-friendly pitch
            speech.lang = 'en-US';

            // Try to find a child-friendly voice
            const voices = speechSynthesis.getVoices();
            const childVoice = voices.find(voice =>
                voice.name.includes('Google UK English Female') ||
                voice.name.includes('Microsoft Zira')
            );

            if (childVoice) {
                speech.voice = childVoice;
            }

            // Update floating character speech
            elements.floatingSpeech.textContent = text.substring(0, 50) + (text.length > 50 ? "..." : "");

            speechSynthesis.speak(speech);
        }
    }

    // Update Functions
    function updateScore() {
        elements.currentScore.textContent = gameState.score;
    }

    function updateLevel() {
        elements.currentLevel.textContent = gameState.currentLevel;
    }

    function updateProgressDots() {
        elements.progressDots.innerHTML = '';

        for (let i = 0; i < questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) dot.classList.add('active');
            elements.progressDots.appendChild(dot);
        }
    }

    function updateCurrentProgressDot() {
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === gameState.currentQuestion) {
                dot.classList.add('active');
            }
        });
    }

    function updateProgressDotStatus(isCorrect) {
        const dots = document.querySelectorAll('.progress-dot');
        if (gameState.currentQuestion < dots.length) {
            dots[gameState.currentQuestion].classList.remove('active');
            dots[gameState.currentQuestion].classList.add(isCorrect ? 'completed' : 'incorrect');
        }
    }

    function updateHintBubbles() {
        const bubbles = document.querySelectorAll('.hint-bubble');
        bubbles.forEach((bubble, index) => {
            if (index < gameState.hintsUsed) {
                bubble.classList.add('used');
                bubble.classList.remove('active');
            } else if (index === gameState.hintsUsed) {
                bubble.classList.add('active');
            } else {
                bubble.classList.remove('active', 'used');
            }
        });
    }

    function updateFeedback(text) {
        const feedback = elements.characterFeedback.querySelector('p');
        feedback.textContent = text;
    }

    // Audio Setup
    function setupAudio() {
        // Sound toggle
        elements.soundToggle.addEventListener('click', function() {
            gameState.isSoundOn = !gameState.isSoundOn;

            if (gameState.isSoundOn) {
                this.innerHTML = '<i class="fas fa-volume-up"></i>';
                audio.bgMusic.play();
            } else {
                this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audio.bgMusic.pause();
                speechSynthesis.cancel();
            }
        });

        // Volume slider
        elements.volumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            audio.bgMusic.volume = volume;
            audio.correctSound.volume = volume;
            audio.wrongSound.volume = volume;
            audio.hintSound.volume = volume;
        });
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Play Again button
        elements.playAgainBtn.addEventListener('click', function() {
            elements.resultScreen.style.display = 'none';
            elements.welcomeScreen.style.display = 'flex';
            startWelcomeCountdown();
        });

        // Home button
        elements.homeBtn.addEventListener('click', function() {
            window.location.href = 'KYNAPSE.HTML';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            if (elements.gameScreen.style.display === 'block') {
                switch (event.key) {
                    case '1':
                    case 'a':
                        selectOptionByIndex(0);
                        break;
                    case '2':
                    case 'b':
                        selectOptionByIndex(1);
                        break;
                    case '3':
                    case 'c':
                        selectOptionByIndex(2);
                        break;
                    case '4':
                    case 'd':
                        selectOptionByIndex(3);
                        break;
                    case 'Enter':
                        if (gameState.selectedOption !== null) {
                            submitAnswer();
                        }
                        break;
                    case ' ':
                        event.preventDefault();
                        if (gameState.selectedOption === null) {
                            selectOptionByIndex(0);
                        }
                        break;
                }
            }
        });
    }

    // Helper function to select option by index
    function selectOptionByIndex(index) {
        const optionCard = document.querySelector(`.option-card[data-index="${index}"]`);
        if (optionCard && !gameState.isAnswerSubmitted) {
            selectOption(optionCard, index);
        }
    }

    // Initialize the game
    initGame();

    // Ensure voices are loaded
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = function() {
            console.log("Voices loaded!");
        };
    }
});