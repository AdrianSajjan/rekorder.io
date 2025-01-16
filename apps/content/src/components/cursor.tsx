import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { theme } from '@rekorder.io/ui';
import { cursor } from '../store/cursor';

const Cursors = observer(() => {
  switch (cursor.mode) {
    case 'default-cursor':
      return null;
    case 'highlight-click':
      return <CursorHighlightClick clientX={cursor.clientX} clientY={cursor.clientY} />;
    case 'highlight-cursor':
      return <CursorHighlightCursor clientX={cursor.clientX} clientY={cursor.clientY} />;
    case 'spotlight-cursor':
      return <CursorSpotlightCursor clientX={cursor.clientX} clientY={cursor.clientY} />;
  }
});

interface CursorProps {
  clientX: number;
  clientY: number;
}

const styles = theme.createStyles({
  click: {
    width: theme.space(10),
    height: theme.space(10),
    borderRadius: theme.space(10),
    border: `3px solid ${theme.colors.primary.dark}`,

    zIndex: 2,
    position: 'fixed',
    pointerEvents: 'none',
    transition: 'transform 200ms ease-in-out',
  },

  highlight: {
    width: theme.space(20),
    height: theme.space(20),
    borderRadius: theme.space(20),

    zIndex: 2,
    opacity: 0.4,
    position: 'fixed',
    background: '#facc15',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
  },

  spotlight: {
    inset: 0,
    zIndex: 2,
    position: 'fixed',
    pointerEvents: 'none',
    background: theme.alpha(theme.colors.core.black, 0.5),
  },
});

const CursorHighlightClick = observer(({ clientX, clientY }: CursorProps) => {
  const [isActive, setActive] = useState(false);

  const handleMouseDown = useCallback(() => {
    setActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  const style = {
    ...styles.click,
    top: clientY,
    left: clientX,
    transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0})`,
  } as CSSProperties;

  return <span style={style} />;
});

const CursorHighlightCursor = observer(({ clientX, clientY }: CursorProps) => {
  return <span style={{ ...styles.highlight, top: clientY, left: clientX }} />;
});

const CursorSpotlightCursor = observer(({ clientX, clientY }: CursorProps) => {
  return (
    <div
      style={{
        ...styles.spotlight,
        mask: `radial-gradient(circle at ${clientX}px ${clientY}px, transparent ${theme.space(15)}, black ${theme.space(15)})`,
      }}
    />
  );
});

export { Cursors };
