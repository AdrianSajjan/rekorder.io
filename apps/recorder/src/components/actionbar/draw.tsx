import { PenIcon, Trash2Icon } from "lucide-react";

import { Button } from "@screenify.io/ui/components/ui/button";
import { Card } from "@screenify.io/ui/components/ui/card";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@screenify.io/ui/components/ui/tooltip";

function DrawingActionbar() {
  return (
    <Card className="w-fit bg-background overflow-hidden flex items-center h-10 pointer-events-auto">
      <TooltipProvider disableHoverableContent delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="no-shadow" className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none">
              <Trash2Icon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Delete recording</span>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" variant="thick" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="no-shadow" className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none">
              <PenIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Drawing options</span>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
      </TooltipProvider>
    </Card>
  );
}

export { DrawingActionbar };
