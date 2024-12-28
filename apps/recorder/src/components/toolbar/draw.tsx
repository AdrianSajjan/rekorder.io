import { PenIcon } from "lucide-react";
import { observer } from "mobx-react";

import { Button } from "@screenify.io/ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@screenify.io/ui/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@screenify.io/ui/components/ui/tooltip";
import { cn } from "@screenify.io/ui/lib/utils";

import { DrawingActionbar } from "@screenify.io/recorder/components/actionbar/draw";
import { toolbar } from "@screenify.io/recorder/store/toolbar";

const ToolbarDrawingControls = observer(() => {
  const isActionbarOpen = toolbar.actionbarState === "drawing";

  return (
    <Popover open={isActionbarOpen}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="no-shadow"
              className={cn(
                "h-10 w-10 grid place-items-center border-0 hover:bg-primary rounded-none",
                isActionbarOpen ? "bg-primary" : "bg-background",
              )}
              onClick={() => toolbar.updateActionbarState("drawing", true)}
            >
              <PenIcon size={16} />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <span>Drawing options</span>
        </TooltipContent>
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
