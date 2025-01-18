import { SidebarBase } from './base';

export function SidebarPlaceholder() {
  return (
    <SidebarBase>
      <div className="flex flex-col gap-8 py-6 shrink-0">
        {Array.from({ length: 3 }, (_, key) => {
          return (
            <div className="flex flex-col gap-3" key={key}>
              <div className="h-4 w-24 rounded-md bg-background-main animate-pulse" />
              {Array.from({ length: 4 }, (_, key) => {
                return <div className="h-16 bg-background-main rounded-2xl animate-pulse" key={key} />;
              })}
            </div>
          );
        })}
      </div>
    </SidebarBase>
  );
}
