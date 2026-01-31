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

            // Animate chart bars on page load
            const chartBars = document.querySelectorAll('.chart-bar');
            chartBars.forEach(bar => {
                const height = bar.style.height;
                bar.style.height = '0';
                setTimeout(() => {
                    bar.style.height = height;
                }, 800);
            });
        });