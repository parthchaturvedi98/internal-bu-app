import { LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function TopBar() {
  const currentEmail = useAppStore((s) => s.currentEmail);
  const clearSession = useAppStore((s) => s.clearSession);

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">BU</span>
        </div>
        <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">BU Tracker</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-400 hidden md:block truncate max-w-[200px]">{currentEmail}</span>
        <button
          onClick={clearSession}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors whitespace-nowrap"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </header>
  );
}
