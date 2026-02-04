/**
 * GDPR Cookie Consent Banner for tsParticles
 * Shows a banner asking for user consent
 */

const CookieBanner = (() => {
    const BANNER_ID = 'gdpr-cookie-banner';
    const BANNER_HTML = `
        <div id="${BANNER_ID}" class="gdpr-banner" role="region" aria-label="Cookie Consent Banner">
            <div class="gdpr-banner-content">
                <div class="gdpr-banner-text">
                    <h3>🍪 Cookie & Privacy</h3>
                    <p>
                        We use cookies to enhance your experience and analyze site usage. 
                        Some are essential for functionality, others help us improve your experience.
                        <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Learn more</a>
                    </p>
                </div>
                <div class="gdpr-banner-buttons">
                    <button id="gdpr-reject-all" class="gdpr-btn gdpr-btn-secondary">
                        Reject All
                    </button>
                    <button id="gdpr-customize" class="gdpr-btn gdpr-btn-secondary">
                        Customize
                    </button>
                    <button id="gdpr-accept-all" class="gdpr-btn gdpr-btn-primary">
                        Accept All
                    </button>
                </div>
            </div>
        </div>

        <div id="gdpr-modal" class="gdpr-modal" style="display: none;">
            <div class="gdpr-modal-content">
                <div class="gdpr-modal-header">
                    <h2>Customize Your Privacy Settings</h2>
                    <button id="gdpr-modal-close" class="gdpr-modal-close" aria-label="Close">×</button>
                </div>
                <div class="gdpr-modal-body">
                    <div class="gdpr-preference">
                        <input type="checkbox" id="gdpr-essential" checked disabled />
                        <label for="gdpr-essential">
                            <strong>Essential Cookies</strong>
                            <span class="gdpr-badge">Always Active</span>
                            <p>Required for the website to function properly. Cannot be disabled.</p>
                        </label>
                    </div>

                    <div class="gdpr-preference">
                        <input type="checkbox" id="gdpr-analytics" />
                        <label for="gdpr-analytics">
                            <strong>Analytics Cookies</strong>
                            <p>Help us understand how you use our site to improve it. Uses Google Analytics.</p>
                        </label>
                    </div>

                    <div class="gdpr-preference">
                        <input type="checkbox" id="gdpr-marketing" />
                        <label for="gdpr-marketing">
                            <strong>Marketing & Social Cookies</strong>
                            <p>Used for social media buttons, ads, and personalized content from Google, Facebook, and Twitter.</p>
                        </label>
                    </div>

                    <div class="gdpr-preference">
                        <input type="checkbox" id="gdpr-preferences" />
                        <label for="gdpr-preferences">
                            <strong>Preference Cookies</strong>
                            <p>Remember your choices and preferences for a better experience.</p>
                        </label>
                    </div>
                </div>
                <div class="gdpr-modal-footer">
                    <button id="gdpr-modal-save" class="gdpr-btn gdpr-btn-primary">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    `;

    const BANNER_CSS = `
        .gdpr-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(20, 20, 20, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 20px;
            z-index: 9999;
            backdrop-filter: blur(10px);
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .gdpr-banner-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: flex-start;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .gdpr-banner-text {
            flex: 1;
            min-width: 250px;
        }

        .gdpr-banner-text h3 {
            margin: 0 0 10px 0;
            font-size: 1.1em;
            font-weight: 600;
        }

        .gdpr-banner-text p {
            margin: 0;
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
        }

        .gdpr-banner-text a {
            color: #66b3ff;
            text-decoration: none;
            font-weight: 500;
        }

        .gdpr-banner-text a:hover {
            text-decoration: underline;
        }

        .gdpr-banner-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: center;
            min-width: 300px;
        }

        .gdpr-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .gdpr-btn-primary {
            background: #0066cc;
            color: white;
        }

        .gdpr-btn-primary:hover {
            background: #0052a3;
        }

        .gdpr-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gdpr-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .gdpr-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .gdpr-modal.active {
            display: flex;
        }

        .gdpr-modal-content {
            background: white;
            color: #333;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                transform: translateY(-30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .gdpr-modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gdpr-modal-header h2 {
            margin: 0;
            font-size: 1.3em;
        }

        .gdpr-modal-close {
            background: none;
            border: none;
            font-size: 1.8em;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .gdpr-modal-close:hover {
            color: #000;
        }

        .gdpr-modal-body {
            padding: 20px;
        }

        .gdpr-preference {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        .gdpr-preference:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .gdpr-preference input[type="checkbox"] {
            margin-right: 10px;
            cursor: pointer;
            width: 18px;
            height: 18px;
        }

        .gdpr-preference input[type="checkbox"]:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .gdpr-preference label {
            cursor: pointer;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .gdpr-preference strong {
            display: block;
            margin-bottom: 5px;
            color: #000;
        }

        .gdpr-preference p {
            margin: 5px 0 0 0;
            font-size: 0.85em;
            color: #666;
            line-height: 1.4;
        }

        .gdpr-badge {
            display: inline-block;
            background: #e0e0e0;
            color: #333;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.75em;
            margin-left: 5px;
            font-weight: 600;
        }

        .gdpr-modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        @media (max-width: 768px) {
            .gdpr-banner-content {
                flex-direction: column;
            }

            .gdpr-banner-buttons {
                width: 100%;
                justify-content: flex-end;
            }

            .gdpr-banner-text {
                width: 100%;
            }

            .gdpr-modal-content {
                width: 95%;
            }
        }
    `;

    const injectCSS = () => {
        const style = document.createElement('style');
        style.textContent = BANNER_CSS;
        document.head.appendChild(style);
    };

    const showBanner = () => {
        let banner = document.getElementById(BANNER_ID);
        if (!banner) {
            const temp = document.createElement('div');
            temp.innerHTML = BANNER_HTML;
            document.body.appendChild(temp.firstElementChild);
            document.body.appendChild(temp.firstElementChild);
            banner = document.getElementById(BANNER_ID);
            attachEventListeners();
        } else {
            banner.style.display = 'block';
        }
    };

    const hideBanner = () => {
        const banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.style.display = 'none';
        }
    };

    const showModal = () => {
        const modal = document.getElementById('gdpr-modal');
        if (modal) {
            modal.classList.add('active');
            updateModalCheckboxes();
        }
    };

    const hideModal = () => {
        const modal = document.getElementById('gdpr-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    const updateModalCheckboxes = () => {
        const consent = ConsentManager.getConsent();
        document.getElementById('gdpr-analytics').checked = consent.analytics;
        document.getElementById('gdpr-marketing').checked = consent.marketing;
        document.getElementById('gdpr-preferences').checked = consent.preferences;
    };

    const attachEventListeners = () => {
        // Banner buttons
        const acceptAllBtn = document.getElementById('gdpr-accept-all');
        const rejectAllBtn = document.getElementById('gdpr-reject-all');
        const customizeBtn = document.getElementById('gdpr-customize');

        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                ConsentManager.acceptAll();
                hideBanner();
                // Reload to apply consent to tracking scripts
                if (ConsentManager.hasConsent('analytics')) {
                    ConsentManager.initGoogleAnalytics('G-922Z47NPS0');
                }
                if (ConsentManager.hasConsent('marketing')) {
                    ConsentManager.initGoogleAdSense('ca-pub-1784552607103901');
                    ConsentManager.initFacebookSDK();
                    ConsentManager.initTwitterSDK();
                }
            });
        }

        if (rejectAllBtn) {
            rejectAllBtn.addEventListener('click', () => {
                ConsentManager.rejectAll();
                hideBanner();
            });
        }

        if (customizeBtn) {
            customizeBtn.addEventListener('click', showModal);
        }

        // Modal
        const modalClose = document.getElementById('gdpr-modal-close');
        const modalSave = document.getElementById('gdpr-modal-save');

        if (modalClose) {
            modalClose.addEventListener('click', hideModal);
        }

        if (modalSave) {
            modalSave.addEventListener('click', () => {
                const consent = {
                    analytics: document.getElementById('gdpr-analytics').checked,
                    marketing: document.getElementById('gdpr-marketing').checked,
                    preferences: document.getElementById('gdpr-preferences').checked,
                };
                ConsentManager.setConsent(consent);
                hideModal();
                hideBanner();
                // Reload to apply consent to tracking scripts
                if (consent.analytics) {
                    ConsentManager.initGoogleAnalytics('G-922Z47NPS0');
                }
                if (consent.marketing) {
                    ConsentManager.initGoogleAdSense('ca-pub-1784552607103901');
                    ConsentManager.initFacebookSDK();
                    ConsentManager.initTwitterSDK();
                }
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('gdpr-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal();
                }
            });
        }
    };

    const init = () => {
        injectCSS();

        // Show banner only if user hasn't made a choice yet
        if (!ConsentManager.hasUserChosenConsent()) {
            showBanner();
        }
    };

    return {
        init,
        showBanner,
        hideBanner,
        showModal,
        hideModal,
    };
})();

// Initialize banner when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CookieBanner.init);
} else {
    CookieBanner.init();
}
