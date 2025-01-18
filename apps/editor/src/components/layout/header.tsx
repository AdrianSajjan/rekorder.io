import { observer } from 'mobx-react';
import { editor } from '../../store/editor';

const Header = observer(() => {
  return (
    <header className="h-16 bg-card-background shrink-0 border-b border-borders-input flex items-center justify-center">
      <input value={editor.name} onChange={(event) => editor.updateName(event.target.value)} className="text-center text-base font-medium w-96 rounded-md" />
    </header>
  );
});

export { Header };
