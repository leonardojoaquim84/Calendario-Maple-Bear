/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Bell, 
  Calendar as CalendarIcon,
  Download,
  Info,
  GraduationCap
} from 'lucide-react';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Event {
  date: Date;
  title: string;
  description?: string;
  type: 'event' | 'task';
}

const INITIAL_EVENTS: Event[] = [
  {
    date: new Date(2026, 2, 10), // March 10, 2026
    title: 'LIV',
    description: 'levar o caderno do aluno do LIV',
    type: 'event'
  },
  {
    date: new Date(2026, 2, 13), // March 13, 2026 (Friday)
    title: 'St. Patric',
    description: 'Ir com roupa verde',
    type: 'event'
  },
  {
    date: new Date(2026, 2, 19), // March 19, 2026
    title: 'Dever de Música',
    description: 'Em comemoração ao dia das mulheres passei um trabalho de casa para cada aluno pesquisar uma mulher importante da música nacional ou internacional, trazer uma foto dessa celebridade feminina e falar um pouco dela, data limite para entrega será até o dia 19/03/2026.',
    type: 'task'
  }
];

const FILES: { name: string; size: string; url?: string }[] = [
  { 
    name: 'Apostila Ukulele.pdf', 
    size: '2.4 MB',
    url: 'https://drive.google.com/file/d/1Dva0KTTJg9co-ckzcV3TPs-lZ-zu0AZW/view?usp=drive_link'
  }
];

const ANNOUNCEMENTS = [
  {
    title: 'Apostila Ukulele',
    content: 'Já está disponível para download a apostila de Ukulele para o Year 2. Acesse a aba de Arquivos para baixar.',
    date: '09/03/2026',
    link: 'https://drive.google.com/file/d/1Dva0KTTJg9co-ckzcV3TPs-lZ-zu0AZW/view?usp=drive_link'
  },
  {
    title: 'YouTube Maple Bear Méier',
    content: 'Acompanhe as novidades e atividades da nossa escola em nosso canal oficial no YouTube.',
    link: 'https://m.youtube.com/@MapleBearM%C3%A9ier',
    date: '09/03/2026'
  }
];

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Start at current date
  const [activeTab, setActiveTab] = useState<'calendar' | 'files' | 'announcements'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [accessTime, setAccessTime] = useState<string>('');

  useEffect(() => {
    setAccessTime(format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss"));
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getEventsForDay = (day: Date) => {
    return INITIAL_EVENTS.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 py-4 sticky top-0 bg-white z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Maple Bear</h1>
              <p className="text-red-600 font-semibold text-sm">Year 2</p>
            </div>
          </div>

          <nav className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeTab === 'calendar' ? "bg-white text-red-600 shadow-md" : "text-gray-500 hover:text-black"
              )}
            >
              <CalendarIcon size={36} />
              <span className="hidden sm:inline">Calendário</span>
            </button>
            <button 
              onClick={() => setActiveTab('announcements')}
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeTab === 'announcements' ? "bg-white text-red-600 shadow-md" : "text-gray-500 hover:text-black"
              )}
            >
              <Bell size={36} />
              <span className="hidden sm:inline">Informações</span>
            </button>
            <button 
              onClick={() => setActiveTab('files')}
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeTab === 'files' ? "bg-white text-red-600 shadow-md" : "text-gray-500 hover:text-black"
              )}
            >
              <FileText size={36} />
              <span className="hidden sm:inline">Arquivos</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div 
                      key={day.toString()} 
                      className={cn(
                        "min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-gray-100 last:border-r-0",
                        !isSameMonth(day, currentMonth) && "bg-gray-50/50 text-gray-300"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday(day) ? "bg-red-600 text-white" : "text-gray-700"
                        )}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event, eIdx) => (
                          <button
                            key={eIdx}
                            onClick={() => setSelectedEvent(event)}
                            className={cn(
                              "w-full text-left px-2 py-1 rounded text-[10px] sm:text-xs font-medium truncate transition-all",
                              event.type === 'event' ? "bg-red-50 text-red-700 border border-red-100" : "bg-gray-100 text-gray-700 border border-gray-200"
                            )}
                          >
                            {event.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {accessTime && (
              <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-400 font-medium">
                  Acesso em: {accessTime}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Informações úteis</h2>
            {ANNOUNCEMENTS.map((ann, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:border-red-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-red-600">{ann.title}</h3>
                  <span className="text-xs text-gray-400 font-medium">{ann.date}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{ann.content}</p>
                {ann.link && (
                  <a 
                    href={ann.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-red-600 font-bold hover:underline"
                  >
                    Acessar Canal <ChevronRight size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Arquivos para Download</h2>
            <div className="grid gap-3">
              {FILES.length > 0 ? (
                FILES.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-red-50 transition-colors">
                        <FileText className="text-red-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{file.name}</h3>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    {file.url ? (
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Download size={20} />
                      </a>
                    ) : (
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                        <Download size={20} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">Nenhum arquivo disponível no momento.</p>
                </div>
              )}
            </div>
            
            <div className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-red-200 hover:text-red-400 transition-all cursor-pointer">
              <Download size={32} className="mb-2 opacity-50" />
              <p className="font-medium">Arraste novos arquivos aqui</p>
              <p className="text-xs">ou clique para selecionar</p>
            </div>
          </div>
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Faixa em cima */}
            <div className="h-2 bg-red-600 w-full" />
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-red-600">{selectedEvent.title}</h3>
                  <p className="text-gray-400 font-medium mt-1">
                    {format(selectedEvent.date, "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-black transition-colors p-1"
                >
                  <ChevronRight className="rotate-90" size={24} />
                </button>
              </div>

              <div className="min-h-[120px]">
                {selectedEvent.description ? (
                  <div className="space-y-8">
                    <p className="text-gray-700 text-xl leading-relaxed">
                      {selectedEvent.description}
                    </p>
                    <div className="pt-6 border-t border-gray-100">
                      <button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                      >
                        Entendido
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <p className="text-gray-500 italic text-lg">Nenhuma descrição adicional para este compromisso.</p>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto p-8 text-center text-gray-400 text-xs border-t border-gray-100 mt-12">
        <p>© 2026 Maple Bear School - Year 2 Parent Portal</p>
      </footer>
    </div>
  );
}
