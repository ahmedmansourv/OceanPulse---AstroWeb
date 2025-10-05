        // Initialize AOS
        AOS.init({ duration: 800, once: false, offset: 100 });

        // Loading Screen
        let loadProgress = 0;
        const loadingInterval = setInterval(() => {
            loadProgress += Math.random() * 15;
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    document.getElementById('loading-screen').classList.add('fade-out');
                    setTimeout(() => {
                        document.getElementById('loading-screen').style.display = 'none';
                    }, 500);
                }, 300);
            }
            document.getElementById('loadingProgress').style.width = loadProgress + '%';
            const statuses = ['Loading data...', 'Preparing visualizations...', 'Almost ready...'];
            document.getElementById('loadingStatus').textContent = statuses[Math.min(Math.floor(loadProgress / 33), 2)];
        }, 200);

        // Particles
        function createParticles() {
            const container = document.getElementById('particlesContainer');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (6 + Math.random() * 4) + 's';
                container.appendChild(particle);
            }
        }
        createParticles();

        // Navigation
        const nav = document.getElementById('mainNav');
        const scrollProgress = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        });

        // Navigation Links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                scrollToSection(section);
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        function scrollToSection(section) {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Sound Toggle
        let soundEnabled = false;
        document.getElementById('soundToggle').addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            this.classList.toggle('muted');
        });

        // Fullscreen Toggle
        document.getElementById('fullscreenToggle').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });

        // Menu Toggle
        document.getElementById('menuToggle').addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        // Stat Counter Animation
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        }

        // Animate stats on scroll
        const statNumbers = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));

        // Year Slider
        const yearSlider = document.getElementById('yearSlider');
        const currentYear = document.getElementById('currentYear');
        const heatValue = document.getElementById('heatValue');
        const heatChange = document.getElementById('heatChange');
        const heatRate = document.getElementById('heatRate');
        const heatPower = document.getElementById('heatPower');

        if (yearSlider) {
            yearSlider.addEventListener('input', (e) => {
                const year = 1957 + parseInt(e.target.value);
                currentYear.textContent = year;
                
                const heat = 50 + (parseInt(e.target.value) * 4.5);
                heatValue.textContent = Math.round(heat);
                heatChange.textContent = Math.round(heat - 50);
                heatRate.textContent = year > 1957 ? ((heat - 50) / (year - 1957)).toFixed(2) : '0';
                heatPower.textContent = (heat / 31.536).toFixed(1);
            });
        }

        // Timeline Play Button
        const playBtn = document.getElementById('timelinePlay');
        let isPlaying = false;
        let playInterval;

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                
                if (isPlaying) {
                    playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
                    
                    playInterval = setInterval(() => {
                        let value = parseInt(yearSlider.value);
                        if (value >= 67) {
                            value = 0;
                        } else {
                            value++;
                        }
                        yearSlider.value = value;
                        yearSlider.dispatchEvent(new Event('input'));
                    }, 100);
                } else {
                    playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
                    clearInterval(playInterval);
                }
            });
        }

        // Year Markers
        const yearMarkers = document.getElementById('yearMarkers');
        if (yearMarkers) {
            [1957, 1970, 1985, 2000, 2015, 2024].forEach(year => {
                const marker = document.createElement('span');
                marker.textContent = year;
                yearMarkers.appendChild(marker);
            });
        }

        // Copy Code Function
        function copyCode(button) {
            const codeBlock = button.closest('.raw-data').querySelector('code');
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }

        // Data Explorer Modal
        function openDataExplorer() {
            document.getElementById('dataExplorerModal').classList.add('active');
        }

        function closeDataExplorer() {
            document.getElementById('dataExplorerModal').classList.remove('active');
        }

        document.getElementById('dataExplorerModal').addEventListener('click', (e) => {
            if (e.target.id === 'dataExplorerModal') {
                closeDataExplorer();
            }
        });

        // Hero Canvas Animation
        const heroCanvas = document.getElementById('heroCanvas');
        if (heroCanvas) {
            const ctx = heroCanvas.getContext('2d');
            heroCanvas.width = heroCanvas.offsetWidth;
            heroCanvas.height = heroCanvas.offsetHeight;

            const waves = [];
            for (let i = 0; i < 3; i++) {
                waves.push({
                    y: heroCanvas.height / 2 + i * 30,
                    length: 0.01 + i * 0.001,
                    amplitude: 30 + i * 10,
                    frequency: 0.01 + i * 0.005
                });
            }

            let increment = 0;
            function animate() {
                ctx.fillStyle = 'rgba(0, 24, 69, 0.05)';
                ctx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

                waves.forEach((wave, index) => {
                    ctx.beginPath();
                    ctx.moveTo(0, wave.y);
                    
                    for (let x = 0; x < heroCanvas.width; x++) {
                        ctx.lineTo(x, wave.y + Math.sin(x * wave.length + increment * wave.frequency) * wave.amplitude);
                    }
                    
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 - index * 0.1})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });

                increment += 0.5;
                requestAnimationFrame(animate);
            }
            animate();

            window.addEventListener('resize', () => {
                heroCanvas.width = heroCanvas.offsetWidth;
                heroCanvas.height = heroCanvas.offsetHeight;
            });
        }

        // Chatbot
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSend = document.getElementById('chatbotSend');

        function openChat() {
            chatbotWindow.classList.add('active');
        }

        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        function addMessage(text, isUser = false) {
            const message = document.createElement('div');
            message.className = `message ${isUser ? 'user' : 'bot'}`;
            message.innerHTML = `
                <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
            chatbotMessages.appendChild(message);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'message bot';
            typing.id = 'typing';
            typing.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            chatbotMessages.appendChild(typing);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function removeTyping() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
        }

        function getResponse(question) {
            const q = question.toLowerCase();
            
            if (q.includes('2015')) {
                return '2015 was significant for ocean heat! It marked one of the warmest years on record, with El Niño contributing to a major spike in ocean heat content. The ocean absorbed approximately 8-10 ZJ that year alone.';
            }
            if (q.includes('why') && q.includes('heat')) {
                return 'The ocean is heating because it absorbs over 90% of excess heat from greenhouse gas emissions. CO2 traps heat in the atmosphere, and the ocean acts like a massive thermal buffer. Since 1955, it has absorbed 372 zettajoules—equivalent to billions of atomic bombs worth of energy.';
            }
            if (q.includes('sea level') && (q.includes('2050') || q.includes('future'))) {
                return 'By 2050, global sea levels are projected to rise by 15-30 cm above 2000 levels, depending on emission scenarios. Under a moderate scenario, we could see 0.5-0.7m rise by 2100, while high emissions could lead to 1.2m or more.';
            }
            if (q.includes('coral')) {
                return 'Coral reefs are severely threatened. About 50% have been lost since the 1950s due to warming waters and ocean acidification. When water temperatures rise just 1-2°C above normal, corals expel their symbiotic algae, causing bleaching.';
            }
            if (q.includes('acidification') || q.includes('acid')) {
                return 'Ocean acidification occurs when the ocean absorbs CO2 from the atmosphere, forming carbonic acid. This has made oceans 30% more acidic since pre-industrial times (pH dropped from 8.2 to 8.1). This threatens shell-forming organisms.';
            }
            if (q.includes('what can') || q.includes('what should') || q.includes('help')) {
                return 'We must reduce CO2 emissions dramatically. Individual actions help: reduce energy use, choose sustainable seafood, support ocean conservation. But systemic change is critical—renewable energy adoption, policy changes, protecting marine ecosystems.';
            }
            if (q.includes('phytoplankton')) {
                return 'Phytoplankton are microscopic algae that produce about 50% of Earth\'s oxygen through photosynthesis. They form the base of ocean food webs. Global populations have declined about 6% since the 1980s due to warming and stratification.';
            }
            if (q.includes('temperature') || q.includes('warm')) {
                return 'Global ocean temperatures have increased by 0.13°C per decade since 1901, with accelerating warming in recent decades. The average increase since pre-industrial era is about 1.5°C, affecting marine life and weather patterns.';
            }
            if (q.includes('ice') || q.includes('melt')) {
                return 'Ice sheets are melting at accelerating rates. Greenland loses about 280 billion tons per year, Antarctica loses 150 billion tons per year. This contributes directly to sea level rise—about 50% of the total rise comes from ice melt.';
            }
            if (q.includes('fish') || q.includes('species')) {
                return 'Marine species are migrating poleward at about 75km per decade as waters warm. This disrupts ecosystems and affects fisheries worldwide. About 40% of key marine habitats are now at risk.';
            }
            
            return 'Great question! I can tell you about ocean heat content, sea level rise, ecosystem changes, temperature trends, coral bleaching, acidification, and future projections. Try asking about specific years, phenomena, or marine life.';
        }

        function askQuestion(text) {
            chatbotInput.value = text;
            sendMessage();
        }

        function sendMessage() {
            const text = chatbotInput.value.trim();
            if (!text) return;
            
            addMessage(text, true);
            chatbotInput.value = '';
            
            showTyping();
            setTimeout(() => {
                removeTyping();
                addMessage(getResponse(text));
            }, 1000 + Math.random() * 1000);
        }

        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        console.log('🌊 OceanPulse Complete Platform Loaded');