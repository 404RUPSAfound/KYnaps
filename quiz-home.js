// ===== QUIZ SELECTION LOGIC - FIXED VERSION =====

document.addEventListener('DOMContentLoaded', function() {
    console.log("Quiz Home: DOM loaded, initializing...");

    // Game State
    const gameState = {
        selectedClass: null,
        selectedSubject: null,
        selectedLevel: null
    };

    // Default progress structure
    const defaultProgress = {
        class1: { math: { levels: [false, false, false, false, false] } },
        class2: { math: { levels: [false, false, false, false, false] } },
        class3: { math: { levels: [false, false, false, false, false] } },
        class4: { math: { levels: [false, false, false, false, false] } }
    };

    // Load saved progress from localStorage
    function loadProgress() {
        try {
            const saved = localStorage.getItem('quizProgress');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.log("Error loading progress:", error);
        }
        return defaultProgress;
    }

    // Initialize progress
    let progress = loadProgress();

    // Save progress to localStorage
    function saveProgress() {
        try {
            localStorage.setItem('quizProgress', JSON.stringify(progress));
        } catch (error) {
            console.log("Error saving progress:", error);
        }
    }

    // Update progress display
    function updateProgressDisplay() {
        try {
            // Update class progress
            document.querySelectorAll('.class-card').forEach(card => {
                const classNum = card.dataset.class;
                const classKey = `class${classNum}`;

                if (progress[classKey] && progress[classKey].math) {
                    const completedLevels = progress[classKey].math.levels.filter(level => level === true).length;
                    const totalLevels = progress[classKey].math.levels.length;
                    const percentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

                    const progressFill = card.querySelector('.progress-fill');
                    const progressText = card.querySelector('.class-progress span');

                    if (progressFill) {
                        progressFill.style.width = `${percentage}%`;
                    }
                    if (progressText) {
                        progressText.textContent = `${percentage}% Complete`;
                    }
                }
            });

            // Update overall progress
            let totalCompleted = 0;
            let totalLevels = 0;

            for (let classNum = 1; classNum <= 4; classNum++) {
                const classKey = `class${classNum}`;
                if (progress[classKey] && progress[classKey].math) {
                    totalCompleted += progress[classKey].math.levels.filter(level => level === true).length;
                    totalLevels += progress[classKey].math.levels.length;
                }
            }

            const overallPercentage = totalLevels > 0 ? Math.round((totalCompleted / totalLevels) * 100) : 0;
            const overallProgressElement = document.getElementById('overallProgress');
            if (overallProgressElement) {
                overallProgressElement.textContent = `${overallPercentage}%`;
            }
        } catch (error) {
            console.log("Error updating progress display:", error);
        }
    }

    // DOM Elements
    const elements = {
        // Steps
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),

        // Navigation buttons
        nextToSubjects: document.getElementById('nextToSubjects'),
        backToClasses: document.getElementById('backToClasses'),
        nextToLevels: document.getElementById('nextToLevels'),
        backToSubjects: document.getElementById('backToSubjects'),
        startQuizBtn: document.getElementById('startQuizBtn'),

        // Grids
        classGrid: document.getElementById('classGrid'),
        subjectGrid: document.getElementById('subjectGrid'),
        levelGrid: document.getElementById('levelGrid'),

        // Info display
        levelSelectionInfo: document.getElementById('levelSelectionInfo'),

        // Activity list
        activityList: document.getElementById('activityList')
    };

    // Initialize
    function init() {
        try {
            updateProgressDisplay();
            setupEventListeners();
            console.log("Quiz selection initialized successfully");
        } catch (error) {
            console.log("Error initializing quiz selection:", error);
        }
    }

    // Setup event listeners - FIXED VERSION
    function setupEventListeners() {
        try {
            // Class selection - FIXED
            document.querySelectorAll('.class-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectClass(this);
                });
            });

            // Subject selection - FIXED
            document.querySelectorAll('.subject-card').forEach(card => {
                if (card.classList.contains('available')) {
                    card.addEventListener('click', function(e) {
                        e.stopPropagation();
                        selectSubject(this);
                    });
                }
            });

            // Level selection will be attached when levels are loaded

            // Navigation buttons
            if (elements.nextToSubjects) {
                elements.nextToSubjects.addEventListener('click', goToSubjects);
            }

            if (elements.backToClasses) {
                elements.backToClasses.addEventListener('click', goToClasses);
            }

            if (elements.nextToLevels) {
                elements.nextToLevels.addEventListener('click', goToLevels);
            }

            if (elements.backToSubjects) {
                elements.backToSubjects.addEventListener('click', goToSubjectsFromLevels);
            }

            if (elements.startQuizBtn) {
                elements.startQuizBtn.addEventListener('click', startQuiz);
            }
        } catch (error) {
            console.log("Error setting up event listeners:", error);
        }
    }

    // Select Class - FIXED VERSION
    function selectClass(classCard) {
        try {
            console.log("Selecting class:", classCard.dataset.class);

            // Remove selection from all cards
            document.querySelectorAll('.class-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            classCard.classList.add('selected');
            gameState.selectedClass = classCard.dataset.class;

            // Enable next button
            if (elements.nextToSubjects) {
                elements.nextToSubjects.disabled = false;
                elements.nextToSubjects.style.opacity = "1";
                elements.nextToSubjects.style.cursor = "pointer";
            }

            // Update activity
            addActivity(`Selected Class ${gameState.selectedClass} for quiz`);

            console.log("Selected class:", gameState.selectedClass);
        } catch (error) {
            console.log("Error selecting class:", error);
        }
    }

    // Select Subject - FIXED VERSION
    function selectSubject(subjectCard) {
        try {
            console.log("Selecting subject:", subjectCard.dataset.subject);

            // Remove selection from all cards
            document.querySelectorAll('.subject-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            subjectCard.classList.add('selected');
            gameState.selectedSubject = subjectCard.dataset.subject;

            // Enable next button
            if (elements.nextToLevels) {
                elements.nextToLevels.disabled = false;
                elements.nextToLevels.style.opacity = "1";
                elements.nextToLevels.style.cursor = "pointer";
            }

            // Update activity
            addActivity(`Selected ${gameState.selectedSubject.toUpperCase()} subject`);

            console.log("Selected subject:", gameState.selectedSubject);
        } catch (error) {
            console.log("Error selecting subject:", error);
        }
    }

    // Select Level (will be attached when levels are loaded)
    function selectLevel(levelCard) {
        try {
            // Remove selection from all cards
            document.querySelectorAll('.level-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            levelCard.classList.add('selected');
            gameState.selectedLevel = levelCard.dataset.level;

            // Enable start button
            if (elements.startQuizBtn) {
                elements.startQuizBtn.disabled = false;
                elements.startQuizBtn.style.opacity = "1";
                elements.startQuizBtn.style.cursor = "pointer";
            }

            // Update activity
            addActivity(`Selected Level ${gameState.selectedLevel} to play`);
        } catch (error) {
            console.log("Error selecting level:", error);
        }
    }

    // Go to Subjects step
    function goToSubjects() {
        try {
            if (!gameState.selectedClass) {
                alert('Please select a class first!');
                return;
            }

            if (elements.step1 && elements.step2) {
                elements.step1.classList.remove('active');
                elements.step2.classList.add('active');
            }

            // Update subject availability based on class
            updateSubjectAvailability();
        } catch (error) {
            console.log("Error going to subjects:", error);
        }
    }

    // Go back to Classes step
    function goToClasses() {
        try {
            if (elements.step1 && elements.step2) {
                elements.step2.classList.remove('active');
                elements.step1.classList.add('active');
            }
        } catch (error) {
            console.log("Error going back to classes:", error);
        }
    }

    // Go to Levels step
    function goToLevels() {
        try {
            if (!gameState.selectedSubject) {
                alert('Please select a subject first!');
                return;
            }

            if (elements.step2 && elements.step3) {
                elements.step2.classList.remove('active');
                elements.step3.classList.add('active');
            }

            // Load levels for selected class and subject
            loadLevels();
        } catch (error) {
            console.log("Error going to levels:", error);
        }
    }

    // Go back to Subjects step from Levels
    function goToSubjectsFromLevels() {
        try {
            if (elements.step2 && elements.step3) {
                elements.step3.classList.remove('active');
                elements.step2.classList.add('active');
            }
        } catch (error) {
            console.log("Error going back to subjects:", error);
        }
    }

    // Load Levels - FIXED VERSION
    function loadLevels() {
        try {
            if (!elements.levelGrid) return;

            elements.levelGrid.innerHTML = '';

            const classKey = `class${gameState.selectedClass}`;
            const subject = gameState.selectedSubject;

            // Get progress for this class and subject
            let levelsProgress = [false, false, false, false, false];
            if (progress[classKey] && progress[classKey][subject]) {
                levelsProgress = progress[classKey][subject].levels;
            } else {
                // Initialize if not exists
                if (!progress[classKey]) {
                    progress[classKey] = {};
                }
                if (!progress[classKey][subject]) {
                    progress[classKey][subject] = { levels: [false, false, false, false, false] };
                }
                saveProgress();
            }

            // Update info text
            if (elements.levelSelectionInfo) {
                elements.levelSelectionInfo.textContent =
                    `Complete Level 1 to unlock Level 2, and so on. Current class: ${gameState.selectedClass}, Subject: ${subject}`;
            }

            // Create level cards
            for (let i = 1; i <= 5; i++) {
                const levelCard = document.createElement('div');
                levelCard.className = 'level-card';
                levelCard.dataset.level = i;

                const isCompleted = levelsProgress[i - 1] === true;
                const isUnlocked = i === 1 || levelsProgress[i - 2] === true;

                if (isCompleted) {
                    levelCard.classList.add('completed');
                } else if (isUnlocked) {
                    levelCard.classList.add('current');
                } else {
                    levelCard.classList.add('locked');
                }

                levelCard.innerHTML = `
                    <div class="level-number">${i}</div>
                    <h4 class="level-title">Level ${i}</h4>
                    <div class="level-status">
                        ${isCompleted ? 'Completed' : isUnlocked ? 'Available' : 'Locked'}
                    </div>
                    <div class="level-desc">
                        ${getLevelDescription(i)}
                    </div>
                `;

                // Add click event listener - FIXED
                levelCard.addEventListener('click', function() {
                    if (!this.classList.contains('locked')) {
                        selectLevel(this);
                    }
                });

                elements.levelGrid.appendChild(levelCard);
            }
        } catch (error) {
            console.log("Error loading levels:", error);
        }
    }

    // Get level description
    function getLevelDescription(level) {
        const descriptions = [
            "Basic questions to start your journey",
            "Slightly harder challenges",
            "Intermediate level questions",
            "Advanced problems",
            "Expert level - Can you master it?"
        ];
        return descriptions[level - 1] || "Challenge yourself!";
    }

    // Update subject availability
    function updateSubjectAvailability() {
        // For now, only Math is available for all classes
        // In future, we can add logic for other subjects
        console.log("Updating subject availability for class:", gameState.selectedClass);
    }

    // Start Quiz
    function startQuiz() {
        try {
            if (!gameState.selectedClass || !gameState.selectedSubject || !gameState.selectedLevel) {
                alert('Please complete all selections!');
                return;
            }

            // Save selections to localStorage
            const quizConfig = {
                class: gameState.selectedClass,
                subject: gameState.selectedSubject,
                level: gameState.selectedLevel
            };

            localStorage.setItem('quizConfig', JSON.stringify(quizConfig));

            // Redirect to quiz game page
            window.location.href = `quiz-game.html?class=${gameState.selectedClass}&subject=${gameState.selectedSubject}&level=${gameState.selectedLevel}`;
        } catch (error) {
            console.log("Error starting quiz:", error);
        }
    }

    // Add activity to recent activity
    function addActivity(text) {
        try {
            if (!elements.activityList) return;

            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">🎮</div>
                <div class="activity-content">
                    <p>${text}</p>
                    <span class="activity-time">${timeString}</span>
                </div>
            `;

            // Add to top
            elements.activityList.insertBefore(activityItem, elements.activityList.firstChild);

            // Keep only 5 activities
            while (elements.activityList.children.length > 5) {
                elements.activityList.removeChild(elements.activityList.lastChild);
            }
        } catch (error) {
            console.log("Error adding activity:", error);
        }
    }

    // Initialize the application
    init();
});