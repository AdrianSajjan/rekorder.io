import { ToggleGroup, ToggleGroupItem, ToggleGroupSingleProps } from '@radix-ui/react-toggle-group';
import { CornersIn, Cursor, PencilSimple, Subtract } from '@phosphor-icons/react';
import { observer } from 'mobx-react';

import { ToolbarAction } from '../ui/toolbar-action';
import { Actionbar } from '../actionbar/actionbar';
import { CursorActionbar } from '../actionbar/cursor';
import { toolbar } from '../../store/toolbar';

const ToolbarActionbarControls = observer((props: Pick<ToggleGroupSingleProps, 'className'>) => {
  return (
    <ToggleGroup value={toolbar.actionbarState} onValueChange={toolbar.updateActionbarState} type="single" {...props}>
      <ToolbarAction asChild tooltip="Toggle drawing mode">
        <ToggleGroupItem value="draw">
          <PencilSimple size={18} weight="bold" />
        </ToggleGroupItem>
      </ToolbarAction>
      <ToolbarAction asChild tooltip="Toggle blur mode">
        <ToggleGroupItem value="blur">
          <Subtract size={19} weight="fill" />
        </ToggleGroupItem>
      </ToolbarAction>
      <ToolbarAction asChild tooltip="Toggle zoom area">
        <ToggleGroupItem value="zoom">
          <CornersIn size={18} weight="bold" />
        </ToggleGroupItem>
      </ToolbarAction>
      <Actionbar open={toolbar.actionbarState === 'click'} content={<CursorActionbar />}>
        <ToolbarAction asChild tooltip="Toggle click mode">
          <ToggleGroupItem value="click">
            <Cursor size={18} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
      </Actionbar>
    </ToggleGroup>
  );
});

export { ToolbarActionbarControls };
