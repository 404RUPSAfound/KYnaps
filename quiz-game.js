// ===== QUIZ GAME LOGIC - FIXED VERSION =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Quiz Game: DOM loaded, initializing...");

    // Global variables to store game state
    let gameState = null;
    let questions = [];
    let elements = {};
    let audioElements = {};
    let timerInterval = null;
    let autoSubmitTimeout = null;
    let hintTimeout = null;

    // Initialize the game
    initGame();

    // ===== MAIN INITIALIZATION FUNCTION =====
    function initGame() {
        console.log("Initializing game...");

        try {
            // 1. Get quiz configuration
            const quizConfig = getQuizConfig();
            console.log("Quiz config:", quizConfig);

            // 2. Initialize game state
            gameState = {
                config: quizConfig,
                currentQuestion: 0,
                score: 0,
                correctAnswers: 0,
                timer: 30,
                selectedOption: null,
                isAnswerSubmitted: false,
                wrongAttempts: 0,
                hintsUsed: 0,
                totalTime: 0,
                triesLeft: 3,
                isSoundOn: true
            };

            // 3. Load questions
            questions = getCurrentQuestions(quizConfig);
            console.log(`Loaded ${questions.length} questions`);

            // 4. Get DOM elements
            elements = getElements();

            // 5. Get audio elements
            audioElements = getAudioElements();

            // 6. Update display
            updateDisplay();

            // 7. Setup event listeners
            setupEventListeners();

            // 8. Setup audio
            setupAudio();

            // 9. Start the game
            loadQuestion();
            startTimer();

            // 10. Welcome message
            setTimeout(() => {
                speak(`Welcome to Class ${quizConfig.class}, Level ${quizConfig.level}! Let's begin!`);
            }, 1000);

            console.log("Game initialized successfully!");

        } catch (error) {
            console.error("Error initializing game:", error);
            alert("Error loading game. Please try again.");
        }
    }

    // ===== HELPER FUNCTIONS =====

    // Get quiz configuration from URL or localStorage
    function getQuizConfig() {
        try {
            // Get from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const urlClass = urlParams.get('class');
            const urlSubject = urlParams.get('subject');
            const urlLevel = urlParams.get('level');

            if (urlClass && urlSubject && urlLevel) {
                return {
                    class: urlClass,
                    subject: urlSubject,
                    level: urlLevel
                };
            }

            // Get from localStorage
            const savedConfig = localStorage.getItem('quizConfig');
            if (savedConfig) {
                return JSON.parse(savedConfig);
            }

        } catch (error) {
            console.log("Error getting quiz config:", error);
        }

        // Default values
        return {
            class: '1',
            subject: 'math',
            level: '1'
        };
    }

    // Get questions based on configuration
    function getCurrentQuestions(config) {
        // Questions database
        const questionsDatabase = {
            class1: {
                math: {
                    level1: [{
                            question: "5 + 0 = ?",
                            options: ["0", "5", "6", "4"],
                            correct: 1,
                            visual: "5️⃣ + 0️⃣ = ?",
                            hint: "Adding zero to any number gives the same number!"
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
                            hint: "If you subtract a number from itself, you get zero!"
                        },
                        {
                            question: "Which is an odd number?",
                            options: ["2", "4", "6", "5"],
                            correct: 3,
                            visual: "Odd Number? 🤔",
                            hint: "Odd numbers are 1, 3, 5, 7, 9..."
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
                            hint: "You can use your fingers: 2 fingers + 3 fingers = 5 fingers!"
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
                    ],
                    level2: [{
                            question: "3 + 4 = ?",
                            options: ["5", "6", "7", "8"],
                            correct: 2,
                            visual: "3️⃣ + 4️⃣ = ?",
                            hint: "3 + 4 = 7. Count: 3, 4, 5, 6, 7!"
                        },
                        {
                            question: "8 - 2 = ?",
                            options: ["4", "5", "6", "7"],
                            correct: 2,
                            visual: "8️⃣ - 2️⃣ = ?",
                            hint: "8 - 2 = 6. Count backwards from 8: 8, 7, 6!"
                        },
                        {
                            question: "Which shape has 4 equal sides?",
                            options: ["Triangle", "Square", "Circle", "Rectangle"],
                            correct: 1,
                            visual: "4 equal sides?",
                            hint: "A square has 4 equal sides!"
                        },
                        {
                            question: "What is half of 10?",
                            options: ["3", "4", "5", "6"],
                            correct: 2,
                            visual: "½ of 🔟 = ?",
                            hint: "Half of 10 is 5. 5 + 5 = 10!"
                        },
                        {
                            question: "Count the stars: ⭐⭐⭐",
                            options: ["2", "3", "4", "5"],
                            correct: 1,
                            visual: "⭐⭐⭐",
                            hint: "Count: 1, 2, 3. There are 3 stars!"
                        },
                        {
                            question: "What comes after 15?",
                            options: ["14", "16", "17", "13"],
                            correct: 1,
                            visual: "15 → ?",
                            hint: "After 15 comes 16. Count: 15, 16, 17..."
                        },
                        {
                            question: "1 + 1 + 1 = ?",
                            options: ["2", "3", "4", "5"],
                            correct: 1,
                            visual: "1️⃣ + 1️⃣ + 1️⃣ = ?",
                            hint: "1 + 1 = 2, then 2 + 1 = 3!"
                        },
                        {
                            question: "Which is even number?",
                            options: ["3", "5", "7", "8"],
                            correct: 3,
                            visual: "Even Number?",
                            hint: "Even numbers are 2, 4, 6, 8..."
                        },
                        {
                            question: "How many days in a week?",
                            options: ["5", "6", "7", "8"],
                            correct: 2,
                            visual: "Days in week? 📅",
                            hint: "There are 7 days in a week: Monday to Sunday!"
                        },
                        {
                            question: "What is 0 + 9?",
                            options: ["0", "9", "10", "8"],
                            correct: 1,
                            visual: "0️⃣ + 9️⃣ = ?",
                            hint: "Adding zero doesn't change the number. 0 + 9 = 9!"
                        }
                    ]
                }
            }
        };

        try {
            const classKey = `class${config.class}`;
            const subject = config.subject || 'math';
            const levelKey = `level${config.level}`;

            if (questionsDatabase[classKey] &&
                questionsDatabase[classKey][subject] &&
                questionsDatabase[classKey][subject][levelKey]) {
                return questionsDatabase[classKey][subject][levelKey];
            }
        } catch (error) {
            console.log("Error getting questions:", error);
        }

        // Default to Class 1 Math Level 1
        return questionsDatabase.class1.math.level1;
    }

    // Get DOM elements
    function getElements() {
        return {
            // Game info
            gameClass: document.getElementById('gameClass'),
            gameSubject: document.getElementById('gameSubject'),
            gameLevel: document.getElementById('gameLevel'),
            currentScore: document.getElementById('currentScore'),
            triesLeft: document.getElementById('triesLeft'),

            // Progress
            progressDots: document.getElementById('progressDots'),
            timerValue: document.getElementById('timerValue'),
            timerProgress: document.querySelector('.timer-progress'),

            // Question
            questionNumber: document.getElementById('questionNumber'),
            totalQuestions: document.getElementById('totalQuestions'),
            questionText: document.getElementById('questionText'),
            questionVisual: document.getElementById('questionVisual'),

            // Options
            optionsGrid: document.getElementById('optionsGrid'),

            // Feedback
            feedbackText: document.getElementById('feedbackText'),

            // Stats
            correctCount: document.getElementById('correctCount'),
            questionsLeft: document.getElementById('questionsLeft'),
            levelProgress: document.getElementById('levelProgress'),

            // Buttons
            skipBtn: document.getElementById('skipBtn'),
            submitBtn: document.getElementById('submitBtn'),

            // Modal
            gameOverModal: document.getElementById('gameOverModal'),
            finalScore: document.getElementById('finalScore'),
            finalCorrect: document.getElementById('finalCorrect'),
            finalTime: document.getElementById('finalTime'),
            completionMessage: document.getElementById('completionMessage'),
            levelUnlockMessage: document.getElementById('levelUnlockMessage'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            nextLevelBtn: document.getElementById('nextLevelBtn'),
            backHomeBtn: document.getElementById('backHomeBtn'),

            // Sound
            soundToggle: document.getElementById('soundToggle'),
            volumeSlider: document.getElementById('volumeSlider')
        };
    }

    // Get audio elements
    function getAudioElements() {
        return {
            correct: document.getElementById('correctSound'),
            wrong: document.getElementById('wrongSound'),
            hint: document.getElementById('hintSound'),
            timeUp: document.getElementById('timeUpSound'),
            levelUp: document.getElementById('levelUpSound')
        };
    }

    // ===== GAME FUNCTIONS =====

    // Update all display elements
    function updateDisplay() {
        if (!gameState || !elements) return;

        // Update game info
        if (elements.gameClass) elements.gameClass.textContent = gameState.config.class;
        if (elements.gameSubject) elements.gameSubject.textContent = gameState.config.subject.toUpperCase();
        if (elements.gameLevel) elements.gameLevel.textContent = gameState.config.level;
        if (elements.totalQuestions) elements.totalQuestions.textContent = questions.length;

        // Update score and tries
        if (elements.currentScore) elements.currentScore.textContent = gameState.score;
        if (elements.triesLeft) elements.triesLeft.textContent = gameState.triesLeft;

        // Setup progress dots
        setupProgressDots();
    }

    // Setup progress dots
    function setupProgressDots() {
        if (!elements.progressDots) return;

        elements.progressDots.innerHTML = '';
        for (let i = 0; i < questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === gameState.currentQuestion) dot.classList.add('active');
            elements.progressDots.appendChild(dot);
        }
    }

    // Update current progress dot
    function updateCurrentProgressDot() {
        if (!elements.progressDots) return;

        const dots = elements.progressDots.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === gameState.currentQuestion) {
                dot.classList.add('active');
            }
        });
    }

    // Update progress dot status
    function updateProgressDotStatus(isCorrect) {
        if (!elements.progressDots) return;

        const dots = elements.progressDots.querySelectorAll('.progress-dot');
        if (gameState.currentQuestion < dots.length) {
            dots[gameState.currentQuestion].classList.remove('active');
            if (isCorrect) {
                dots[gameState.currentQuestion].classList.add('correct');
            } else {
                dots[gameState.currentQuestion].classList.add('incorrect');
            }
        }
    }

    // Load question
    function loadQuestion() {
        if (!gameState || !questions.length) return;

        // Check if all questions are completed
        if (gameState.currentQuestion >= questions.length) {
            completeLevel();
            return;
        }

        const question = questions[gameState.currentQuestion];

        // Reset state for new question
        gameState.selectedOption = null;
        gameState.isAnswerSubmitted = false;
        gameState.wrongAttempts = 0;
        gameState.timer = 30;
        gameState.triesLeft = 3;

        // Update UI
        if (elements.questionNumber) elements.questionNumber.textContent = gameState.currentQuestion + 1;
        if (elements.questionText) elements.questionText.textContent = question.question;
        if (elements.triesLeft) elements.triesLeft.textContent = gameState.triesLeft;

        // Update question visual
        if (elements.questionVisual) {
            elements.questionVisual.innerHTML = question.visual || '';
        }

        // Load options
        loadOptions(question);

        // Update submit button
        if (elements.submitBtn) {
            elements.submitBtn.disabled = true;
        }

        // Update progress dot
        updateCurrentProgressDot();

        // Update stats
        updateStats();

        // Clear any existing hint timeout
        if (hintTimeout) clearTimeout(hintTimeout);

        // Auto hint after 15 seconds if no answer
        hintTimeout = setTimeout(() => {
            if (!gameState.isAnswerSubmitted && gameState.selectedOption === null) {
                giveHint();
            }
        }, 15000);

        // Speak question after 1 second
        setTimeout(() => {
            speak(`Question ${gameState.currentQuestion + 1}: ${question.question}`);
        }, 1000);
    }

    // Load options
    function loadOptions(question) {
        if (!elements.optionsGrid) return;

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

    // Select option
    function selectOption(optionCard, index) {
        if (!gameState || gameState.isAnswerSubmitted) return;

        // Remove selection from all options
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Select clicked option
        optionCard.classList.add('selected');
        gameState.selectedOption = index;

        if (elements.submitBtn) {
            elements.submitBtn.disabled = false;
        }

        // Clear any existing auto-submit timeout
        if (autoSubmitTimeout) clearTimeout(autoSubmitTimeout);

        // Auto-submit after 2 seconds
        autoSubmitTimeout = setTimeout(() => {
            if (!gameState.isAnswerSubmitted) {
                submitAnswer();
            }
        }, 2000);
    }

    // Submit answer
    function submitAnswer() {
        if (!gameState || gameState.selectedOption === null || gameState.isAnswerSubmitted) return;

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

    // Handle correct answer
    function handleCorrectAnswer() {
        const question = questions[gameState.currentQuestion];

        // Play sound
        if (gameState.isSoundOn && audioElements.correct) {
            try {
                audioElements.correct.currentTime = 0;
                audioElements.correct.play();
            } catch (e) {
                console.log("Audio play error:", e);
            }
        }

        // Update score
        let pointsEarned = 10;
        if (gameState.wrongAttempts === 0) pointsEarned += 5; // Bonus for first try
        if (gameState.timer > 20) pointsEarned += 3; // Bonus for quick answer

        gameState.score += pointsEarned;
        gameState.correctAnswers++;

        // Speak encouragement
        const messages = [
            "Excellent! Perfect answer! ⭐",
            "Wow! You got it right! 🎉",
            "Amazing! You're so smart! 🧠",
            "Perfect! Keep it up! 🎯"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        speak(message);

        // Update feedback
        updateFeedback(message);

        // Update progress dot
        updateProgressDotStatus(true);

        // Update stats
        updateStats();

        // Move to next question after delay
        setTimeout(() => {
            gameState.currentQuestion++;
            loadQuestion();
            startTimer();
        }, 2000);
    }

    // Handle wrong answer
    function handleWrongAnswer() {
        gameState.wrongAttempts++;
        gameState.triesLeft--;

        // Update tries display
        if (elements.triesLeft) {
            elements.triesLeft.textContent = gameState.triesLeft;
        }

        // Play sound
        if (gameState.isSoundOn && audioElements.wrong) {
            try {
                audioElements.wrong.currentTime = 0;
                audioElements.wrong.play();
            } catch (e) {
                console.log("Audio play error:", e);
            }
        }

        // Mark wrong option
        const optionCard = document.querySelector(`.option-card[data-index="${gameState.selectedOption}"]`);
        if (optionCard) {
            optionCard.classList.add('incorrect');
        }

        // Update feedback
        updateFeedback(`Try again! You have ${gameState.triesLeft} tries left.`);

        // If no tries left, show correct answer and move on
        if (gameState.triesLeft <= 0) {
            showCorrectAnswer();
            setTimeout(() => {
                gameState.currentQuestion++;
                loadQuestion();
                startTimer();
            }, 3000);
        } else {
            // Give hint on second wrong attempt
            if (gameState.wrongAttempts === 2) {
                giveHint();
            } else {
                speak("Not quite! Try again!");
            }

            // Allow retry after 1 second
            setTimeout(() => {
                if (optionCard) {
                    optionCard.classList.remove('incorrect');
                    optionCard.classList.remove('selected');
                }
                gameState.selectedOption = null;
                gameState.isAnswerSubmitted = false;
                if (elements.submitBtn) {
                    elements.submitBtn.disabled = true;
                }
                startTimer();
            }, 1000);
        }
    }

    // Show correct answer
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
        updateFeedback(`Correct answer: ${question.options[question.correct]}`);
    }

    // Give hint
    function giveHint() {
        if (!gameState || gameState.isAnswerSubmitted || gameState.hintsUsed >= 3) return;

        const question = questions[gameState.currentQuestion];
        gameState.hintsUsed++;

        // Update hint bubbles
        updateHintBubbles();

        // Play hint sound
        if (gameState.isSoundOn && audioElements.hint) {
            try {
                audioElements.hint.currentTime = 0;
                audioElements.hint.play();
            } catch (e) {
                console.log("Audio play error:", e);
            }
        }

        // Speak hint
        speak(question.hint);
        updateFeedback(question.hint);
    }

    // Update hint bubbles
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

    // Start timer
    function startTimer() {
        clearInterval(timerInterval);
        gameState.timer = 30;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            gameState.timer--;
            updateTimerDisplay();

            if (gameState.timer <= 10 && elements.timerValue) {
                elements.timerValue.style.color = '#EF4444';
            }

            if (gameState.timer <= 0) {
                clearInterval(timerInterval);
                timeUp();
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay() {
        if (elements.timerValue) {
            elements.timerValue.textContent = gameState.timer;
        }

        // Update progress circle
        if (elements.timerProgress) {
            const circumference = 339;
            const offset = circumference - (gameState.timer / 30) * circumference;
            elements.timerProgress.style.strokeDashoffset = offset;
        }
    }

    // Time up
    function timeUp() {
        if (!gameState.isAnswerSubmitted) {
            showCorrectAnswer();
            speak("Time's up! Let's see the correct answer.");

            setTimeout(() => {
                gameState.currentQuestion++;
                loadQuestion();
                startTimer();
            }, 2000);
        }
    }

    // Update stats
    function updateStats() {
        if (!gameState || !elements) return;

        if (elements.currentScore) elements.currentScore.textContent = gameState.score;
        if (elements.correctCount) elements.correctCount.textContent = gameState.correctAnswers;
        if (elements.questionsLeft) elements.questionsLeft.textContent = questions.length - gameState.currentQuestion;

        const progressPercentage = Math.round((gameState.currentQuestion / questions.length) * 100);
        if (elements.levelProgress) elements.levelProgress.textContent = `${progressPercentage}%`;
    }

    // Update feedback
    function updateFeedback(text) {
        if (elements.feedbackText) {
            elements.feedbackText.textContent = text;
        }
    }

    // Complete level
    function completeLevel() {
        clearInterval(timerInterval);

        // Save progress to localStorage
        saveProgress();

        // Show game over modal
        showGameOverModal();
    }

    // Save progress
    function saveProgress() {
        try {
            // Load existing progress
            const existingProgress = JSON.parse(localStorage.getItem('quizProgress')) || {};

            const classKey = `class${gameState.config.class}`;
            const subject = gameState.config.subject;
            const levelIndex = parseInt(gameState.config.level) - 1;

            // Initialize if not exists
            if (!existingProgress[classKey]) {
                existingProgress[classKey] = {};
            }
            if (!existingProgress[classKey][subject]) {
                existingProgress[classKey][subject] = { levels: [false, false, false, false, false] };
            }

            // Mark level as completed
            existingProgress[classKey][subject].levels[levelIndex] = true;

            // Save back to localStorage
            localStorage.setItem('quizProgress', JSON.stringify(existingProgress));

        } catch (error) {
            console.log("Error saving progress:", error);
        }
    }

    // Show game over modal
    function showGameOverModal() {
        if (!elements.gameOverModal) return;

        // Update modal content
        if (elements.finalScore) elements.finalScore.textContent = gameState.score;
        if (elements.finalCorrect) elements.finalCorrect.textContent = `${gameState.correctAnswers}/${questions.length}`;
        if (elements.finalTime) elements.finalTime.textContent = `${gameState.totalTime}s`;
        if (elements.completionMessage) {
            elements.completionMessage.textContent = `You've completed Level ${gameState.config.level}!`;
        }

        // Check if next level is unlocked
        const nextLevel = parseInt(gameState.config.level) + 1;
        const maxLevel = 5;

        if (nextLevel <= maxLevel) {
            if (elements.levelUnlockMessage) {
                elements.levelUnlockMessage.innerHTML = `<i class="fas fa-lock-open"></i><span>Level ${nextLevel} is now unlocked! 🚀</span>`;
            }
            if (elements.nextLevelBtn) {
                elements.nextLevelBtn.style.display = 'flex';
            }
        } else {
            if (elements.levelUnlockMessage) {
                elements.levelUnlockMessage.innerHTML = `<i class="fas fa-trophy"></i><span>You've completed all levels! 🏆</span>`;
            }
            if (elements.nextLevelBtn) {
                elements.nextLevelBtn.style.display = 'none';
            }
        }

        // Play celebration sound
        if (gameState.isSoundOn && audioElements.levelUp) {
            try {
                audioElements.levelUp.currentTime = 0;
                audioElements.levelUp.play();
            } catch (e) {
                console.log("Audio play error:", e);
            }
        }

        // Show modal
        elements.gameOverModal.style.display = 'flex';
    }

    // ===== EVENT LISTENERS =====

    // Setup event listeners
    function setupEventListeners() {
        // Submit button
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', submitAnswer);
        }

        // Skip button
        if (elements.skipBtn) {
            elements.skipBtn.addEventListener('click', function() {
                if (!gameState || gameState.isAnswerSubmitted) return;

                gameState.score = Math.max(0, gameState.score - 5);
                updateStats();

                speak("Skipping to next question!");

                gameState.currentQuestion++;
                loadQuestion();
                startTimer();
            });
        }

        // Modal buttons
        if (elements.playAgainBtn) {
            elements.playAgainBtn.addEventListener('click', function() {
                // Reset game state
                gameState.currentQuestion = 0;
                gameState.score = 0;
                gameState.correctAnswers = 0;
                gameState.totalTime = 0;
                gameState.wrongAttempts = 0;
                gameState.hintsUsed = 0;

                // Hide modal
                if (elements.gameOverModal) {
                    elements.gameOverModal.style.display = 'none';
                }

                // Restart game
                loadQuestion();
                startTimer();
                updateStats();
            });
        }

        if (elements.nextLevelBtn) {
            elements.nextLevelBtn.addEventListener('click', function() {
                const nextLevel = parseInt(gameState.config.level) + 1;
                window.location.href = `quiz-game.html?class=${gameState.config.class}&subject=${gameState.config.subject}&level=${nextLevel}`;
            });
        }

        if (elements.backHomeBtn) {
            elements.backHomeBtn.addEventListener('click', function() {
                window.location.href = 'quiz-home.html';
            });
        }
    }

    // Setup audio
    function setupAudio() {
        // Sound toggle
        if (elements.soundToggle) {
            elements.soundToggle.addEventListener('click', function() {
                gameState.isSoundOn = !gameState.isSoundOn;

                if (gameState.isSoundOn) {
                    this.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    // Stop any ongoing speech
                    if ('speechSynthesis' in window) {
                        speechSynthesis.cancel();
                    }
                }
            });
        }

        // Volume slider
        if (elements.volumeSlider) {
            elements.volumeSlider.addEventListener('input', function() {
                const volume = this.value / 100;
                if (audioElements.correct) audioElements.correct.volume = volume;
                if (audioElements.wrong) audioElements.wrong.volume = volume;
                if (audioElements.hint) audioElements.hint.volume = volume;
                if (audioElements.timeUp) audioElements.timeUp.volume = volume;
                if (audioElements.levelUp) audioElements.levelUp.volume = volume;
            });
        }
    }

    // ===== SPEECH FUNCTIONS =====

    // Speech synthesis function
    function speak(text) {
        if (!gameState || !gameState.isSoundOn) return;

        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const speech = new SpeechSynthesisUtterance(text);
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1.5; // Child-friendly pitch
            speech.lang = 'en-US';

            // Try to find a child-friendly voice
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                const childVoice = voices.find(voice =>
                    voice.name.includes('Google UK English Female') ||
                    voice.name.includes('Microsoft Zira') ||
                    voice.name.includes('Child')
                );

                if (childVoice) {
                    speech.voice = childVoice;
                }
            }

            // Speak the text
            speechSynthesis.speak(speech);
        }
    }

    // Initialize speech synthesis voices
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = function() {
            console.log("Speech synthesis voices loaded");
        };
    }
});