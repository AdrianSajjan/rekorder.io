import { ToggleGroup, ToggleGroupItem, ToggleGroupSingleProps } from '@radix-ui/react-toggle-group';
import { CornersIn, Cursor, PencilSimple, Subtract } from '@phosphor-icons/react';
import { observer } from 'mobx-react';

import { toolbar } from '../../store/toolbar';
import { Actionbar } from '../actionbar/actionbar';
import { CursorActionbar } from '../actionbar/cursor';
import { EditorActionbar } from '../actionbar/editor';
import { ToolbarAction } from '../ui/toolbar-action';

const toolbarContainer = document.getElementById('rekorder-toolbar') as HTMLElement;

const ToolbarActionbarControls = observer((props: Pick<ToggleGroupSingleProps, 'className'>) => {
  return (
    <ToggleGroup value={toolbar.actionbarState} onValueChange={toolbar.updateActionbarState} type="single" {...props}>
      <Actionbar open={toolbar.actionbarState === 'draw'} container={toolbarContainer} content={<EditorActionbar />}>
        <ToolbarAction actionbarIndicator asChild tooltip="Toggle drawing mode">
          <ToggleGroupItem value="draw">
            <PencilSimple size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
      </Actionbar>
      <ToolbarAction actionbarIndicator asChild tooltip="Toggle blur mode">
        <ToggleGroupItem value="blur">
          <Subtract size={16} weight="fill" />
        </ToggleGroupItem>
      </ToolbarAction>
      <ToolbarAction actionbarIndicator asChild tooltip="Toggle zoom area">
        <ToggleGroupItem value="zoom">
          <CornersIn size={16} weight="bold" />
        </ToggleGroupItem>
      </ToolbarAction>
      <Actionbar open={toolbar.actionbarState === 'click'} content={<CursorActionbar />}>
        <ToolbarAction actionbarIndicator asChild tooltip="Toggle click mode">
          <ToggleGroupItem value="click">
            <Cursor size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
      </Actionbar>
    </ToggleGroup>
  );
});

export { ToolbarActionbarControls };
