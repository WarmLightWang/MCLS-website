// index.js - core intergration setup for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Main page content loading function
    async function loadPageContent(pageId) {
        try {
            const pageFiles = {
                'about': '../html/about_us.html',
                'registration': '../html/registration.html',
                'resource': '../html/resource.html',
                'calendar': '../html/calendar.html',
                'news': '../html/news.html'
            };

            const sectionMapping = {
                'about': 'aboutSection',
                'registration': 'registrationSection',
                'resource': 'resourceSection',
                'calendar': 'calendarSection',
                'news': 'newsSection'
            };

            const pageFile = pageFiles[pageId];
            if (!pageFile) {
                console.error('No matching page file for:', pageId);
                return;
            }

            const response = await fetch(pageFile);
            const html = await response.text();

            const targetSection = document.getElementById(sectionMapping[pageId]);
            if (targetSection) {
                // Hide all main sections
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });

                // Update and show the target section
                targetSection.innerHTML = html;
                targetSection.style.display = 'block';

                // Apply current language to newly loaded content
                const currentLanguage = window.MCLS.getCurrentLanguage();
                window.MCLS.applyLanguageToElements(currentLanguage);

                // If this is the about page, set up its internal navigation and load initial content
                if (pageId === 'about') {
                    setupAboutPageNavigation();
                    loadAboutContent('aboutUs');
                    const cleanupSlider = initializeSlider();
    
                    // Store cleanup function for later use
                    window.cleanupSlider = cleanupSlider;
                }
            }
        } catch (error) {
            console.error(`Error loading content for ${pageId}:`, error);
        }
    }

    // Set up main navigation click handlers
    const mainNavLinks = document.querySelectorAll('#about, #registration, #resource, #calendar, #news');
    
    mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPageContent(link.id);
        });
    });

    // Initial load of about page
    loadPageContent('about');
});