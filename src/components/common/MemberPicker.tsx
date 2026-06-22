import { TEAM_MEMBERS } from '../../config/members';
import { useAppStore } from '../../store/useAppStore';

export default function MemberPicker() {
  const selectedMember = useAppStore((s) => s.selectedMember);
  const setSelectedMember = useAppStore((s) => s.setSelectedMember);

  return (
    <select
      value={selectedMember ?? ''}
      onChange={(e) => setSelectedMember(e.target.value || null)}
      className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select your name</option>
      {TEAM_MEMBERS.map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
  );
}
