import { LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function TopBar() {
  const currentEmail = useAppStore((s) => s.currentEmail);
  const clearSession = useAppStore((s) => s.clearSession);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[11px] font-bold">BU</span>
        </div>
        <span className="font-semibold text-gray-900 text-sm">Anthropic BU Tracker</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 hidden sm:block">{currentEmail}</span>
        <button
          onClick={clearSession}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </header>
  );
}
