/**
 * Dasa AI RAG Chatbot Engine for Sanjaya Kandel Portfolio
 * Features:
 * - Client-side Vector / Keyword RAG Engine (No API key needed)
 * - Multilingual Greetings & Query Support (English, Nepali, Hindi, Spanish, French, German, Japanese, Arabic)
 * - AI Safety Guardrails & SOS Emergency Protocol
 * - Professional Tone & Dynamic Theme Integration
 */

(function () {
    // 1. Multilingual Greetings Database
    const GREETINGS = [
        // English (50+ Patterns)
        { 
            patterns: [
                /hi\b/i, /hello\b/i, /hey\b/i, /yo\b/i, /hiya\b/i, /howdy\b/i, /sup\b/i, /greetings\b/i, /welcome\b/i,
                /good morning/i, /good afternoon/i, /good evening/i, /good day/i, /morning\b/i, /afternoon\b/i, /evening\b/i,
                /hello there/i, /hey there/i, /hi there/i, /yo there/i, /hiya there/i, /howdy there/i,
                /how goes it/i, /how are you/i, /how's it going/i, /how's life/i, /how's everything/i, /how is everything/i,
                /what's up/i, /what is up/i, /what's happening/i, /what is happening/i, /what's new/i, /what is new/i,
                /how do you do/i, /howdy-do/i, /pleased to meet/i, /nice to meet/i, /long time no see/i,
                /hey man/i, /hello man/i, /hi man/i, /hey dude/i, /hello dude/i, /hi dude/i,
                /hey buddy/i, /hello buddy/i, /hi buddy/i, /hey friend/i, /hello friend/i, /hi friend/i,
                /what's good/i, /what's cooking/i, /how's tricks/i, /how are you doing/i, /how is your day/i, /how's your day/i
            ], 
            response: "👋 Hello and a warm welcome! It is an absolute pleasure to connect with you! 🚀\n\nI am **Dasa AI**, Sanjaya's virtual assistant. I am here to help you learn about Sanjaya's professional journey, skills, and projects in the most interactive way possible!\n\nWhat are you most curious to discover today? Let's check out:\n* 🛠️ His **Technical Skills**\n* 📁 His **Web Applications**\n* 🎓 His **Education & Accomplishments**\n* ✉️ How to **Get In Touch** with him\n\nJust tell me what you'd like to see, or type a question!" 
        },
        // Nepali (50+ Patterns)
        { 
            patterns: [
                /namaste\b/i, /namaskar\b/i, /sanchai\b/i, /k chha\b/i, /k cha\b/i, /k xa\b/i, /hjur\b/i, /hazur\b/i, /helau\b/i, /hello\b/i, /hi\b/i,
                /sanchai hunuhunchha/i, /sanchai hunuhunxa/i, /sanchai xau/i, /sanchai chhau/i, /sanchai chau/i,
                /k chha khabar/i, /k cha khabar/i, /k xa khabar/i, /khabar k chha/i, /khabar k cha/i, /khabar k xa/i,
                /sanchai aram/i, /sanchai aramai/i, /saramai/i, /aramai chha/i, /aramai cha/i, /aramai xa/i,
                /k gardai/i, /k k chha/i, /k k cha/i, /k k xa/i, /ke chha/i, /ke cha/i, /ke xa/i, /ke chha khabar/i, /ke cha khabar/i, /ke xa khabar/i,
                /kasto chha/i, /kasto cha/i, /kasto xa/i, /kasto chaldai chha/i, /kasto chaldai cha/i, /kasto chaldai xa/i,
                /namaste hjur/i, /namaste hazur/i, /namaskar hazur/i, /sewaro/i, /dhog/i, /darshan/i, /pranam/i,
                /sanchai ho/i, /k chha bro/i, /k cha bro/i, /k xa bro/i, /ke xa bro/i, /subha prabhat/i, /subha din/i, /subha sandhya/i, /subha ratri/i,
                /नमस्ते/i, /नमस्कार/i, /सञ्चै/i, /सन्चै/i, /के छ/i, /के छ खबर/i, /कस्तो छ/i, /हजुर/i, /सन्चै हुनुहुन्छ/i,
                /के छ नयाँ/i, /कस्तो चल्दैछ/i, /हेल्लो/i, /हाई/i, /नमस्ते हजुर/i, /सेवा ढोग/i, /जडे/i, /दर्शन/i, /प्रणाम/i,
                /स्वागत/i, /स्वागतम/i, /सन्चै छौ/i, /कता हो/i, /के गर्दै/i, /के छ विचार/i, /कता जान लाको/i, /राम्रो छ/i,
                /भेटेर खुसी लाग्यो/i, /शुभ प्रभात/i, /शुभ दिन/i, /शुभ सन्ध्या/i, /शुभ रात्री/i, /सन्चै हुनुहुन्छ त/i, /के छ हालखबर/i,
                /हालखबर के छ/i, /आरामै हुनुहुन्छ/i, /आराम छ/i, /के छ दाइ/i, /के छ भाइ/i, /के छ साथी/i, /ओइ/i, /ओए/i,
                /हेलो साथी/i, /नमस्ते साथी/i, /नमस्ते दाइ/i, /सन्चै छौ त/i, /कस्तो छ हालखबर/i, /कस्तो छ खबर/i, /सन्चै आरामै/i,
                /के छ समाचार/i, /के समाचार छ/i, /नमस्ते सर/i, /नमस्कार सर/i
            ], 
            response: "🙏 नमस्ते र न्यानो स्वागत छ! तपाईंसँग जोडिन पाउँदा मलाई अत्यन्तै खुसी लागेको छ। 😊\n\nम **दासा (Dasa) एआई** हुँ, सञ्जय कँडेलको भर्चुअल सहायक। म सञ्जयको शिक्षा, सीप, प्रोजेक्टहरू र अनुभवका बारेमा जानकारी दिन तयार छु।\n\nआज म तपाईंलाई कसरी सहयोग गर्न सक्छु? सोध्नुहोस्!" 
        },
        // Hindi (50+ Patterns)
        { 
            patterns: [
                /namaste/i, /namaskar/i, /pranam/i, /kaise ho/i, /kya haal/i, /kya chal raha/i, /sab thik/i, /ram ram/i,
                /नमस्ते/i, /नमस्कार/i, /प्रणाम/i, /राम राम/i, /जय श्री कृष्ण/i, /जय सियाराम/i, /आदाब/i, /सलाम/i, /सत श्री अकाल/i,
                /कैसे हो/i, /क्या हाल है/i, /क्या चल रहा है/i, /हेलो/i, /हाय/i, /गुड मॉर्निंग/i, /गुड आफ्टरनून/i, /गुड इवनिंग/i,
                /कैसे हैं आप/i, /क्या समाचार है/i, /सब ठीक ठाक/i, /सब खैरियत/i, /स्वागत है/i, /मिलकर खुशी हुई/i, /शुभ प्रभात/i,
                /शुभ दोपहर/i, /शुभ संध्या/i, /शुभ रात्रि/i, /कैसे हो भाई/i, /कैसे हो दोस्त/i, /क्या हालचाल/i, /हालचाल क्या है/i,
                /ओए/i, /ओय/i, /सुनो/i, /सुनिए/i, /नमस्ते जी/i, /नमस्कार जी/i, /प्रणाम गुरुजी/i, /प्रणाम जी/i, /कैसे चल रहा है/i,
                /क्या नया है/i, /सब बढ़िया/i, /सब कुशल मंगल/i, /जय माता दी/i, /जय हिंद/i, /हरे कृष्णा/i, /राधे राधे/i, /सलाम वालेकुम/i,
                /वालेकुम सलाम/i, /सत श्री अकाल जी/i, /केम छो/i, /भईया कैसे हो/i
            ], 
            response: "🙏 नमस्ते और आपका हार्दिक स्वागत है! आपसे मिलकर बहुत खुशी हुई। 😊\n\nमैं **दासा (Dasa) एआई** हूँ, संजय कंदेल का वर्चुअल असिस्टेंट। मैं आपको संजय के स्किल्स, प्रोजेक्ट्स, शिक्षा और उनके अनुभवों के बारे में जानकारी देने में मदद कर सकता हूँ।\n\nपूछिए, आज मैं आपके लिए क्या जानकारी लेकर आऊँ?" 
        },
        // Spanish
        { patterns: [/hola/i, /buenos dias/i, /buenas tardes/i], response: "¡Hola! Soy Dasa AI, el asistente virtual de Sanjaya. ¿En qué puedo ayudarte hoy sobre sus habilidades o proyectos?" },
        // French
        { patterns: [/bonjour/i, /salut/i, /bonsoir/i], response: "Bonjour! Je suis Dasa AI, l'assistant virtuel de Sanjaya. Comment puis-je vous aider aujourd'hui?" },
        // German
        { patterns: [/hallo/i, /guten tag/i], response: "Hallo! Ich bin Dasa AI, Sanjayas virtueller Assistent. Wie kann ich Ihnen heute helfen?" },
        // Japanese
        { patterns: [/konnichiwa/i, /hajimemashite/i, /こんにちは/i], response: "こんにちは！私はDasa AI（サञ्जयのバーチャルアシスタント）です。どのような情報をお探しですか？" },
        // Arabic
        { patterns: [/marhaba/i, /salam/i, /مرحبا/i], response: "مرحباً! أنا Dasa AI، المساعد الافتراضي لـ Sanjaya. كيف يمكنني مساعدتك اليوم؟" }
    ];

    // 2. SOS Emergency Protocol Patterns
    const SOS_PATTERNS = [
        /sos\b/i, /emergency/i, /urgent/i, /help me now/i, /critical/i, /distress/i, /immediate contact/i
    ];

    const SOS_RESPONSE = `🚨 **EMERGENCY / SOS DISPATCH ACTIVATED** 🚨
\nIf you need immediate professional assistance, urgent collaboration, or critical technical support:
\n1. 📧 **Direct Email**: Please send an urgent marked email to: **kandelsanjaya7@gmail.com**
\n2. 📝 **Priority Contact Form**: Navigate to the bottom **#contact** section of this page and send your message.
\n*Sanjaya's team monitors messages and will respond promptly to high-priority inquiries.*`;

    // 3. Professional Guardrails & Safety Policy
    const GUARDRAIL_PATTERNS = [
        { pattern: /phone|mobile|whatsapp|viber|call number|contact number/i, msg: "🛡️ **Guardrail Policy**: Sanjaya's personal telephone and mobile numbers are protected for privacy. You can contact Sanjaya directly via the **#contact** form or official email!" },
        { pattern: /address|home|house|street|location coordinates/i, msg: "🛡️ **Guardrail Policy**: Sanjaya's private home address and location details are confidential. His general location is Gaindakot, Nawalpur, Nepal." },
        { pattern: /social account|personal facebook|personal instagram|snapchat|tinder|password|bank|credit card|salary/i, msg: "🛡️ **Guardrail Policy**: Private personal social accounts and confidential financial credentials are strictly protected by AI security guardrails." },
        { pattern: /hack|abuse|vulgar|profanity|exploit|illegal|crack/i, msg: "⚠️ **Safety Guardrail**: I am a professional AI Assistant. I operate under strict ethical standards and cannot assist with harmful, inappropriate, or unauthorized requests." }
    ];

    // 4. Knowledge Base for RAG Search Engine (105 Distinct Q&A Points)
    const KNOWLEDGE_BASE = [
        // Group 1: Identity & Bio (1-14)
        {
            topic: "identity",
            keywords: ["who", "sanjaya", "kandel", "about", "bio", "profile", "introduce", "programmer", "nepal"],
            content: "Sanjaya Kandel is a dedicated **Full Stack Web Developer**, **UI/UX Designer**, and **AI/ML Enthusiast** based in Nepal. He crafts modern, high-performance, and visually responsive web applications using Python (Django) and JavaScript."
        },
        {
            topic: "fullname",
            keywords: ["full name", "complete name", "real name", "actual name"],
            content: "Sanjaya's full name is **Sanjaya Kandel**."
        },
        {
            topic: "nickname",
            keywords: ["nickname", "call you", "short name", "known as"],
            content: "You can call him **Sanjaya**."
        },
        {
            topic: "age",
            keywords: ["age", "old", "years old", "birth year", "how old"],
            content: "Sanjaya is a young adult currently pursuing his university degree while actively working as an insurance agency manager and developer."
        },
        {
            topic: "gender",
            keywords: ["gender", "sex", "male", "female", "man", "boy"],
            content: "Sanjaya is **Male**."
        },
        {
            topic: "nationality",
            keywords: ["nationality", "citizen", "citizenship", "where from", "origin"],
            content: "Sanjaya is **Nepalese**."
        },
        {
            topic: "location",
            keywords: ["location", "live", "located", "where do you live", "address", "current address"],
            content: "Sanjaya lives in **Gaindakot, Nawalpur, Nepal**."
        },
        {
            topic: "hometown",
            keywords: ["hometown", "born", "birth place", "native"],
            content: "Sanjaya's hometown is **Gaindakot, Nawalpur**, situated in the Gandaki Province of Nepal."
        },
        {
            topic: "country",
            keywords: ["country", "nation", "state", "nepal"],
            content: "Sanjaya is from **Nepal**, a beautiful country in South Asia known for Mt. Everest."
        },
        {
            topic: "career_goal",
            keywords: ["career goal", "ambition", "future", "dream", "aim", "vision", "job goal"],
            content: "Sanjaya aims to become a leading **AI Engineer & Full Stack Architect**, bridging modern web technologies with LLMs and automated system workflows."
        },
        {
            topic: "languages_spoken",
            keywords: ["languages", "speak", "multilingual", "english", "nepali", "hindi", "communication language"],
            content: "Sanjaya is fluent in **English**, **Nepali**, and **Hindi**."
        },
        {
            topic: "hobbies",
            keywords: ["hobbies", "hobby", "leisure", "free time", "do for fun", "interest"],
            content: "In his free time, Sanjaya loves **coding experimental AI tools**, designing intuitive UI prototypes, reading tech articles, and analyzing insurance market structures."
        },
        {
            topic: "role_model",
            keywords: ["role model", "inspiration", "inspire", "admire"],
            content: "Sanjaya is inspired by tech entrepreneurs and software innovators who leverage open source code to build global software solutions."
        },
        {
            topic: "daily_routine",
            keywords: ["daily routine", "schedule", "day look like", "routine"],
            content: "Sanjaya balances his day between studying B.Sc. CSIT, developing full-stack projects, and managing insurance operations at Reliable Nepal Life Insurance."
        },

        // Group 2: Tech Stack & Dev Skills (15-30)
        {
            topic: "backend",
            keywords: ["backend", "server", "python", "django", "database", "sql", "api", "rest"],
            content: "💻 **Backend Architecture Stack**:\nSanjaya builds robust backend systems using **Python (Django)**, **Django REST Framework**, and database integrations like **SQLite** and **MySQL**."
        },
        {
            topic: "frontend",
            keywords: ["frontend", "ui", "javascript", "html", "css", "styling", "responsive", "ux"],
            content: "🎨 **Frontend & UI Stack**:\nSanjaya is skilled in modern **JavaScript (ES6+)**, **HTML5**, **CSS3**, **Flexbox/Grid**, and custom responsive designs utilizing modern styling tokens (like Neon highlights and Glassmorphism)."
        },
        {
            topic: "database",
            keywords: ["database", "db", "sqlite", "mysql", "sql query", "schemas", "normalization"],
            content: "🗄️ **Database Systems**:\nSanjaya has strong competencies in relational databases, utilizing **SQLite** for development and **MySQL** for larger web platforms, focusing on query speed and schemas."
        },
        {
            topic: "version_control",
            keywords: ["version control", "git", "github", "commit", "merge", "pull request", "repo"],
            content: "🛠️ **Version Control**:\nSanjaya uses **Git** and **GitHub** for repository hosting, commit tracking, collaborative branching, and continuous delivery setups."
        },
        {
            topic: "design_tools",
            keywords: ["design tools", "figma", "mockups", "wireframes", "prototype", "graphic design"],
            content: "🖌️ **Design Systems & Figma**:\nSanjaya uses **Figma** to draft digital wireframes, construct interactive UI layouts, and plan custom typography rules before coding."
        },
        {
            topic: "rest_api",
            keywords: ["rest api", "apis", "endpoints", "json", "request", "http status", "integration"],
            content: "🔗 **API Systems**:\nSanjaya designs and integrates RESTful APIs, facilitating seamless JSON payloads communication between front-end components and Django servers."
        },
        {
            topic: "javascript",
            keywords: ["javascript", "js", "es6", "dom manipulation", "async await", "promises"],
            content: "⚡ **JavaScript Skills**:\nSanjaya is highly proficient in modern JS, including DOM management, asynchronous fetch logic, promises, and dynamic event listeners."
        },
        {
            topic: "python",
            keywords: ["python", "scripting", "python code", "object oriented python", "oop"],
            content: "🐍 **Python Programming**:\nPython is Sanjaya's primary programming language, used for backend development, automation scripting, and AI prototyping."
        },
        {
            topic: "django",
            keywords: ["django", "django framework", "mvc", "mvt", "admin site", "django models"],
            content: "🏢 **Django Framework**:\nSanjaya is a Django expert, specializing in MVT architecture, custom model structures, custom admin interfaces, database migrations, and security settings."
        },
        {
            topic: "html5",
            keywords: ["html5", "html", "semantic tags", "dom structure", "web pages"],
            content: "🌐 **Semantic HTML5**:\nSanjaya writes clean, accessibility-compliant HTML5 structures, ensuring page readability and compatibility."
        },
        {
            topic: "css3",
            keywords: ["css3", "css", "layout", "keyframes", "animations", "transitions"],
            content: "🎨 **Advanced CSS3**:\nSanjaya crafts custom styling solutions including complex keyframe animations, UI theme modes, flex/grid systems, and neon visual accents."
        },
        {
            topic: "glowing_marquee",
            keywords: ["glowing marquee", "ticker", "scrolling text", "breaking news", "neon text"],
            content: "📣 **Specializations Neon Marquee**:\nSanjaya integrated a custom glowing CSS-only right-to-left marquee into his portfolio footer to showcase his professional specializations dynamically."
        },
        {
            topic: "responsive_design",
            keywords: ["responsive design", "mobile friendly", "media queries", "adaptive layout", "viewport"],
            content: "📱 **Responsive Web Design**:\nSanjaya designs with a mobile-first philosophy, using standard media queries to ensure websites scale perfectly across desktops, tablets, and smartphones."
        },
        {
            topic: "seo",
            keywords: ["seo", "search engine", "metadata", "meta description", "robots.txt", "google search"],
            content: "📈 **SEO Optimization**:\nSanjaya structures web layouts to load fast and ranks high by utilizing optimized meta tags, semantic hierarchy, and clean URL routing."
        },
        {
            topic: "glassmorphism",
            keywords: ["glassmorphism", "blur effect", "frosted glass", "backdrop filter"],
            content: "💎 **Glassmorphism Aesthetics**:\nSanjaya frequently utilizes modern frosted-glass effects (using CSS backdrop-filters and translucent borders) to create sleek, high-end interfaces."
        },
        {
            topic: "loader_screen",
            keywords: ["loader screen", "loading animation", "branding loader", "logo animation"],
            content: "⏳ **Branding Loading Screen**:\nBoth the homepage and CV page feature an identical high-contrast animated loading screen, displaying a glowing profile logo, progress bar, and popping text."
        },
        {
            topic: "skills_summary",
            keywords: ["skills", "technical skills", "core skills", "tech stack", "what are his skills", "what does he know", "programming languages", "technologies"],
            content: "💡 **Here are Sanjaya's Technical Skills!**\n\nSanjaya is a highly versatile developer who combines strong engineering foundations with intuitive user interface designs. Here is his professional tech stack:\n\n* 💻 **Core Languages & Web Frameworks**: Python (Django, Flask), React, Node.js, JavaScript (ES6+), HTML5, and CSS3.\n* ⚙️ **Database & API Design**: REST APIs, SQLite, MySQL, and PostgreSQL.\n* 🛠️ **Design, Tools & Workflow**: Figma, UI/UX prototyping, Git/GitHub version control, Adobe XD, Photoshop, Video Editing, and modern AI automation tools.\n* 🚀 **Currently Exploring & Mastering**: Next.js, TypeScript, Cloud Deployment, Docker & Containers, System Design, Web Security, and Machine Learning.\n\nHe is always enthusiastic about learning new technologies and implementing optimized solutions. Feel free to ask me details about any specific skill!"
        },

        // Group 3: B.Sc. CSIT Education (31-45)
        {
            topic: "degree",
            keywords: ["degree", "major", "qualification", "bachelor degree", "computer science degree"],
            content: "🎓 **Major Degree**:\nSanjaya is pursuing a **Bachelor of Science in Computer Science and Information Technology (B.Sc. CSIT)**."
        },
        {
            topic: "university",
            keywords: ["university", "tu", "tribhuvan", "tribhuvan university"],
            content: "🏫 **University Affiliation**:\nSanjaya's CSIT course is affiliated with **Tribhuvan University (TU)**, the oldest and largest university in Nepal."
        },
        {
            topic: "campus",
            keywords: ["campus", "college name", "ict campus", "lumbini campus", "lumbini ict"],
            content: "🏫 **Campus**:\nSanjaya studies at **Lumbini I.C.T. Campus**, located in Gaindakot, Nawalpur, Nepal."
        },
        {
            topic: "semester",
            keywords: ["semester", "current semester", "which sem", "academic year", "4th sem"],
            content: "📚 **Current Academic Year**:\nSanjaya is currently studying in the **4th Semester** of his B.Sc. CSIT program."
        },
        {
            topic: "courses",
            keywords: ["courses", "subjects", "curriculum", "study modules", "syllabus"],
            content: "📖 **CSIT Syllabus**:\nSanjaya's curriculum includes Data Structures & Algorithms (DSA), Database Systems (DBMS), Operating Systems, Software Engineering, AI, Computer Networks, and Mathematics."
        },
        {
            topic: "dsa",
            keywords: ["dsa", "algorithms", "data structures", "linked list", "binary tree", "sorting"],
            content: "algorithms **Data Structures & Algorithms (DSA)**:\nSanjaya studies algorithmic complexity, sorting, searching, linked lists, trees, graphs, and optimization methods."
        },
        {
            topic: "dbms",
            keywords: ["dbms", "database course", "sql queries", "erd", "relational algebra"],
            content: "🗄️ **DBMS Course**:\nSanjaya is trained in relational model designs, entity-relationship diagrams (ERDs), SQL scripting, database transaction controls, and functional normalization."
        },
        {
            topic: "software_engineering",
            keywords: ["software engineering course", "sdlc", "agile", "scrum", "waterfall", "uml"],
            content: "🏗️ **Software Engineering**:\nSanjaya studies the Software Development Life Cycle (SDLC), agile management, design patterns, UML class drafting, and testing metrics."
        },
        {
            topic: "artificial_intelligence",
            keywords: ["ai course", "machine learning course", "expert systems", "heuristics"],
            content: "🤖 **Artificial Intelligence Course**:\nCovers search heuristics, knowledge representation, neural networks, expert systems, and modern concepts in NLP and computer vision."
        },
        {
            topic: "os",
            keywords: ["os course", "operating systems", "processes", "threads", "memory allocation"],
            content: "💻 **Operating Systems (OS)**:\nSanjaya studies process management, CPU scheduling, thread synchronization, memory virtualization, and file systems."
        },
        {
            topic: "networking",
            keywords: ["networking course", "computer networks", "tcp ip model", "osi layers", "routing"],
            content: "🌐 **Computer Networks**:\nCovers OSI reference layers, TCP/IP handshake, local subnets, IP routing, domain name translation, and security protocols."
        },
        {
            topic: "toc",
            keywords: ["toc", "theory of computation", "automata", "cfg", "turing machine"],
            content: "🧠 **Theory of Computation (TOC)**:\nIncludes finite automata, regular languages, context-free grammars (CFGs), pushdown automata, and Turing machines."
        },
        {
            topic: "compiler",
            keywords: ["compiler design", "lexical analysis", "syntax parsing", "code generation"],
            content: "⚙️ **Compiler Design**:\nSanjaya learns compiler construction phases: lexical analysis, syntax parsing, semantic checkers, intermediate code, and target generation."
        },
        {
            topic: "cg",
            keywords: ["cg", "computer graphics course", "rasterization", "opengl", "rendering"],
            content: "🖥️ **Computer Graphics (CG)**:\nCovers rasterization algorithms, 2D/3D transformations, projections, OpenGL programming, and shading rendering mechanics."
        },
        {
            topic: "gpa",
            keywords: ["gpa", "marks", "grades", "percentage", "academic standing"],
            content: "📈 **Academic Records**:\nSanjaya maintains a high academic standing with excellent scores across his semesters in B.Sc. CSIT."
        },

        // Group 4: Portfolio Projects (46-55)
        {
            topic: "edusphere_ai",
            keywords: ["edusphere", "edusphere ai", "education app", "ai study helper"],
            content: "🎓 **Edusphere AI Platform**:\nAn adaptive AI-powered educational system designed to aid college students. It provides role-based workspaces, AI presentation generators, automated study planners, quiz generators, code explainers, and RAG study desks. It is built using Python and Streamlit, powered by LLaMA 3.1."
        },
        {
            topic: "streamlit",
            keywords: ["streamlit", "streamlit app", "python frontend", "fast prototyping"],
            content: "⚡ **Streamlit Development**:\nSanjaya uses **Streamlit** to rapidly deploy data dashboards and AI agent interfaces, such as the **Edusphere AI** system."
        },
        {
            topic: "edusphere_link",
            keywords: ["edusphere link", "edusphere url", "edusphere streamlit url", "where is edusphere"],
            content: "🔗 **Edusphere AI Deployment**:\nEdusphere AI is live and deployed at: [eduspheres.streamlit.app](https://eduspheres.streamlit.app)."
        },
        {
            topic: "college_erp",
            keywords: ["college erp", "school erp", "erp system", "management portal"],
            content: "🏫 **Smart College ERP System**:\nA complete web application featuring role-based dashboards for College Admins, Teachers, and Students, managing enrollments, attendance, and fee tracking. The dashboard screenshot shows analytical charts and record lists."
        },
        {
            topic: "portfolio_website",
            keywords: ["portfolio website", "portfolio django", "this site", "about this project", "portfolio link", "portfolio url"],
            content: "🚀 **Django Portfolio Website**:\nThis personal portfolio is built on a Django backend. It is live at: [www.kandelsanjaya.com.np](https://www.kandelsanjaya.com.np). Features include visitor location logs, dynamic CV generator, responsive neon styling, interactive business card modal, and Dasa AI."
        },
        {
            topic: "portfolio_features",
            keywords: ["portfolio features", "website capabilities", "what can this site do"],
            content: "🛠️ **Portfolio Features**:\n- Dynamic visitor analytics (IP logs, hits tracker)\n- Dynamic CV PDF generation from DB models\n- Neon specialized ticker marquee\n- Interactive business card modal\n- Dasa AI client RAG chatbot"
        },
        {
            topic: "x_clone",
            keywords: ["x clone", "twitter clone", "social media app"],
            content: "🐦 **X / Twitter Clone**:\nSanjaya previously developed a functional prototype of a social feed, which was later replaced by the more advanced **Edusphere AI** platform on his portfolio."
        },
        {
            topic: "calculator_project",
            keywords: ["calculator", "simple math app", "math calculator"],
            content: "🔢 **Calculator App**:\nA frontend utility built using HTML5, CSS3, and JavaScript logic to handle basic algebraic arithmetic calculations."
        },
        {
            topic: "todo_app",
            keywords: ["todo app", "task manager", "todo list"],
            content: "📝 **Task Manager App**:\nA local storage-backed task manager project constructed to practice DOM manipulation and event scheduling."
        },
        {
            topic: "weather_app",
            keywords: ["weather app", "api weather", "forecast app"],
            content: "⛅ **Weather Broadcast App**:\nA web widget that calls public weather APIs, parsing and rendering real-time temperature conditions based on input city names."
        },

        // Group 5: Insurance Career (56-65)
        {
            topic: "life_insurance",
            keywords: ["life insurance", "insurance industry", "policy", "premium", "lic"],
            content: "💼 **Life Insurance Career**:\nAlongside technical studies, Sanjaya operates in the financial sector as an **Agency Manager** in life insurance, advising clients on family protection policies and wealth growth strategies."
        },
        {
            topic: "agency_manager",
            keywords: ["agency manager", "manager role", "insurance job", "reliable manager"],
            content: "👔 **Agency Manager**:\nSanjaya holds an Agency Manager position in life insurance. He recruits insurance agents, trains them in sales methodologies, and monitors monthly premium targets."
        },
        {
            topic: "insurance_duties",
            keywords: ["insurance duties", "what do you do in insurance", "insurance responsibilities"],
            content: "📋 **Insurance Responsibilities**:\n- Client financial profiling and risk assessments\n- Recruitment and training of insurance advisors\n- Organizing premium collection drives\n- Assisting clients with insurance claim processing"
        },
        {
            topic: "financial_planning",
            keywords: ["financial planning", "wealth management", "insurance planning"],
            content: "📈 **Financial Consulting**:\nSanjaya advises families on long-term endowment plans, retirement savings, child education funds, and term covers."
        },
        {
            topic: "reliable_nepal",
            keywords: ["reliable nepal", "reliable life", "reliable nepal life"],
            content: "🏢 **Reliable Nepal Life Insurance**:\nSanjaya works as an Agency Manager at **Reliable Nepal Life Insurance Limited**, one of Nepal's premier insurance providers."
        },
        {
            topic: "sales_skills",
            keywords: ["sales skills", "negotiation", "selling", "marketing", "business development"],
            content: "🤝 **Sales & Negotiation**:\nManaging an agency has refined Sanjaya's public speaking, pitch development, objection handling, and relationship management skills."
        },
        {
            topic: "team_leadership",
            keywords: ["team leadership", "team manager", "leadership insurance", "lead agents"],
            content: "👥 **Team Management**:\nSanjaya leads a team of independent insurance advisors, organizing weekly feedback meetings and motivating them to meet agent KPI goals."
        },
        {
            topic: "business_experience",
            keywords: ["business experience", "agency management", "operations"],
            content: "🏢 **Business Management**:\nHis agency role provides practical knowledge in operational sales pipelines, customer retention rates, and financial reports."
        },
        {
            topic: "customer_relations",
            keywords: ["customer relations", "client support", "customer satisfaction", "loyalty"],
            content: "📞 **Client Support**:\nSanjaya maintains communication channels with over 100+ clients to ensure policy compliance and handle coverage queries."
        },
        {
            topic: "insurance_achievements",
            keywords: ["insurance achievements", "manager awards", "best manager"],
            content: "🏆 **Managerial Achievements**:\nSanjaya has repeatedly led his agency branch in monthly policy sales, receiving corporate recognition for agent activation rates."
        },

        // Group 6: Certifications & Competitions (66-75)
        {
            topic: "genai_cert",
            keywords: ["genai cert", "generative ai certificate", "ai engineering certificate"],
            content: "📜 **Generative AI & AI Engineering Certificate**:\nSanjaya completed a intensive **45 credit hours professional course** in Generative AI and AI Engineering at Lumbini I.C.T. Campus, verifying his technical expertise in prompt engineering and AI workflow integration."
        },
        {
            topic: "uiux_cert",
            keywords: ["uiux cert", "uiux design certificate", "design competition"],
            content: "🎨 **LICT UI/UX Design Competition**:\nSanjaya participated in the **LICT UI/UX Design Competition 2082**, earning a verified Certificate of Participation for prototyping intuitive layout interfaces."
        },
        {
            topic: "cert_provider",
            keywords: ["cert provider", "who gave certificates", "campus certificates"],
            content: "🏫 **Certification Authority**:\nSanjaya's major professional certifications were awarded by **Lumbini I.C.T. Campus** and the **Lumbini ICT Club**."
        },
        {
            topic: "cert_hours",
            keywords: ["cert hours", "45 credit hours", "course length"],
            content: "⏱️ **45 Credit Hours**:\nSanjaya's Generative AI course comprised 45 hours of lectures, hands-on lab sessions, and system deployment projects."
        },
        {
            topic: "uiux_comp_year",
            keywords: ["uiux comp year", "2082", "nepali year 2082"],
            content: "📅 **UI/UX Competition Date**:\nThe competition took place in the year **2082 BS** (Nepali Bikram Sambat calendar)."
        },
        {
            topic: "genai_comp_year",
            keywords: ["genai comp year", "2026", "certification date"],
            content: "📅 **Generative AI Certificate Date**:\nSanjaya completed his AI Engineering credentials in **2026 AD**."
        },
        {
            topic: "webdev_cert",
            keywords: ["webdev cert", "web development certificate", "full stack course"],
            content: "📜 **Full Stack Developer Course**:\nSanjaya holds completion credentials for Full Stack Web Engineering, verifying backend structures and frontend styling skills."
        },
        {
            topic: "python_cert",
            keywords: ["python cert", "python coding certificate"],
            content: "🐍 **Python Programming Credentials**:\nSanjaya completed specialized training in Python scripting, covering functional code, object-oriented concepts, and API creation."
        },
        {
            topic: "js_cert",
            keywords: ["js cert", "javascript systems certificate", "js training"],
            content: "📜 **Advanced JavaScript Training**:\nSanjaya holds certificates validating his DOM manipulation expertise, client-side algorithms, and asynchronous processing."
        },
        {
            topic: "responsive_cert",
            keywords: ["responsive cert", "responsive web design certificate"],
            content: "📱 **Responsive Web Design Credentials**:\nValidates proficiency in adaptive layout frameworks, CSS flex/grid rules, and viewport media queries."
        },

        // Group 7: Contacts & Socials (76-85)
        {
            topic: "email_contact",
            keywords: ["email contact", "kandelsanjaya7", "send email", "email address"],
            content: "📧 **Official Email**:\nYou can reach Sanjaya at: **kandelsanjaya7@gmail.com**."
        },
        {
            topic: "github_link",
            keywords: ["github link", "github profile", "github url", "sanjaya github"],
            content: "💻 **GitHub Profile**:\nSee Sanjaya's code repositories at: [github.com/kandelsanjaya](https://github.com/kandelsanjaya)."
        },
        {
            topic: "youtube_link",
            keywords: ["youtube link", "youtube channel", "youtube url", "sanjaya youtube"],
            content: "🎥 **YouTube Channel**:\nSubscribe to Sanjaya's educational content at: [youtube.com/@kandelsanjaya6613](https://youtube.com/@kandelsanjaya6613)."
        },
        {
            topic: "tiktok_link",
            keywords: ["tiktok link", "tiktok profile", "tiktok url", "sanjaya tiktok"],
            content: "🎵 **TikTok Profile**:\nFollow Sanjaya's content updates at: [tiktok.com/@sanjaya_013](https://www.tiktok.com/@sanjaya_013)."
        },
        {
            topic: "socials",
            keywords: ["socials", "social media", "profiles", "social accounts", "links"],
            content: "🔗 **Official Profiles**:\n- **GitHub**: [github.com/kandelsanjaya](https://github.com/kandelsanjaya)\n- **YouTube**: [youtube.com/@kandelsanjaya6613](https://youtube.com/@kandelsanjaya6613)\n- **TikTok**: [tiktok.com/@sanjaya_013](https://www.tiktok.com/@sanjaya_013)"
        },
        {
            topic: "hire_me",
            keywords: ["hire me", "hire sanjaya", "looking for developer", "job offer"],
            content: "💼 **Hiring Inquiries**:\nSanjaya is available for full-stack contracts and junior developer roles. Send an email to **kandelsanjaya7@gmail.com** or use the **Get in Touch** form!"
        },
        {
            topic: "collaborate",
            keywords: ["collaborate", "partnership", "work together", "join project"],
            content: "🤝 **Project Collaboration**:\nIf you want to collaborate on AI scripts, Django backends, or UI styling templates, email **kandelsanjaya7@gmail.com**."
        },
        {
            topic: "contact_form",
            keywords: ["contact form", "how to contact", "message form"],
            content: "📩 **Portfolio Contact Form**:\nYou can submit a message directly via the **Get in Touch** form located right above the footer on the home page."
        },
        {
            topic: "cv_pdf",
            keywords: ["cv pdf", "download resume", "cv print", "resume file"],
            content: "📄 **Download CV Resume**:\nYou can download a printer-friendly PDF copy of Sanjaya's CV using the download toggle button on the **CV Page**."
        },
        {
            topic: "location_details",
            keywords: ["location details", "gaindakot location", "nawalpur province"],
            content: "📍 **Geographical Location**:\nSanjaya operates from Gaindakot-01, Nawalpur, located across the Narayani River from Chitwan, Nepal."
        },

        // Group 8: Freelance Services (86-95)
        {
            topic: "service_webdev",
            keywords: ["service webdev", "build website", "website development service"],
            content: "💻 **Custom Web Development**:\nSanjaya develops robust Django platforms with customizable dashboard UI, RESTful architectures, and secure SQL databases."
        },
        {
            topic: "service_uidesign",
            keywords: ["service uidesign", "figma wireframes service", "prototype design"],
            content: "🎨 **UI/UX Prototyping**:\nSanjaya designs high-fidelity interactive wireframes in Figma, mapping out design palettes and component structures."
        },
        {
            topic: "service_apidev",
            keywords: ["service apidev", "api design service", "custom backend api"],
            content: "⚙️ **API Development**:\nSanjaya builds clean backend REST APIs with fast lookup JSON structures, secure endpoints, and thorough documentation."
        },
        {
            topic: "service_insurance",
            keywords: ["service insurance", "insurance planning", "consult life insurance"],
            content: "💼 **Life Insurance Advice**:\nSanjaya provides professional financial planning advice, advising on term policies, endowments, and health covers."
        },
        {
            topic: "freelance_pricing",
            keywords: ["freelance pricing", "development cost", "hourly rate", "project budget"],
            content: "💲 **Freelance Pricing**:\nProject costs vary depending on requirements. Contact Sanjaya at **kandelsanjaya7@gmail.com** for a customized project quote."
        },
        {
            topic: "project_speed",
            keywords: ["project speed", "delivery time", "fast turnaround"],
            content: "⏱️ **Fast Turnaround**:\nSanjaya prioritizes efficient coding, delivering clean web prototypes within agreed timelines without compromising design."
        },
        {
            topic: "clean_code",
            keywords: ["clean code philosophy", "readable code", "mvc design rules"],
            content: "🧹 **Clean Code Standards**:\nSanjaya writes self-documenting code with clear comments, modular templates, and standard MVC architectures."
        },
        {
            topic: "consultation",
            keywords: ["consultation request", "meet developer", "free talk"],
            content: "📞 **Initial Consultation**:\nSanjaya offers a free 15-minute email or video consultation to discuss new development projects."
        },
        {
            topic: "tech_consulting",
            keywords: ["tech consulting", "architecture advice", "system planning"],
            content: "🛠️ **Tech Stack Consultation**:\nSanjaya helps select the right backend servers, databases, and styling tools for your startup idea."
        },
        {
            topic: "maintenance",
            keywords: ["maintenance service", "website fixes", "update database"],
            content: "🔧 **Website Maintenance**:\nSanjaya offers post-launch debugging, security checks, database optimization, and layout updates."
        },

        // Group 9: Strengths & Personal (96-105)
        {
            topic: "problem_solving",
            keywords: ["problem solving", "debugging skill", "troubleshoot"],
            content: "🧠 **Debugging & Problem Solving**:\nSanjaya excels at parsing stack traces, resolving database bottlenecks, and diagnosing CSS layout issues."
        },
        {
            topic: "teamwork",
            keywords: ["teamwork philosophy", "cooperation", "collaborative dev"],
            content: "👥 **Team Collaboration**:\nThrough both academic group projects and insurance sales training, Sanjaya has refined his team cooperation and coordination skills."
        },
        {
            topic: "communication_skills",
            keywords: ["communication skills", "reporting", "customer chat"],
            content: "🗣️ **Clear Communication**:\nSanjaya excels at presenting technical system architectures to non-technical business clients."
        },
        {
            topic: "learning_style",
            keywords: ["learning style", "fast learner", "new tech"],
            content: "📚 **Continuous Learning**:\nSanjaya stays updated with software trends by reading documentation, analyzing source code, and building quick project prototypes."
        },
        {
            topic: "strengths",
            keywords: ["strengths", "best qualities", "why hire sanjaya"],
            content: "💪 **Core Strengths**:\n- High-velocity full-stack Python/Django coding\n- Detail-oriented Figma UI/UX designs\n- Strong leadership and business communication skills"
        },
        {
            topic: "weaknesses",
            keywords: ["weaknesses", "limitations", "areas of improvement"],
            content: "⚠️ **Areas of Improvement**:\nSanjaya can get highly absorbed in solving coding puzzles, occasionally extending his screen hours to ensure clean layouts."
        },
        {
            topic: "dream_job",
            keywords: ["dream job", "ideal company", "work preference"],
            content: "🚀 **Dream Career**:\nOperating as a Lead Solutions Architect at a forward-thinking AI product lab, building scalable user interfaces."
        },
        {
            topic: "interests",
            keywords: ["interests", "passions", "what drives sanjaya"],
            content: "🔥 **Passions**:\nSanjaya is passionate about artificial intelligence, RAG systems, user-centric interface design, and financial growth."
        },
        {
            topic: "favorite_framework",
            keywords: ["favorite framework", "preferred backend", "python django love"],
            content: "❤️ **Favorite Tech**:\nSanjaya prefers **Django** for backend logic due to its security, and **Figma** for UI wireframes."
        },
        {
            topic: "dasa_ai_meaning",
            keywords: ["dasa ai meaning", "what is dasa", "about dasa ai"],
            content: "🤖 **About Dasa AI**:\nDasa AI is Sanjaya's custom-built client RAG agent. It processes user keywords to answer questions about his career directly in the browser."
        },
        {
            topic: "admin_panel",
            keywords: ["admin", "admin panel", "login", "credentials", "superuser", "staff", "dashboard"],
            content: "🔑 **Admin Panel & Login Details**:\n- **URL**: [/admin/](/admin/)\n- **Username**: `admin`\n- **Password**: `admin1234`\n\nYou can log in there to manage projects, certificates, skills, education history, and view visitor statistics!"
        }
    ];

    // 5. RAG Retrieval & Context Matching Engine (With Fuzzy Typo Tolerant Logic)
    function retrieveContext(query) {
        const cleanQuery = query.toLowerCase().replace(/[^\w\s]/gi, '');
        const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);
        let bestMatch = null;
        let highestScore = 0;

        KNOWLEDGE_BASE.forEach(item => {
            let score = 0;
            item.keywords.forEach(kw => {
                // Exact word matching
                if (tokens.includes(kw)) {
                    score += 3.0;
                }
                // String inclusion matching
                else if (cleanQuery.includes(kw)) {
                    score += 1.5;
                }
                // Fuzzy fallback matching for minor spelling typos
                else {
                    tokens.forEach(tok => {
                        if (tok.length > 3 && kw.length > 3) {
                            if (tok.includes(kw) || kw.includes(tok)) {
                                score += 1.0;
                            }
                        }
                    });
                }
            });
            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        });

        return { bestMatch, score: highestScore };
    }

    // 6. Master Response Generator with Guardrails, SOS, Multilingual & RAG
    function generateRAGResponse(userQuery) {
        const cleanQuery = userQuery.trim();

        if (SOS_PATTERNS.some(p => p.test(cleanQuery))) {
            return SOS_RESPONSE;
        }

        for (const guard of GUARDRAIL_PATTERNS) {
            if (guard.pattern.test(cleanQuery)) {
                return guard.msg;
            }
        }

        for (const greet of GREETINGS) {
            if (greet.patterns.some(p => p.test(cleanQuery))) {
                return greet.response;
            }
        }

        const { bestMatch, score } = retrieveContext(cleanQuery);
        if (bestMatch && score >= 1.5) {
            return bestMatch.content;
        }

        return "🤖 I am **Dasa AI**, Sanjaya's smart RAG assistant.\nI specialize in answering questions about Sanjaya's **Academic background**, **Technical skills**, **Projects**, **Experience**, and **Services**.\n\n*Try asking: 'Tell me about Edusphere AI' or 'What are his certificates?'*";
    }

    // 7. DOM Initialization & Event Wiring
    document.addEventListener('DOMContentLoaded', function () {
        const widget = document.getElementById('metaChatbotWidget');
        const toggleBtn = document.getElementById('metaChatbotToggle');
        const closeBtn = document.getElementById('metaChatCloseBtn');
        const sendBtn = document.getElementById('metaChatSendBtn');
        const inputField = document.getElementById('metaChatInput');
        const messagesContainer = document.getElementById('metaChatMessages');
        const chipsContainer = document.getElementById('metaChatChips');

        if (!widget || !toggleBtn) return;

        // Create speech bubble greeting popup
        const popup = document.createElement('div');
        popup.className = 'meta-chatbot-popup';
        popup.innerHTML = 'Hii, I am Dasa AI! How can I help you?';
        widget.appendChild(popup);

        // Show popup after 1.5 seconds, vanish after 5 seconds
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

        toggleBtn.addEventListener('click', function () {
            popup.remove();
            const isActive = widget.classList.toggle('active');
            const botImg = toggleBtn.querySelector('img.bot-icon');
            if (isActive) {
                if (botImg) botImg.classList.remove('closing-spin');
                inputField.focus();
            } else {
                if (botImg) {
                    botImg.classList.add('closing-spin');
                    setTimeout(() => botImg.classList.remove('closing-spin'), 1000);
                }
            }
        });

        closeBtn.addEventListener('click', function () {
            widget.classList.remove('active');
            const botImg = toggleBtn.querySelector('img.bot-icon');
            if (botImg) {
                botImg.classList.add('closing-spin');
                setTimeout(() => botImg.classList.remove('closing-spin'), 1000);
            }
        });

        const statusElement = widget.querySelector('.meta-chat-status');

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
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06); // E5
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
                statusElement.textContent = 'Dasa AI is typing...';
            }

            setTimeout(() => {
                typingIndicator.remove();
                if (statusElement) {
                    statusElement.className = 'meta-chat-status';
                    statusElement.textContent = "Sanjaya's Assistant • Online";
                }
                const response = generateRAGResponse(query);
                appendMessage(response, 'bot');
                playChime('bot');
            }, 750);
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

        function appendMessage(text, sender) {
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
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #00ffaa; text-decoration: underline;">$1</a>');
            bubbleDiv.innerHTML = htmlContent;

            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubbleDiv);
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
