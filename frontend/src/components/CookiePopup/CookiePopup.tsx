import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './CookiePopup.module.css';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    setShowPopup(false);
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
  };

  const handleDecline = () => {
    setShowPopup(false);
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
  };

  return (
    showPopup && (
      <div className={styles.cookiePopup}>
        <p>We use cookies to save your preferences, including your last search query. Allow?</p>
        <div>
          <button onClick={handleAccept}>Yes</button>
          <button onClick={handleDecline}>No</button>
        </div>
      </div>
    )
  );
};

export default CookiePopup;