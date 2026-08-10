/**
 * 🤖 DASA AI 2.0 — Advanced Memory-Based RAG Assistant Engine
 * 
 * Capabilities:
 * - Stateful Conversation Memory (Name recognition, topic tracking, contextual follow-ups)
 * - Session Persistence (Remembers conversation across page reloads via sessionStorage)
 * - Comprehensive Portfolio Knowledge Base (Bio, Skills, Projects, Education, Insurance Career, Contact)
 * - Multilingual Support (English, Nepali, Hindi, Spanish, French, German, Japanese, Arabic)
 * - Safety Guardrails & SOS Emergency Protocol
 * - Interactive Dynamic Action Chips & Audio Feedback
 */

(function () {
    'use strict';

    // ==========================================
    // 1. STATEFUL MEMORY SYSTEM & PERSISTENCE
    // ==========================================
    const MEMORY_STORAGE_KEY = 'dasa_ai_state_v2';
    const CHAT_STORAGE_KEY = 'dasa_ai_messages_v2';

    let state = {
        userName: null,
        lastTopic: null,
        turnCount: 0,
        askedQuestions: []
    };

    function loadMemory() {
        try {
            const savedState = sessionStorage.getItem(MEMORY_STORAGE_KEY);
            if (savedState) {
                state = Object.assign(state, JSON.parse(savedState));
            }
        } catch (e) {
            console.warn('Dasa AI: Unable to access sessionStorage', e);
        }
    }

    function saveMemory() {
        try {
            sessionStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function clearMemory() {
        state = { userName: null, lastTopic: null, turnCount: 0, askedQuestions: [] };
        try {
            sessionStorage.removeItem(MEMORY_STORAGE_KEY);
            sessionStorage.removeItem(CHAT_STORAGE_KEY);
        } catch (e) {}
    }

    loadMemory();

    // ==========================================
    // 2. MULTILINGUAL GREETINGS DATABASE
    // ==========================================
    const GREETINGS = [
        {
            patterns: [
                /hi\b/i, /hello\b/i, /hey\b/i, /yo\b/i, /hiya\b/i, /howdy\b/i, /sup\b/i, /greetings\b/i,
                /good morning/i, /good afternoon/i, /good evening/i, /morning\b/i, /afternoon\b/i, /evening\b/i,
                /how are you/i, /how's it going/i, /what's up/i, /nice to meet you/i
            ],
            response: function() {
                const greetingName = state.userName ? `, **${state.userName}**` : '';
                return `👋 Hello and a warm welcome${greetingName}! It is an absolute pleasure to connect with you! 🚀\n\nI am **Dasa AI 2.0**, Sanjaya's memory-powered virtual assistant. I remember our conversation and help you discover Sanjaya's skills, projects, and career details.\n\nWhat would you like to explore today?\n* 🛠️ **Technical Skills**\n* 📁 **Web Applications & Projects**\n* 🎓 **Academic Education**\n* 💼 **Work & Insurance Career**\n* ✉️ **Contact & Collaboration**`;
            }
        },
        {
            patterns: [
                /namaste\b/i, /namaskar\b/i, /sanchai\b/i, /k chha\b/i, /k cha\b/i, /k xa\b/i, /hazur\b/i, /hjur\b/i,
                /सञ्चै/i, /सन्चै/i, /के छ/i, /नमस्ते/i, /नमस्कार/i, /कस्तो छ/i
            ],
            response: function() {
                const greetingName = state.userName ? `, **${state.userName}**` : '';
                return `🙏 नमस्ते र न्यानो स्वागत छ${greetingName}! तपाईंसँग जोडिन पाउँदा मलाई अत्यन्तै खुसी लागेको छ। 😊\n\nम **दासा (Dasa) एआई २.०** हुँ। म सञ्जय कँडेलको सीप, प्रोजेक्टहरू, र शिक्षाका बारेमा जानकारी दिन तयार छु।\n\nआज म तपाईंलाई कसरी सहयोग गर्न सक्छु? सोध्नुहोस्!`;
            }
        },
        {
            patterns: [/namaste/i, /namaskar/i, /kaise ho/i, /kya haal/i, /नमस्ते/i, /नमस्कार/i, /कैसे हैं/i],
            response: function() {
                const greetingName = state.userName ? `, **${state.userName}**` : '';
                return `🙏 नमस्ते और आपका हार्दिक स्वागत है${greetingName}! आपसे मिलकर बहुत खुशी हुई। 😊\n\nमैं **दासा (Dasa) एआई २.०** हूँ, संजय कंदेल का वर्चुअल असिस्टेंट। पूछिए, आज मैं आपके लिए क्या जानकारी लेकर आऊँ?`;
            }
        },
        { patterns: [/hola/i, /buenos dias/i], response: () => "¡Hola! Soy **Dasa AI 2.0**, el asistente virtual de Sanjaya. ¿En qué puedo ayudarte hoy sobre sus habilidades o proyectos?" },
        { patterns: [/bonjour/i, /salut/i], response: () => "Bonjour! Je suis **Dasa AI 2.0**, l'assistant virtuel de Sanjaya. Comment puis-je vous aider aujourd'hui?" },
        { patterns: [/hallo/i, /guten tag/i], response: () => "Hallo! Ich bin **Dasa AI 2.0**, Sanjayas virtueller Assistent. Wie kann ich Ihnen heute helfen?" },
        { patterns: [/konnichiwa/i, /こんにちは/i], response: () => "こんにちは！私は **Dasa AI 2.0**（サञ्जयのバーチャルアシスタント）です。どのような情報をお探しですか？" }
    ];

    // ==========================================
    // 3. SAFETY GUARDRAILS & SOS PROTOCOL
    // ==========================================
    const SOS_PATTERNS = [/sos\b/i, /emergency/i, /urgent/i, /critical/i, /distress/i, /immediate contact/i];
    const SOS_RESPONSE = `🚨 **EMERGENCY / PRIORITY CONTACT ACTIVATED** 🚨\n\nIf you need immediate technical assistance, urgent hiring, or business collaboration:\n1. 📧 **Direct Email**: Send a priority message to **kandelsanjaya7@gmail.com**\n2. 📝 **Contact Form**: Scroll to the bottom **#contact** section of this page to submit your request directly.`;

    const GUARDRAILS = [
        { pattern: /phone|mobile|whatsapp|viber|call number|contact number/i, msg: "🛡️ **Privacy Policy**: Sanjaya's personal telephone number is kept private. You can contact him instantly via the **#contact** form or direct email (`kandelsanjaya7@gmail.com`)." },
        { pattern: /address|home|house|street|exact location/i, msg: "🛡️ **Privacy Policy**: Sanjaya's private home address is confidential. His general location is **Gaindakot, Nawalpur, Nepal**." },
        { pattern: /password|bank|credit card|salary|financial/i, msg: "🛡️ **Security Guardrail**: Confidential financial information and credentials are protected under strict security protocols." },
        { pattern: /hack|abuse|profanity|exploit|illegal|crack/i, msg: "⚠️ **Safety Policy**: As a professional AI Assistant, I operate strictly under ethical boundaries and cannot fulfill unauthorized requests." }
    ];

    // ==========================================
    // 4. COMPREHENSIVE RAG KNOWLEDGE BASE
    // ==========================================
    const KNOWLEDGE_BASE = [
        // Identity & Overview
        {
            topic: "identity",
            keywords: ["who", "sanjaya", "kandel", "about", "bio", "profile", "introduce", "programmer", "nepal", "developer"],
            content: "👨‍💻 **About Sanjaya Kandel**:\nSanjaya Kandel is a dedicated **Full Stack Web Developer**, **UI/UX Designer**, and **AI Enthusiast** based in Nepal. He specializes in Python (Django), modern JavaScript, responsive glassmorphism UIs, and RAG AI integrations."
        },
        {
            topic: "location",
            keywords: ["location", "live", "located", "where", "address", "gaindakot", "nawalpur", "nepal"],
            content: "📍 **Location**:\nSanjaya is based in **Gaindakot, Nawalpur**, situated in the Gandaki Province of **Nepal**."
        },
        {
            topic: "languages",
            keywords: ["languages", "speak", "multilingual", "english", "nepali", "hindi"],
            content: "🗣️ **Languages Spoken**:\nSanjaya is fluent in **English**, **Nepali**, and **Hindi**."
        },
        {
            topic: "career_goal",
            keywords: ["goal", "ambition", "future", "dream", "aim", "vision", "career"],
            content: "🎯 **Career Vision**:\nSanjaya aims to become a premier **AI Systems Engineer & Full Stack Architect**, connecting web platforms with LLM reasoning and automated workflows."
        },

        // Tech Stack & Programming Skills
        {
            topic: "backend",
            keywords: ["backend", "python", "django", "drf", "rest framework", "server", "api", "database", "sqlite", "mysql"],
            content: "⚙️ **Backend Engineering Stack**:\n- **Primary Framework**: Python & Django / Django REST Framework\n- **Databases**: SQLite (Development) & MySQL (Production)\n- **Features**: Custom authentication, ORM queries, API endpoints, dynamic PDF generators, and visitor analytics trackers."
        },
        {
            topic: "frontend",
            keywords: ["frontend", "javascript", "js", "html", "css", "styling", "flexbox", "grid", "responsive", "ui", "ux", "glassmorphism", "neon"],
            content: "🎨 **Frontend & UI/UX Stack**:\n- **Languages**: JavaScript (ES6+), HTML5, CSS3\n- **Design Aesthetics**: Custom Neon accents, Glassmorphism, Responsive CSS Grid/Flexbox, dynamic micro-animations, and light/dark theme toggling."
        },
        {
            topic: "skills_summary",
            keywords: ["skill", "skills", "tech stack", "technologies", "tools", "competencies", "expertise", "what can he do"],
            content: "🛠️ **Full Tech Stack & Tools**:\n- **Languages**: Python, JavaScript (ES6+), HTML5, CSS3, SQL\n- **Frameworks**: Django, Django REST Framework\n- **Databases**: SQLite, MySQL\n- **Dev Tools**: Git, GitHub, Figma, VS Code\n- **Specializations**: RAG AI Chatbots, Dynamic Web Systems, UI/UX Design."
        },
        {
            topic: "version_control",
            keywords: ["git", "github", "version control", "repository", "commits"],
            content: "🐙 **Git & GitHub**:\nSanjaya utilizes **Git** and **GitHub** for code version control, repository management, and structured project commits. Check out his profile at `github.com/kandelsanjaya`."
        },

        // Projects Portfolio
        {
            topic: "projects_overview",
            keywords: ["project", "projects", "portfolio", "work", "built", "apps", "websites", "showcase"],
            content: "🚀 **Featured Projects**:\n1. **Edusphere AI**: An AI-powered educational web app with RAG search & automated course assistance.\n2. **School ERP System**: Comprehensive school management system handling student records, attendance, fees, and report cards.\n3. **Sanjaya Portfolio (This Site)**: Full-stack Django 6.1 website with real-time visitor analytics, dynamic DB settings, PDF CV generator, and Dasa AI assistant.\n\n*Scroll down to the #projects section on this page to view live screenshots!*"
        },
        {
            topic: "edusphere_ai",
            keywords: ["edusphere", "edusphere ai", "education app", "ai course", "rag project"],
            content: "🤖 **Edusphere AI**:\nAn advanced educational web platform leveraging Retrieval-Augmented Generation (RAG) and PyTorch models to provide instant course Q&A, syllabus summaries, and automated student guidance."
        },
        {
            topic: "school_erp",
            keywords: ["school erp", "school management", "erp", "student system", "fee system"],
            content: "🏫 **School ERP System**:\nA full-featured school administration system built to streamline student enrollment, grade evaluation, monthly fee tracking, teacher management, and automated report card generation."
        },
        {
            topic: "portfolio_site",
            keywords: ["portfolio site", "this site", "django portfolio", "how was this site built"],
            content: "💻 **Sanjaya's Django Portfolio Website**:\nBuilt with Django 6.1, featuring:\n- Dynamic singleton SiteSettings backend\n- Visitor Analytics & Realtime IP Logging\n- Dasa AI 2.0 Memory-Based RAG Assistant\n- PDF CV Exporter & Interactive Business Card Modal\n- Glassmorphic UI with landscape iPhone video mockup."
        },

        // Education & Academic Background
        {
            topic: "education",
            keywords: ["education", "academic", "study", "university", "college", "degree", "csit", "bsc", "school", "high school", "qualification"],
            content: "🎓 **Academic Education**:\n- **Bachelor's Degree**: B.Sc. CSIT (Computer Science & Information Technology) at Birendra Multiple Campus, Tribhuvan University (TU).\n- **High School (+2 Science)**: Specialization in Computer Science & Mathematics.\n- **Schooling**: Primary and secondary education completed in Gaindakot, Nawalpur."
        },

        // Work Experience & Insurance Career
        {
            topic: "experience",
            keywords: ["experience", "work", "job", "career", "insurance", "agency manager", "reliable nepal", "freelance"],
            content: "💼 **Professional Experience**:\n- **Agency Manager**: Reliable Nepal Life Insurance (Managing agency network, client relations, financial risk planning, and team coordination).\n- **Full-Stack Freelance Developer**: Designing custom Django web platforms, REST APIs, and responsive UI systems for clients."
        },

        // Contact & Hiring Information
        {
            topic: "contact",
            keywords: ["contact", "email", "reach", "hire", "freelance", "message", "connect", "social", "github", "linkedin", "youtube", "tiktok"],
            content: "✉️ **Get In Touch with Sanjaya**:\n- 📧 **Official Email**: `kandelsanjaya7@gmail.com`\n- 📝 **Contact Form**: Scroll to the **#contact** section below to send a direct message.\n- 🐙 **GitHub**: `github.com/kandelsanjaya`\n- 💼 **Availability**: Open for Full-Stack Web Development, AI Integration, and Freelance Consultancies."
        },

        // Services & Capabilities
        {
            topic: "services",
            keywords: ["service", "services", "offer", "can you build", "hire for", "features", "custom web"],
            content: "🛠️ **Services Offered by Sanjaya**:\n1. **Full-Stack Web Development** (Django + REST API + Custom Frontend)\n2. **AI & RAG Chatbot Integration** (Retrieval Augmented Generation, Vector Search)\n3. **UI/UX Design & Prototyping** (Figma, Glassmorphism UIs, Responsive Grids)\n4. **Database & Backend Architecture** (MySQL, SQLite, ORM Optimization)."
        }
    ];

    // ==========================================
    // 5. MEMORY-AWARE QUERY RESOLVER & RAG ENGINE
    // ==========================================
    function extractAndSaveName(query) {
        const namePatterns = [
            /my name is ([a-zA-Z]{2,20})/i,
            /i am ([a-zA-Z]{2,20})/i,
            /call me ([a-zA-Z]{2,20})/i,
            /im ([a-zA-Z]{2,20})/i,
            /this is ([a-zA-Z]{2,20})/i
        ];
        for (const pattern of namePatterns) {
            const match = query.match(pattern);
            if (match && match[1]) {
                const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                const invalidWords = ['a', 'an', 'the', 'looking', 'here', 'testing', 'asking', 'student', 'developer'];
                if (!invalidWords.includes(name.toLowerCase())) {
                    state.userName = name;
                    saveMemory();
                    return name;
                }
            }
        }
        return null;
    }

    function retrieveContext(query) {
        const tokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
        let bestMatch = null;
        let highestScore = 0;

        for (const item of KNOWLEDGE_BASE) {
            let matchCount = 0;
            for (const token of tokens) {
                if (item.keywords.some(kw => kw.includes(token) || token.includes(kw))) {
                    matchCount += 1.5;
                }
            }
            if (matchCount > highestScore) {
                highestScore = matchCount;
                bestMatch = item;
            }
        }

        return { bestMatch, score: highestScore };
    }

    function generateRAGResponse(rawQuery) {
        const cleanQuery = rawQuery.trim();
        state.turnCount++;

        // Check for Name capture
        const newName = extractAndSaveName(cleanQuery);
        if (newName) {
            return `✨ Fantastic to meet you, **${newName}**! 🚀\n\nI have stored your name in my active conversation memory. How can I help you explore Sanjaya's portfolio today, ${newName}?`;
        }

        // Memory query for User Name
        if (/what is my name|do you know my name|who am i|my name/i.test(cleanQuery)) {
            if (state.userName) {
                return `😊 Yes, I remember! Your name is **${state.userName}**. It's great chatting with you, ${state.userName}!`;
            } else {
                return `I haven't caught your name yet! What should I call you? (e.g. type *"My name is Alex"*).`;
            }
        }

        // Memory query for Bot Identity
        if (/who are you|what is your name|dasa ai/i.test(cleanQuery)) {
            const nameAdd = state.userName ? `, **${state.userName}**` : '';
            return `🤖 I am **Dasa AI 2.0**${nameAdd}! I am Sanjaya Kandel's intelligent RAG assistant built with conversation memory. I can answer any questions about Sanjaya's education, skills, projects, and career.`;
        }

        // Check SOS Emergency
        if (SOS_PATTERNS.some(p => p.test(cleanQuery))) {
            return SOS_RESPONSE;
        }

        // Check Guardrails
        for (const guard of GUARDRAILS) {
            if (guard.pattern.test(cleanQuery)) {
                return guard.msg;
            }
        }

        // Contextual Follow-up Memory Check
        if (/tell me more|more details|explain that|first one|second one|what about that/i.test(cleanQuery) && state.lastTopic) {
            if (state.lastTopic === 'projects') {
                return "📁 **More About Sanjaya's Projects**:\nSanjaya has engineered multiple production-ready systems:\n- **Edusphere AI**: Features PyTorch & RAG query handling.\n- **School ERP System**: Handles multi-tenant school operations.\n- **Django Portfolio**: Fully responsive with real-time visitor analytics.";
            } else if (state.lastTopic === 'skills') {
                return "🛠️ **More About Sanjaya's Tech Skills**:\nSanjaya focuses heavily on Python backend development (Django, REST Framework) and clean JavaScript frontend logic, supported by MySQL/SQLite database optimizations.";
            } else if (state.lastTopic === 'education') {
                return "🎓 **More About Academic Background**:\nSanjaya is pursuing B.Sc. CSIT at Birendra Multiple Campus under Tribhuvan University, maintaining a strong foundation in computer science and algorithms.";
            }
        }

        // Check Multilingual Greetings
        for (const greet of GREETINGS) {
            if (greet.patterns.some(p => p.test(cleanQuery))) {
                return greet.response();
            }
        }

        // Knowledge Base Vector Match
        const { bestMatch, score } = retrieveContext(cleanQuery);
        if (bestMatch && score >= 1.2) {
            state.lastTopic = bestMatch.topic;
            saveMemory();
            
            let resultText = bestMatch.content;
            if (state.userName && Math.random() > 0.6) {
                resultText += `\n\n*(Hope this answers your question, ${state.userName}! Let me know if you need more details.)*`;
            }
            return resultText;
        }

        // Fallback Response
        const fallbackName = state.userName ? `, **${state.userName}**` : '';
        return `🤖 I am **Dasa AI 2.0**${fallbackName}, Sanjaya's intelligent portfolio assistant.\nI specialize in answering questions about Sanjaya's:\n- 🎓 **Education & B.Sc. CSIT Study**\n- 🛠️ **Technical Stack (Django, JS, Python)**\n- 📁 **Web Applications (Edusphere AI, ERP)**\n- 💼 **Work Experience (Reliable Nepal Life Insurance)**\n\n*Try asking: 'What projects has Sanjaya built?' or 'What are his skills?'*`;
    }

    // ==========================================
    // 6. DOM INITIALIZATION & EVENT WIRING
    // ==========================================
    document.addEventListener('DOMContentLoaded', function () {
        const widget = document.getElementById('metaChatbotWidget');
        const toggleBtn = document.getElementById('metaChatbotToggle');
        const closeBtn = document.getElementById('metaChatCloseBtn');
        const resetBtn = document.getElementById('metaChatResetBtn');
        const sendBtn = document.getElementById('metaChatSendBtn');
        const inputField = document.getElementById('metaChatInput');
        const messagesContainer = document.getElementById('metaChatMessages');
        const chipsContainer = document.getElementById('metaChatChips');
        const statusElement = widget ? widget.querySelector('.meta-chat-status') : null;

        if (!widget || !toggleBtn) return;

        // Restore chat history from sessionStorage if present
        function restoreChatHistory() {
            try {
                const savedMsgs = sessionStorage.getItem(CHAT_STORAGE_KEY);
                if (savedMsgs && messagesContainer) {
                    const parsed = JSON.parse(savedMsgs);
                    if (parsed && parsed.length > 0) {
                        messagesContainer.innerHTML = '';
                        parsed.forEach(m => renderMessageDiv(m.text, m.sender, false));
                    }
                }
            } catch (e) {}
        }

        function saveChatHistory(text, sender) {
            try {
                let msgs = [];
                const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
                if (saved) msgs = JSON.parse(saved);
                msgs.push({ text, sender });
                if (msgs.length > 30) msgs = msgs.slice(-30);
                sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
            } catch (e) {}
        }

        restoreChatHistory();

        // Speech bubble popup on load
        const popup = document.createElement('div');
        popup.className = 'meta-chatbot-popup';
        popup.innerHTML = state.userName ? `Welcome back, ${state.userName}! Dasa AI is ready.` : 'Hii, I am Dasa AI 2.0! How can I help you?';
        widget.appendChild(popup);

        setTimeout(() => {
            if (!widget.classList.contains('active')) {
                popup.style.opacity = '1';
                popup.style.transform = 'translateY(0)';
                setTimeout(() => {
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(10px)';
                    setTimeout(() => popup.remove(), 400);
                }, 5000);
            } else {
                popup.remove();
            }
        }, 1500);

        // Toggle widget open/close
        toggleBtn.addEventListener('click', function () {
            popup.remove();
            const isActive = widget.classList.toggle('active');
            const botImg = toggleBtn.querySelector('img.bot-icon');
            if (isActive) {
                if (botImg) botImg.classList.remove('closing-spin');
                inputField.focus();
            } else if (botImg) {
                botImg.classList.add('closing-spin');
                setTimeout(() => botImg.classList.remove('closing-spin'), 1000);
            }
        });

        // Event delegation for Header Action Buttons (New Chat, Theme Switcher, Close)
        document.addEventListener('click', function (e) {
            const targetBtn = e.target.closest('#metaChatNewBtn, #metaChatThemeBtn, #metaChatCloseBtn');
            if (!targetBtn) return;

            if (targetBtn.id === 'metaChatNewBtn') {
                e.preventDefault();
                clearMemory();
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                    const welcomeMsg = `✨ **New Conversation Started!**\n\nHello! I am **Dasa AI 2.0**, Sanjaya's memory-aware assistant. What would you like to ask about Sanjaya today?`;
                    renderMessageDiv(welcomeMsg, 'bot', false);
                }
                playChime('bot');
            } else if (targetBtn.id === 'metaChatThemeBtn') {
                e.preventDefault();
                currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
                const nextTheme = THEMES[currentThemeIndex];
                applyTheme(nextTheme);
                playChime('bot');
            } else if (targetBtn.id === 'metaChatCloseBtn') {
                e.preventDefault();
                if (widget) widget.classList.remove('active');
            }
        });

        function playChime(sender) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                if (sender === 'user') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(450, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
                    gain.gain.setValueAtTime(0.02, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.08);
                } else {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06);
                    gain.gain.setValueAtTime(0.03, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.15);
                }
            } catch (e) {}
        }

        function handleSendMessage(text) {
            const query = text || inputField.value.trim();
            if (!query) return;

            inputField.value = '';
            appendMessage(query, 'user');
            playChime('user');

            const typingIndicator = showTypingIndicator();
            if (statusElement) {
                statusElement.className = 'meta-chat-status typing';
                statusElement.textContent = 'Dasa AI is reasoning...';
            }

            setTimeout(() => {
                if (typingIndicator) typingIndicator.remove();
                if (statusElement) {
                    statusElement.className = 'meta-chat-status';
                    statusElement.textContent = state.userName ? `Talking to ${state.userName} • Online` : "Sanjaya's Assistant • Online";
                }
                const response = generateRAGResponse(query);
                appendMessage(response, 'bot');
                playChime('bot');
            }, 600);
        }

        sendBtn.addEventListener('click', () => handleSendMessage());

        inputField.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });

        if (chipsContainer) {
            chipsContainer.addEventListener('click', function (e) {
                if (e.target.classList.contains('meta-chip')) {
                    const question = e.target.getAttribute('data-question');
                    if (question) {
                        handleSendMessage(question);
                    }
                }
            });
        }

        function renderMessageDiv(text, sender, save = true) {
            if (!messagesContainer) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = `meta-msg ${sender}-msg`;

            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'meta-msg-avatar';
            avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'meta-msg-bubble';

            let htmlContent = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code style="background: rgba(0,243,255,0.15); color:#00f3ff; padding:2px 6px; border-radius:4px;">$1</code>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #00ffaa; text-decoration: underline;">$1</a>');
            bubbleDiv.innerHTML = htmlContent;

            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubbleDiv);
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            if (save) saveChatHistory(text, sender);
        }

        function appendMessage(text, sender) {
            renderMessageDiv(text, sender, true);
        }

        function showTypingIndicator() {
            if (!messagesContainer) return null;
            const indDiv = document.createElement('div');
            indDiv.className = 'meta-msg bot-msg';

            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'meta-msg-avatar';
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';

            const indicator = document.createElement('div');
            indicator.className = 'meta-typing-indicator';
            indicator.innerHTML = '<div class="meta-typing-dot"></div><div class="meta-typing-dot"></div><div class="meta-typing-dot"></div>';

            indDiv.appendChild(avatarDiv);
            indDiv.appendChild(indicator);
            messagesContainer.appendChild(indDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return indDiv;
        }
    });
})();
