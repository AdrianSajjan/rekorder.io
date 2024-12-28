import { observer } from "mobx-react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@screenify.io/ui/components/ui/accordion";
import { Label } from "@screenify.io/ui/components/ui/label";
import { Switch } from "@screenify.io/ui/components/ui/switch";

const ToolbarPlugin = observer(() => {
  return (
    <AccordionItem value="toolbar" className="shadow-none border-0 rounded-none">
      <AccordionTrigger className="bg-background">Toolbar</AccordionTrigger>
      <AccordionContent className="bg-background p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="hide-toolbar">Enabled</Label>
          <Switch id="hide-toolbar" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="camera-controls">Camera Controls</Label>
          <Switch id="camera-controls" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="mic-controls">Microphone Controls</Label>
          <Switch id="mic-controls" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="cursor-controls">Cursor Controls</Label>
          <Switch id="cursor-controls" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="effects-controls">Effects Controls</Label>
          <Switch id="effects-controls" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="blur-controls">Blur Controls</Label>
          <Switch id="blur-controls" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="drawing-controls">Drawing Controls</Label>
          <Switch id="drawing-controls" />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

export { ToolbarPlugin };
