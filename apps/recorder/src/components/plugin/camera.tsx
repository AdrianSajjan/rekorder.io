import { observer } from "mobx-react";

import { VideoIcon, VideoOffIcon } from "lucide-react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@screenify.io/ui/components/ui/accordion";
import { Badge } from "@screenify.io/ui/components/ui/badge";
import { Label } from "@screenify.io/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@screenify.io/ui/components/ui/select";
import { Switch } from "@screenify.io/ui/components/ui/switch";

import { camera } from "@screenify.io/recorder/store/camera";
import { useFetchUserCameraDevices } from "@screenify.io/recorder/hooks/use-camera";

const CameraPlugin = observer(() => {
  const cameras = useFetchUserCameraDevices();

  return (
    <AccordionItem value="camera" className="shadow-none border-0 rounded-none">
      <AccordionTrigger className="bg-background">Camera</AccordionTrigger>
      <AccordionContent className="bg-background p-6 space-y-5">
        <Select value={camera.device} onValueChange={camera.changeDevice}>
          <SelectTrigger className="">
            <div className="flex items-center gap-2 flex-1">
              {camera.device === "n/a" ? <VideoOffIcon size={20} /> : <VideoIcon size={20} />}
              {camera.device === "n/a" ? "No Camera" : cameras.find((c) => c.deviceId === camera.device)?.label}
              {camera.device === "n/a" ? <Badge className="ml-auto rounded-full">Off</Badge> : null}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="n/a">No Camera</SelectItem>
            {cameras.map((camera, index) => (
              <SelectItem key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="flip-camera">Flip Camera</Label>
          <Switch id="flip-camera" checked={camera.flip} onCheckedChange={camera.updateFlip} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

export { CameraPlugin };
