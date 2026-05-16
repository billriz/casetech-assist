import { Sidebar } from "./Sidebar";

export function AppShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar active={active} />
      <main className="px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
