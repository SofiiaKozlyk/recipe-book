import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './CookiePopup.module.css';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [functionalCookies, setFunctionalCookies] = useState(true);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowPopup(true);
    }
    else if (consent === "accepted") {
      setFunctionalCookies(Cookies.get("functionalCookies") === "true");
    }
  }, []);

  const handleAccept = () => {
    setShowPopup(false);
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    if (functionalCookies) {
      Cookies.set("functionalCookies", "true", { expires: 365 });
    }
  };

  const handleDecline = () => {
    setShowPopup(false);
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    Cookies.remove("functionalCookies");
  };

  return (
    showPopup && (
      <div className={styles.cookiePopup}>
        <p>We use cookies to save your preferences, including your last search query. Allow?</p>
        <div style={{ gap: "4px" }}>
          Learn more about cookies in our 
          <a href="https://github.com/SofiiaKozlyk/recipe-book/blob/main/privacy-policy.md" target="_blank" rel="noopener noreferrer">Privacy Policy.</a>
        </div>
        {!showSettings ? (
          <div>
            <button onClick={handleAccept}>Yes</button>
            <button onClick={handleDecline}>No</button>
            <button onClick={() => setShowSettings(true)}>Settings</button>
          </div>
        ) : (
          <div className={styles.settings}>
            <label>
              <input type="checkbox" checked disabled />
              Necessary Cookies (Always required)
            </label>
            <label>
              <input
                type="checkbox"
                checked={functionalCookies}
                onChange={(e) => setFunctionalCookies(e.target.checked)}
              />
              Functional Cookies (Save last search query)
            </label>
            <div>
              <button onClick={handleAccept}>Save</button>
              <button onClick={() => setShowSettings(false)}>Back</button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default CookiePopup;