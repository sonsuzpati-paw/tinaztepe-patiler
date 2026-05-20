import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { LogEntry, Animal } from '../types';
import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface CampusCalendarProps {
  logs: LogEntry[];
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
}

export default function CampusCalendar({ logs, animals, onSelectAnimal }: CampusCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  // Sadece takvime işlenmiş (isScheduled) veya ileri tarihli olanları al
  const scheduledLogs = logs.filter(log => log.isScheduled || (log.scheduledDate && new Date(log.scheduledDate) > new Date()));

  const logsForSelectedDate = scheduledLogs.filter(log => {
    const logDate = log.scheduledDate ? parseISO(log.scheduledDate) : parseISO(log.date);
    return isSameDay(logDate, date);
  });

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dayLogs = scheduledLogs.filter(log => {
        const logDate = log.scheduledDate ? parseISO(log.scheduledDate) : parseISO(log.date);
        return isSameDay(logDate, date);
      });
      
      if (dayLogs.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col lg:flex-row min-h-[500px]">
      <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-6">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <span>Takvim & Randevular</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center calendar-wrapper">
          <Calendar
            onChange={(val) => setDate(val as Date)}
            value={date}
            tileContent={tileContent}
            className="border-0 font-sans w-full max-w-md"
            locale="tr-TR"
          />
        </div>
        <style>{`
          .react-calendar {
            border: none !important;
            font-family: inherit !important;
          }
          .react-calendar__tile--active {
            background: #f97316 !important; /* primary color */
            border-radius: 0.75rem;
          }
          .react-calendar__tile--now {
            background: #fff7ed !important; /* primary/10 */
            color: #ea580c !important;
            border-radius: 0.75rem;
          }
          .react-calendar__tile {
            border-radius: 0.75rem;
            padding: 1em 0.5em !important;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #ffedd5 !important;
          }
        `}</style>
      </div>
      
      <div className="w-full lg:w-1/2 p-6 bg-slate-50 flex flex-col">
        <div className="flex items-center gap-2 text-slate-700 font-medium mb-6">
          <Clock className="w-5 h-5 text-slate-400" />
          <span>{format(date, "d MMMM yyyy", { locale: tr })} Programı</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          {logsForSelectedDate.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <CalendarIcon className="w-12 h-12 opacity-20" />
              <p>Bu tarih için kayıtlı program bulunmuyor.</p>
            </div>
          ) : (
            logsForSelectedDate.map(log => {
              const animal = animals.find(a => a.id === log.animalId);
              return (
                <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold
                        ${log.category === 'hastalık' ? 'bg-red-100 text-red-700' : 
                          log.category === 'ilaç' ? 'bg-amber-100 text-amber-700' :
                          log.category === 'beslenme' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'}
                      `}>
                        {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{log.title}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{log.description}</p>
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      Kayıt: {log.userName}
                    </div>
                  </div>
                  
                  {animal && (
                    <button 
                      onClick={() => onSelectAnimal(animal)}
                      className="shrink-0 flex flex-col items-center gap-2 ml-4 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                        {animal.photos[0] ? (
                          <img src={animal.photos[0]} alt={animal.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center font-bold text-slate-400">
                            {animal.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-primary flex items-center gap-1">
                        Profili <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
