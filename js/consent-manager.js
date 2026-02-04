/**
 * GDPR Consent Manager for tsParticles
 * Manages user consent for cookies and tracking
 */

const ConsentManager = (() => {
    const CONSENT_STORAGE_KEY = 'tsparticles_consent';
    const CONSENT_VERSION = '1.0';

    // Default consent state (all disabled until user accepts)
    const defaultConsent = {
        version: CONSENT_VERSION,
        essential: true, // Always true - essential cookies don't need consent
        analytics: false,
        marketing: false,
        preferences: false,
        timestamp: new Date().toISOString(),
    };

    /**
     * Get current consent state
     */
    const getConsent = () => {
        try {
            const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (!stored) return { ...defaultConsent };

            const parsed = JSON.parse(stored);
            // Check if version has changed, reset if needed
            if (parsed.version !== CONSENT_VERSION) {
                return { ...defaultConsent };
            }
            return parsed;
        } catch (e) {
            console.error('Error reading consent:', e);
            return { ...defaultConsent };
        }
    };

    /**
     * Save consent state
     */
    const setConsent = (consent) => {
        try {
            const toStore = {
                ...defaultConsent,
                ...consent,
                version: CONSENT_VERSION,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(toStore));
            // Dispatch event for other scripts to listen to
            window.dispatchEvent(
                new CustomEvent('consent-updated', { detail: toStore })
            );
            return true;
        } catch (e) {
            console.error('Error saving consent:', e);
            return false;
        }
    };

    /**
     * Accept all consents
     */
    const acceptAll = () => {
        return setConsent({
            analytics: true,
            marketing: true,
            preferences: true,
        });
    };

    /**
     * Reject all non-essential consents
     */
    const rejectAll = () => {
        return setConsent({
            analytics: false,
            marketing: false,
            preferences: false,
        });
    };

    /**
     * Check if a specific consent category is allowed
     */
    const hasConsent = (category) => {
        const consent = getConsent();
        return consent[category] === true;
    };

    /**
     * Check if user has made a consent choice
     */
    const hasUserChosenConsent = () => {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        return stored !== null;
    };

    /**
     * Load script only if consent is given
     */
    const loadScriptWithConsent = (src, consentCategory, options = {}) => {
        if (!hasConsent(consentCategory)) {
            console.log(`Script not loaded: ${src} (consent: ${consentCategory})`);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = options.async !== false;
        script.defer = options.defer === true;

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
        }

        const target = options.target || document.head;
        target.appendChild(script);
    };

    /**
     * Initialize Google Analytics with consent
     */
    const initGoogleAnalytics = (gaId) => {
        if (!hasConsent('analytics')) {
            console.log('Google Analytics disabled by user consent');
            return;
        }

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', gaId, {
            'anonymize_ip': true,
            'allow_google_signals': false,
            'allow_ad_personalization_signals': false
        });

        // Load the GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
    };

    /**
     * Initialize Google AdSense with consent
     */
    const initGoogleAdSense = (clientId) => {
        if (!hasConsent('marketing')) {
            console.log('Google AdSense disabled by user consent');
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    };

    /**
     * Initialize Facebook SDK with consent
     */
    const initFacebookSDK = () => {
        if (!hasConsent('marketing')) {
            console.log('Facebook SDK disabled by user consent');
            return;
        }

        window.fbAsyncInit = function () {
            FB.init({
                appId: '130672560341873',
                xfbml: true,
                version: 'v10.0'
            });
        };

        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.src = 'https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v10.0&appId=130672560341873&autoLogAppEvents=1';
        script.nonce = 'jC6Fjy00';
        document.body.appendChild(script);
    };

    /**
     * Initialize Twitter SDK with consent
     */
    const initTwitterSDK = () => {
        if (!hasConsent('marketing')) {
            console.log('Twitter SDK disabled by user consent');
            return;
        }

        window.twttr = (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };

            return t;
        })(document, 'script', 'twitter-wjs');
    };

    /**
     * Create a function to track events with gtag if consent is given
     */
    const trackEvent = (eventName, eventData = {}) => {
        if (hasConsent('analytics') && window.gtag) {
            window.gtag('event', eventName, eventData);
        }
    };

    // Listen for consent changes and reload scripts if needed
    window.addEventListener('consent-updated', (event) => {
        const consent = event.detail;
        console.log('Consent updated:', consent);

        // You could add logic here to reload scripts if user changes consent
        // For example, reload page or dynamically load/unload scripts
    });

    return {
        getConsent,
        setConsent,
        acceptAll,
        rejectAll,
        hasConsent,
        hasUserChosenConsent,
        loadScriptWithConsent,
        initGoogleAnalytics,
        initGoogleAdSense,
        initFacebookSDK,
        initTwitterSDK,
        trackEvent,
    };
})();

// Auto-initialize analytics if consent exists and is given
if (ConsentManager.hasUserChosenConsent() && ConsentManager.hasConsent('analytics')) {
    ConsentManager.initGoogleAnalytics('G-922Z47NPS0');
}

// Auto-initialize AdSense if consent exists and is given
if (ConsentManager.hasUserChosenConsent() && ConsentManager.hasConsent('marketing')) {
    ConsentManager.initGoogleAdSense('ca-pub-1784552607103901');
}
