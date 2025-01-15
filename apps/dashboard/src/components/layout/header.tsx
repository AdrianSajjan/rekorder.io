import { MagnifyingGlass } from '@phosphor-icons/react';
import { Lightning } from '@phosphor-icons/react/dist/ssr';
import { supabase } from '@rekorder.io/database';
import { Button } from '@rekorder.io/ui';

export function Header() {
  return (
    <header className="w-full pt-2.5 sticky top-0">
      <div className="container w-full max-w-screen-xl mx-auto h-16 flex items-center justify-start">
        <Button variant="outline" color="accent" size="medium" className="flex-1 font-normal !text-text-muted !justify-start !text-left !gap-3 !pl-3">
          <MagnifyingGlass size={20} />
          <span>Search for videos or stuffs</span>
          <span className="text-muted-foreground ml-auto">⌘K</span>
        </Button>
        <Button variant="light" className="shrink-0 !ml-8 !mr-4" onClick={() => supabase.auth.signOut()}>
          <Lightning size={16} weight="fill" />
          <span>Upgrade plan</span>
        </Button>
        <Button variant="outline" color="accent" size="icon">
          ?
        </Button>
      </div>
    </header>
  );
}
