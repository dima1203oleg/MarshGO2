import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Star,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Car,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CarpoolRide, ScreenId } from '../../types/marshgo';

interface RideDetailsScreenProps {
  ride: CarpoolRide;
  onBack: () => void;
  onBookSeat: (ride: CarpoolRide) => void;
  onNavigateToChat: () => void;
}

export const RideDetailsScreen: React.FC<RideDetailsScreenProps> = ({
  ride,
  onBack,
  onBookSeat,
  onNavigateToChat,
}) => {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChipClick = (msg: string) => {
    setActiveChip(msg);
    setToastMessage(`Статус відправлено водію: "${msg}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Деталі попутки</span>
        </button>
        <button className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Meeting Point Card with Map Visual */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Місце зустрічі</span>
            <span className="text-blue-600 font-bold">{ride.distanceFromUserKm} км від вас</span>
          </div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{ride.fromAddress}</span>
          </div>

          {/* Styled Mini Map Snapshot */}
          <div className="w-full h-24 rounded-2xl bg-gradient-to-tr from-blue-100 via-sky-50 to-indigo-100 border border-blue-200 relative overflow-hidden flex items-center justify-center mt-2">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-blue-500/20">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-blue-900 mt-1 bg-white/90 px-2 py-0.5 rounded-full border border-blue-200 shadow-xs">
                Посадка о {ride.departureTime}
              </span>
            </div>
          </div>
        </div>

        {/* Driver Profile Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img
                  src={ride.driverAvatar}
                  alt={ride.driverName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>{ride.driverName}</span>
                  <span title="Верифікований">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </h4>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{ride.driverRating}</span>
                  </div>
                  <span className="text-slate-400">({ride.driverReviewsCount})</span>
                  <span className="text-slate-400">• На платформі з {ride.driverJoinedYear}</span>
                </div>
              </div>
            </div>

            {/* Direct Communication Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => alert(`Дзвінок водію: +380 67 452 8912`)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                title="Подзвонити"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToChat}
                className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                title="Написати повідомлення"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Car Details Strip */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Автомобіль</span>
              <span className="font-bold text-slate-800">
                {ride.carModel} • {ride.carColor}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Номерний знак</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                {ride.carPlate}
              </span>
            </div>
          </div>

          {/* Quick Action Chips for Passenger */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Швидке повідомлення водію:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Я на місці', 'Буду за 5 хв', 'Затримуюсь на 10 хв'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activeChip === chip
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/60'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trip Stats Matrix */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
            <span className="text-[11px] font-medium text-slate-400 block">Вільних місць</span>
            <span className="text-base font-black text-blue-600 mt-0.5 block">
              {ride.availableSeats} з {ride.totalSeats}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
            <span className="text-[11px] font-medium text-slate-400 block">Час виїзду</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {ride.departureTime}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
            <span className="text-[11px] font-medium text-slate-400 block">Вартість місця</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {ride.costPerSeatUah} грн
            </span>
          </div>
        </div>

        {/* Itinerary Stops */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Маршрут попутки
          </h4>
          <div className="space-y-3 pl-2 border-l-2 border-blue-200 text-xs">
            {ride.intermediateStops.map((stop, idx) => (
              <div key={idx} className="relative pl-3">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{stop.name}</span>
                  <span className="font-semibold text-slate-500 font-mono">{stop.time}</span>
                </div>
                {stop.stopDurationMin > 0 && (
                  <span className="text-[10px] text-slate-400">
                    зупинка {stop.stopDurationMin} хв
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Co-passengers list */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Попутники ({ride.bookedPassengers.length} з {ride.totalSeats - 1})
            </h4>
          </div>
          <div className="flex items-center gap-3">
            {ride.bookedPassengers.map((pass) => (
              <div key={pass.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <img
                  src={pass.avatar}
                  alt={pass.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-slate-800 block">{pass.name}</span>
                  <span className="text-slate-400">Місце {pass.seat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Button */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-slate-200">
        <button
          onClick={() => onBookSeat(ride)}
          className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>Забронювати місце ({ride.costPerSeatUah} грн)</span>
        </button>
      </div>
    </div>
  );
};
