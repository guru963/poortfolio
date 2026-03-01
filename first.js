/* ─── CURSOR GLOW ───────────────────────────────────────────── */
const glow = document.createElement('div');
glow.classList.add('cursor-glow');
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
});

/* ─── HAMBURGER / NAV ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ─── GSAP + SCROLLTRIGGER ──────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* — Hero reveals — */
gsap.to('.hero-eyebrow', {
    opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'
});
gsap.from('.hero-eyebrow', { y: 20 });

gsap.fromTo('.hero-title span', 
    { opacity: 0, y: 60, skewY: 4 },
    { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.15, delay: 0.5, ease: 'power3.out' }
);

gsap.fromTo('.hero-desc',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, delay: 1.0, ease: 'power2.out' }
);

gsap.fromTo('.hero-cta',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'power2.out' }
);

/* — Section title reveals via ScrollTrigger — */
gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        }
    );
});

/* ═══════════════════════════════════════════════════════════ */
/* EDUCATION — Horizontal timeline animation                   */
/* ═══════════════════════════════════════════════════════════ */
ScrollTrigger.create({
    trigger: '.timeline-wrap',
    start: 'top 75%',
    once: true,
    onEnter: () => {
        // Animate the line fill
        const fill = document.getElementById('timelineFill');
        if (fill) fill.style.width = '100%';

        // Stagger milestones
        document.querySelectorAll('[data-milestone]').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 300 + i * 180);
        });
    }
});

/* ═══════════════════════════════════════════════════════════ */
/* SERVICES — Staggered entrance                               */
/* ═══════════════════════════════════════════════════════════ */
ScrollTrigger.create({
    trigger: '.services-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('[data-service]').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 120);
        });
    }
});

/* — Skill groups appear — */
gsap.utils.toArray('[data-skill-group]').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    // Animate skill bars
                    el.querySelectorAll('.skill-bar-fill').forEach(bar => {
                        const w = bar.getAttribute('data-width');
                        bar.style.width = w + '%';
                    });
                    // Animate soft-skill rings
                    el.querySelectorAll('.soft-skill').forEach(sk => {
                        const pct = parseInt(sk.getAttribute('data-soft'));
                        const fill = sk.querySelector('.soft-ring-fill');
                        const pctEl = sk.querySelector('.soft-pct');
                        const circumference = 314;
                        const offset = circumference - (pct / 100) * circumference;

                        gsap.to(fill, {
                            strokeDashoffset: offset,
                            duration: 1.5,
                            ease: 'power3.out',
                            delay: 0.3
                        });

                        let current = 0;
                        const interval = setInterval(() => {
                            current += 2;
                            if (current >= pct) { current = pct; clearInterval(interval); }
                            pctEl.textContent = current + '%';
                        }, 30);
                    });
                }
            }
        }
    );
});

/* ═══════════════════════════════════════════════════════════ */
/* PROJECTS — Tab Switcher                                     */
/* ═══════════════════════════════════════════════════════════ */
const tabs      = document.querySelectorAll('.project-tab');
const panels    = document.querySelectorAll('.project-panel');
const indicator = document.querySelector('.project-tab-indicator');

function updateIndicator(activeTab) {
    const tabsContainer = document.querySelector('.project-tabs');
    const containerRect = tabsContainer.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const offset = tabRect.left - containerRect.left;

    // Move indicator WITHOUT resizing
    indicator.style.transform =
        `translateX(${offset + (tabRect.width - indicator.offsetWidth)/2}px)`;
}

// Init indicator on load
const initActive = document.querySelector('.project-tab.active');
if (initActive) {
    requestAnimationFrame(() => {
        updateIndicator(initActive);
    });
}

// Tab click
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = 'tab-' + tab.getAttribute('data-tab');

        // Update active tab
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Move indicator
        updateIndicator(tab);

        // Switch panels
        panels.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
    });
});

// Reposition on resize
window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.project-tab.active');
    if (activeTab) updateIndicator(activeTab);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════ */
/* REVIEWS — Horizontal scroll + animations                   */
/* ═══════════════════════════════════════════════════════════ */
const track   = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('reviewPrev');
const nextBtn = document.getElementById('reviewNext');
let reviewIndex = 0;

function getCardWidth() {
    const card = track.querySelector('.review-card');
    if (!card) return 364;
    return card.offsetWidth + 24; // card + gap
}

function moveReviews(dir) {
    const total = track.querySelectorAll('.review-card').length;
    reviewIndex = Math.max(0, Math.min(total - 1, reviewIndex + dir));
    const offset = reviewIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
}

if (prevBtn) prevBtn.addEventListener('click', () => moveReviews(-1));
if (nextBtn) nextBtn.addEventListener('click', () => moveReviews(1));

// Animate review cards and headings on scroll
ScrollTrigger.create({
    trigger: '.reviews',
    start: 'top 75%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('.reviews-heading, .reviews-sub').forEach(el => {
            el.classList.add('visible');
        });

        document.querySelectorAll('[data-review]').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 150);
        });
    }
});

/* — Contact info items — */
gsap.utils.toArray('[data-contact-item]').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0, duration: 0.7, delay: i * 0.12, ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true
            }
        }
    );
});

gsap.fromTo('.contact-socials',
    { opacity: 0, x: -30 },
    {
        opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-socials',
            start: 'top 88%',
            once: true
        }
    }
);

gsap.fromTo('[data-form]',
    { opacity: 0, y: 30 },
    {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: {
            trigger: '[data-form]',
            start: 'top 85%',
            once: true
        }
    }
);

/* — Parallax glow on hero — */
document.querySelector('.hero').addEventListener('mousemove', e => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    gsap.to('.hero::before', { x: x * 40, y: y * 40, duration: 1, ease: 'power1.out' });
});

/* — Nav shrink on scroll — */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    nav.style.padding = window.scrollY > 60 ? '14px 48px' : '24px 48px';
}, { passive: true });

/* — Form submit animation — */
const form = document.querySelector('[data-form]');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn--primary');
        btn.textContent = 'Sent ✓';
        btn.style.background = '#4caf50';
        btn.style.borderColor = '#4caf50';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            form.reset();
        }, 2500);
    });
}