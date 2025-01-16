import css from 'styled-jsx/css';
import { animations, theme } from '@rekorder.io/ui';
import { Popover, PopoverContent, PopoverPortal, PopoverProps, PopoverTrigger } from '@radix-ui/react-popover';
import { HexColorPicker } from 'react-colorful';
import clsx from 'clsx';
import { Eyedropper } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { unwrapError } from '@rekorder.io/utils';
import { useState } from 'react';

const ColorfulPickerCSS = css.global`
  #rekorder-colorful-picker .react-colorful {
    width: 160px;
    height: 160px;
  }

  #rekorder-colorful-picker .react-colorful__hue {
    height: 20px;
  }

  #rekorder-colorful-picker .react-colorful__saturation-pointer {
    width: 12px;
    height: 12px;
    border-radius: 12px;
  }

  #rekorder-colorful-picker .react-colorful__hue-pointer,
  #rekorder-colorful-picker .react-colorful__alpha-pointer {
    width: 12px;
    border-radius: 12px;
  }
`;

const ColorPickerCSS = css.resolve`
  .rekorder-color-picker {
    z-index: ${theme.zIndex(250)};
  }

  .rekorder-color-picker[data-state='open'],
  .rekorder-colorful-picker[data-state='open'] {
    animation-name: ${animations['zoom-in-fade-in']};
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-duration: 300ms;
  }

  .rekorder-color-picker[data-state='closed'],
  .rekorder-colorful-picker[data-state='closed'] {
    animation-name: ${animations['zoom-out-fade-out']};
    animation-timing-function: ease-out;
    animation-duration: 150ms;
  }

  .rekorder-color-wheel {
    position: relative;
    width: ${theme.space(32)};
    height: ${theme.space(32)};

    border-radius: ${theme.space(24)};
    background: radial-gradient(circle, transparent ${theme.space(8)}, ${theme.colors.core.jetblack} ${theme.space(8)});
  }

  .rekorder-color-wheel::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: ${theme.space(14)};
    height: ${theme.space(14)};
    border-radius: ${theme.space(14)};
    border: 3px solid ${theme.alpha(theme.colors.core.white, 0.3)};
  }

  @media (prefers-color-scheme: light) {
    .rekorder-color-wheel {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
  }

  @media (prefers-color-scheme: dark) {
    .rekorder-color-wheel {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
  }

  .rekorder-color-eyedropper {
    border: none;
    display: grid;
    place-items: center;
    transition: background-color 100ms ease-in-out;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: ${theme.space(10)};
    height: ${theme.space(10)};
    border-radius: ${theme.space(10)};
    background-color: ${theme.colors.core.jetblack};
  }

  .rekorder-color-eyedropper:hover {
    background-color: ${theme.colors.core.black};
  }

  .rekorder-color-swatch {
    --scale: 1;

    border: none;
    position: absolute;
    transition: transform 150ms ease-in-out;

    width: ${theme.space(4.5)};
    height: ${theme.space(4.5)};
    border-radius: ${theme.space(5)};
  }

  .rekorder-color-swatch:hover {
    --scale: 1.1;
  }

  .rekorder-color-swatch:nth-child(2) {
    top: 0;
    left: 50%;
    transform: translate(-50%, 40%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(3) {
    top: 50%;
    left: 0;
    transform: translate(40%, -50%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(4) {
    top: 50%;
    right: 0;
    transform: translate(-40%, -50%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(5) {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -40%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(6) {
    right: 3px;
    bottom: 3px;
    transform: translate(-100%, -100%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(7) {
    left: 3px;
    bottom: 3px;
    transform: translate(100%, -100%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(8) {
    top: 3px;
    right: 3px;
    transform: translate(-100%, 100%) scale(var(--scale));
  }

  .rekorder-color-swatch:nth-child(9) {
    left: 3px;
    top: 3px;
    transform: translate(100%, 100%) scale(var(--scale));
  }

  .rekorder-color-colorful-trigger {
    background: conic-gradient(red, orange, yellow, green, cyan, blue, violet, red);
  }
`;

interface ColorPickerProps extends PopoverProps {
  onChange: (color: string) => void;
  color: string;
}

const highlighters = ['#FFFF00', '#00FF00', '#FF69B4', '#FFA500', '#00BFFF', '#DA70D6', '#40E0D0'];

export function ColorPicker({ children, color, onChange, ...props }: ColorPickerProps) {
  const [isOpen, setOpen] = useState(false);

  const handleEyeDropperClick = () => {
    if (!window.EyeDropper) return toast.error('EyeDropper is not supported in this browser');
    const eyedropper = new window.EyeDropper();
    eyedropper.open().then(
      (value) => {
        onChange(value.sRGBHex);
        setOpen(false);
        props.onOpenChange?.(false);
      },
      (error) => {
        toast.error(unwrapError(error, 'Failed to pick color'));
      }
    );
  };

  const handleSwatchClick = (color: string) => () => {
    onChange(color);
    setOpen(false);
    props.onOpenChange?.(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen} {...props}>
      {ColorPickerCSS.styles}
      <style jsx global>
        {ColorfulPickerCSS}
      </style>
      <PopoverTrigger asChild>
        <div id="color-picker-trigger">{children}</div>
      </PopoverTrigger>
      <PopoverPortal container={document.getElementById('rekorder-area')}>
        <PopoverContent
          side="top"
          sideOffset={20}
          className={clsx(ColorPickerCSS.className, 'rekorder-color-picker')}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className={clsx(ColorPickerCSS.className, 'rekorder-color-wheel')}>
            <button onClick={handleEyeDropperClick} className={clsx(ColorPickerCSS.className, 'rekorder-color-eyedropper')}>
              <Eyedropper size={18} color={theme.colors.core.white} weight="fill" />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className={clsx(ColorPickerCSS.className, 'rekorder-color-swatch', 'rekorder-color-colorful-trigger')} />
              </PopoverTrigger>
              <PopoverPortal container={document.getElementById('rekorder-toolbar')}>
                <PopoverContent
                  side="top"
                  sideOffset={20}
                  id="rekorder-colorful-picker"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className={clsx(ColorPickerCSS.className, 'rekorder-colorful-picker')}
                >
                  <HexColorPicker color={color} onChange={onChange} />
                </PopoverContent>
              </PopoverPortal>
            </Popover>
            {highlighters.map((highlighter) => (
              <button
                key={highlighter}
                onClick={handleSwatchClick(highlighter)}
                style={{ backgroundColor: highlighter }}
                className={clsx(ColorPickerCSS.className, 'rekorder-color-swatch')}
              />
            ))}
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
