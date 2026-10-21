import { useEffect, useState } from 'react';

const CLARITY_ID = 'yuynivp5i5';
const STORAGE_KEY = 'flavorcraft-cookie-consent';

function loadClarity() {
  if (window.clarity) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
  window.clarity('consent');
}

function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage is blocked. The choice only lasts for this visit.
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !readConsent());

  useEffect(() => {
    if (readConsent() === 'accepted') loadClarity();
  }, []);

  const accept = () => {
    saveConsent('accepted');
    loadClarity();
    setVisible(false);
  };

  const decline = () => {
    saveConsent('declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', left: 16, right: 16, bottom: 80, zIndex: 1000,
        maxWidth: 480, margin: '0 auto', padding: 16, borderRadius: 18,
        background: '#ffffff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <p style={{ margin: '0 0 12px' }}>
        <strong>Cookies, but not the tasty kind!</strong> We use Microsoft Clarity to see how
        people use FlavorCraft, so we can make it even better. Is that okay?
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={decline}>No thanks</button>
        <button type="button" onClick={accept}>Sure, go ahead</button>
      </div>
    </div>
  );
}
