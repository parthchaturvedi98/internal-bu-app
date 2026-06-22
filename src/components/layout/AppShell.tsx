import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import TopBar from './TopBar';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col py-4 flex-shrink-0">
          <nav className="flex flex-col gap-1 px-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <LayoutDashboard size={16} />
              My Accounts
            </NavLink>
            <NavLink
              to="/all"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Users size={16} />
              All Accounts
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
