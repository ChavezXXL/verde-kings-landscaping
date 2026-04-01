// ============================================
// JDJ LANDSCAPING & GARDENING SERVICES
// Advanced Animations | Parallax | Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === Cursor Glow Effect (Desktop) ===
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // === Navbar ===
    const navbar = document.getElementById('navbar');
    const floatingCta = document.getElementById('floatingCta');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        floatingCta.classList.toggle('visible', window.scrollY > window.innerHeight);
    });

    // === Mobile Menu ===
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Stats are now static values — no animation needed

    // === Scroll Reveal Animations ===
    const revealElements = document.querySelectorAll(
        '.service-card, .pricing-card, .portfolio-card, .review-card, .step, .about-feature, .trust-item, .contact-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, i * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.98)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // === Section Headers Reveal ===
    document.querySelectorAll('.section-header').forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 }).observe(header);
    });

    // === Before/After Sliders ===
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const beforeImg = slider.querySelector('.ba-before');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width;
            pos = Math.max(0.05, Math.min(0.95, pos));
            beforeImg.style.clipPath = `inset(0 ${(1 - pos) * 100}% 0 0)`;
            handle.style.left = (pos * 100) + '%';
        }

        slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
        slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, {passive: true});

        document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
        document.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, {passive: true});

        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('touchend', () => { isDragging = false; });
    });

    // === Map click to activate ===
    const mapWrapper = document.getElementById('mapWrapper');
    if (mapWrapper) {
        mapWrapper.addEventListener('click', () => {
            mapWrapper.classList.add('active');
        });
        document.addEventListener('click', (e) => {
            if (!mapWrapper.contains(e.target)) {
                mapWrapper.classList.remove('active');
            }
        });
    }

    // Area items are display-only, no click behavior needed

    // === Pricing Toggle (Monthly/Annual) ===
    const pricingToggle = document.getElementById('pricingToggle');
    if (pricingToggle) {
        let isAnnual = false;
        const toggleLabels = document.querySelectorAll('.toggle-label');

        pricingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            pricingToggle.classList.toggle('active', isAnnual);
            toggleLabels.forEach(label => {
                label.classList.toggle('active',
                    (isAnnual && label.dataset.period === 'annual') ||
                    (!isAnnual && label.dataset.period === 'monthly')
                );
            });
            document.querySelectorAll('.price[data-monthly]').forEach(price => {
                const target = isAnnual ? parseInt(price.dataset.annual) : parseInt(price.dataset.monthly);
                animatePrice(price, target);
            });
        });

        function animatePrice(el, target) {
            const current = parseInt(el.textContent);
            const diff = target - current;
            const duration = 400;
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(current + diff * eased);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
    }

    // === Parallax on Hero ===
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const progress = window.scrollY / window.innerHeight;
            if (heroContent) {
                heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
                heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
            }
        }
    });

    // Card tilt disabled for cleaner feel

    // === Phone Formatting ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 3) value = '(' + value;
            else if (value.length <= 6) value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
            else value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
            e.target.value = value;
        });
    }

    // === Quote Form ===
    const quoteForm = document.getElementById('quoteForm');
    const formSuccess = document.getElementById('formSuccess');

    if (quoteForm) {
        // Floating label effect
        quoteForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            field.addEventListener('blur', () => {
                if (!field.value) field.parentElement.classList.remove('focused');
            });
        });

        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Animated button state
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';

            const formData = new FormData(quoteForm);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });
            data.submittedAt = new Date().toISOString();

            // Simulate brief processing
            await new Promise(r => setTimeout(r, 1200));

            try {
                // Store locally
                const submissions = JSON.parse(localStorage.getItem('jdj_quotes') || '[]');
                submissions.push(data);
                localStorage.setItem('jdj_quotes', JSON.stringify(submissions));

                // Production: Uncomment and add your Formspree / EmailJS endpoint
                // await fetch('https://formspree.io/f/YOUR_ID', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });

                // Success animation
                quoteForm.style.opacity = '0';
                quoteForm.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    quoteForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.style.opacity = '0';
                    formSuccess.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        formSuccess.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        formSuccess.style.opacity = '1';
                        formSuccess.style.transform = 'scale(1)';
                    });
                }, 300);

                // Analytics tracking
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        event_category: 'Quote Request',
                        event_label: data.service
                    });
                }

                console.log('Quote submitted:', data);
            } catch (error) {
                console.error('Submission error:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                alert('Something went wrong. Please call us at (818) 641-6482.');
            }
        });
    }

    // === FAQ Accordion ===
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            // Open clicked (if it wasn't already open)
            if (!isOpen) item.classList.add('active');
        });
    });

    // === Active Nav Tracking ===
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.style.opacity = link.getAttribute('href') === '#' + current ? '1' : '';
            });
        }
    });

    // Magnetic buttons disabled for smoother UX

    // === Pricing Card Hover ===
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            document.querySelectorAll('.pricing-card').forEach(c => {
                if (c !== card) c.style.opacity = '0.6';
            });
        });
        card.addEventListener('mouseleave', () => {
            document.querySelectorAll('.pricing-card').forEach(c => {
                c.style.opacity = '1';
            });
        });
    });

    // Area items don't need scroll reveal - they're on dark bg and visible by default

    // === Typing Effect for Hero (optional visual flair) ===
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.animation = 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }, 200);
    }

    // === Preloader ===
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

});

// === Admin: View Quotes (console) ===
window.viewQuotes = function() {
    const quotes = JSON.parse(localStorage.getItem('jdj_quotes') || '[]');
    if (!quotes.length) return console.log('No quotes yet.');
    console.table(quotes);
    return quotes;
};

// === Admin: Export Quotes as CSV (console) ===
window.exportQuotes = function() {
    const quotes = JSON.parse(localStorage.getItem('jdj_quotes') || '[]');
    if (!quotes.length) return console.log('No quotes to export.');

    const headers = Object.keys(quotes[0]);
    const csv = [
        headers.join(','),
        ...quotes.map(q => headers.map(h => `"${(q[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jdj-quotes.csv';
    a.click();
    URL.revokeObjectURL(url);
    console.log(`Exported ${quotes.length} quotes.`);
};
