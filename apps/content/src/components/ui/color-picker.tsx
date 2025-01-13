import css from 'styled-jsx/css';
import { animations, theme } from '@rekorder.io/ui';
import { Popover, PopoverContent, PopoverPortal, PopoverProps, PopoverTrigger } from '@radix-ui/react-popover';
import { HexColorPicker } from 'react-colorful';

const ColorPickerCSS = css.global`
  .rekorder-color-picker {
    z-index: ${theme.zIndex(250)};
  }

  .rekorder-color-picker .react-colorful {
    width: 160px;
    height: 160px;
  }

  .rekorder-color-picker .react-colorful__hue {
    height: 20px;
  }

  .rekorder-color-picker .react-colorful__saturation-pointer {
    width: 12px;
    height: 12px;
    border-radius: 12px;
  }

  .rekorder-color-picker .react-colorful__hue-pointer,
  .rekorder-color-picker .react-colorful__alpha-pointer {
    width: 12px;
    border-radius: 12px;
  }

  .rekorder-color-picker[data-state='open'] {
    animation-name: ${animations['zoom-in-fade-in']};
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-duration: 300ms;
  }

  .rekorder-color-picker[data-state='closed'] {
    animation-name: ${animations['zoom-out-fade-out']};
    animation-timing-function: ease-out;
    animation-duration: 150ms;
  }
`;

interface ColorPickerProps extends PopoverProps {
  onChange: (color: string) => void;
  color: string;
}

export function ColorPicker({ children, color, onChange, ...props }: ColorPickerProps) {
  return (
    <Popover {...props}>
      <style jsx global>
        {ColorPickerCSS}
      </style>
      <PopoverTrigger asChild>
        <div id="color-picker-trigger">{children}</div>
      </PopoverTrigger>
      <PopoverPortal container={document.getElementById('rekorder-area')}>
        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="rekorder-color-picker" sideOffset={14} side="top">
          <HexColorPicker color={color} onChange={onChange} />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
