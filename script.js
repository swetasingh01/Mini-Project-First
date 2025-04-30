// Particle animation
function createParticles() {
    const particles = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = 
            Math.random() * 10 + 5 + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particles.appendChild(particle);
    }
}
createParticles();

// Calculator logic
const display = document.querySelector('.display');
let currentValue = '0';
let shouldResetDisplay = false;

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        
        if (value === 'C') {
            clearDisplay();
        } else if (value === '⌫') {
            deleteLastChar();
        } else if (value === '=') {
            calculate();
        } else {
            appendValue(value);
        }
    });
});

function appendValue(value) {
    if (currentValue === '0' || shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    
    if (value === '×') value = '*';
    if (value === '÷') value = '/';
    if (value === '−') value = '-';
    
    currentValue += value;
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastChar() {
    currentValue = currentValue.slice(0, -1) || '0';
    updateDisplay();
}

function calculate() {
    try {
        currentValue = eval(currentValue).toString();
        updateDisplay();
        shouldResetDisplay = true;
    } catch (error) {
        currentValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function updateDisplay() {
    display.textContent = currentValue.replace('*', '×').replace('/', '÷').replace('-', '−');
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
        appendValue(e.key);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLastChar();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});