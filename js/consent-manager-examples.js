/**
 * GDPR Consent Manager - Quick Start Examples
 *
 * This file contains practical examples of how to use the ConsentManager
 * in your JavaScript code.
 */

// ============================================================================
// EXAMPLE 1: Check if user has given consent before using a service
// ============================================================================

if (ConsentManager.hasConsent('analytics')) {
    // Safe to use Google Analytics
    console.log('User has consented to analytics');
    // Your analytics code here
} else {
    console.log('User has NOT consented to analytics');
}

// ============================================================================
// EXAMPLE 2: Track custom events (only if consent is given)
// ============================================================================

document.getElementById('subscribe-button').addEventListener('click', function () {
    // This will only track if user has analytics consent
    ConsentManager.trackEvent('subscribe_clicked', {
        source: 'homepage',
        button_text: 'Subscribe Now'
    });

    // Your subscribe logic here
});

// ============================================================================
// EXAMPLE 3: Load a tracking script conditionally
// ============================================================================

// Only load custom tracking script if user consented
ConsentManager.loadScriptWithConsent(
    'https://example.com/tracking.js',
    'analytics',
    {
        async: true,
        target: document.head
    }
);

// ============================================================================
// EXAMPLE 4: Listen for consent changes
// ============================================================================

window.addEventListener('consent-updated', function (event) {
    const consent = event.detail;

    console.log('New consent state:', consent);

    if (consent.analytics) {
        console.log('User just enabled analytics - load GA now');
        // Reload analytics or perform action
    }

    if (!consent.marketing) {
        console.log('User just disabled marketing cookies - remove ads');
        // Clean up marketing code
    }
});

// ============================================================================
// EXAMPLE 5: Get current consent state
// ============================================================================

function checkConsentState() {
    const consent = ConsentManager.getConsent();

    console.log('Current consent state:');
    console.log('Essential:', consent.essential); // Always true
    console.log('Analytics:', consent.analytics); // true/false
    console.log('Marketing:', consent.marketing); // true/false
    console.log('Preferences:', consent.preferences); // true/false
    console.log('Timestamp:', consent.timestamp); // When consent was given
}

// ============================================================================
// EXAMPLE 6: Programmatically set consent (advanced)
// ============================================================================

// Accept all
ConsentManager.acceptAll();

// Reject all
ConsentManager.rejectAll();

// Custom selection
ConsentManager.setConsent({
    analytics: true,
    marketing: false,
    preferences: true
});

// ============================================================================
// EXAMPLE 7: Check if user has made a choice
// ============================================================================

if (ConsentManager.hasUserChosenConsent()) {
    console.log('User has already made a consent choice');
    // Skip showing banner
} else {
    console.log('User has NOT made a choice yet');
    // Banner will be shown automatically
}

// ============================================================================
// EXAMPLE 8: Conditional rendering based on consent
// ============================================================================

function renderAds() {
    if (ConsentManager.hasConsent('marketing')) {
        // Render ads
        document.getElementById('ads-container').style.display = 'block';
        // Load ad scripts
    } else {
        // Hide ads
        document.getElementById('ads-container').style.display = 'none';
    }
}

// Call when page loads
renderAds();

// Listen for changes
window.addEventListener('consent-updated', renderAds);

// ============================================================================
// EXAMPLE 9: Safe usage of third-party services
// ============================================================================

// Initialize third-party service only if consented
function initializeChat() {
    if (!ConsentManager.hasConsent('marketing')) {
        console.log('Chat requires marketing consent');
        return;
    }

    // Load chat script
    const script = document.createElement('script');
    script.src = 'https://chat-service.com/widget.js';
    document.head.appendChild(script);
}

// ============================================================================
// EXAMPLE 10: Google Analytics safe integration
// ============================================================================

// The ConsentManager will auto-initialize GA if consent exists
// But here's how to manually track events:

function trackUserAction(action, label) {
    ConsentManager.trackEvent(action, {
        event_category: 'User Interaction',
        event_label: label,
        timestamp: new Date().toISOString()
    });
}

// Usage:
trackUserAction('video_played', 'demo-video');

// ============================================================================
// EXAMPLE 11: Combination with other libraries
// ============================================================================

// Example with Vue.js
if (typeof Vue !== 'undefined') {
    Vue.prototype.$consent = {
        hasConsent: (category) => ConsentManager.hasConsent(category),
        trackEvent: (event, data) => ConsentManager.trackEvent(event, data),
        getConsent: () => ConsentManager.getConsent()
    };

    // Now you can use in components:
    // this.$consent.hasConsent('analytics')
}

// Example with React
if (typeof React !== 'undefined') {
    const useConsent = () => {
        const [consent, setConsent] = React.useState(ConsentManager.getConsent());

        React.useEffect(() => {
            const handleConsentUpdate = (event) => {
                setConsent(event.detail);
            };

            window.addEventListener('consent-updated', handleConsentUpdate);
            return () => {
                window.removeEventListener('consent-updated', handleConsentUpdate);
            };
        }, []);

        return {
            consent,
            hasConsent: (category) => consent[category],
            trackEvent: ConsentManager.trackEvent
        };
    };

    // Now you can use in components:
    // const { consent, hasConsent, trackEvent } = useConsent();
}

// ============================================================================
// EXAMPLE 12: Logging for debugging
// ============================================================================

function logConsentDebugInfo() {
    console.group('🔒 GDPR Consent Debug Info');

    const consent = ConsentManager.getConsent();
    console.log('Consent State:', consent);

    console.log('Has chosen?', ConsentManager.hasUserChosenConsent());
    console.log('Analytics enabled?', ConsentManager.hasConsent('analytics'));
    console.log('Marketing enabled?', ConsentManager.hasConsent('marketing'));

    console.log('Stored in localStorage:', localStorage.getItem('tsparticles_consent'));

    console.groupEnd();
}

// Run when you need to debug
// logConsentDebugInfo();

// ============================================================================
// EXAMPLE 13: Form submission with consent requirement
// ============================================================================

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Check if user consented to marketing
    if (!ConsentManager.hasConsent('marketing')) {
        alert('Please accept marketing cookies to submit the form.');
        return;
    }

    // Safe to process form
    console.log('Form submission allowed - marketing consent given');
    // Submit form...
});

// ============================================================================
// EXAMPLE 14: Persistent data storage with consent
// ============================================================================

function saveUserPreferences(preferences) {
    // Only save if user consented to preferences cookies
    if (ConsentManager.hasConsent('preferences')) {
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
    } else {
        console.log('Cannot save preferences - user has not given consent');
    }
}

function loadUserPreferences() {
    if (ConsentManager.hasConsent('preferences')) {
        const prefs = localStorage.getItem('user_preferences');
        return prefs ? JSON.parse(prefs) : null;
    }
    return null;
}

// ============================================================================
// EXAMPLE 15: API calls with consent header
// ============================================================================

function makeTrackedAPICall(endpoint, data) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Add consent info to API call
    if (ConsentManager.hasConsent('analytics')) {
        headers['X-Consent-Analytics'] = 'true';
    }

    if (ConsentManager.hasConsent('marketing')) {
        headers['X-Consent-Marketing'] = 'true';
    }

    return fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
}

// ============================================================================
// NOTES
// ============================================================================

/*
 * Key Points:
 *
 * 1. ConsentManager is a global object - use it anywhere
 *
 * 2. Always check consent before using tracking services:
 *    if (ConsentManager.hasConsent('analytics')) { ... }
 *
 * 3. Listen for consent updates to handle dynamic changes:
 *    window.addEventListener('consent-updated', handler)
 *
 * 4. Never bypass consent - it's against GDPR
 *
 * 5. Essential cookies always work - no consent needed
 *
 * 6. User can change consent anytime - your code must handle it
 *
 * 7. Consent is stored in localStorage under 'tsparticles_consent'
 *
 * 8. ConsentManager auto-initializes GA and AdSense if consent exists
 *
 * 9. For custom services, use loadScriptWithConsent()
 *
 * 10. Always provide fallback experience when consent is rejected
 */
