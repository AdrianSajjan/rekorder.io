import { observer } from 'mobx-react';
import { AnimatePresence } from 'motion/react';

import { CropSidebar } from './sidebar/crop';
import { SidebarBase } from './sidebar/base';
import { AudioSidebar } from './sidebar/audio';
import { DefaultSidebar } from './sidebar/default';
import { SidebarPlaceholder } from './sidebar/placeholder';
import { editor, SidebarMode } from '../../store/editor';

const Sidebar = observer(() => {
  if (!editor.video) {
    return <SidebarPlaceholder />;
  }

  return (
    <SidebarBase back={editor.sidebar !== 'default'}>
      <AnimatePresence>
        <SidebarVariant sidebar={editor.sidebar} />
      </AnimatePresence>
    </SidebarBase>
  );
});

const SidebarVariant = observer(({ sidebar }: { sidebar: SidebarMode }) => {
  switch (sidebar) {
    case 'default':
      return <DefaultSidebar />;
    case 'crop':
      return <CropSidebar />;
    case 'audio':
      return <AudioSidebar />;
  }
});

export { Sidebar };
