import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the browser's default prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom button
      setIsVisible(true);
    });

    // Handle case where app is already installed
    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('App successfully installed!');
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // We've used the prompt, so clear it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
      <button 
        onClick={handleInstallClick}
        className="btn"
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px',
          backgroundColor: '#FF8BA7',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold',
          border: 'none',
          boxShadow: '0 4px 6px rgba(255, 139, 167, 0.2)'
        }}
      >
        <Download size={22} />
        DOWNLOAD & INSTALL APP
      </button>
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.75rem', textAlign: 'center' }}>
        Click to download and add the SunSeating icon to your phone's home screen.
      </p>
    </div>
  );
};

export default InstallButton;
