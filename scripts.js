function getCurrentTheme() {
    const attrTheme = document.documentElement.getAttribute('data-theme');
    if (attrTheme === 'light' || attrTheme === 'dark') {
        return attrTheme;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButton(theme);
}

function updateToggleButton(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.classList.toggle('dark-mode', theme === 'dark');
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle || themeToggle.dataset.themeInit === 'true') {
        return;
    }

    applyTheme(getCurrentTheme());

    themeToggle.dataset.themeInit = 'true';
    themeToggle.addEventListener('click', () => {
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuToggle || !navLinks) {
        return;
    }

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute(
            'aria-expanded',
            navLinks.classList.contains('active') ? 'true' : 'false'
        );
    });

    document.addEventListener('click', (e) => {
        const isNavLink = e.target.closest('.nav-links a');
        if (navLinks.classList.contains('active') &&
            (isNavLink || (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)))) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initFooter() {
    // Footer snaps to the viewport bottom via body flex + footer { margin-top: auto }.
}

function initCopyright() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.copyright-notice').forEach((element) => {
        element.textContent = `\u00A9 ${year} Eric Gulotty Jr. All rights reserved.`;
    });
}

function initHeroRoleTypewriter() {
    const roleElement = document.querySelector('.hero-role-text');
    const cursorElement = document.querySelector('.hero-role-cursor');

    if (!roleElement || !cursorElement) {
        return;
    }

    const roles = ['Data Scientist', 'Artificial Intelligence Engineer', 'Economist'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 45;
    const pauseDelay = 2800;

    function tick() {
        const currentRole = roles[roleIndex];
        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (isDeleting) {
            charIndex -= 1;
            roleElement.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex += 1;
            roleElement.textContent = currentRole.substring(0, charIndex);
        }

        if (!isDeleting && charIndex === currentRole.length) {
            delay = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 600);
}

function initTypewriter() {
    const container = document.querySelector('.typewriter-container');
    const prefixElement = document.querySelector('.typewriter-prefix');
    const staticElement = document.querySelector('.typewriter-static');
    const suffixElement = document.querySelector('.typewriter-suffix');
    const cursorElement = document.querySelector('.typewriter-cursor');

    if (!container || !prefixElement || !staticElement || !suffixElement || !cursorElement) {
        return;
    }

    const contactPlatforms = [
        { prefix: '', suffix: '@gmail.com' },
        { prefix: 'linkedin.com/in/', suffix: '' },
        { prefix: 'github.com/', suffix: '' },
        { prefix: '', suffix: '.github.io' }
    ];

    let platformIndex = 0;
    let prefixIndex = 0;
    let suffixIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    const deletingDelay = 50;
    const newTextDelay = 2000;

    function updateCursor() {
        const platform = contactPlatforms[platformIndex];
        const typingPrefix = platform.prefix && (
            isDeleting ? prefixIndex > 0 : prefixIndex < platform.prefix.length
        );
        const typingSuffix = platform.suffix && (
            isDeleting ? suffixIndex > 0 : suffixIndex < platform.suffix.length
        );

        if (typingPrefix) {
            prefixElement.after(cursorElement);
        } else if (typingSuffix) {
            suffixElement.after(cursorElement);
        } else if (platform.suffix && suffixIndex > 0) {
            suffixElement.after(cursorElement);
        } else if (platform.prefix && prefixIndex > 0) {
            staticElement.after(cursorElement);
        } else {
            staticElement.after(cursorElement);
        }
    }

    function typeEffect() {
        const currentPlatform = contactPlatforms[platformIndex];
        const currentPrefix = currentPlatform.prefix;
        const currentSuffix = currentPlatform.suffix;

        if (isDeleting) {
            if (currentPrefix) {
                prefixElement.textContent = currentPrefix.substring(0, prefixIndex - 1);
                prefixIndex--;
            }

            if (currentSuffix) {
                suffixElement.textContent = currentSuffix.substring(0, suffixIndex - 1);
                suffixIndex--;
            }

            typingDelay = deletingDelay;
        } else {
            if (currentPrefix && prefixIndex < currentPrefix.length) {
                prefixElement.textContent = currentPrefix.substring(0, prefixIndex + 1);
                prefixIndex++;
            }

            if (currentSuffix && suffixIndex < currentSuffix.length) {
                suffixElement.textContent = currentSuffix.substring(0, suffixIndex + 1);
                suffixIndex++;
            }

            typingDelay = 100;
        }

        updateCursor();

        const prefixComplete = !currentPrefix || prefixIndex === currentPrefix.length;
        const suffixComplete = !currentSuffix || suffixIndex === currentSuffix.length;

        if (!isDeleting && prefixComplete && suffixComplete) {
            isDeleting = false;
            typingDelay = newTextDelay;
            setTimeout(() => {
                isDeleting = true;
            }, newTextDelay);
        }

        const prefixDeleted = !currentPrefix || prefixIndex === 0;
        const suffixDeleted = !currentSuffix || suffixIndex === 0;

        if (isDeleting && prefixDeleted && suffixDeleted) {
            isDeleting = false;
            platformIndex = (platformIndex + 1) % contactPlatforms.length;
            prefixIndex = 0;
            suffixIndex = 0;
        }

        setTimeout(typeEffect, typingDelay);
    }

    updateCursor();
    setTimeout(typeEffect, 1000);
}

function initAOS() {
    if (typeof AOS === 'undefined') {
        return;
    }

    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        mirror: false,
        offset: 40,
        delay: 0
    });

    setTimeout(function() {
        document.querySelectorAll('[data-aos]').forEach(function(el) {
            el.style.pointerEvents = 'auto';
        });
    }, 1000);
}

function initReadMore() {
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', () => {
            const fullDescription = button.previousElementSibling;
            fullDescription.classList.toggle('hidden');
            button.textContent = fullDescription.classList.contains('hidden') ? 'Read More' : 'Read Less';
        });
    });

    document.querySelectorAll('.timeline-content').forEach(content => {
        const fullDesc = content.querySelector('.full-description');
        const readMoreBtn = content.querySelector('.read-more');

        if (!fullDesc || fullDesc.textContent.trim().length === 0) {
            if (readMoreBtn) {
                readMoreBtn.style.display = 'none';
            }
        }
    });
}

function initH1DataText() {
    document.querySelectorAll('h1').forEach(h1 => {
        if (!h1.hasAttribute('data-text')) {
            h1.setAttribute('data-text', h1.textContent);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileMenu();
    initFooter();
    initCopyright();
    initAOS();
    initReadMore();
    initH1DataText();
    initHeroRoleTypewriter();
    initTypewriter();
});
