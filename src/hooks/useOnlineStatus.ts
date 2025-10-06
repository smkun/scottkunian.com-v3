/**
 * useOnlineStatus Hook
 *
 * Detects and monitors user's online/offline status
 * Returns current online status and provides connection state
 */

import { useState, useEffect } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType: string | null;
  effectiveType: string | null;
}

export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    type: string | null;
    effectiveType: string | null;
  }>({
    type: null,
    effectiveType: null,
  });

  useEffect(() => {
    // Get connection information if available (Network Information API)
    const updateConnectionInfo = () => {
      // @ts-ignore - Network Information API is not fully typed
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        setConnectionInfo({
          type: connection.type || null,
          effectiveType: connection.effectiveType || null,
        });
      }
    };

    // Initial connection info
    updateConnectionInfo();

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(false);
      updateConnectionInfo();

      // Optional: Show reconnection notification
      console.log('✅ Connection restored');
    };

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      updateConnectionInfo();

      // Optional: Show offline notification
      console.log('⚠️ Connection lost');
    };

    // Handle connection change (if Network Information API is available)
    const handleConnectionChange = () => {
      updateConnectionInfo();
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // @ts-ignore - Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return {
    isOnline,
    wasOffline,
    connectionType: connectionInfo.type,
    effectiveType: connectionInfo.effectiveType,
  };
}
