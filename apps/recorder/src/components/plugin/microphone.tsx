import { MicIcon, MicOffIcon } from "lucide-react";
import { observer } from "mobx-react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@screenify.io/ui/components/ui/accordion";
import { Badge } from "@screenify.io/ui/components/ui/badge";
import { Label } from "@screenify.io/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@screenify.io/ui/components/ui/select";
import { Switch } from "@screenify.io/ui/components/ui/switch";

import { useAudioWaveform } from "@screenify.io/recorder/hooks/use-audio-waveform";
import { useFetchUserMicrophoneDevices } from "@screenify.io/recorder/hooks/use-microphone";
import { microphone } from "@screenify.io/recorder/store/microphone";

const MicrophonePlugin = observer(() => {
  const microphones = useFetchUserMicrophoneDevices();
  const waveform = useAudioWaveform(microphone.device, microphone.pushToTalk);

  return (
    <AccordionItem value="microphone" className="shadow-none border-0 rounded-none">
      <AccordionTrigger className="bg-background">Microphone</AccordionTrigger>
      <AccordionContent className="bg-background p-6 space-y-5">
        <Select value={microphone.device} onValueChange={microphone.changeDevice}>
          <SelectTrigger className="">
            <div className="flex items-center gap-2 flex-1">
              {microphone.device === "n/a" ? <MicOffIcon size={20} /> : <MicIcon size={20} />}
              {microphone.device === "n/a" ? "No Microphone" : microphones.find((m) => m.deviceId === microphone.device)?.label}
              {microphone.device === "n/a" ? <Badge className="ml-auto rounded-full">Off</Badge> : null}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="n/a">No Microphone</SelectItem>
            {microphones.map((microphone, index) => (
              <SelectItem key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || `Microphone ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="push-to-talk">
            <span>Push to Talk</span>&nbsp;
            <span className="text-xs">(⌥⇧U)</span>
          </Label>
          <Switch checked={microphone.pushToTalk} onCheckedChange={microphone.updatePushToTalk} id="push-to-talk" />
        </div>
        {microphone.device !== "n/a" ? <canvas id="waveform" ref={waveform} className="w-full h-8" /> : null}
      </AccordionContent>
    </AccordionItem>
  );
});

export { MicrophonePlugin };
