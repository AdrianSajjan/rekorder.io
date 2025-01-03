import { observer } from 'mobx-react';
import { ToggleGroup, ToggleGroupItem, ToggleGroupSingleProps } from '@radix-ui/react-toggle-group';
import { CornersIn, Cursor, PencilSimple, Subtract } from '@phosphor-icons/react';

import { toolbar } from '../../store/toolbar';
import { cursor } from '../../store/cursor';

import { Actionbar } from '../actionbar/actionbar';
import { CursorActionbar } from '../actionbar/cursor';
import { EditorActionbar } from '../actionbar/editor';
import { ToolbarAction } from '../ui/toolbar-action';

import { CursorClickIcon } from '../icons/cursor-click';
import { CursorHighlightIcon } from '../icons/cursor-highlight';
import { CursorSpotlightIcon } from '../icons/cursor-spotlight';

const cursors = {
  'default-cursor': <Cursor size={16} weight="bold" />,
  'highlight-click': <CursorClickIcon height={16} width={16} />,
  'highlight-cursor': <CursorHighlightIcon height={16} width={16} />,
  'spotlight-cursor': <CursorSpotlightIcon height={16} width={16} />,
};

const ToolbarActionbarControls = observer((props: Pick<ToggleGroupSingleProps, 'className'>) => {
  const toolbarContainer = document.getElementById('rekorder-toolbar') as HTMLElement;

  return (
    <ToggleGroup value={toolbar.actionbarState} onValueChange={toolbar.updateActionbarState} type="single" {...props}>
      <Actionbar open={toolbar.actionbarState === 'draw'} container={toolbarContainer} content={<EditorActionbar />}>
        <ToolbarAction actionbarIndicator asChild tooltip="Toggle drawing mode">
          <ToggleGroupItem value="draw">
            <PencilSimple size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
      </Actionbar>
      <ToolbarAction asChild tooltip="Toggle blur mode">
        <ToggleGroupItem value="blur">
          <Subtract size={16} weight="fill" />
        </ToggleGroupItem>
      </ToolbarAction>
      <ToolbarAction asChild tooltip="Toggle zoom area">
        <ToggleGroupItem value="zoom">
          <CornersIn size={16} weight="bold" />
        </ToggleGroupItem>
      </ToolbarAction>
      <Actionbar open={toolbar.actionbarState === 'click'} container={toolbarContainer} content={<CursorActionbar />}>
        <ToolbarAction actionbarIndicator asChild tooltip="Toggle click mode">
          <ToggleGroupItem value="click">{cursors[cursor.mode]}</ToggleGroupItem>
        </ToolbarAction>
      </Actionbar>
    </ToggleGroup>
  );
});

export { ToolbarActionbarControls };
