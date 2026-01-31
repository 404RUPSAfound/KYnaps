// Create stars for background
function createStars() {
    const cosmicBg = document.getElementById('cosmicBg');
    // Clear any existing stars
    cosmicBg.innerHTML = `
        <div class="nebula nebula-1"></div>
        <div class="nebula nebula-2"></div>
        <div class="nebula nebula-3"></div>
    `;
    
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 5}s`;
        cosmicBg.appendChild(star);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Chatbot functionality - FIXED VERSION
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.initialize();
    }

    initialize() {
        this.toggleBtn = document.getElementById('chatbotToggle');
        this.window = document.getElementById('chatbotWindow');
        this.closeBtn = document.getElementById('chatbotClose');
        this.sendBtn = document.getElementById('chatbotSend');
        this.input = document.getElementById('chatbotInput');
        this.messagesContainer = document.getElementById('chatbotMessages');

        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        // Toggle chatbot window
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Close chatbot
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.window.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('active');
            this.input.focus();
        } else {
            this.window.classList.remove('active');
        }
    }

    open() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.input.focus();
    }

    close() {
        this.isOpen = false;
        this.window.classList.remove('active');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            text: "Hi there! I'm Kyno, your AI learning buddy! 🤖<br><br>I can help you with:<br>• Explaining concepts<br>• Solving problems<br>• Finding the right games<br>• Tracking your progress<br><br>What would you like to learn today?"
        };
        this.addMessage(welcomeMessage.text, welcomeMessage.type);
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (message === '') return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking and response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // Random delay for natural feel
    }

    showTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'message message-bot typing-indicator';
        typingEl.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingEl = this.messagesContainer.querySelector('.typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', `message-${sender}`);
        
        if (sender === 'bot') {
            messageEl.innerHTML = text; // Allow HTML for bot messages
        } else {
            messageEl.textContent = text; // Plain text for user messages
        }
        
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        // Add to messages history
        this.messages.push({ text, sender, timestamp: new Date() });
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Math related queries
        if (lowerMessage.includes('math') || lowerMessage.includes('number') || lowerMessage.includes('calculate')) {
            return this.getMathResponse(lowerMessage);
        }
        
        // Game related queries
        else if (lowerMessage.includes('game') || lowerMessage.includes('play') || lowerMessage.includes('fun')) {
            return this.getGameResponse(lowerMessage);
        }
        
        // Science related queries
        else if (lowerMessage.includes('science') || lowerMessage.includes('experiment') || lowerMessage.includes('lab')) {
            return this.getScienceResponse(lowerMessage);
        }
        
        // English related queries
        else if (lowerMessage.includes('english') || lowerMessage.includes('grammar') || lowerMessage.includes('read') || lowerMessage.includes('write')) {
            return this.getEnglishResponse(lowerMessage);
        }
        
        // Progress related queries
        else if (lowerMessage.includes('progress') || lowerMessage.includes('report') || lowerMessage.includes('score')) {
            return this.getProgressResponse();
        }
        
        // Class/grade related queries
        else if (lowerMessage.includes('class') || lowerMessage.includes('grade') || lowerMessage.includes('level')) {
            return this.getClassResponse(lowerMessage);
        }
        
        // Parent related queries
        else if (lowerMessage.includes('parent') || lowerMessage.includes('mom') || lowerMessage.includes('dad')) {
            return this.getParentResponse();
        }
        
        // Greetings
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm Kyno, your AI learning buddy! 😊 How can I help you with your learning adventure today?";
        }
        
        // Thanks
        else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! I'm always here to help you learn and grow. Remember, every expert was once a beginner! 🌟";
        }
        
        // Help
        else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what can you do')) {
            return this.getHelpResponse();
        }
        
        // Default response
        else {
            return "That's an interesting question! 🤔 As your AI learning buddy, I can help explain concepts, suggest perfect games for your level, track your progress, or solve tricky problems. What specific topic would you like to explore today?";
        }
    }

    getMathResponse(message) {
        const responses = [
            "Math is super fun! 🧮 I can help you with numbers, calculations, and problem solving. What specific math topic are you working on?",
            "Mathematics is everywhere! 🌟 I recommend trying our <strong>Number Valley Run</strong> for number practice or <strong>Dragon Compare Bridge</strong> for learning greater than/less than.",
            "Let's make math exciting! 🚀 Are you learning addition, subtraction, multiplication, fractions, or something else?",
            "Math adventures await! Try <strong>Pizza Slice City</strong> for fractions or <strong>Times Table Tunnel</strong> for multiplication practice."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getGameResponse(message) {
        const class1Games = "For Class 1: <strong>Number Valley Run</strong> (numbers), <strong>Alphabet Jungle</strong> (letters)";
        const class2Games = "For Class 2: <strong>Clock Hero Run</strong> (time), <strong>Word Knight</strong> (nouns/verbs)";
        const class3Games = "For Class 3: <strong>Pizza Slice City</strong> (fractions), <strong>Seed Runner</strong> (plants)";
        const class5Games = "For Class 5: <strong>Space Jet Run</strong> (solar system), <strong>Wire Runner</strong> (electricity)";
        
        return `We have awesome Mario-style learning games! 🎮<br><br>${class1Games}<br>${class2Games}<br>${class3Games}<br>${class5Games}<br><br>Which class are you in? I'll recommend the perfect game!`;
    }

    getScienceResponse(message) {
        const responses = [
            "Science is amazing! 🔬 I can explain concepts about plants, animals, solar system, electricity, and more. What science topic interests you?",
            "Ready for some science fun? 🌍 Try <strong>Space Jet Run</strong> to explore the solar system or <strong>Wire Runner</strong> to learn about circuits!",
            "Science is all about discovery! 🧪 Are you learning about plants, animals, weather, planets, or something else?",
            "Let's experiment! 🔭 I can help with science concepts and recommend fun experiments you can try at home."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getEnglishResponse(message) {
        const responses = [
            "English adventures await! 📚 I can help with reading, writing, grammar, and vocabulary. What English skill would you like to practice?",
            "Let's improve your English! ✨ Try <strong>Alphabet Jungle</strong> for letter practice or <strong>Word Knight</strong> for grammar fun!",
            "Reading and writing are superpowers! 🦸 I can help with stories, poems, grammar rules, and building your vocabulary.",
            "English is fun with games! 🎯 Are you working on spelling, reading comprehension, writing stories, or learning grammar?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getProgressResponse() {
        const gamesCompleted = Math.floor(Math.random() * 10) + 15;
        const badgesEarned = Math.floor(Math.random() * 5) + 8;
        const currentStreak = Math.floor(Math.random() * 7) + 3;
        
        return `📊 <strong>Your Learning Progress:</strong><br>
• Games Completed: ${gamesCompleted}/25<br>
• Badges Earned: ${badgesEarned}<br>
• Current Streak: ${currentStreak} days<br>
• Skills Improved: Logic +${Math.floor(Math.random() * 20) + 20}%, Creativity +${Math.floor(Math.random() * 15) + 15}%<br><br>
Keep up the amazing work! 🎉`;
    }

    getClassResponse(message) {
        if (message.includes('1')) {
            return "Class 1 is so exciting! 🌟 You'll learn numbers, basic addition, shapes, and start reading. Try <strong>Number Valley Run</strong> and <strong>Alphabet Jungle</strong> games!";
        } else if (message.includes('2')) {
            return "Class 2 adventures! 🚀 You'll learn bigger numbers, time telling, and more reading. Try <strong>Clock Hero Run</strong> and <strong>Word Knight</strong>!";
        } else if (message.includes('3')) {
            return "Class 3 is where it gets really fun! 🌈 Multiplication, fractions, and science experiments await. Try <strong>Pizza Slice City</strong> and <strong>Seed Runner</strong>!";
        } else if (message.includes('4') || message.includes('5') || message.includes('6') || message.includes('7')) {
            return "Upper classes are amazing! 🎯 You'll learn advanced math, science concepts, and critical thinking. Try <strong>Space Jet Run</strong> and <strong>Wire Runner</strong> for exciting challenges!";
        } else {
            return "We have learning games for all classes 1-7! 📖 Each class has specially designed games that match your syllabus. Which class are you in?";
        }
    }

    getParentResponse() {
        return "Hello parents! 👨‍👩‍👧‍👦 I can help you:<br>• Track your child's learning progress<br>• View activity reports<br>• Set learning goals<br>• Recommend age-appropriate games<br>• Monitor screen time<br><br>How can I assist you today?";
    }

    getHelpResponse() {
        return `I'm Kyno, your AI learning buddy! 🤖 Here's what I can do:<br><br>
<strong>📚 Learning Help:</strong><br>
• Explain concepts in simple ways<br>
• Solve math problems step-by-step<br>
• Help with science experiments<br>
• Improve English reading/writing<br><br>
<strong>🎮 Game Recommendations:</strong><br>
• Suggest perfect games for your level<br>
• Find games by subject<br>
• Track game progress<br><br>
<strong>📊 Progress Tracking:</strong><br>
• Show learning statistics<br>
• Track skill improvement<br>
• Monitor learning streaks<br><br>
What would you like help with?`;
    }
}

// Modal functionality
function initializeModals() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Open modals
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    signupBtn.addEventListener('click', () => {
        signupModal.classList.add('active');
    });

    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            signupModal.classList.remove('active');
        });
    });

    // Switch between login and signup
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Form submission
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            showNotification('Login successful! Welcome back!', 'success');
            setTimeout(() => {
                loginModal.classList.remove('active');
                e.target.reset();
            }, 1500);
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const childGrade = document.getElementById('signupChild').value;
        
        if (name && email && password && childGrade) {
            showNotification('Account created successfully! Welcome to Kynapse Kids!', 'success');
            setTimeout(() => {
                signupModal.classList.remove('active');
                e.target.reset();
            }, 2000);
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });
}

// Interactive game cards
function initializeGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameTitle = card.getAttribute('data-game') || card.querySelector('.game-title').textContent;
            const gameClass = card.querySelector('.game-class').textContent;
            showNotification(`Opening ${gameTitle} for ${gameClass}...`, 'success');
            
            setTimeout(() => {
                alert(`🎮 ${gameTitle}\n\nThis is a Mario-style educational game designed for ${gameClass} students.\n\nIn a real application, this would launch the actual game interface with interactive learning activities!`);
            }, 1000);
        });
    });
}

// Hero section buttons
function initializeHeroButtons() {
    document.getElementById('exploreBtn').addEventListener('click', () => {
        showNotification('Exploring all classes and games...', 'success');
        document.querySelector('.games-preview').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('demoBtn').addEventListener('click', () => {
        showNotification('Loading game demo...', 'success');
        setTimeout(() => {
            alert("🎮 Game Demo\n\nWelcome to Kynapse Kids! This demo would show you:\n\n• Mario-style gameplay with educational content\n• Interactive learning challenges\n• Progress tracking\n• AI buddy assistance\n\nAll our games are syllabus-aligned and designed to make learning fun!\n\nIn the full version, you'd be playing an actual educational game right now!");
        }, 1000);
    });
}

// Parallax effect
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const nebula1 = document.querySelector('.nebula-1');
        const nebula2 = document.querySelector('.nebula-2');
        const nebula3 = document.querySelector('.nebula-3');
        
        if (nebula1) nebula1.style.transform = `translateY(${rate * 0.3}px)`;
        if (nebula2) nebula2.style.transform = `translateY(${rate * 0.5}px)`;
        if (nebula3) nebula3.style.transform = `translateY(${rate * 0.7}px)`;
    });
}

// Feature cards animation
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    // Initialize all components
    const chatbot = new Chatbot();
    initializeModals();
    initializeGameCards();
    initializeHeroButtons();
    initializeParallax();
    initializeFeatureCards();
    
    console.log('🚀 Kynapse Kids - Educational Gaming Platform Loaded!');
    console.log('🤖 AI Chatbot Kyno is ready to help with learning!');
    
    // Prevent form submission on Enter key in inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});