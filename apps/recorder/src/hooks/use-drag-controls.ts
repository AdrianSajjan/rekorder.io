import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlPosition, DraggableEventHandler } from 'react-draggable';
import { useWindowDimensions } from '@rekorder.io/hooks';

import { measureElement } from '../lib/utils';
import { SAFE_AREA_PADDING } from '../constants/layout';

interface DragControlsProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  dimension?: Pick<DOMRect, 'height' | 'width'>;
}

function initializeDefaultPosition(
  position: DragControlsProps['position'],
  screen: Pick<DOMRect, 'height' | 'width'>,
  element: Pick<DOMRect, 'height' | 'width'>
): ControlPosition {
  switch (position) {
    case 'top-left':
      return { x: SAFE_AREA_PADDING, y: SAFE_AREA_PADDING };
    case 'top-right':
      return { x: screen.width - element.width - SAFE_AREA_PADDING, y: SAFE_AREA_PADDING };
    case 'bottom-left':
      return { x: SAFE_AREA_PADDING, y: screen.height - element.height - SAFE_AREA_PADDING };
    case 'bottom-right':
      return {
        x: screen.width - element.width - SAFE_AREA_PADDING,
        y: screen.height - element.height - SAFE_AREA_PADDING,
      };
  }
}

export function useDragControls<T extends HTMLElement>(props: DragControlsProps) {
  const ref = useRef<T>(null!);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { height: elementHeight, width: elementWidth } = measureElement(ref.current, props.dimension);

  const [position, setPosition] = useState<ControlPosition>(() =>
    initializeDefaultPosition(
      props.position,
      { height: screenHeight, width: screenWidth },
      { height: elementHeight, width: elementWidth }
    )
  );

  const onChangePosition: DraggableEventHandler = useCallback((event, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  useEffect(() => {
    if (position.x < SAFE_AREA_PADDING) {
      setPosition((state) => ({ ...state, x: SAFE_AREA_PADDING }));
    }

    if (position.y < SAFE_AREA_PADDING) {
      setPosition((state) => ({ ...state, y: SAFE_AREA_PADDING }));
    }

    if (position.x > screenWidth - elementWidth - SAFE_AREA_PADDING) {
      setPosition((state) => ({ ...state, x: screenWidth - elementWidth - SAFE_AREA_PADDING }));
    }

    if (position.y > screenHeight - elementHeight - SAFE_AREA_PADDING) {
      setPosition((state) => ({ ...state, y: screenHeight - elementHeight - SAFE_AREA_PADDING }));
    }
  }, [screenHeight, screenWidth, elementHeight, elementWidth, position]);

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: screenWidth - elementWidth - SAFE_AREA_PADDING,
    bottom: screenHeight - elementHeight - SAFE_AREA_PADDING,
  };

  return { ref, bounds, position, onChangePosition };
}
