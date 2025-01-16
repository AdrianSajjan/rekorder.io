import { CSSProperties } from 'react';

export function Permission() {
  if (import.meta.env.DEV) {
    return null;
  } else {
    const styles = { pointerEvents: 'none', display: 'none', visibility: 'hidden' } as CSSProperties;
    return <iframe src={chrome.runtime.getURL('build/permissions.html')} title="Permissions" allow="camera *; microphone *" style={styles} />;
  }
}
