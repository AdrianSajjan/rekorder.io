import { useState } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@rekorder.io/ui';
import { ArrowCounterClockwise, QuestionMark } from '@phosphor-icons/react';
import { editor } from '../../store/editor';

const Header = observer(() => {
  const [isEditing, setEditing] = useState(false);

  return (
    <header className="h-[4.5rem] bg-card-background shrink-0 border-b border-borders-input flex items-center justify-between gap-8 px-4 relative">
      <div className="flex items-center">
        {isEditing ? (
          <input
            value={editor.name}
            placeholder="Project Name"
            onChange={(event) => editor.changeName(event.target.value)}
            onBlur={() => setEditing(false)}
            className="text-left text-sm font-medium w-48 py-1 px-2 rounded-md bg-transparent"
          />
        ) : (
          <p className="text-sm text-left font-medium w-48 line-clamp-1" onDoubleClick={() => setEditing(true)}>
            {editor.name || 'Project Name'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="light" color="accent" className="shrink-0">
          <ArrowCounterClockwise size={16} weight="bold" />
          <span>Revert to original</span>
        </Button>
        <Button size="icon" variant="light" color="accent">
          <QuestionMark size={16} weight="bold" />
        </Button>
      </div>
    </header>
  );
});

export { Header };
