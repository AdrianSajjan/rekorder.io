import { observer } from 'mobx-react';

const AudioSidebar = observer(() => {
  return (
    <div className="flex flex-col py-6 shrink-0">
      <label className="text-xs font-semibold">Crop Video</label>
    </div>
  );
});

export { AudioSidebar };
