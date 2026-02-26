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

/* — Education items — */
gsap.utils.toArray('[data-edu]').forEach((el, i) => {

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    tl.fromTo(el,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    )

    .fromTo(el.querySelector('.edu-card'),
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.45"
    )

    .fromTo(el.querySelector('.edu-year'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.4"
    );

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
                        const circumference = 314; // 2 * π * 50
                        const offset = circumference - (pct / 100) * circumference;

                        gsap.to(fill, {
                            strokeDashoffset: offset,
                            duration: 1.5,
                            ease: 'power3.out',
                            delay: 0.3
                        });

                        // Count-up number
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

/* — Project cards — */
gsap.utils.toArray('[data-project]').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        }
    );
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