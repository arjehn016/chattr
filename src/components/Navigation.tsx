import React from 'react';
import {
  MessageSquare,
  CircleDot,
  Phone,
  Settings,
  Shield,
  Smartphone,
  Compass,
  Radio
} from 'lucide-react';
import { ActiveTab, DeviceOS, AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadTotal: number;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  unreadTotal,
  deviceOS,
  currentTheme = 'cyber_neon'
}) => {
  const isApple = deviceOS === 'apple';
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'chats',
      label: 'Sohbetler',
      icon: (
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadTotal > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-black bg-cyan-400 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              {unreadTotal}
            </span>
          )}
        </div>
      )
    },
    {
      id: 'nearby',
      label: 'Yakındakiler',
      icon: <Compass className="w-5 h-5" />
    },
    {
      id: 'emergency',
      label: 'Afet Ağı',
      icon: (
        <div className="relative">
          <Radio className="w-5 h-5 text-rose-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        </div>
      )
    },
    {
      id: 'status',
      label: isApple ? 'Güncellemeler' : 'Durum',
      icon: <CircleDot className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className={`h-16 ${theme.navBg} flex items-center justify-around px-2 select-none shrink-0 z-30 transition-colors`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isEmergency = tab.id === 'emergency';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all min-h-[44px] ${
              isActive
                ? isEmergency
                  ? 'bg-rose-500/20 text-rose-300 font-bold rounded-2xl shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : `${theme.navActive} font-bold rounded-2xl`
                : isEmergency
                ? 'text-rose-400 hover:text-rose-300'
                : theme.navInactive
            }`}
          >
            <div className="mb-0.5">{tab.icon}</div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
