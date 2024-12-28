import Draggable from "react-draggable";

import {
  ArrowDownToLineIcon,
  GripVerticalIcon,
  MicIcon,
  MousePointer2Icon,
  RotateCcwIcon,
  Trash2Icon,
  VideoIcon,
  WandIcon,
} from "lucide-react";
import { useRef } from "react";

import { Button } from "@screenify.io/ui/components/ui/button";
import { Card } from "@screenify.io/ui/components/ui/card";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@screenify.io/ui/components/ui/tooltip";

import { ToolbarRecorderPlayback } from "@screenify.io/recorder/components/toolbar/playback";
import { ToolbarRecordTimer } from "@screenify.io/recorder/components/toolbar/timer";

import { ToolbarDrawingControls } from "@screenify.io/recorder/components/toolbar/draw";
import { SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";
import { measureElement } from "@screenify.io/recorder/lib/utils";
import { recorder } from "@screenify.io/recorder/store/recorder";

function PluginToolbar() {
  const toolbar$ = useRef<HTMLDivElement>(null!);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { height: toolbarHeight, width: toolbarWidth } = measureElement(toolbar$.current, { height: 40, width: 200 });

  const defaultPosition = {
    x: SAFE_AREA_PADDING,
    y: screenHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  const bounds = {
    top: SAFE_AREA_PADDING,
    left: SAFE_AREA_PADDING,
    right: screenWidth - SAFE_AREA_PADDING - toolbarWidth,
    bottom: screenHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  return (
    <Draggable nodeRef={toolbar$} handle="#toolbar-handle" defaultPosition={defaultPosition} bounds={bounds}>
      <Card ref={toolbar$} className="w-fit absolute bg-background overflow-hidden flex items-center h-10 pointer-events-auto">
        <TooltipProvider disableHoverableContent delayDuration={500}>
          <div className="px-1.5 bg-primary/80 h-10 grid place-items-center cursor-move">
            <GripVerticalIcon id="toolbar-handle" size={16} />
          </div>
          <Separator orientation="vertical" variant="thick" />
          <ToolbarRecordTimer />
          <Separator orientation="vertical" variant="thick" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
                onClick={recorder.stopScreenCapture}
              >
                <ArrowDownToLineIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Save recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <ToolbarRecorderPlayback />
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <RotateCcwIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Restart recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <Trash2Icon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Delete recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" variant="thick" />
          <ToolbarDrawingControls />
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <WandIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Effects options</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <MousePointer2Icon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Cursor options</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" variant="thick" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <MicIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Toggle mic</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <VideoIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Toggle camera</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Card>
    </Draggable>
  );
}

export { PluginToolbar };
