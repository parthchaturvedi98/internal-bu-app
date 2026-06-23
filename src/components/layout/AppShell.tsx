import TopBar from './TopBar';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
