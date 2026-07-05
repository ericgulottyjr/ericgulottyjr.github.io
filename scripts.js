function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
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
    if (!themeToggle) {
        return;
    }

    applyTheme(getCurrentTheme());

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
    const footer = document.querySelector('footer');
    if (!footer) {
        return;
    }

    const body = document.body;
    const html = document.documentElement;

    function adjustFooter() {
        const documentHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        const viewportHeight = window.innerHeight;

        if (documentHeight > viewportHeight + 150) {
            footer.classList.remove('fixed');
            footer.classList.add('dynamic');
        } else {
            footer.classList.remove('dynamic');
            footer.classList.add('fixed');
        }
    }

    adjustFooter();
    window.addEventListener('resize', adjustFooter);
    window.addEventListener('load', adjustFooter);

    if (window.matchMedia('(max-width: 768px)').matches) {
        footer.classList.remove('fixed');
        footer.classList.add('dynamic');
    }
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

function initTypewriter() {
    const prefixElement = document.querySelector('.typewriter-prefix');
    const suffixElement = document.querySelector('.typewriter-suffix');

    if (!prefixElement || !suffixElement) {
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

    setTimeout(typeEffect, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileMenu();
    initFooter();
    initAOS();
    initReadMore();
    initH1DataText();
    initTypewriter();
});
