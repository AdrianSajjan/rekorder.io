import { observer } from "mobx-react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { Button } from "@screenify.io/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@screenify.io/ui/components/ui/tooltip";
import { recorder } from "@screenify.io/recorder/store/recorder";

const ToolbarRecorderPlayback = observer(() => {
  if (recorder.status === "active") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="no-shadow"
            className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
            onClick={recorder.pauseScreenCapture}
          >
            <PauseIcon size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Pause recording</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="no-shadow"
          className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
          onClick={recorder.resumeScreenCapture}
        >
          <PlayIcon size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Resume recording</span>
      </TooltipContent>
    </Tooltip>
  );
});

export { ToolbarRecorderPlayback };
