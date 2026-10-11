import React, { useState } from 'react';
import {
  ChevronLeft,
  Send,
  Phone,
  CheckCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface MessagesScreenProps {
  onBack: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  time: string;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Доброго дня! Я водій Андрій, чекатиму вас на вул. Стрийська, 45 (біля виїзду з АЗС WOG). Біла Skoda Octavia AA 1254 AB.',
      time: '14:15',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Вітаю! Дякую, буду там рівно о 14:30. У мене з собою один невеликий рюкзак.',
      time: '14:18',
    },
    {
      id: 'driver-3',
      sender: 'driver',
      text: 'Чудово, місце в багажнику вільне. Напишіть, як будете на місці!',
      time: '14:20',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputVal('');

    // Simulated driver response after 1.5s
    setTimeout(() => {
      const driverReplies = [
        'Добре, зрозумів!',
        'Я на місці, аварійка ввімкнена біля правого ряду.',
        'Все гаразд, очікую вас.',
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `driver-reply-${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Андрій Коваленко"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>Андрій Коваленко</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold block">Онлайн • Водій</span>
          </div>
        </div>

        <button
          onClick={() => alert('Дзвінок водію: +380 67 452 8912')}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
          title="Подзвонити"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* Timestamp header */}
        <div className="text-center my-2">
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Сьогодні, 30 жовтня
          </span>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
              <span>{m.time}</span>
              {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-600" />}
            </div>
          </div>
        ))}
      </div>

      {/* Quick response chips */}
      <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {['Я на місці 👋', 'Вже підходжу 🚶', 'Де саме ви стоїте? 📍'].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap border border-slate-200/80 shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Повідомлення для водія..."
          className="flex-1 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <button
          onClick={() => handleSend()}
          className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
