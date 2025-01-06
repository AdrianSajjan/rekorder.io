import { Fragment } from 'react/jsx-runtime';
import { CaretDown, CaretLeft, CaretUp, Icon, ListChecks } from '@phosphor-icons/react';
import { Brand, Button } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';

import { SidebarMode, useAppStore } from '../../store/app';
import { navigations } from '../../constants/layout';

export function Sidebar() {
  const { sidebarMode, toggleSidebar } = useAppStore();

  return (
    <aside className={cn('h-screen p-2.5 bg-card-background relative', sidebarMode === 'expanded' ? 'w-72' : 'w-24')}>
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 rounded-full h-8 w-8 grid place-items-center shadow-sm border border-borders-input bg-card-background hover:bg-background-light transition-colors"
      >
        <CaretLeft size={16} weight="bold" className={cn(sidebarMode === 'collapsed' ? 'rotate-180' : '')} />
      </button>
      <div className="h-full w-full bg-background-light rounded-lg flex flex-col border border-borders-input/50">
        <header className={cn('px-4 border-b border-b-borders-input h-16 flex items-center', sidebarMode === 'expanded' ? 'justify-start' : 'justify-center')}>
          <a href="/" id="Screech">
            <Brand mode={sidebarMode} height={32} />
          </a>
        </header>
        <div className="flex flex-col px-3.5 flex-1">
          <SidebarNavigation mode={sidebarMode} />
          <SidebarChecklist mode={sidebarMode} />
        </div>
        <footer className="border-t border-t-borders-input">
          <SidebarProfile mode={sidebarMode} />
        </footer>
      </div>
    </aside>
  );
}

function SidebarNavigation({ mode }: { mode: SidebarMode }) {
  return (
    <nav className={cn('flex flex-col gap-1.5 py-6', mode === 'expanded' ? 'items-start' : 'items-center')}>
      {navigations.map((navigation) => (
        <SidebarItem key={navigation.href} mode={mode} {...navigation} />
      ))}
    </nav>
  );
}

function SidebarProfile({ mode }: { mode: SidebarMode }) {
  return (
    <button
      className={cn(
        'flex items-center gap-3 hover:bg-background-main/70 rounded-b-lg transition-colors w-full',
        mode === 'expanded' ? 'pl-4 py-3 pr-5' : 'p-3'
      )}
    >
      <div className={cn('border-2 border-accent-light p-1 rounded-full', mode === 'expanded' ? 'h-12 w-12' : 'h-11 w-11 mx-auto')}>
        <img
          src="https://1.gravatar.com/avatar/f95d1d8685c31a02f6129d0976e73c06170ed0b919d612e84d1f8cab544c8e0e?size=256"
          alt="Adrian Sajjan"
          className="h-full w-full rounded-full"
        />
      </div>
      {mode === 'expanded' ? (
        <Fragment>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Adrian Sajjan</span>
            <span className="text-xs text-accent-dark">My Workspace</span>
          </div>
          <span className="ml-auto">
            <CaretDown size={14} weight="bold" />
          </span>
        </Fragment>
      ) : null}
    </button>
  );
}

function SidebarChecklist({ mode }: { mode: SidebarMode }) {
  return (
    <div className={cn('py-5 mt-auto flex flex-col gap-3', mode === 'expanded' ? 'items-start' : 'items-center')}>
      <Button variant="outline" size={mode === 'expanded' ? 'medium' : 'icon'} color="accent" className="w-full !bg-card-background hover:!bg-background-light">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" alt="Chrome" className="h-6 w-auto shrink-0" />
        {mode === 'expanded' ? <span>Install chrome extension</span> : null}
      </Button>
      {mode === 'expanded' ? (
        <article
          role="button"
          tabIndex={0}
          className="rounded-xl p-4 border shadow-sm cursor-pointer transition-colors border-borders-input bg-card-background hover:bg-indigo-50 hover:border-indigo-100"
        >
          <div className="flex items-center gap-1.5">
            <ListChecks size={16} weight="bold" />
            <h3 className="text-sm font-medium">Get Started</h3>
            <span className="ml-auto">
              <CaretUp size={14} weight="bold" />
            </span>
          </div>
          <div className="flex gap-1.5 my-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="rounded h-2 flex-1 bg-primary-main/30" />
            ))}
          </div>
          <p className="text-xs text-accent-dark">Record your first video, with our easy to use chrome extension.</p>
        </article>
      ) : (
        <Button variant="outline" size="icon" color="accent" className="w-full !bg-card-background hover:!bg-background-light">
          <ListChecks size={16} weight="bold" />
        </Button>
      )}
    </div>
  );
}

interface SidebarItemProps {
  icon: Icon;
  label: string;
  href: string;
  active?: boolean;
  mode: SidebarMode;
}

function SidebarItem({ icon: Icon, label, href, active, mode }: SidebarItemProps) {
  const weight = active ? 'fill' : 'regular';

  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 h-10 rounded-lg text-sm font-medium transition-colors',
        active ? 'text-primary-dark bg-primary-light/10 hover:bg-primary-light/10' : 'text-background-text bg-background-light hover:bg-background-main/70',
        mode === 'expanded' ? 'justify-start px-3 w-full' : 'justify-center px-0 w-10'
      )}
    >
      <Icon size={20} weight={weight} />
      {mode === 'expanded' ? <span className="leading-relaxed">{label}</span> : null}
    </a>
  );
}
