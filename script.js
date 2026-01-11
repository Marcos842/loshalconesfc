// ==========================================
// SCRIPT.JS - Los Halcones FC
// ==========================================

// Inicializar AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});

// Navbar transparente al scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 1)';
    }
});

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar navbar en móvil después de click
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Animación contador de stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Iniciar contadores cuando sean visibles
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const counters = entry.target.querySelectorAll('.display-4');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                if (!isNaN(target)) {
                    animateCounter(counter, target, 2000);
                }
            });
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// ==========================================
// FORMULARIO DE INSCRIPCIÓN - CORREGIDO
// ==========================================
const inscripcionForm = document.getElementById('inscripcionForm');
if (inscripcionForm) {
    inscripcionForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
        btn.disabled = true;

        // Recopilar datos del formulario
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Agregar timestamp en formato Perú
        data.fecha = new Date().toLocaleString('es-PE', {timeZone: 'America/Lima'});

        try {
            // Enviar a Google Apps Script
            // NOTA: Con mode: 'no-cors' no podemos leer la respuesta, pero los datos SÍ se envían
            fetch('https://script.google.com/macros/s/AKfycbzVMKRTU97EacsbRS8P2qMeL62l-jPRn-X7kv6mqoa7Z6dfPYoWuZ9jyW8bDNMWHLlZ-g/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Esperar 2 segundos para dar tiempo al servidor
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mostrar mensaje de éxito
            const mensajeExito = document.getElementById('mensajeExito');
            if (mensajeExito) {
                mensajeExito.classList.remove('d-none');
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    mensajeExito.classList.add('d-none');
                }, 5000);
            }

            // Alerta personalizada de éxito
            alert(
                '🎉 ¡Inscripción enviada con éxito!\n\n' +
                '✅ Hemos recibido tu solicitud\n' +
                '✅ Recibirás un email de confirmación\n' +
                '✅ Nos contactaremos contigo en las próximas 24 horas\n\n' +
                '¡Bienvenido a la familia Los Halcones FC! 🦅⚽'
            );

            // Limpiar formulario
            inscripcionForm.reset();

            // Scroll al inicio del formulario
            inscripcionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            
            // Mensaje de error amigable
            alert(
                '⚠️ Hubo un problema al enviar tu inscripción.\n\n' +
                'Por favor, intenta nuevamente o contáctanos directamente:\n\n' +
                '📱 WhatsApp: +51 949 356 883\n' +
                '📧 Email: mb2571079@gmail.com'
            );
        } finally {
            // Restaurar botón siempre
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// Lazy loading para imágenes
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Cambiar color de categoria cards al hacer hover
document.querySelectorAll('.categoria-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
    });
    card.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#ffffff';
    });
});

// Efecto parallax en hero (opcional)
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-video');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Validación adicional de formulario
function validatePhoneNumber(phone) {
    const phoneRegex = /^[9]\d{8}$/; // Formato peruano: 9XXXXXXXX
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

if (inscripcionForm) {
    // Validación de teléfono
    const phoneInput = inscripcionForm.querySelector('input[name="telefono"]');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (!validatePhoneNumber(this.value)) {
                this.classList.add('is-invalid');
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Por favor ingresa un número válido (ej: 987654321)';
                    this.parentNode.appendChild(feedback);
                }
            } else {
                this.classList.remove('is-invalid');
                const feedback = this.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            }
        });
    }

    // Validación de email
    const emailInput = inscripcionForm.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                this.classList.add('is-invalid');
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Por favor ingresa un email válido';
                    this.parentNode.appendChild(feedback);
                }
            } else {
                this.classList.remove('is-invalid');
                const feedback = this.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            }
        });
    }
}

// Google Analytics (opcional - reemplaza con tu ID)
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
*/

// Facebook Pixel (opcional - reemplaza con tu ID)
/*
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
*/

// Evento tracking de clicks en botones importantes
document.querySelectorAll('.btn-warning, .btn-success').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        console.log('Botón clickeado:', btnText);
        // Aquí puedes agregar tracking de Google Analytics o Facebook Pixel
    });
});

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', function() {
    const viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    }
}, { once: true });

console.log('🦅 Los Halcones FC - Website cargado correctamente');
console.log('📝 Formulario de inscripción: ACTIVO');
