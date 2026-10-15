import React, { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { User } from '../types';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onCreateGroup: (groupName: string, selectedUserIds: string[]) => void;
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onCreateGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Kendisi hariç diğer kullanıcılar
  const availableUsers = users.filter((u) => u.id !== currentUser.id);

  const toggleUser = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;
    onCreateGroup(groupName.trim(), selectedIds);
    setGroupName('');
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0B0F17] border border-slate-800 text-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100">Yeni Grup Kur</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Grup Adı</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Örn: Afet Koordinasyon, Aile vb."
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Üye Seç ({selectedIds.length} seçildi)</label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {availableUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400/40'
                        : 'border-slate-800/60 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-sm overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedIds.length === 0}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg shadow-md shadow-amber-400/20 transition-all"
            >
              Grubu Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};