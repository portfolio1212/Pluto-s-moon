document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const galleryContainer = document.getElementById('galleryContainer');
    const artworkItems = document.querySelectorAll('.artwork-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxNumber = lightbox.querySelector('.lightbox-number');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxYear = lightbox.querySelector('.lightbox-year');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    let currentLightboxIndex = 0;
    let visibleItems = Array.from(artworkItems);

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

    const interactiveElements = document.querySelectorAll('a, button, .artwork-item');
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

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            artworkItems.forEach(item => {
                const itemYear = item.getAttribute('data-year');
                const itemType = item.getAttribute('data-type');
                const matchesAll = filter === 'all';
                const matchesYear = itemYear === filter;
                const matchesType = itemType === filter;

                if (matchesAll || matchesYear || matchesType) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });

            visibleItems = Array.from(artworkItems).filter(item => !item.classList.contains('hidden'));
        });
    });

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const layout = btn.getAttribute('data-layout');
            
            galleryContainer.classList.remove('grid-layout', 'masonry-layout', 'list-layout');
            galleryContainer.classList.add(`${layout}-layout`);

            artworkItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });
    });

    artworkItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('hidden')) {
                const itemIndex = visibleItems.indexOf(item);
                openLightbox(itemIndex);
            }
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.artwork-title').textContent;
        const year = item.querySelector('.artwork-year').textContent;
        const category = item.querySelector('.artwork-category').textContent;
        const number = item.querySelector('.artwork-number').textContent;
        const description = item.getAttribute('data-description') || '';

        if (img && !img.parentElement.classList.contains('placeholder')) {
            lightboxImage.src = img.src;
            lightboxNumber.textContent = number;
            lightboxTitle.textContent = title;
            lightboxYear.textContent = year;
            lightboxCategory.textContent = category;
            if (lightboxDescription) {
                lightboxDescription.textContent = description;
                lightboxDescription.style.display = description ? 'block' : 'none';
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevLightbox() {
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentLightboxIndex);
    }

    function showNextLightbox() {
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
        openLightbox(currentLightboxIndex);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevLightbox);
    lightboxNext.addEventListener('click', showNextLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevLightbox();
                break;
            case 'ArrowRight':
                showNextLightbox();
                break;
        }
    });

    let itemsShown = 12;
    const itemsPerLoad = 6;

    function updateLoadMoreButton() {
        const totalItems = artworkItems.length;
        if (itemsShown >= totalItems) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        const totalItems = artworkItems.length;
        const newItemsShown = Math.min(itemsShown + itemsPerLoad, totalItems);

        for (let i = itemsShown; i < newItemsShown; i++) {
            if (artworkItems[i]) {
                artworkItems[i].style.animationDelay = `${(i - itemsShown) * 0.1}s`;
            }
        }

        itemsShown = newItemsShown;
        updateLoadMoreButton();

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    updateLoadMoreButton();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    artworkItems.forEach(item => {
        observer.observe(item);
    });

    const images = document.querySelectorAll('.artwork-inner img');
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.gallery-header');
        
        if (scrolled > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });

    console.log('Gallery page initialized');
    console.log(`Total artworks: ${artworkItems.length}`);
    console.log('Layout modes: Grid, Masonry, List');
    console.log('Filter options: All, 2024, 2023, 2022');
});
