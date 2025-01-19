import { observer } from 'mobx-react';
import { Button } from '@rekorder.io/ui';
import { ArrowCounterClockwise, QuestionMark } from '@phosphor-icons/react';
import { editor } from '../../store/editor';

const Header = observer(() => {
  return (
    <header className="h-[4.5rem] bg-card-background shrink-0 border-b border-borders-input flex items-center justify-end gap-8 px-4 relative">
      <div className="absolute left-1/2 -translate-x-1/2">
        <input
          value={editor.name}
          placeholder="Project Name"
          onChange={(event) => editor.changeName(event.target.value)}
          className="text-center text-sm font-medium w-fit p-1 rounded-md bg-transparent"
        />
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
