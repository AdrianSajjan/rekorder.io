import { Slider as SliderRoot, SliderTrack, SliderRange, SliderThumb, SliderProps as SliderPropsRoot } from '@radix-ui/react-slider';
import { cn } from '@rekorder.io/utils';

interface SliderProps extends SliderPropsRoot {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}

export function Slider({ trackClassName, rangeClassName, thumbClassName, ...props }: SliderProps) {
  return (
    <SliderRoot {...props} className="relative flex w-full touch-none select-none items-center">
      <SliderTrack className={cn('relative h-2 w-full grow overflow-hidden rounded-full bg-background-dark', trackClassName)}>
        <SliderRange className={cn('absolute h-full bg-primary-main', rangeClassName)} />
      </SliderTrack>
      <SliderThumb
        className={cn(
          'block h-5 w-5 rounded-full border-2 border-primary-main bg-card-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30',
          thumbClassName
        )}
      />
    </SliderRoot>
  );
}
