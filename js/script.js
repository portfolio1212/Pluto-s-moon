document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const modal = document.getElementById('modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalNumber = modal.querySelector('.modal-number');
    const modalTitle = modal.querySelector('.modal-title');
    const modalYear = modal.querySelector('.modal-year');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    const contactForm = document.getElementById('contactForm');

    let currentModalIndex = 0;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        cursorDot.style.left = x + 'px';
        cursorDot.style.top = y + 'px';
        
        setTimeout(() => {
            cursorOutline.style.left = x + 'px';
            cursorOutline.style.top = y + 'px';
        }, 100);
    });

    const interactiveElements = document.querySelectorAll('a, button, .gallery-card, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    const linkSection = link.getAttribute('data-section');
                    if (linkSection === sectionId) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSection = link.getAttribute('data-section');
            
            if (targetSection && !link.classList.contains('nav-link-external')) {
                e.preventDefault();
                const target = document.getElementById(targetSection);
                
                if (target) {
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    galleryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(index);
        });
    });

    function openModal(index) {
        currentModalIndex = index;
        const card = galleryCards[index];
        const img = card.querySelector('img');
        const title = card.getAttribute('data-title');
        const year = card.getAttribute('data-year');

        if (img && img.src && !img.parentElement.classList.contains('placeholder')) {
            modalImage.src = img.src;
            modalNumber.textContent = String(index + 1).padStart(2, '0');
            modalTitle.textContent = title || 'ARTWORK';
            modalYear.textContent = year || '2024';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevModal() {
        currentModalIndex = (currentModalIndex - 1 + galleryCards.length) % galleryCards.length;
        openModal(currentModalIndex);
    }

    function showNextModal() {
        currentModalIndex = (currentModalIndex + 1) % galleryCards.length;
        openModal(currentModalIndex);
    }

    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrevModal);
    modalNext.addEventListener('click', showNextModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevModal();
                    break;
                case 'ArrowRight':
                    showNextModal();
                    break;
            }
        }
        
        if (mainNav.classList.contains('active') && e.key === 'Escape') {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form data:', data);

        alert('メッセージを受け付けました!\n\n実際の運用時は、FormspreeやNetlify Formsなどのサービスと連携してください。');

        contactForm.reset();
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrolled > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });

    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    console.log("Pluto's Moon portfolio initialized");
    console.log('Background: Pluto and Moon animation active');
    console.log('Navigation: Hamburger menu enabled');
    console.log('Smooth scroll navigation active');
});
