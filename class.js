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

        // Class navigation functionality
        const classTabs = document.querySelectorAll('.class-tab');
        const classContents = document.querySelectorAll('.class-content');

        classTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                classTabs.forEach(t => t.classList.remove('active'));
                classContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const classId = `class-${tab.getAttribute('data-class')}`;
                document.getElementById(classId).classList.add('active');
            });
        });

        // Button functionality
        const exploreButtons = document.querySelectorAll('.btn-explore');
        const viewButtons = document.querySelectorAll('.btn-view');

        exploreButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('This would navigate to the games page with filtered games for this subject.');
            });
        });

        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('This would show detailed information about the subject curriculum.');
            });
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            
            // Animate progress bars on page load
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });