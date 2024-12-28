import { useState, useEffect, useCallback } from 'react';

function initializeWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(initializeWindowDimensions());

  const handleResize = useCallback(() => {
    setWindowDimensions(initializeWindowDimensions());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowDimensions;
}
