import { observer } from "mobx-react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@screenify.io/ui/components/ui/accordion";
import { Label } from "@screenify.io/ui/components/ui/label";
import { Switch } from "@screenify.io/ui/components/ui/switch";

const ScreenPlugin = observer(() => {
  return (
    <AccordionItem value="screen" className="shadow-none border-0 rounded-none">
      <AccordionTrigger className="bg-background">Screen</AccordionTrigger>
      <AccordionContent className="bg-background p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="capture-audio">Capture Audio</Label>
          <Switch id="capture-audio" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="click-zoom">Zoom on Click</Label>
          <Switch id="click-zoom" />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

export { ScreenPlugin };
