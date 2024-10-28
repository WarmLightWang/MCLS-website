// about_us.js - setup the content flow on About Us page
function initializeSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const sliderImages = slider.querySelectorAll('.slider-image');
    if (sliderImages.length === 0) return;

    let currentImageIndex = 0;
    let isTransitioning = false;
    let slideInterval;

    // Create navigation dots
    const sliderNav = document.createElement('div');
    sliderNav.className = 'slider-nav';
    
    // Create nav buttons based on number of images
    sliderImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('data-index', index);
        if (index === 0) dot.classList.add('active');
        sliderNav.appendChild(dot);
    });
    slider.appendChild(sliderNav);

    const navButtons = sliderNav.querySelectorAll('button');

    function updateSlider(newIndex) {
        if (isTransitioning || newIndex === currentImageIndex) return;
        isTransitioning = true;

        // Ensure newIndex is within bounds
        newIndex = (newIndex + sliderImages.length) % sliderImages.length;

        // Update navigation buttons
        navButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === newIndex);
        });

        // Update images
        const currentImage = sliderImages[currentImageIndex];
        const nextImage = sliderImages[newIndex];

        // Reset all images except current and next
        sliderImages.forEach(img => {
            if (img !== currentImage && img !== nextImage) {
                img.style.opacity = '0';
                img.style.zIndex = '0';
            }
        });

        // Position the images for transition
        currentImage.style.zIndex = '1';
        nextImage.style.zIndex = '2';
        
        // Trigger transition
        requestAnimationFrame(() => {
            nextImage.style.opacity = '1';
            currentImage.style.opacity = '0';

            // Wait for transition to complete
            setTimeout(() => {
                currentImageIndex = newIndex;
                isTransitioning = false;
            }, 500); // Match this with CSS transition duration
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        slideInterval = setInterval(() => {
            updateSlider((currentImageIndex + 1) % sliderImages.length);
        }, 5000);
    }

    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Initialize first image
    sliderImages.forEach((img, index) => {
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.zIndex = index === 0 ? '1' : '0';
    });

    // Event Listeners
    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            stopAutoPlay();
            updateSlider(index);
            startAutoPlay();
        });
    });

    // Touch events
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
    });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) { // minimum swipe distance
            if (diff > 0) {
                updateSlider(currentImageIndex + 1);
            } else {
                updateSlider(currentImageIndex - 1);
            }
        }
        startAutoPlay();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            updateSlider(currentImageIndex - 1);
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            updateSlider(currentImageIndex + 1);
            startAutoPlay();
        }
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    startAutoPlay();

    // Return cleanup function
    return function cleanup() {
        stopAutoPlay();
        slider.removeEventListener('mouseenter', stopAutoPlay);
        slider.removeEventListener('mouseleave', startAutoPlay);
    };
}

 // Subtitle content loading function on the main page(About Us)
 async function loadAboutContent(contentId) {
    try {
        const contentFiles = {
            'aboutUs': '../html/about/aboutUs.html',
            'contactUs': '../html/about/contactUs.html',
            'schoolPolicy': '../html/about/policy.html',
            'guidelines': '../html/about/guidelines.html',
            'teachers': '../html/about/teachers.html'
        };

        const contentMapping = {
            'aboutUs': 'aboutContent',
            'contactUs': 'contactContent',
            'schoolPolicy': 'policyContent',
            'guidelines': 'guideContent',
            'teachers': 'teacherContent'
        };

        const contentFile = contentFiles[contentId];
        if (!contentFile) {
            console.error('No matching content file for:', contentId);
            return;
        }

        const response = await fetch(contentFile);
        const html = await response.text();

        const contentSections = document.querySelectorAll(
            '#aboutContent, #contactContent, #policyContent, #guideContent, #teacherContent'
        );

        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        const mainAboutSection = document.querySelector('#aboutSection');
        if (mainAboutSection) {
            mainAboutSection.style.display = 'block';
        }

        const sliderSection = document.querySelector('#slider');
        if (sliderSection) {
            sliderSection.style.display = 'block';
        }

        const targetSection = document.getElementById(contentMapping[contentId]);
        if (targetSection) {
            targetSection.innerHTML = html;
            targetSection.style.display = 'block';

            // Apply current language to newly loaded content
            const currentLanguage = window.MCLS.getCurrentLanguage();
            window.MCLS.applyLanguageToElements(currentLanguage);
        }
    } catch (error) {
        console.error(`Error loading content for ${contentId}:`, error);
    }
}

function setupAboutPageNavigation() {
    const aboutPageLinks = document.querySelectorAll('#aboutUs, #contactUs, #schoolPolicy, #guidelines, #teachers');
    
    aboutPageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadAboutContent(link.id);
        });
    });
}