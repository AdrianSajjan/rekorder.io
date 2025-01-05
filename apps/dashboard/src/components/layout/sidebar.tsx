import { CaretDown, CaretUp, ChartDonut, GearSix, MonitorPlay, ShareFat } from '@phosphor-icons/react';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';
import { Brand, Button } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';

const navigations = [
  {
    icon: <ChartDonut size={20} weight="regular" />,
    label: 'Dashboard',
    href: '/',
    active: true,
  },
  {
    icon: <MonitorPlay size={20} weight="regular" />,
    label: 'My Library',
    href: '/library',
    active: false,
  },
  {
    icon: <ShareFat size={20} weight="regular" />,
    label: 'Shared Videos',
    href: '/shared',
    active: false,
  },
  {
    icon: <GearSix size={20} weight="regular" />,
    label: 'Settings',
    href: '/settings',
    active: false,
  },
];

export function Sidebar() {
  return (
    <aside className="h-screen w-72 p-2.5 bg-card-background relative">
      <button className="absolute top-1/2 -right-1.5 -translate-y-1/2 rounded-full h-8 w-8 grid place-items-center shadow-sm border border-borders-input  bg-card-background hover:bg-background-light transition-colors">
        <CaretLeft size={16} weight="bold" />
      </button>
      <div className="h-full w-full bg-background-light rounded-lg flex flex-col border border-borders-input/50">
        <header className="px-4 border-b border-b-borders-input h-16 flex items-center">
          <a href="/" id="Screech">
            <Brand mode="expanded" height={32} />
          </a>
        </header>
        <div className="flex flex-col px-3.5 flex-1">
          <nav className="flex flex-col gap-1.5 py-6">
            {navigations.map((navigation) => (
              <SidebarItem key={navigation.href} {...navigation} />
            ))}
          </nav>
          <div className="py-5 mt-auto flex flex-col gap-3">
            <Button variant="outline" color="accent" className="w-full !bg-card-background hover:!bg-background-light">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" alt="Chrome" className="h-6 w-auto shrink-0" />
              <span>Install chrome extension</span>
            </Button>
            <article className="mt-auto rounded-xl p-4 border shadow-sm cursor-pointer transition-colors border-borders-input bg-card-background hover:bg-indigo-50 hover:border-indigo-100">
              <div className="flex items-center gap-1.5">
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
          </div>
        </div>
        <footer className="border-t border-t-borders-input">
          <button className="flex items-center gap-3 hover:bg-background-main/70 rounded-b-lg transition-colors w-full pl-4 py-3 pr-5">
            <div className="h-12 w-12 border-2 border-accent-light p-1 rounded-full">
              <img
                src="https://1.gravatar.com/avatar/f95d1d8685c31a02f6129d0976e73c06170ed0b919d612e84d1f8cab544c8e0e?size=256"
                alt="Adrian Sajjan"
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Adrian Sajjan</span>
              <span className="text-xs text-accent-dark">My Workspace</span>
            </div>
            <span className="ml-auto">
              <CaretDown size={14} weight="bold" />
            </span>
          </button>
        </footer>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
  return (
    <a
      href={href}
      data-active={active}
      className={cn(
        'inline-flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-medium transition-colors',
        'text-background-text bg-background-light hover:bg-background-main/70 data-[active=true]:text-primary-dark data-[active=true]:bg-primary-light/10 data-[active=true]:hover:bg-primary-light/10'
      )}
    >
      <span>{icon}</span>
      <span className="leading-relaxed">{label}</span>
    </a>
  );
}
