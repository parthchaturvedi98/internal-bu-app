import TopBar from './TopBar';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <main className="flex-1 overflow-x-auto p-4">
        {children}
      </main>
    </div>
  );
}
