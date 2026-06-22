import { LogOut } from 'lucide-react';
import { useMsal } from '@azure/msal-react';
import MemberPicker from '../common/MemberPicker';

export default function TopBar() {
  const { instance, accounts } = useMsal();
  const email = accounts[0]?.username ?? '';

  const handleSignOut = () => instance.logoutPopup();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-900 text-base">BU Tracker</span>
        <span className="text-gray-300">|</span>
        <MemberPicker />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{email}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          title="Sign out"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </header>
  );
}
