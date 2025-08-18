class ReviewAnswersManager {
    constructor() {
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];
        this.correctAnswers = [];
        this.score = 0;
        this.totalQuestions = 0;
    }

    initialize(testData, userAnswers, score) {
        this.questions = testData.questions || [];
        this.userAnswers = userAnswers || [];
        this.correctAnswers = this.questions.map(q => q.correctAnswer);
        this.score = score || 0;
        this.totalQuestions = this.questions.length;
        this.currentQuestionIndex = 0;
        
        this.setupEventListeners();
        this.displayCurrentQuestion();
        this.updateQuestionCounter();
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prev-question-btn');
        const nextBtn = document.getElementById('next-question-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.backToMenu());
        }
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= this.questions.length) {
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        const correctAnswer = this.correctAnswers[this.currentQuestionIndex];
        const isCorrect = userAnswer === correctAnswer;

        // Update question display
        const questionElement = document.getElementById('review-question');
        if (questionElement) {
            questionElement.textContent = question.question || question.text;
        }

        // Update options display
        const optionsContainer = document.getElementById('review-options');
        if (optionsContainer && question.options) {
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option-review';
                
                // Add classes based on answer status
                if (option === correctAnswer) {
                    optionElement.classList.add('correct-answer');
                }
                if (option === userAnswer && !isCorrect) {
                    optionElement.classList.add('incorrect-answer');
                }
                if (option === userAnswer) {
                    optionElement.classList.add('user-selected');
                }
                
                optionElement.textContent = option;
                optionsContainer.appendChild(optionElement);
            });
        }

        // Update answer status
        const statusElement = document.getElementById('answer-status');
        if (statusElement) {
            statusElement.textContent = isCorrect ? 'Correct' : 'Incorrect';
            statusElement.className = isCorrect ? 'status-correct' : 'status-incorrect';
        }

        // Update explanation if available
        const explanationElement = document.getElementById('explanation');
        if (explanationElement) {
            if (question.explanation) {
                explanationElement.textContent = question.explanation;
                explanationElement.style.display = 'block';
            } else {
                explanationElement.style.display = 'none';
            }
        }

        this.updateNavigationButtons();
    }

    updateQuestionCounter() {
        const counterElement = document.getElementById('question-counter');
        if (counterElement) {
            counterElement.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question-btn');
        const nextBtn = document.getElementById('next-question-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentQuestionIndex === this.totalQuestions - 1;
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
            this.updateQuestionCounter();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
            this.updateQuestionCounter();
        }
    }

    backToMenu() {
        // Navigate back to main menu
        if (window.viewManager) {
            window.viewManager.showView('menu');
        }
    }
}

// Make it globally available
window.ReviewAnswersManager = ReviewAnswersManager;
