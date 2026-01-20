document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle Icon between Bars and Times (Close)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu on mobile after click
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Form Submission with Validation
    const form = document.getElementById('enquiryForm');

    // Helper validation regex
    const patterns = {
        name: /^[a-zA-Z\s]{3,}$/, // Min 3 chars, letters only
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        phone: /^[0-9+]{10,15}$/, // 10-15 digits, allows +
        message: /^[\s\S]{10,}$/ // Min 10 chars
    };

    const validateField = (field, regex) => {
        const value = field.value.trim();
        const parent = field.parentElement;
        // Remove existing error
        const existingError = parent.querySelector('.error-msg');
        if (existingError) existingError.remove();

        if (!regex.test(value)) {
            field.style.borderColor = 'red';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-msg';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';

            if (field.id === 'name') errorDiv.innerText = 'Name must be at least 3 letters.';
            if (field.id === 'email') errorDiv.innerText = 'Please enter a valid email address.';
            if (field.id === 'phone') errorDiv.innerText = 'Phone must be 10-15 digits.';
            if (field.id === 'message') errorDiv.innerText = 'Message must be at least 10 characters.';

            parent.appendChild(errorDiv);
            return false;
        } else {
            field.style.borderColor = '#ddd'; // Restore default (adjust color if needed)
            return true;
        }
    };

    if (form) {
        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                if (patterns[e.target.id]) {
                    validateField(e.target, patterns[e.target.id]);
                }
            });
        });

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const nameValid = validateField(document.getElementById('name'), patterns.name);
                const emailValid = validateField(document.getElementById('email'), patterns.email);
                const phoneValid = validateField(document.getElementById('phone'), patterns.phone);
                const messageValid = validateField(document.getElementById('message'), patterns.message);

                if (!nameValid || !emailValid || !phoneValid || !messageValid) {
                    return;
                }

                const originalText = submitBtn.value;
                submitBtn.value = 'Sending...';
                submitBtn.style.opacity = '0.7';
                submitBtn.disabled = true;

                const formData = new FormData(form);

                fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(data.message);
                            form.reset();
                            form.querySelectorAll('input, textarea').forEach(i => i.style.borderColor = '#ddd');
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to send message. Please check your internet connection.');
                    })
                    .finally(() => {
                        submitBtn.value = originalText;
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    });
            });
        }
    }

    // Scroll Reveal Animation (Simple version)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Staggered animation for feature list items
                if (entry.target.classList.contains('features-list')) {
                    const items = entry.target.querySelectorAll('li');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content, .section-title, .gallery-item, .contact-wrapper, .features-list').forEach(el => {
        el.style.opacity = '0';
        // Remove translateY from here as it conflicts with CSS animations in some cases, handle in CSS or be specific
        if (!el.classList.contains('hero-content')) {
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
