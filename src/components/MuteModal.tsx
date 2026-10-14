import React, { useState } from 'react';
import { VolumeX, Check, X } from 'lucide-react';

interface MuteModalProps {
  isOpen: boolean;
  contactName: string;
  onClose: () => void;
  onConfirm: (duration: string) => void;
  isApple: boolean;
}

export const MuteModal: React.FC<MuteModalProps> = ({
  isOpen,
  contactName,
  onClose,
  onConfirm,
  isApple
}) => {
  const [selectedDuration, setSelectedDuration] = useState('8 saat');

  if (!isOpen) return null;

  const options = [
    { id: '8 saat', label: '8 Saat' },
    { id: '1 hafta', label: '1 Hafta' },
    { id: 'Her zaman', label: 'Her Zaman' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm overflow-hidden shadow-2xl transition-all ${
          isApple
            ? 'bg-white rounded-2xl'
            : 'bg-white rounded-3xl'
        }`}
      >
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <VolumeX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                Bildirimleri Sessize Al
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {contactName}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Diğer katılımcılar bu sohbeti sessize aldığınızı görmez. Belirlenen süre boyunca yeni mesaj bildirimleri sessiz kalır.
          </p>
        </div>

        <div className="px-5 py-2 space-y-1">
          {options.map((opt) => (
            <label
              key={opt.id}
              onClick={() => setSelectedDuration(opt.id)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                selectedDuration === opt.id
                  ? 'bg-emerald-50 text-emerald-950 font-medium'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-sm">{opt.label}</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedDuration === opt.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300'
                }`}
              >
                {selectedDuration === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </label>
          ))}
        </div>

        <div className="p-4 bg-slate-50 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedDuration)}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-transform active:scale-95"
          >
            Sessize Al
          </button>
        </div>
      </div>
    </div>
  );
};
