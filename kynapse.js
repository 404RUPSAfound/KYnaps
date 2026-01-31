// Create stars for background
function createStars() {
    const cosmicBg = document.querySelector('.cosmic-bg');
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

// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.add('active');
});

mobileNavClose.addEventListener('click', () => {
    mobileNav.classList.remove('active');
});

// Modal functionality
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileSignupBtn = document.getElementById('mobileSignupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModals = document.querySelectorAll('.close-modal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

function openLoginModal() {
    loginModal.classList.add('active');
    mobileNav.classList.remove('active');
}

function openSignupModal() {
    signupModal.classList.add('active');
    mobileNav.classList.remove('active');
}

loginBtn.addEventListener('click', openLoginModal);
mobileLoginBtn.addEventListener('click', openLoginModal);

signupBtn.addEventListener('click', openSignupModal);
mobileSignupBtn.addEventListener('click', openSignupModal);

closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
    });
});

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

// Form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login functionality would be implemented here!');
    loginModal.classList.remove('active');
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Signup functionality would be implemented here!');
    signupModal.classList.remove('active');
});

// Chatbot functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Simulate AI response after a delay
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', `message-${sender}`);
    messageEl.textContent = text;
    chatbotMessages.appendChild(messageEl);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! How can I help you with your learning today?";
    } else if (lowerMessage.includes('math') || lowerMessage.includes('number')) {
        return "Math is fun! Let me suggest the 'Number Valley Run' game for practicing numbers, or 'Dragon Compare Bridge' for learning greater/less than concepts.";
    } else if (lowerMessage.includes('game') || lowerMessage.includes('play')) {
        return "We have so many fun games! For Class 1, try 'Number Valley Run'. For Class 3, 'Pizza Slice City' teaches fractions. For Class 5, 'Space Jet Run' explores the solar system!";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        return "I'm here to help! You can ask me about:\n- Specific subjects (math, science, english)\n- Game recommendations\n- Learning concepts\n- Your progress";
    } else if (lowerMessage.includes('science') || lowerMessage.includes('experiment')) {
        return "Science is amazing! Try 'Seed Runner' to learn about plant growth, or 'Wire Runner' to understand electricity. Both are interactive and fun!";
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('report')) {
        return "I can show you your learning progress! You've completed 15 games and earned 8 badges. Keep up the great work!";
    } else {
        return "That's an interesting question! As your AI learning buddy, I can help explain concepts, suggest games, or track your progress. What specific topic are you learning about?";
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createStars();
});