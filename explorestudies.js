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

        // Learning path functionality
        const pathSteps = document.querySelectorAll('.path-step');
        const contentTitle = document.querySelector('.content-title');
        const progressText = document.querySelector('.progress-text');
        const playButton = document.querySelector('.play-button');
        const contentVideo = document.querySelector('.content-video');
        
        // Step content data
        const stepContent = {
            1: {
                title: "Introduction to Multiplication",
                content: `
                    <h3>What is Multiplication?</h3>
                    <p>Multiplication is a way of adding the same number multiple times. It's like repeated addition! For example, if you have 3 groups of 4 apples, instead of adding 4 + 4 + 4, you can multiply 3 × 4.</p>
                    
                    <h3>Multiplication Symbols</h3>
                    <p>We use different symbols to show multiplication:</p>
                    <p>• The "×" symbol: 3 × 4 = 12</p>
                    <p>• The "•" symbol: 3 • 4 = 12</p>
                    <p>• Parentheses: (3)(4) = 12</p>
                    
                    <h3>Key Terms</h3>
                    <p>• <strong>Factors</strong>: The numbers being multiplied (3 and 4 in 3 × 4)</p>
                    <p>• <strong>Product</strong>: The result of multiplication (12 in 3 × 4 = 12)</p>
                    
                    <h3>Real World Examples</h3>
                    <p>• If you have 5 bags with 2 candies in each, you have 5 × 2 = 10 candies total</p>
                    <p>• If there are 4 rows with 3 students in each, there are 4 × 3 = 12 students total</p>
                `
            },
            2: {
                title: "Multiplication Tables",
                content: `
                    <h3>Multiplication Tables</h3>
                    <p>Multiplication tables help us quickly find the product of two numbers. Let's learn the tables from 1 to 10!</p>
                    
                    <h3>Table of 2</h3>
                    <p>2 × 1 = 2</p>
                    <p>2 × 2 = 4</p>
                    <p>2 × 3 = 6</p>
                    <p>2 × 4 = 8</p>
                    <p>2 × 5 = 10</p>
                    
                    <h3>Table of 3</h3>
                    <p>3 × 1 = 3</p>
                    <p>3 × 2 = 6</p>
                    <p>3 × 3 = 9</p>
                    <p>3 × 4 = 12</p>
                    <p>3 × 5 = 15</p>
                    
                    <h3>Tips for Learning Tables</h3>
                    <p>• Practice regularly</p>
                    <p>• Use flashcards</p>
                    <p>• Sing multiplication songs</p>
                    <p>• Play multiplication games</p>
                `
            },
            3: {
                title: "Multiplication Properties",
                content: `
                    <h3>Commutative Property</h3>
                    <p>The order of factors doesn't change the product.</p>
                    <p>Example: 3 × 4 = 4 × 3 = 12</p>
                    
                    <h3>Associative Property</h3>
                    <p>How we group factors doesn't change the product.</p>
                    <p>Example: (2 × 3) × 4 = 2 × (3 × 4) = 24</p>
                    
                    <h3>Distributive Property</h3>
                    <p>Multiplying a number by a sum is the same as multiplying by each number and adding the products.</p>
                    <p>Example: 3 × (4 + 5) = (3 × 4) + (3 × 5) = 12 + 15 = 27</p>
                    
                    <h3>Identity Property</h3>
                    <p>Any number multiplied by 1 stays the same.</p>
                    <p>Example: 7 × 1 = 7</p>
                    
                    <h3>Zero Property</h3>
                    <p>Any number multiplied by 0 equals 0.</p>
                    <p>Example: 9 × 0 = 0</p>
                `
            }
        };

        pathSteps.forEach(step => {
            step.addEventListener('click', () => {
                // Remove active class from all steps
                pathSteps.forEach(s => s.classList.remove('active'));
                // Add active class to clicked step
                step.classList.add('active');
                
                // Update content based on step
                const stepNumber = step.getAttribute('data-step');
                if (stepContent[stepNumber]) {
                    contentTitle.textContent = stepContent[stepNumber].title;
                    document.querySelector('.content-text').innerHTML = stepContent[stepNumber].content;
                    progressText.textContent = `Step ${stepNumber} of 5`;
                }
            });
        });

        // Video play functionality
        playButton.addEventListener('click', () => {
            alert('In a real implementation, this would play an educational video about multiplication.');
        });

        // Game buttons functionality
        const gameButtons = document.querySelectorAll('.btn-play');
        gameButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('This would launch the selected educational game.');
            });
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
        });