// ===== NAVIGATION TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');

const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
    }, stepTime);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formNotice = document.getElementById('formNotice');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const pesan = document.getElementById('pesan').value.trim();

        if (!nama || !email || !pesan) {
            formNotice.textContent = 'Harap lengkapi semua field.';
            formNotice.className = 'form-notice error';
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            formNotice.textContent = 'Alamat email tidak valid.';
            formNotice.className = 'form-notice error';
            return;
        }

        formNotice.textContent = 'Pesan Anda berhasil terkirim!';
        formNotice.className = 'form-notice success';
        form.reset();

        setTimeout(() => {
            formNotice.textContent = '';
            formNotice.className = 'form-notice';
        }, 5000);
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.produk-card, .tentang-item, .testimoni-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===== PARALLAX EFFECT ON HERO =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.illustration-card');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    cards.forEach((card, index) => {
        const speed = 1 + index * 0.2;
        card.style.transform = `translate(${x * speed * 0.3}px, ${y * speed * 0.3}px)`;
    });
});

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5 ? '251, 191, 36' : '74, 139, 202';
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.phase += 0.01;
        this.x += this.speedX + Math.sin(this.phase) * 0.02;
        this.y += this.speedY + Math.cos(this.phase) * 0.02;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150 * 0.03;
            this.x -= dx * force;
            this.y -= dy * force;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const color1 = particles[i].color;
                const color2 = particles[j].color;
                const mixedColor = color1 === color2 ? color1 : '251, 191, 36';
                ctx.strokeStyle = `rgba(${mixedColor}, ${0.04 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
}

animateParticles();

console.log('🚀 Tech Tiles landing page loaded successfully.');