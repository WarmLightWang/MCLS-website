// language.js - Core language management for all pages
const DEFAULT_LANGUAGE = 'en';
const SESSION_STORAGE_KEY = 'currentSessionLanguage';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the first time the site is being loaded in this session
    const isNewSession = !sessionStorage.getItem('sessionStarted');
    
    if (isNewSession) {
        // First visit in this session - set English as default
        sessionStorage.setItem('sessionStarted', 'true');
        sessionStorage.setItem(SESSION_STORAGE_KEY, DEFAULT_LANGUAGE);
    }
    
    // Get current session language
    const currentLanguage = sessionStorage.getItem(SESSION_STORAGE_KEY) || DEFAULT_LANGUAGE;
    
    // Update language selector if it exists
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        
        // Add event listener for language selection
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Apply current language
    changeLanguage(currentLanguage);
});

function changeLanguage(lang) {
    // Save language preference for current session
    sessionStorage.setItem(SESSION_STORAGE_KEY, lang);
    
    // Update all elements with direct language attributes
    applyLanguageToElements(lang);
    
    // Notify other scripts that language has changed
    document.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { 
            language: lang,
            isDefaultLanguage: lang === DEFAULT_LANGUAGE 
        }
    }));
}

// New function to apply language to elements
function applyLanguageToElements(lang) {
    document.querySelectorAll('[en]').forEach(elem => {
        const enText = elem.getAttribute('en');
        const zhText = elem.getAttribute('zh');
        elem.textContent = lang === 'zh' ? zhText : enText;
    });
    
    // Update document title if translations exist
    const titleElement = document.querySelector('title');
    if (titleElement) {
        const enTitle = titleElement.getAttribute('en');
        const zhTitle = titleElement.getAttribute('zh');
        if (enTitle && zhTitle) {
            titleElement.textContent = lang === 'zh' ? zhTitle : enTitle;
        }
    }
}

// Export for use in other scripts
window.MCLS = window.MCLS || {};
window.MCLS.getCurrentLanguage = function() {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) || DEFAULT_LANGUAGE;
};
window.MCLS.applyLanguageToElements = applyLanguageToElements;