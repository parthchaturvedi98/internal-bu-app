import { LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import MemberPicker from '../common/MemberPicker';

export default function TopBar() {
  const currentEmail = useAppStore((s) => s.currentEmail);
  const clearSession = useAppStore((s) => s.clearSession);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-900 text-base">BU Tracker</span>
        <span className="text-gray-300">|</span>
        <MemberPicker />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{currentEmail}</span>
        <button
          onClick={clearSession}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          title="Sign out"
        >
          <LogOut size={14} />
          Switch user
        </button>
      </div>
    </header>
  );
}
