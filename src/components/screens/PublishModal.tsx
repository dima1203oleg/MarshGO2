import React, { useState } from 'react';
import {
  X,
  Car,
  User,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CarpoolRide, TransitRoute } from '../../types/marshgo';
import { IOSDateTimePickerModal } from '../IOSDateTimePickerModal';
import { triggerRatchetTick } from '../../utils/haptics';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishDriverRide: (newRide: Partial<CarpoolRide>) => void;
  onPublishPassengerRequest: (request: any) => void;
  onSuccessToast?: (message: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublishDriverRide,
  onPublishPassengerRequest,
  onSuccessToast,
}) => {
  const [role, setRole] = useState<'driver' | 'passenger'>('driver');
  const [fromCity, setFromCity] = useState('Львів');
  const [fromAddress, setFromAddress] = useState('вул. Стрийська, 45 (АЗС WOG)');
  const [toCity, setToCity] = useState('Київ');
  const [toAddress, setToAddress] = useState('вул. Хрещатик, 1');
  const [departureDate, setDepartureDate] = useState('Сьогодні, 30 жовтня');
  const [departureTime, setDepartureTime] = useState('15:30');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [carModel, setCarModel] = useState('Volkswagen Passat B8');
  const [carPlate, setCarPlate] = useState('BC 9988 EK');
  const [availableSeats, setAvailableSeats] = useState(3);
  const [priceUah, setPriceUah] = useState(350);
  const [comment, setComment] = useState('Є великий багажник, не палимо в салоні.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerRatchetTick('hour');
    if (role === 'driver') {
      onPublishDriverRide({
        fromCity,
        fromAddress,
        toCity,
        toAddress,
        departureDate,
        departureTime,
        carModel,
        carPlate,
        availableSeats,
        totalSeats: 4,
        costPerSeatUah: priceUah,
      });
      if (onSuccessToast) {
        onSuccessToast(`Поїздку водія ${fromCity} → ${toCity} успішно опубліковано!`);
      }
    } else {
      onPublishPassengerRequest({
        fromCity,
        toCity,
        date: departureDate,
        budgetUah: priceUah,
        comment,
      });
      if (onSuccessToast) {
        onSuccessToast(`Запит пасажира на ${fromCity} → ${toCity} опубліковано!`);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              {role === 'driver' ? 'Опублікувати поїздку' : 'Створити запит на поїздку'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Нова публікація
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                role === 'driver'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Я водій (є вільні місця)</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('passenger')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                role === 'passenger'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Я пасажир (шукаю авто)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Route details */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Маршрут поїздки
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Звідки</span>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Куди</span>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                  required
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium">Місце зустрічі / посадки</span>
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
              />
            </div>
          </div>

          {/* Date & Time with Ratchet Wheel Picker */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                triggerRatchetTick('date');
                setIsPickerOpen(true);
              }}
              className="bg-slate-50 hover:bg-blue-50/70 p-3 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all text-left"
              title="Вибрати дату (колесо з тріскачкою)"
            >
              <span className="text-[10px] text-slate-500 font-medium block">Дата</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">{departureDate}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerRatchetTick('hour');
                setIsPickerOpen(true);
              }}
              className="bg-slate-50 hover:bg-blue-50/70 p-3 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all text-left"
              title="Вибрати час (колесо з тріскачкою)"
            >
              <span className="text-[10px] text-slate-500 font-medium block">Час виїзду</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold font-mono text-slate-800">{departureTime}</span>
              </div>
            </button>
          </div>

          {/* Driver specific info */}
          {role === 'driver' ? (
            <>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Дані автомобіля та місця
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Марка авто</span>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Номерний знак</span>
                    <input
                      type="text"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      className="w-full text-xs font-bold font-mono text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Кількість місць</span>
                    <select
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(Number(e.target.value))}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                    >
                      <option value={1}>1 місце</option>
                      <option value={2}>2 місця</option>
                      <option value={3}>3 місця</option>
                      <option value={4}>4 місця</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Ціна за місце (грн)</span>
                    <input
                      type="number"
                      value={priceUah}
                      onChange={(e) => setPriceUah(Number(e.target.value))}
                      className="w-full text-xs font-black text-blue-600 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                      min={50}
                      step={10}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Бажаний бюджет (грн)</span>
                <input
                  type="number"
                  value={priceUah}
                  onChange={(e) => setPriceUah(Number(e.target.value))}
                  className="w-full text-xs font-black text-blue-600 bg-white border border-slate-200 rounded-xl px-2.5 py-2 mt-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Коментар до поїздки</span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 mt-0.5"
                />
              </div>
            </div>
          )}

          {/* Diia Trust Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/80 text-blue-900 text-[11px] font-medium border border-blue-200/60">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Верифікація через Дія.Підпис підвищує довіру попутників на 80%.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{role === 'driver' ? 'Опублікувати поїздку' : 'Опублікувати запит'}</span>
            <span>✓</span>
          </button>
        </form>
      </div>

      {/* iOS Wheel Date & Time Picker with Mechanical Ratchet */}
      <IOSDateTimePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialDate={departureDate}
        initialTime={departureTime}
        onApply={(newDate, newTime) => {
          setDepartureDate(newDate);
          setDepartureTime(newTime);
        }}
      />
    </div>
  );
};
