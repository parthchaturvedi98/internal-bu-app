import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TEAM_MEMBERS } from '../../config/members';
import { useAddAccount, useUpdateAccount } from '../../hooks/useAccounts';
import { STAGE_LABELS } from '../../types';
import type { Account, PipelineStage, PursuitType } from '../../types';

interface FormValues {
  name: string;
  dealName: string;
  pursuitType: PursuitType;
  stage: PipelineStage;
  ownerName: string;
  description: string;
}

interface Props {
  account?: Account | null;
  onClose: () => void;
}

export default function AccountForm({ account, onClose }: Props) {
  const currentEmail = useAppStore((s) => s.currentEmail) ?? '';
  const selectedMember = useAppStore((s) => s.selectedMember) ?? '';
  const addAccount = useAddAccount();
  const updateAccount = useUpdateAccount();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      dealName: '',
      pursuitType: 'transactional',
      stage: 'qualify',
      ownerName: selectedMember,
      description: '',
    },
  });

  const pursuitType = watch('pursuitType');

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        dealName: account.dealName,
        pursuitType: account.pursuitType,
        stage: account.stage,
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

  const transactionalStages: PipelineStage[] = ['qualify', 'commercial', 'provisioned'];
  const transformationalStages: PipelineStage[] = ['discover', 'workshop', 'pilot_pov', 'close'];
  const allowedStages = pursuitType === 'transactional' ? transactionalStages : transformationalStages;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{account ? 'Edit Pursuit' : 'New Pursuit'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account / Company name *</label>
            <input
              {...register('name', { required: 'Required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Office Depot"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal / Pursuit description *</label>
            <input
              {...register('dealName', { required: 'Required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Renewal ADM deal"
            />
            {errors.dealName && <p className="text-red-500 text-xs mt-1">{errors.dealName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pursuit type *</label>
            <div className="grid grid-cols-2 gap-2">
              {(['transactional', 'transformational'] as PursuitType[]).map((pt) => (
                <label key={pt} className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                  pursuitType === pt
                    ? pt === 'transactional'
                      ? 'border-slate-600 bg-slate-50 text-slate-700 font-medium'
                      : 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input type="radio" {...register('pursuitType')} value={pt} className="sr-only" />
                  <span>{pt === 'transactional' ? 'Transactional' : 'Transformational'}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {pursuitType === 'transactional' ? 'Resell / API tokens (Stages 1–3)' : 'Services led (Stages 4–7)'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline stage *</label>
              <select
                {...register('stage', { required: 'Required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allowedStages.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
              <select
                {...register('ownerName', { required: 'Required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Any additional context..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {account ? 'Save Changes' : 'Add Pursuit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
