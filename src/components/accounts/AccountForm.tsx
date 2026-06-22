import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useMsal } from '@azure/msal-react';
import { useAppStore } from '../../store/useAppStore';
import { TEAM_MEMBERS } from '../../config/members';
import { useAddAccount, useUpdateAccount } from '../../hooks/useAccounts';
import type { Account } from '../../types';

interface FormValues {
  name: string;
  company: string;
  status: Account['status'];
  ownerName: string;
  description: string;
}

interface Props {
  account?: Account | null;
  onClose: () => void;
}

export default function AccountForm({ account, onClose }: Props) {
  const { accounts: msalAccounts } = useMsal();
  const currentEmail = msalAccounts[0]?.username ?? '';
  const selectedMember = useAppStore((s) => s.selectedMember) ?? '';
  const addAccount = useAddAccount();
  const updateAccount = useUpdateAccount();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      company: '',
      status: 'active',
      ownerName: selectedMember,
      description: '',
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        company: account.company,
        status: account.status,
        ownerName: account.ownerName,
        description: account.description ?? '',
      });
    }
  }, [account, reset]);

  const onSubmit = async (values: FormValues) => {
    if (account) {
      await updateAccount.mutateAsync({ id: account.id, ...values });
    } else {
      await addAccount.mutateAsync({ ...values, ownerEmail: currentEmail });
    }
    onClose();
  };

  const isPending = addAccount.isPending || updateAccount.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{account ? 'Edit Account' : 'New Account'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account / Deal name *</label>
            <input
              {...register('name', { required: 'Required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Project Phoenix"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client / Company *</label>
            <input
              {...register('company', { required: 'Required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Acme Corp"
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
              <select
                {...register('ownerName', { required: 'Required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief summary of this account..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : account ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
