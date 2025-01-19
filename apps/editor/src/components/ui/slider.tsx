import { Slider as SliderRoot, SliderTrack, SliderRange, SliderThumb, SliderProps } from '@radix-ui/react-slider';

export function Slider(props: SliderProps) {
  return (
    <SliderRoot {...props} className="relative flex w-full touch-none select-none items-center">
      <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-background-dark">
        <SliderRange className="absolute h-full bg-primary-main" />
      </SliderTrack>
      <SliderThumb className="block h-5 w-5 rounded-full border-2 border-primary-main bg-card-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30" />
    </SliderRoot>
  );
}
