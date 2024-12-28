import { observer } from 'mobx-react';
import { Tooltip } from '@rekorder.io/ui';
import { toolbar } from '../../store/toolbar';

const ToolbarDrawingControls = observer(() => {
  const isActionbarOpen = toolbar.actionbarState === 'drawing';

  return (
    <Popover open={isActionbarOpen}>
      <Tooltip>
        <PopoverTrigger asChild>
          <button
            variant="no-shadow"
            className={cn(
              'h-10 w-10 grid place-items-center border-0 hover:bg-primary rounded-none',
              isActionbarOpen ? 'bg-primary' : 'bg-background'
            )}
            onClick={() => toolbar.updateActionbarState('drawing', true)}
          >
            <PenIcon size={16} />
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-fit border-none shadow-none bg-transparent p-0 rounded-none"
      >
        <DrawingActionbar />
      </PopoverContent>
    </Popover>
  );
});

export { ToolbarDrawingControls };
