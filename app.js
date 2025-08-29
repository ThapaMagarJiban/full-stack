// Global variables and calculator object
let calculator = {
    currentDisplay: '0',
    previousDisplay: '',
    operation: null,
    waitingForOperand: false,
    history: [],

    // Clear all
    clear: function() {
        this.currentDisplay = '0';
        this.previousDisplay = '';
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    },

    // Input number
    inputNumber: function(num) {
        if (this.waitingForOperand) {
            this.currentDisplay = num;
            this.waitingForOperand = false;
        } else {
            this.currentDisplay = this.currentDisplay === '0' ? num : this.currentDisplay + num;
        }
        this.updateDisplay();
    },

    // Input decimal point
    inputDecimal: function() {
        if (this.waitingForOperand) {
            this.currentDisplay = '0.';
            this.waitingForOperand = false;
        } else if (this.currentDisplay.indexOf('.') === -1) {
            this.currentDisplay += '.';
        }
        this.updateDisplay();
    },

    // Set operation
    setOperation: function(nextOperation) {
        const inputValue = parseFloat(this.currentDisplay);

        if (this.previousDisplay === '') {
            this.previousDisplay = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousDisplay || 0;
            const newValue = this.performCalculation(this.operation, currentValue, inputValue);

            this.currentDisplay = String(newValue);
            this.previousDisplay = newValue;
        }

        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.updateHistory();
        this.updateDisplay();
        this.highlightOperator(nextOperation);
    },

    // Perform calculation
    performCalculation: function(operation, firstOperand, secondOperand) {
        switch (operation) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                if (secondOperand === 0) {
                    alert('Error: Division by zero');
                    return firstOperand;
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    },

    // Calculate result
    calculate: function() {
        const inputValue = parseFloat(this.currentDisplay);

        if (this.previousDisplay !== '' && this.operation) {
            const newValue = this.performCalculation(this.operation, this.previousDisplay, inputValue);
            
            // Add to history
            this.history.push(`${this.previousDisplay} ${this.operation} ${inputValue} = ${newValue}`);
            
            this.currentDisplay = String(newValue);
            this.previousDisplay = '';
            this.operation = null;
            this.waitingForOperand = true;
            this.updateDisplay();
            this.clearOperatorHighlight();
        }
    },

    // Toggle sign
    toggleSign: function() {
        if (this.currentDisplay !== '0') {
            this.currentDisplay = this.currentDisplay.charAt(0) === '-' 
                ? this.currentDisplay.slice(1) 
                : '-' + this.currentDisplay;
        }
        this.updateDisplay();
    },

    // Percentage
    percentage: function() {
        const value = parseFloat(this.currentDisplay);
        this.currentDisplay = String(value / 100);
        this.updateDisplay();
    },

    // Update display
    updateDisplay: function() {
        const currentElement = document.getElementById('calc-current');
        if (currentElement) {
            currentElement.textContent = this.currentDisplay;
        }
        
        // Also update any preview calculator display
        const previewDisplay = document.querySelector('.calc-display');
        if (previewDisplay) {
            previewDisplay.textContent = this.currentDisplay;
        }
    },

    // Update history display
    updateHistory: function() {
        const historyElement = document.getElementById('calc-history');
        if (historyElement && this.previousDisplay && this.operation) {
            historyElement.textContent = `${this.previousDisplay} ${this.operation}`;
        }
    },

    // Highlight active operator
    highlightOperator: function(operation) {
        this.clearOperatorHighlight();
        const buttons = document.querySelectorAll('.operator-btn');
        buttons.forEach(button => {
            if (button.textContent === operation) {
                button.classList.add('active');
            }
        });
    },

    // Clear operator highlight
    clearOperatorHighlight: function() {
        const buttons = document.querySelectorAll('.operator-btn');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
    }
};

// Color theme system
let colorThemes = {
    current: 'dark',
    
    themes: {
        dark: {
            background: '#1f2121',
            surface: '#262828',
            text: '#f5f5f5',
            accent: '#32b8cd'
        },
        light: {
            background: '#fcfcf9',
            surface: '#fffffe',
            text: '#134252',
            accent: '#21808d'
        },
        blue: {
            background: '#0f1419',
            surface: '#1e2a3a',
            text: '#e6f1ff',
            accent: '#3b82f6'
        },
        green: {
            background: '#0a1f0a',
            surface: '#1a2f1a',
            text: '#e6ffe6',
            accent: '#10b981'
        }
    },

    applyTheme: function(themeName) {
        if (!this.themes[themeName]) return;
        
        this.current = themeName;
        const theme = this.themes[themeName];
        
        // Apply to body
        document.body.className = `theme-${themeName}`;
        
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
            }
        });
        
        // Apply to color preview
        this.updateColorPreview();
    },

    updateColorPreview: function() {
        const preview = document.getElementById('color-preview');
        if (preview) {
            const theme = this.themes[this.current];
            preview.style.background = theme.background;
            preview.style.color = theme.text;
            preview.style.borderColor = theme.accent;
            
            const btn = preview.querySelector('.preview-btn');
            if (btn) {
                btn.style.background = theme.accent;
                btn.style.color = theme.background;
            }
        }
    }
};

// Full stack demo data
let fullStackDemo = {
    submissions: [],
    
    submitForm: function(formData) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const submission = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    ...formData
                };
                
                this.submissions.push(submission);
                this.logToBackend(`📝 New submission received: ${formData.name}`, 'success');
                this.logToBackend(`💾 Data saved to database with ID: ${submission.id}`, 'success');
                this.updateStoredData();
                
                resolve(submission);
            }, 1500);
        });
    },
    
    logToBackend: function(message, type = 'info') {
        const logContainer = document.getElementById('backend-log');
        if (logContainer) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    },
    
    updateStoredData: function() {
        const dataContainer = document.getElementById('stored-data');
        if (dataContainer) {
            if (this.submissions.length === 0) {
                dataContainer.innerHTML = '<em>No data submitted yet...</em>';
            } else {
                dataContainer.innerHTML = this.submissions.map(submission => `
                    <div class="data-entry">
                        <strong>ID:</strong> ${submission.id}<br>
                        <strong>Name:</strong> ${submission.name}<br>
                        <strong>Email:</strong> ${submission.email}<br>
                        <strong>Message:</strong> ${submission.message.substring(0, 50)}${submission.message.length > 50 ? '...' : ''}<br>
                        <strong>Submitted:</strong> ${submission.timestamp}
                    </div>
                `).join('');
            }
        }
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Hide loading screen after a delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            console.log('Loading screen hidden');
        }
    }, 1500);

    // Initialize all components
    initializeNavigation();
    initializeScrollAnimations();
    initializeSkillsAnimation();
    initializeMobileNav();
    initializeConsole();
    initializeEditors();
    initializeColorTools();
    initializeFullStackDemo();
    
    // Initialize calculator with proper event binding
    initializeCalculator();
    
    console.log('App initialization complete');
}

function initializeCalculator() {
    console.log('Initializing calculator...');
    
    // Make sure the calculator display is properly initialized
    calculator.updateDisplay();
    
    // Test to make sure calculator functions are available globally
    if (window.calculator) {
        console.log('Calculator object available globally');
    } else {
        window.calculator = calculator;
        console.log('Calculator object added to global scope');
    }
}

function initializeNavigation() {
    console.log('Initializing navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            console.log('Navigation clicked:', targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                console.log('Scrolling to position:', targetPosition);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link and scroll indicator on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / documentHeight) * 100, 100);
        
        // Update scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.width = scrollPercent + '%';
        }

        // Update active nav link
        let current = '';
        const navbarHeight = 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initializeScrollAnimations() {
    if (!window.IntersectionObserver) {
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in');
            }
        });
    }, observerOptions);

    // Observe all cards and major elements
    const animatedElements = document.querySelectorAll('.stack-card, .feature-card, .layout-card, .concept-card, .contact-item, .skill-item');
    animatedElements.forEach(el => observer.observe(el));
}

function initializeSkillsAnimation() {
    if (!window.IntersectionObserver) {
        return;
    }

    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress');
                
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => skillsObserver.observe(item));
}

function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

function initializeConsole() {
    const consoleInput = document.getElementById('console-input');
    const consoleOutput = document.getElementById('console-output');
    
    if (consoleInput && consoleOutput) {
        consoleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    executeCommand(command);
                    this.value = '';
                }
            }
        });
    }
    
    function executeCommand(command) {
        // Add input to output
        addToConsole('> ' + command, 'console-text');
        
        try {
            // Simple command evaluation
            let result;
            if (command.startsWith('console.log')) {
                const match = command.match(/console\.log\((.*)\)/);
                if (match) {
                    result = eval(match[1]);
                    addToConsole(result, 'console-text');
                }
            } else {
                result = eval(command);
                if (result !== undefined) {
                    addToConsole(result, 'console-text');
                }
            }
        } catch (error) {
            addToConsole('Error: ' + error.message, 'console-error');
        }
    }
    
    function addToConsole(text, className) {
        if (!consoleOutput) return;
        
        const consoleLine = document.createElement('div');
        consoleLine.className = 'console-line';
        consoleLine.innerHTML = `<span class="console-prompt">></span><span class="${className}">${text}</span>`;
        consoleOutput.appendChild(consoleLine);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
}

function initializeEditors() {
    // HTML Editor
    const htmlEditor = document.getElementById('html-editor');
    const htmlPreview = document.getElementById('html-preview');
    
    if (htmlEditor && htmlPreview) {
        htmlEditor.addEventListener('input', function() {
            updateHtmlPreview();
        });
    }
    
    // CSS Editor
    const cssEditor = document.getElementById('css-editor');
    const cssPreview = document.getElementById('css-preview');
    
    if (cssEditor && cssPreview) {
        cssEditor.addEventListener('input', function() {
            updateCssPreview();
        });
    }
}

function initializeColorTools() {
    // Theme switcher
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            console.log('Theme button clicked:', theme);
            colorThemes.applyTheme(theme);
        });
    });

    // Color picker
    const bgColor = document.getElementById('bg-color');
    const textColor = document.getElementById('text-color');
    const accentColor = document.getElementById('accent-color');

    [bgColor, textColor, accentColor].forEach(input => {
        if (input) {
            input.addEventListener('input', updateLiveColorPreview);
        }
    });

    // Gradient generator
    const gradientDirection = document.getElementById('gradient-direction');
    const gradientStart = document.getElementById('gradient-start');
    const gradientEnd = document.getElementById('gradient-end');

    [gradientDirection, gradientStart, gradientEnd].forEach(input => {
        if (input) {
            input.addEventListener('input', updateGradientPreview);
        }
    });

    // Initialize gradient preview
    updateGradientPreview();
    updateLiveColorPreview();
}

function initializeFullStackDemo() {
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
        demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('demo-name').value,
                email: document.getElementById('demo-email').value,
                message: document.getElementById('demo-message').value
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Log frontend activity
            fullStackDemo.logToBackend('📤 Frontend: Form submission initiated');
            fullStackDemo.logToBackend('🔄 Frontend: Validating form data...');
            fullStackDemo.logToBackend('✅ Frontend: Validation passed');
            fullStackDemo.logToBackend('🌐 Frontend: Sending POST request to /api/contact');
            
            try {
                const submission = await fullStackDemo.submitForm(formData);
                
                // Show success message
                showFormStatus('Message sent successfully! ✅', 'success');
                
                // Reset form
                this.reset();
                
            } catch (error) {
                fullStackDemo.logToBackend('❌ Error: ' + error.message, 'error');
                showFormStatus('Failed to send message. Please try again. ❌', 'error');
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
}

function showFormStatus(message, type) {
    const statusElement = document.getElementById('form-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        statusElement.classList.remove('hidden');
        
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 3000);
    }
}

function updateHtmlPreview() {
    const htmlEditor = document.getElementById('html-editor');
    const htmlPreview = document.getElementById('html-preview');
    
    if (htmlEditor && htmlPreview) {
        try {
            const htmlContent = htmlEditor.value;
            const previewDoc = htmlPreview.contentDocument || htmlPreview.contentWindow.document;
            previewDoc.open();
            previewDoc.write(htmlContent);
            previewDoc.close();
        } catch (error) {
            console.error('Error updating HTML preview:', error);
        }
    }
}

function updateCssPreview() {
    const cssEditor = document.getElementById('css-editor');
    const cssPreview = document.getElementById('css-preview');
    
    if (cssEditor && cssPreview) {
        try {
            const cssContent = cssEditor.value;
            
            // Remove existing style element
            const existingStyle = cssPreview.querySelector('style');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            // Add new style element
            const styleElement = document.createElement('style');
            styleElement.textContent = cssContent;
            cssPreview.appendChild(styleElement);
        } catch (error) {
            console.error('Error updating CSS preview:', error);
        }
    }
}

function updateLiveColorPreview() {
    const bgColor = document.getElementById('bg-color');
    const textColor = document.getElementById('text-color');
    const accentColor = document.getElementById('accent-color');
    const preview = document.getElementById('color-preview');
    
    if (bgColor && textColor && accentColor && preview) {
        preview.style.background = bgColor.value;
        preview.style.color = textColor.value;
        preview.style.borderColor = accentColor.value;
        
        const btn = preview.querySelector('.preview-btn');
        if (btn) {
            btn.style.background = accentColor.value;
            btn.style.color = bgColor.value;
        }
    }
}

function updateGradientPreview() {
    const direction = document.getElementById('gradient-direction');
    const startColor = document.getElementById('gradient-start');
    const endColor = document.getElementById('gradient-end');
    const preview = document.getElementById('gradient-preview');
    const codeElement = document.getElementById('gradient-code');
    
    if (direction && startColor && endColor && preview && codeElement) {
        let gradientCSS;
        const dir = direction.value;
        const start = startColor.value;
        const end = endColor.value;
        
        if (dir === 'circle') {
            gradientCSS = `radial-gradient(circle, ${start}, ${end})`;
        } else {
            gradientCSS = `linear-gradient(${dir}, ${start}, ${end})`;
        }
        
        preview.style.background = gradientCSS;
        codeElement.textContent = `background: ${gradientCSS};`;
    }
}

// Modal Functions - Global scope
function showArchitecture() {
    console.log('Opening architecture modal...');
    openModal('architecture-modal');
}

function openLiveDemo() {
    console.log('Opening full stack live demo...');
    openModal('fullstack-demo-modal');
}

function openHtmlEditor() {
    console.log('Opening HTML editor...');
    openModal('html-editor-modal');
    // Trigger initial preview update after modal is visible
    setTimeout(() => {
        updateHtmlPreview();
    }, 300);
}

function showDomTree() {
    console.log('Opening DOM tree...');
    const domTreeContent = `
    <div style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #0ff; border-radius: 8px;">
        <h3>HTML DOM Tree Structure</h3>
        <pre style="text-align: left; background: #000; padding: 15px; border-radius: 5px; overflow-x: auto;">
html
├── head
│   ├── meta (charset)
│   ├── meta (viewport) 
│   ├── title
│   └── link (stylesheets)
└── body
    ├── nav
    │   └── ul
    │       └── li > a (navigation links)
    ├── main
    │   ├── section#profile
    │   │   ├── h1 (title)
    │   │   ├── p (description)
    │   │   └── div.skills
    │   ├── section#fullstack
    │   ├── section#html
    │   ├── section#css
    │   ├── section#bootstrap
    │   └── section#javascript
    └── div.modals
        </pre>
        <p><em>Interactive DOM tree visualization would show expandable/collapsible nodes.</em></p>
    </div>`;
    
    showCustomModal('DOM Tree Visualization', domTreeContent);
}

function openCssPlayground() {
    console.log('Opening CSS playground...');
    openModal('css-playground-modal');
    // Trigger initial preview update after modal is visible
    setTimeout(() => {
        updateCssPreview();
    }, 300);
}

function applyAllStyles() {
    console.log('Applying all CSS styles...');
    
    // Get current color values
    const bgColor = document.getElementById('bg-color')?.value || '#1f2121';
    const textColor = document.getElementById('text-color')?.value || '#f5f5f5';
    const accentColor = document.getElementById('accent-color')?.value || '#32b8cd';
    
    // Create temporary style element
    const tempStyle = document.createElement('style');
    tempStyle.id = 'temp-applied-styles';
    tempStyle.textContent = `
        body { 
            background-color: ${bgColor} !important; 
            color: ${textColor} !important;
            transition: all 0.5s ease;
        }
        .section { 
            background-color: ${bgColor} !important; 
        }
        .btn--primary { 
            background-color: ${accentColor} !important;
            border-color: ${accentColor} !important;
        }
        .nav-brand, .section-header h2 { 
            color: ${accentColor} !important;
        }
    `;
    
    document.head.appendChild(tempStyle);
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${accentColor};
        color: ${bgColor};
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = 'Styles Applied! ✨';
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (tempStyle) tempStyle.remove();
        if (notification) notification.remove();
    }, 3000);
}

function openGridBuilder() {
    console.log('Opening grid builder...');
    const gridContent = `
    <div style="padding: 20px;">
        <h3>Bootstrap Grid System Builder</h3>
        <div style="margin: 20px 0;">
            <h4>12-Column Grid Examples:</h4>
            <div style="margin: 15px 0; padding: 10px; background: rgba(119, 124, 124, 0.1); border-radius: 5px;">
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <div style="flex: 1; background: #32b8cd; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-12</div>
                </div>
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <div style="flex: 0.5; background: #e66161; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-6</div>
                    <div style="flex: 0.5; background: #e66161; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-6</div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <div style="flex: 0.33; background: #e68161; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-4</div>
                    <div style="flex: 0.33; background: #e68161; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-4</div>
                    <div style="flex: 0.33; background: #e68161; color: white; padding: 8px; text-align: center; border-radius: 3px;">col-4</div>
                </div>
            </div>
            <h4>Responsive Breakpoints:</h4>
            <ul style="text-align: left;">
                <li><strong>xs:</strong> &lt;576px (Extra small devices)</li>
                <li><strong>sm:</strong> ≥576px (Small devices)</li>
                <li><strong>md:</strong> ≥768px (Medium devices)</li>
                <li><strong>lg:</strong> ≥992px (Large devices)</li>
                <li><strong>xl:</strong> ≥1200px (Extra large devices)</li>
            </ul>
        </div>
    </div>`;
    
    showCustomModal('Bootstrap Grid Builder', gridContent);
}

function showComponentGallery() {
    console.log('Opening component gallery...');
    const componentContent = `
    <div style="padding: 20px;">
        <h3>Bootstrap Component Gallery</h3>
        <div style="display: grid; gap: 20px; margin: 20px 0;">
            <div>
                <h4>Buttons</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button style="background: #32b8cd; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Primary</button>
                    <button style="background: #626868; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Secondary</button>
                    <button style="background: #5d878f; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Success</button>
                    <button style="background: transparent; color: #32b8cd; border: 1px solid #32b8cd; padding: 8px 16px; border-radius: 4px;">Outline</button>
                </div>
            </div>
            <div>
                <h4>Alerts</h4>
                <div style="background: rgba(93, 135, 143, 0.2); color: #5d878f; padding: 12px; border-radius: 4px; border: 1px solid rgba(93, 135, 143, 0.5); margin-bottom: 10px;">
                    Success alert - This is a success message!
                </div>
                <div style="background: rgba(255, 84, 89, 0.2); color: #ff5459; padding: 12px; border-radius: 4px; border: 1px solid rgba(255, 84, 89, 0.5);">
                    Danger alert - Something went wrong!
                </div>
            </div>
            <div>
                <h4>Cards</h4>
                <div style="background: rgba(119, 124, 124, 0.1); border: 1px solid rgba(119, 124, 124, 0.3); border-radius: 8px; padding: 20px; max-width: 300px;">
                    <h5 style="margin: 0 0 10px 0; color: #f5f5f5;">Card Title</h5>
                    <p style="margin: 0; color: #a7a9a9;">This is a sample card component with some content.</p>
                </div>
            </div>
        </div>
    </div>`;
    
    showCustomModal('Bootstrap Component Gallery', componentContent);
}

function openJsConsole() {
    console.log('Opening JS console...');
    openModal('js-console-modal');
    // Focus on console input after modal opens
    setTimeout(() => {
        const consoleInput = document.getElementById('console-input');
        if (consoleInput) {
            consoleInput.focus();
        }
    }, 300);
}

function showMiniProjects() {
    console.log('Opening mini projects...');
    const projectsContent = `
    <div style="padding: 20px;">
        <h3>JavaScript Mini Projects</h3>
        <div style="display: grid; gap: 20px; margin: 20px 0;">
            <div style="border: 1px solid rgba(119, 124, 124, 0.3); border-radius: 8px; padding: 15px;">
                <h4>🧮 Advanced Calculator</h4>
                <p>Scientific calculator with memory functions, history, and expression evaluation.</p>
                <div style="background: rgba(119, 124, 124, 0.1); padding: 10px; border-radius: 4px; font-family: monospace;">
                    Features: +, -, ×, ÷, sin, cos, tan, log, sqrt, π, e
                </div>
            </div>
            <div style="border: 1px solid rgba(119, 124, 124, 0.3); border-radius: 8px; padding: 15px;">
                <h4>📝 Todo List App</h4>
                <p>Task management with categories, due dates and persistence.</p>
                <div style="background: rgba(119, 124, 124, 0.1); padding: 10px; border-radius: 4px; font-family: monospace;">
                    Features: Add/edit/delete tasks, filtering, drag & drop reordering
                </div>
            </div>
            <div style="border: 1px solid rgba(119, 124, 124, 0.3); border-radius: 8px; padding: 15px;">
                <h4>🌤️ Weather Dashboard</h4>
                <p>Real-time weather data with forecasts and location-based updates.</p>
                <div style="background: rgba(119, 124, 124, 0.1); padding: 10px; border-radius: 4px; font-family: monospace;">
                    API Integration: OpenWeatherMap, geolocation, responsive charts
                </div>
            </div>
            <div style="border: 1px solid rgba(119, 124, 124, 0.3); border-radius: 8px; padding: 15px;">
                <h4>🧠 Memory Game</h4>
                <p>Card matching game with difficulty levels and score tracking.</p>
                <div style="background: rgba(119, 124, 124, 0.1); padding: 10px; border-radius: 4px; font-family: monospace;">
                    Features: Timer, move counter, high scores, animations
                </div>
            </div>
        </div>
        <p style="text-align: center; font-style: italic; color: #a7a9a9;">
            Each project demonstrates different JavaScript concepts and best practices.
        </p>
    </div>`;
    
    showCustomModal('JavaScript Mini Projects', projectsContent);
}

function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Add click outside to close
        const clickHandler = function(e) {
            if (e.target === modal) {
                closeModal(modalId);
                modal.removeEventListener('click', clickHandler);
            }
        };
        modal.addEventListener('click', clickHandler);
        
        // Add escape key to close
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function showCustomModal(title, content) {
    // Create a temporary modal for custom content
    const existingCustomModal = document.getElementById('custom-modal');
    if (existingCustomModal) {
        existingCustomModal.remove();
    }
    
    const customModal = document.createElement('div');
    customModal.id = 'custom-modal';
    customModal.className = 'modal';
    customModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal" onclick="closeCustomModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(customModal);
    
    // Show the modal
    setTimeout(() => {
        customModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }, 10);
    
    // Add click outside to close
    customModal.addEventListener('click', function(e) {
        if (e.target === customModal) {
            closeCustomModal();
        }
    });
}

function closeCustomModal() {
    const customModal = document.getElementById('custom-modal');
    if (customModal) {
        customModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            customModal.remove();
        }, 300);
    }
}

// Make functions globally available
window.showArchitecture = showArchitecture;
window.openLiveDemo = openLiveDemo;
window.openHtmlEditor = openHtmlEditor;
window.showDomTree = showDomTree;
window.openCssPlayground = openCssPlayground;
window.applyAllStyles = applyAllStyles;
window.openGridBuilder = openGridBuilder;
window.showComponentGallery = showComponentGallery;
window.openJsConsole = openJsConsole;
window.showMiniProjects = showMiniProjects;
window.closeModal = closeModal;
window.closeCustomModal = closeCustomModal;
window.calculator = calculator;