import React from 'react';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Plus,
  Palette
} from 'lucide-react';
import { CallRecord, DeviceOS, AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface CallsViewProps {
  calls: CallRecord[];
  onStartCall: (contactId: string, type: 'audio' | 'video') => void;
  onOpenNewCall: () => void;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
  onOpenThemeSelector?: () => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  calls,
  onStartCall,
  onOpenNewCall,
  deviceOS,
  currentTheme = 'cyber_neon',
  onOpenThemeSelector
}) => {
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;

  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgClass} select-none overflow-y-auto transition-colors`}>
      {/* Header */}
      <header className={`px-4 py-3 shrink-0 flex items-center justify-between ${theme.headerClass}`}>
        <h1 className={`text-xl font-bold tracking-tight ${theme.textPrimary}`}>
          Aramalar
        </h1>

        <div className="flex items-center gap-1.5">
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="p-1.5 rounded-full hover:bg-white/10 text-cyan-400 transition-colors"
              title="Tema Seç"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewCall}
            className={`p-2 rounded-full ${theme.accentColor} transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer`}
            title="Yeni Arama"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Call list */}
      <div className="p-3 space-y-2.5">
        <p className={`text-xs font-bold uppercase tracking-wider px-2 ${theme.textSecondary} opacity-80`}>
          Son Aramalar
        </p>

        {calls.length === 0 ? (
          <div className={`py-16 text-center ${theme.textSecondary}`}>
            <Phone className="w-10 h-10 mx-auto stroke-1 text-cyan-400/40 mb-2 animate-pulse" />
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>Arama kaydı yok</p>
            <p className="text-xs opacity-75 mt-1">
              Bir arkadaşınızı arayarak sesli veya görüntülü görüşme başlatın.
            </p>
          </div>
        ) : (
          calls.map((call) => {
            const isMissed = call.direction === 'missed';

            return (
              <div
                key={call.id}
                className={`p-3 rounded-2xl border transition-all ${theme.cardClass} hover:border-cyan-400/40 flex items-center justify-between gap-3 group`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-white border border-white/10 shadow-sm">
                    {call.contactAvatar ? (
                      <img
                        src={call.contactAvatar}
                        alt={call.contactName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      call.contactName.charAt(0)
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${
                        isMissed ? 'text-rose-400' : theme.textPrimary
                      }`}
                    >
                      {call.contactName}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-mono mt-0.5">
                      {call.direction === 'incoming' && (
                        <PhoneIncoming className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                      {call.direction === 'outgoing' && (
                        <PhoneOutgoing className={`w-3.5 h-3.5 ${theme.textSecondary} shrink-0`} />
                      )}
                      {call.direction === 'missed' && (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}

                      <span className={`${theme.textSecondary} opacity-80`}>{call.timestamp}</span>
                      {call.duration && (
                        <span className={`${theme.textSecondary} opacity-80`}>· {call.duration}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onStartCall(call.contactId, call.type)}
                    className="p-2.5 text-cyan-400 hover:bg-cyan-500/15 rounded-xl transition-all active:scale-95 cursor-pointer"
                    title={call.type === 'video' ? 'Görüntülü Ara' : 'Sesli Ara'}
                  >
                    {call.type === 'video' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
