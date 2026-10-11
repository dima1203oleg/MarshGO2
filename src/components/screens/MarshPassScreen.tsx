import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Phone,
  MessageCircle,
  Car,
  QrCode,
  Wallet,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  X,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { MarshPassTicket } from '../../types/marshgo';
import { QRCodeSvg } from '../QRCodeSvg';
import { triggerRatchetTick } from '../../utils/haptics';

interface MarshPassScreenProps {
  ticket: MarshPassTicket;
  onBack: () => void;
  onCancelTicket: (ticketId: string) => void;
  onNavigateToChat: () => void;
  initialViewMode?: 'pass' | 'details';
}

export const MarshPassScreen: React.FC<MarshPassScreenProps> = ({
  ticket,
  onBack,
  onCancelTicket,
  onNavigateToChat,
  initialViewMode = 'pass',
}) => {
  const [viewMode, setViewMode] = useState<'pass' | 'details'>(initialViewMode);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFullscreenQR, setShowFullscreenQR] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    triggerRatchetTick('minute');
    if (navigator.share) {
      navigator.share({
        title: `Квиток MarshPass ${ticket.bookingCode}`,
        text: `Поїздка ${ticket.fromCity} → ${ticket.toCity}, ${ticket.date} о ${ticket.departureTime}. Код: ${ticket.bookingCode}`,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `MarshPass ${ticket.bookingCode}: ${ticket.fromCity} - ${ticket.toCity}, ${ticket.departureTime}`
      );
      showToast('Деталі квитка скопійовано в буфер обміну!');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-200 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-800 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1 font-extrabold text-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>{viewMode === 'pass' ? 'MarshPass' : 'Деталі MarshPass'}</span>
        </button>

        {/* Quick Switcher between Screen 7 & Screen 8 */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setViewMode('pass');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'pass'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Квиток
          </button>
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setViewMode('details');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'details'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Деталі
          </button>
        </div>
      </div>

      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5">
        {viewMode === 'pass' ? (
          /* SCREEN 7: MarshPass (Електронний квиток з QR) - EXACT FROM SCREENSHOT 7 */
          <div className="space-y-3.5">
            <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-lg p-5 flex flex-col items-center text-center space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-sm tracking-tight">
                  <Car className="w-4 h-4" />
                  <span>MarshPass</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Дійсний
                </span>
              </div>

              {/* Route & Timing */}
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {ticket.fromCity} ➔ {ticket.toCity}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  {ticket.date}
                </div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {ticket.departureTime} – {ticket.arrivalTime}
                </div>
              </div>

              {/* Seat & Price Strip */}
              <div className="w-full flex items-center justify-around py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Місце</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">3 з 4</span>
                </div>
                <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Ціна</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{ticket.totalCostUah} грн</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div
                onClick={() => {
                  triggerRatchetTick('hour');
                  setShowFullscreenQR(true);
                }}
                className="cursor-pointer group flex flex-col items-center p-3 rounded-3xl bg-white shadow-sm border border-slate-100 hover:border-blue-300 transition-all"
                title="Натисніть для збільшення"
              >
                <QRCodeSvg value={ticket.qrPayload} size={155} />
                <div className="mt-2.5 font-mono font-black text-base tracking-widest text-slate-900">
                  {ticket.bookingCode || 'MG-7X4P-9K2L'}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Покажіть QR-код водію перед поїздкою
                </span>
              </div>

              {/* Driver info row */}
              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt={ticket.driverName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{ticket.driverName}</span>
                      <span className="text-amber-500 font-bold">★ 4.9 (128)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {ticket.carModel}, {ticket.carPlate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Дзвінок водію: ${ticket.driverPhone}`)}
                  className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  title="Подзвонити водію"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>

              {/* Expand details trigger */}
              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  setViewMode('details');
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1 hover:underline"
              >
                <span>Деталі поїздки</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* SCREEN 8: Деталі MarshPass - EXACT FROM SCREENSHOT 8 */
          <div className="space-y-3.5">
            {/* Top Ticket Status Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-sm p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  MarshPass
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Дійсний
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {ticket.fromCity} ➔ {ticket.toCity}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {ticket.date} • {ticket.departureTime} – {ticket.arrivalTime}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt={ticket.driverName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {ticket.driverName} <span className="text-amber-500">★ 4.9 (128)</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ticket.carModel} • {ticket.carPlate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Дзвінок: ${ticket.driverPhone}`)}
                  className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Місце: <strong>3 з 4</strong> (Середній ряд, біля вікна)</span>
                <span className="font-black text-blue-600">{ticket.totalCostUah} грн</span>
              </div>
            </div>

            {/* Actions List matching Screenshot 8 */}
            <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 overflow-hidden">
              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  setShowFullscreenQR(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-slate-500" />
                  <span>Код бронювання: <strong>{ticket.bookingCode || 'MG-7X4P-9K2L'}</strong></span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  setShowWalletModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span>Додати в Apple Wallet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleShare}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Поділитися поїздкою</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onNavigateToChat}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-slate-500" />
                  <span>Зв'язатися з водієм</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  showToast('Режим керування бронюванням відкрито');
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Керувати бронюванням</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('hour');
                  setShowCancelModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left text-rose-600 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Скасувати поїздку</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enlarged QR Modal */}
      {showFullscreenQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full flex flex-col items-center space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setShowFullscreenQR(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-2">
              <span className="text-xs font-bold text-blue-600">MARSHPASS QR</span>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                {ticket.fromCity} ➔ {ticket.toCity}
              </h4>
            </div>
            <div className="p-3 bg-white rounded-2xl border shadow-md">
              <QRCodeSvg value={ticket.qrPayload} size={200} />
            </div>
            <div className="font-mono font-black text-lg text-slate-900">
              {ticket.bookingCode || 'MG-7X4P-9K2L'}
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(ticket.bookingCode || 'MG-7X4P-9K2L');
                showToast('Код скопійовано!');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Скопіювати код</span>
            </button>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl p-5 max-w-xs w-full space-y-3 relative border border-slate-700">
            <button
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold">Apple Wallet Pass</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-4 space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span>MARSHPASS</span>
                <span>{ticket.bookingCode}</span>
              </div>
              <div className="font-black text-sm">{ticket.fromCity} ➔ {ticket.toCity}</div>
              <div className="flex justify-between text-[11px] text-blue-200">
                <span>{ticket.departureTime}</span>
                <span>Місце: 3 з 4</span>
                <span className="text-white font-bold">{ticket.totalCostUah} грн</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowWalletModal(false);
                showToast('Квиток додано в Wallet!');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              Зберегти в Apple Wallet
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full space-y-3 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Скасувати поїздку?</h4>
            <p className="text-xs text-slate-500">Місце буде звільнено для інших попутників.</p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Ні
              </button>
              <button
                onClick={() => {
                  onCancelTicket(ticket.id);
                  setShowCancelModal(false);
                  onBack();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Так, скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
