// Kynapse Shield Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress circles
    initializeProgressCircles();
    
    // Set up event listeners for Shield
    setupShieldListeners();
    
    // Simulate real-time updates
    startShieldSimulation();
});

function initializeProgressCircles() {
    const circles = document.querySelectorAll('.circle-progress');
    circles.forEach(circle => {
        const value = parseInt(circle.getAttribute('data-value'));
        const circleElement = circle.querySelector('.progress-ring-circle');
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;
        
        circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
        circleElement.style.strokeDashoffset = offset;
    });
}

function setupShieldListeners() {
    // Refresh Data Button
    document.getElementById('refreshData')?.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            simulateDataRefresh();
        }, 1500);
    });
    
    // Set Reminders Button
    document.getElementById('setReminders')?.addEventListener('click', function() {
        const reminderTime = prompt("Set reminder time (e.g., 30 minutes):", "30");
        if (reminderTime) {
            alert(`Reminder set! You'll get notified after ${reminderTime} minutes of passive screen time.`);
        }
    });
    
    // View Reports Button
    document.getElementById('viewReports')?.addEventListener('click', function() {
        showWeeklyReport();
    });
    
    // Launch Mission Button
    document.getElementById('launchMission')?.addEventListener('click', function() {
        launchNewMission();
    });
    
    // Send Suggestion Buttons
    document.querySelectorAll('.btn-send-suggestion').forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestion = this.closest('.suggestion').querySelector('.suggestion-text').innerText;
            alert(`Suggestion sent to child!\n\n"${suggestion}"`);
        });
    });
    
    // Mission Action Buttons
    document.querySelectorAll('.btn-mission-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const missionCard = this.closest('.mission-card');
            const missionName = missionCard.querySelector('h4').innerText;
            
            if (this.innerText === 'Update') {
                const progress = prompt(`Update progress for "${missionName}" (e.g., 3/5):`, "3/5");
                if (progress) {
                    updateMissionProgress(missionCard, progress);
                }
            } else if (this.innerText === 'Log Reading') {
                const minutes = prompt(`How many minutes did you read for "${missionName}"?`, "15");
                if (minutes) {
                    updateReadingProgress(missionCard, minutes);
                }
            } else if (this.innerText === 'Upload Photos') {
                alert(`Upload photos for "${missionName}" - You can upload images showing the leaves you collected!`);
            }
        });
    });
    
    // Time Range Selector
    document.getElementById('timeRange')?.addEventListener('change', function() {
        updateDashboardData(this.value);
    });
}

function simulateDataRefresh() {
    // Randomly update insight cards
    const insights = document.querySelectorAll('.insight-card');
    insights.forEach(insight => {
        const timeElement = insight.querySelector('.time-stamp');
        if (timeElement) {
            timeElement.textContent = 'Just now';
        }
    });
    
    // Update app times randomly
    const appTimes = document.querySelectorAll('.app-time');
    appTimes.forEach(timeElement => {
        const currentTime = parseInt(timeElement.textContent);
        const newTime = Math.max(5, Math.min(currentTime + (Math.random() * 10 - 5), 120));
        timeElement.textContent = Math.round(newTime) + ' min';
    });
    
    // Update progress circles with new random values
    const circles = document.querySelectorAll('.circle-progress');
    circles.forEach(circle => {
        const currentValue = parseInt(circle.getAttribute('data-value'));
        const newValue = Math.max(10, Math.min(currentValue + (Math.random() * 20 - 10), 95));
        circle.setAttribute('data-value', Math.round(newValue));
        
        const circleElement = circle.querySelector('.progress-ring-circle');
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (newValue / 100) * circumference;
        
        circleElement.style.strokeDashoffset = offset;
        
        // Update percentage text
        const valueElement = circle.querySelector('.circle-value');
        valueElement.textContent = Math.round(newValue) + '%';
        
        // Update label if it's passive time
        if (circle.closest('.stat-circle').querySelector('.circle-label').textContent === 'Passive Time') {
            const subLabel = circle.closest('.stat-circle').querySelector('.circle-sub');
            if (newValue > 30) {
                subLabel.textContent = '(Needs attention)';
                subLabel.style.color = '#F59E0B';
            } else {
                subLabel.textContent = '(Good!)';
                subLabel.style.color = '#10B981';
            }
        }
    });
    
    // Show success message
    showNotification('Dashboard data refreshed successfully!', 'success');
}

function updateDashboardData(timeRange) {
    const ranges = {
        'Today': { active: 72, passive: 28, kynapse: '2.1 hrs', youtube: '48 min', social: '22 min', gaming: '1.8 hrs' },
        'This Week': { active: 68, passive: 32, kynapse: '14.2 hrs', youtube: '6.5 hrs', social: '2.8 hrs', gaming: '12.3 hrs' },
        'This Month': { active: 65, passive: 35, kynapse: '58 hrs', youtube: '28 hrs', social: '12 hrs', gaming: '49 hrs' }
    };
    
    const data = ranges[timeRange];
    
    // Update progress circles
    document.querySelectorAll('.circle-progress').forEach((circle, index) => {
        const value = index === 0 ? data.active : data.passive;
        circle.setAttribute('data-value', value);
        
        const circleElement = circle.querySelector('.progress-ring-circle');
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;
        
        circleElement.style.strokeDashoffset = offset;
        
        // Update percentage text
        const valueElement = circle.querySelector('.circle-value');
        valueElement.textContent = value + '%';
    });
    
    // Update breakdown values
    const breakdownItems = document.querySelectorAll('.breakdown-item');
    breakdownItems[0].querySelector('.breakdown-value').textContent = data.kynapse;
    breakdownItems[1].querySelector('.breakdown-value').textContent = data.youtube;
    breakdownItems[2].querySelector('.breakdown-value').textContent = data.social;
    breakdownItems[3].querySelector('.breakdown-value').textContent = data.gaming;
    
    // Update bar widths (simplified)
    const barWidths = [65, 25, 11, 55];
    document.querySelectorAll('.bar-fill').forEach((bar, index) => {
        bar.style.width = barWidths[index] + '%';
    });
    
    showNotification(`Showing data for ${timeRange.toLowerCase()}`, 'info');
}

function showWeeklyReport() {
    const reportModal = document.createElement('div');
    reportModal.className = 'modal active';
    reportModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2 class="modal-title">📊 Weekly Learning Report</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="report-content">
                <div class="report-summary">
                    <div class="report-stat">
                        <div class="stat-value">18.5</div>
                        <div class="stat-label">Total Learning Hours</div>
                    </div>
                    <div class="report-stat">
                        <div class="stat-value">87%</div>
                        <div class="stat-label">Active vs Passive Ratio</div>
                    </div>
                    <div class="report-stat">
                        <div class="stat-value">24</div>
                        <div class="stat-label">Missions Completed</div>
                    </div>
                </div>
                
                <div class="report-details">
                    <h3>Top Learning Activities</h3>
                    <ol>
                        <li>Number Valley Run - 4.2 hours</li>
                        <li>Pizza Slice City - 3.8 hours</li>
                        <li>Space Jet Run - 2.5 hours</li>
                        <li>Dragon Compare Bridge - 2.1 hours</li>
                    </ol>
                    
                    <h3>Recommendations for Next Week</h3>
                    <ul>
                        <li>Increase science content by 30%</li>
                        <li>Try 3 new real-world missions</li>
                        <li>Reduce passive YouTube time by 15%</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="downloadReport">Download PDF</button>
                <button class="btn btn-outline" id="closeReport">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(reportModal);
    
    // Add close functionality
    reportModal.querySelector('.close-modal').addEventListener('click', () => {
        reportModal.remove();
    });
    
    reportModal.querySelector('#closeReport').addEventListener('click', () => {
        reportModal.remove();
    });
    
    reportModal.querySelector('#downloadReport').addEventListener('click', () => {
        alert('Report download started!');
        reportModal.remove();
    });
    
    // Close when clicking outside
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.remove();
        }
    });
}

function launchNewMission() {
    const missions = [
        {
            title: "Kitchen Scientist",
            description: "Measure ingredients using cups and spoons",
            icon: "🧪"
        },
        {
            title: "Backyard Explorer",
            description: "Identify 5 different insects or birds",
            icon: "🐛"
        },
        {
            title: "Home Architect",
            description: "Draw a floor plan of your house",
            icon: "🏠"
        },
        {
            title: "Family Historian",
            description: "Interview a family member about their childhood",
            icon: "📖"
        }
    ];
    
    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    
    const missionModal = document.createElement('div');
    missionModal.className = 'modal active';
    missionModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">🚀 New Real-Life Mission</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="mission-preview">
                <div class="mission-icon-large">${randomMission.icon}</div>
                <h3>${randomMission.title}</h3>
                <p>${randomMission.description}</p>
                
                <div class="mission-details">
                    <div class="detail">
                        <i class="fas fa-clock"></i>
                        <span>Estimated: 20-30 minutes</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-star"></i>
                        <span>Reward: 25 Learning Points</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Skills: Observation, Measurement, Communication</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="assignMission">Assign to Child</button>
                <button class="btn btn-outline" id="randomMission">Get Another Mission</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(missionModal);
    
    // Add functionality
    missionModal.querySelector('.close-modal').addEventListener('click', () => {
        missionModal.remove();
    });
    
    missionModal.querySelector('#assignMission').addEventListener('click', () => {
        alert(`Mission "${randomMission.title}" assigned! The child will see this in their Real-Life Missions.`);
        missionModal.remove();
        
        // Add to active missions (simulated)
        addToActiveMissions(randomMission);
    });
    
    missionModal.querySelector('#randomMission').addEventListener('click', () => {
        missionModal.remove();
        launchNewMission(); // Recursive call for new random mission
    });
    
    missionModal.addEventListener('click', (e) => {
        if (e.target === missionModal) {
            missionModal.remove();
        }
    });
}

function addToActiveMissions(mission) {
    const missionsContainer = document.querySelector('.mission-cards');
    if (!missionsContainer) return;
    
    const missionCard = document.createElement('div');
    missionCard.className = 'mission-card';
    missionCard.innerHTML = `
        <div class="mission-icon">${mission.icon}</div>
        <div class="mission-content">
            <h4>${mission.title}</h4>
            <p>${mission.description}</p>
            <div class="mission-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span>0% completed</span>
            </div>
        </div>
        <button class="btn-mission-action">Update</button>
    `;
    
    // Add to beginning
    missionsContainer.insertBefore(missionCard, missionsContainer.firstChild);
    
    // Add event listener to new button
    missionCard.querySelector('.btn-mission-action').addEventListener('click', function() {
        const progress = prompt(`Update progress for "${mission.title}" (e.g., 1/5 or 25%):`, "0%");
        if (progress) {
            updateMissionProgress(missionCard, progress);
        }
    });
    
    showNotification(`New mission added: ${mission.title}`, 'success');
}

function updateMissionProgress(missionCard, progress) {
    const progressBar = missionCard.querySelector('.progress-fill');
    const progressText = missionCard.querySelector('.mission-progress span');
    
    let percentage = 0;
    
    if (progress.includes('/')) {
        // Format like "2/5"
        const [current, total] = progress.split('/').map(Number);
        percentage = Math.round((current / total) * 100);
        progressText.textContent = `${current}/${total} completed`;
    } else if (progress.includes('%')) {
        // Format like "50%"
        percentage = parseInt(progress);
        progressText.textContent = `${percentage}% completed`;
    } else {
        // Just a number
        percentage = Math.min(parseInt(progress), 100);
        progressText.textContent = `${percentage}% completed`;
    }
    
    progressBar.style.width = `${percentage}%`;
    
    if (percentage >= 100) {
        // Move to completed
        moveToCompleted(missionCard);
    }
}

function updateReadingProgress(missionCard, minutes) {
    const totalMinutes = 20;
    const percentage = Math.min((minutes / totalMinutes) * 100, 100);
    
    const progressBar = missionCard.querySelector('.progress-fill');
    const progressText = missionCard.querySelector('.mission-progress span');
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${minutes}/${totalMinutes} minutes`;
    
    if (percentage >= 100) {
        moveToCompleted(missionCard);
    }
}

function moveToCompleted(missionCard) {
    const missionTitle = missionCard.querySelector('h4').textContent;
    const missionDesc = missionCard.querySelector('p').textContent;
    
    // Remove from active
    missionCard.remove();
    
    // Add to completed
    const completedContainer = document.querySelector('.completed-missions');
    const completedItem = document.createElement('div');
    completedItem.className = 'completed-item';
    completedItem.innerHTML = `
        <div class="completed-icon">✅</div>
        <div class="completed-details">
            <div class="completed-title">${missionTitle}</div>
            <div class="completed-desc">${missionDesc}</div>
            <div class="completed-time">Completed just now</div>
        </div>
    `;
    
    // Add to beginning of completed
    completedContainer.insertBefore(completedItem, completedContainer.firstChild);
    
    // Limit to 5 items
    const items = completedContainer.querySelectorAll('.completed-item');
    if (items.length > 5) {
        items[5].remove();
    }
    
    showNotification(`Mission completed: ${missionTitle}`, 'success');
}

function startShieldSimulation() {
    // Simulate periodic updates
    setInterval(() => {
        // Randomly update one insight
        const insights = document.querySelectorAll('.insight-card');
        if (insights.length > 0) {
            const randomInsight = insights[Math.floor(Math.random() * insights.length)];
            const timeElement = randomInsight.querySelector('.time-stamp');
            if (timeElement) {
                const minutes = Math.floor(Math.random() * 60);
                timeElement.textContent = `${minutes} minutes ago`;
            }
        }
        
        // Occasionally add new suggestion
        if (Math.random() > 0.8) {
            addRandomSuggestion();
        }
    }, 30000); // Every 30 seconds
}

function addRandomSuggestion() {
    const suggestions = [
        {
            icon: "🎯",
            text: "<strong>Learning Break:</strong> Try 10 minutes of physical activity before next session"
        },
        {
            icon: "📚",
            text: "<strong>Reading Time:</strong> Switch to educational ebook for 15 minutes"
        },
        {
            icon: "🧩",
            text: "<strong>Puzzle Time:</strong> Suggest offline puzzle game instead of video"
        }
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    
    if (suggestionsContainer) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion';
        suggestionDiv.innerHTML = `
            <div class="suggestion-icon">${randomSuggestion.icon}</div>
            <div class="suggestion-text">${randomSuggestion.text}</div>
            <button class="btn-send-suggestion">Send to Child</button>
        `;
        
        // Add to top
        suggestionsContainer.appendChild(suggestionDiv);
        
        // Add event listener
        suggestionDiv.querySelector('.btn-send-suggestion').addEventListener('click', function() {
            alert('Suggestion sent to child!');
        });
        
        // Remove after 2 minutes
        setTimeout(() => {
            if (suggestionDiv.parentElement) {
                suggestionDiv.remove();
            }
        }, 120000);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            z-index: 10000;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        .notification-success {
            border-left: 4px solid #10B981;
        }
        
        .notification-info {
            border-left: 4px solid #3B82F6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: #e2e8f0;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 1.2rem;
            line-height: 1;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}