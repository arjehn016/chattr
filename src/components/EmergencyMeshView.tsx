import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Battery,
  MapPin,
  Send,
  ShieldAlert,
  Users,
  CheckCircle2,
  Activity,
  Flame,
  HeartPulse,
  Share2,
  Flashlight,
  Signal,
  X,
  Compass
} from 'lucide-react';
import { User, EmergencyStatus, EmergencyBroadcast, MeshPeer } from '../types';
import { startEmergencyWhistle, stopEmergencyWhistle } from '../utils/emergencyAudio';

interface EmergencyMeshViewProps {
  currentUser: User;
  onClose?: () => void;
  isApple: boolean;
}

export const EmergencyMeshView: React.FC<EmergencyMeshViewProps> = ({
  currentUser,
  onClose,
  isApple
}) => {
  const [isWhistleActive, setIsWhistleActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [myStatus, setMyStatus] = useState<EmergencyStatus>('safe');
  const [customMsg, setCustomMsg] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(84);
  const [bloodType, setBloodType] = useState('A Rh(+)');
  const [activeTab, setActiveTab] = useState<'feed' | 'sos' | 'peers'>('feed');

  // Simulated live Mesh Broadcasts without internet/Wi-Fi
  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>([
    {
      id: 'emb_1',
      senderId: 'user_zeynep',
      senderName: 'Zeynep Demir',
      username: 'zeynep_d',
      status: 'safe',
      message: 'Ben iyiyim! Ailemle birlikte toplanma alanındayız (Göztepe Parkı). İnternet yok ama mesh çalışıyor.',
      coordinates: '40.9781° K, 29.0566° D',
      batteryPercent: 78,
      bloodType: '0 Rh(+)',
      timestamp: 'Az önce',
      hopCount: 1,
      signalStrength: 92,
      distanceMeters: 280
    },
    {
      id: 'emb_2',
      senderId: 'user_mehmet',
      senderName: 'Mehmet Can',
      username: 'mehmet_c',
      status: 'under_rubble',
      message: 'ACİL YARDIM! Rıhtım Cad. No:18, 2. kat merdiven boşluğu. 2 kişiyiz, bilincimiz açık.',
      coordinates: '40.9912° K, 29.0254° D',
      batteryPercent: 34,
      bloodType: 'B Rh(+)',
      timestamp: '3 dk önce',
      hopCount: 2,
      signalStrength: 65,
      distanceMeters: 620
    },
    {
      id: 'emb_3',
      senderId: 'user_melis',
      senderName: 'Melis Aydın',
      username: 'melis_design',
      status: 'medical_needed',
      message: 'Acil ilk yardım çantası ve sargı bezi lazım. Moda sahildeyiz.',
      coordinates: '40.9840° K, 29.0280° D',
      batteryPercent: 55,
      bloodType: 'A Rh(-)',
      timestamp: '7 dk önce',
      hopCount: 1,
      signalStrength: 88,
      distanceMeters: 450
    }
  ]);

  // Simulated nearby mesh peer nodes
  const [peers, setPeers] = useState<MeshPeer[]>([
    {
      id: 'p1',
      name: 'Zeynep Demir',
      username: 'zeynep_d',
      distanceMeters: 280,
      signalStrength: 92,
      battery: 78,
      status: 'safe',
      lastSeenSec: 4
    },
    {
      id: 'p2',
      name: 'Burak Öztürk (Röle Cihazı)',
      username: 'burak_dev',
      distanceMeters: 420,
      signalStrength: 85,
      battery: 64,
      status: 'safe',
      lastSeenSec: 12
    },
    {
      id: 'p3',
      name: 'Mehmet Can',
      username: 'mehmet_c',
      distanceMeters: 620,
      signalStrength: 65,
      battery: 34,
      status: 'under_rubble',
      lastSeenSec: 18
    },
    {
      id: 'p4',
      name: 'AKUT Arama Kurtarma Düğümü',
      username: 'akut_mesh_relay',
      distanceMeters: 750,
      signalStrength: 95,
      battery: 98,
      status: 'safe',
      lastSeenSec: 2
    }
  ]);

  // Battery API simulation
  useEffect(() => {
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((batt: any) => {
        setBatteryLevel(Math.round(batt.level * 100));
      });
    }
  }, []);

  // Handle Emergency Rescue Whistle
  const toggleWhistle = () => {
    if (isWhistleActive) {
      stopEmergencyWhistle();
      setIsWhistleActive(false);
    } else {
      startEmergencyWhistle();
      setIsWhistleActive(true);
    }
  };

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      stopEmergencyWhistle();
    };
  }, []);

  // Broadcast "Ben İyiyim"
  const handleBroadcastSafe = () => {
    const timeString = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newSafeBroadcast: EmergencyBroadcast = {
      id: `emb_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      username: currentUser.username,
      status: 'safe',
      message: 'BEN İYİYİM! Güvenli alandayım. Cihazım açık, bataryam yeterli.',
      coordinates: '40.9850° K, 29.0320° D (Yaklaşık)',
      batteryPercent: batteryLevel,
      bloodType,
      timestamp: timeString,
      hopCount: 1,
      signalStrength: 100,
      distanceMeters: 0
    };

    setBroadcasts((prev) => [newSafeBroadcast, ...prev]);
    setMyStatus('safe');
  };

  // Broadcast SOS Distress
  const handleBroadcastSOS = (sosType: EmergencyStatus, detailText: string) => {
    const timeString = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const titlePrefix =
      sosType === 'under_rubble'
        ? '🆘 ACİL: ENKAZ ALTINDAYIM! '
        : sosType === 'medical_needed'
        ? '🚑 ACİL TIBBİ YARDIM! '
        : '⚠️ ACİL YARDIM ÇAĞRISI: ';

    const newSosBroadcast: EmergencyBroadcast = {
      id: `emb_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      username: currentUser.username,
      status: sosType,
      message: titlePrefix + detailText,
      coordinates: '40.9850° K, 29.0320° D (Yaklaşık)',
      batteryPercent: batteryLevel,
      bloodType,
      timestamp: timeString,
      hopCount: 1,
      signalStrength: 100,
      distanceMeters: 0
    };

    setBroadcasts((prev) => [newSosBroadcast, ...prev]);
    setMyStatus(sosType);
    setActiveTab('feed');
  };

  // Send mesh message
  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    const timeString = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newCustomBroadcast: EmergencyBroadcast = {
      id: `emb_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      username: currentUser.username,
      status: myStatus,
      message: customMsg.trim(),
      coordinates: '40.9850° K, 29.0320° D',
      batteryPercent: batteryLevel,
      bloodType,
      timestamp: timeString,
      hopCount: 1,
      signalStrength: 100,
      distanceMeters: 0
    };

    setBroadcasts((prev) => [newCustomBroadcast, ...prev]);
    setCustomMsg('');
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full bg-[#0A0E17] text-white select-none overflow-hidden relative ${
        isStrobeActive ? 'animate-pulse bg-white' : ''
      }`}
    >
      {/* Top Mesh Status Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-900 to-slate-900 p-3.5 border-b border-rose-500/30 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-rose-300 uppercase">
                İnternetsiz Afet Mesh Ağı
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded-full">
                Çevrim Dışı
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5 font-mono">
              <span>{peers.length} Cihaz Bağlı</span>
              <span>·</span>
              <span className="text-emerald-400">P2P Doğrudan</span>
              <span>·</span>
              <span>Batarya: %{batteryLevel}</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Critical Action Bar: "Ben İyiyim" + "Düdük Çal (Enkaz)" */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 gap-2.5 shrink-0">
        <button
          type="button"
          onClick={handleBroadcastSafe}
          className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>Ben İyiyim Bildir</span>
        </button>

        <button
          type="button"
          onClick={toggleWhistle}
          className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
            isWhistleActive
              ? 'bg-rose-600 text-white animate-bounce shadow-[0_0_30px_rgba(244,63,94,0.8)]'
              : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
          }`}
        >
          {isWhistleActive ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Düdüğü Sustur</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Düdük Çal (Enkaz Altı)</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs (Feed / SOS Gönder / Yakın Düğümler) */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeTab === 'feed'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Acil Ağ Yayını ({broadcasts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sos')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeTab === 'sos'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          SOS Çağrısı Gönder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('peers')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeTab === 'peers'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Mesh Düğümleri ({peers.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'feed' && (
          <>
            {/* Info Box */}
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 flex items-start gap-2.5">
              <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Bu mesajlar internet ve baz istasyonları çalışmasa dahi Bluetooth ve Wi-Fi Direct üzerinden cihazdan cihaza aktarılmaktadır.
              </p>
            </div>

            {/* Broadcast Feed */}
            {broadcasts.map((b) => {
              const isDanger = b.status === 'under_rubble';
              const isMedical = b.status === 'medical_needed';
              const isSafe = b.status === 'safe';

              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-3xl border transition-all ${
                    isDanger
                      ? 'bg-rose-950/50 border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                      : isMedical
                      ? 'bg-amber-950/50 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-emerald-950/40 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full animate-ping ${
                          isDanger ? 'bg-rose-500' : isMedical ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="text-xs font-bold text-white">{b.senderName}</span>
                      <span className="text-[10px] font-mono text-slate-400">@{b.username}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span>{b.timestamp}</span>
                      <span>·</span>
                      <span className="text-cyan-400">{b.distanceMeters}m</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-100 leading-relaxed font-medium">
                    {b.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {b.coordinates}
                      </span>
                      <span>·</span>
                      <span className="text-amber-300">Kan: {b.bloodType}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400">
                      <span>Batarya: %{b.batteryPercent}</span>
                      <span>·</span>
                      <span>{b.hopCount}. Sıçrama</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'sos' && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-3xl text-center">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-2 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Acil Yardım Bildirimi Yayınla</h3>
              <p className="text-xs text-slate-300 mt-1">
                İnternetsiz çevrenizdeki tüm telefonlara ve kurtarma ekiplerine acil yardım sinyali yollar.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleBroadcastSOS(
                    'under_rubble',
                    'Enkaz altındayım! Sesime ve konum sinyalime gelin.'
                  )
                }
                className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between shadow-lg active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-lg">
                    🧱
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Enkaz Altındayım</p>
                    <p className="text-[11px] text-rose-100">Acil arama kurtarma çağrısı gönder</p>
                  </div>
                </div>
                <span className="text-xs bg-black/30 px-2 py-1 rounded-lg">Yayınla</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleBroadcastSOS(
                    'medical_needed',
                    'Ağır yaralı var, kanama durdurucu ve ilk yardım gerekli.'
                  )
                }
                className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow-lg active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-lg">
                    🚑
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Tıbbi Yardım Lazım</p>
                    <p className="text-[11px] text-amber-100">Yaralı veya ilaç ihtiyacı bildir</p>
                  </div>
                </div>
                <span className="text-xs bg-black/30 px-2 py-1 rounded-lg">Yayınla</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStrobeActive(!isStrobeActive)}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-between shadow-lg active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Flashlight className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Ekran Feneri / SOS Çakar</p>
                    <p className="text-[11px] text-slate-300">Gece kurtarma ekiplerine ışıklı sinyal ver</p>
                  </div>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-lg">
                  {isStrobeActive ? 'Kapat' : 'Aç'}
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'peers' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-400 font-mono">
              Doğrudan bağlı düğümler ({peers.length}):
            </p>

            {peers.map((peer) => (
              <div
                key={peer.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 shrink-0">
                    {peer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{peer.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Mesafe: ~{peer.distanceMeters}m · {peer.lastSeenSec} sn önce aktif
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-[10px]">
                  <span className="text-emerald-400 font-bold">%{peer.signalStrength} Sinyal</span>
                  <p className="text-slate-400">Batarya: %{peer.battery}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mesh Message Composer */}
      <form
        onSubmit={handleSendCustomMessage}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
          placeholder="İnternetsiz çevreye acil mesaj yazın..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={!customMsg.trim()}
          className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-cyan-500/30"
          title="Mesh Yayını Gönder"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
