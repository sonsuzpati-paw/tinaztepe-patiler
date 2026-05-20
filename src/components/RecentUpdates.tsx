/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogEntry, LogCategory } from '../types';
import { Pill, Activity, Footprints, MessageSquare, Apple, Stethoscope, Clock, Search, ExternalLink } from 'lucide-react';

interface RecentUpdatesProps {
  logs: LogEntry[];
  onSelectAnimal: (animalId: string) => void;
}

export default function RecentUpdates({ logs, onSelectAnimal }: RecentUpdatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');

  const categories: { label: string; value: LogCategory | 'all'; color: string }[] = [
    { label: 'Hepsi', value: 'all', color: 'bg-slate-100 text-slate-700' },
    { label: 'Hastalık', value: 'hastalık', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { label: 'İlaç Verme', value: 'ilaç', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { label: 'Beslenme', value: 'beslenme', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { label: 'Davranış', value: 'davranış', color: 'bg-violet-100 text-violet-800 border-violet-200' },
    { label: 'Diğer', value: 'diğer', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];

  const getCategoryIconAndColor = (cat: LogCategory) => {
    switch (cat) {
      case 'hastalık':
        return {
          icon: <Stethoscope className="w-4 h-4" />,
          color: 'bg-rose-50 text-rose-700 border-rose-100'
        };
      case 'ilaç':
        return {
          icon: <Pill className="w-4 h-4" />,
          color: 'bg-amber-50 text-amber-700 border-amber-100'
        };
      case 'beslenme':
        return {
          icon: <Apple className="w-4 h-4" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
      case 'davranış':
        return {
          icon: <Activity className="w-4 h-4" />,
          color: 'bg-violet-50 text-violet-700 border-violet-100'
        };
      default:
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          color: 'bg-blue-50 text-blue-700 border-blue-100'
        };
    }
  };

  const getCategoryTitle = (cat: LogCategory) => {
    switch (cat) {
      case 'hastalık': return 'Hastalık Teşhisi';
      case 'ilaç': return 'İlaç & Tedavi';
      case 'beslenme': return 'Beslenme / Mama Gözlemi';
      case 'davranış': return 'Davranış Gözlemi';
      default: return 'Gözlem / Diğer Güncelleme';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500 animate-pulse" />
            Son Güncellemeler Sehpası
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Kampüs dostlarımızın son durumlarını, beslenme, sağlık ve ilaç gelişim kronolojisini buradan saniyelik takip edin.
          </p>
        </div>

        {/* Arama Barı */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
            placeholder="Hayvan ismi, detay, yazan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Kategori Filtresi */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <Footprints className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Uyuşan rapor ya da güncelleme bulunamadı.</p>
          <p className="text-slate-400 text-xs mt-1">Arama kelimenizi değiştirebilir veya yeni bir gözlem ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 pl-4 sm:pl-6 ml-3 space-y-7">
          {filteredLogs.map((log) => {
            const { icon, color } = getCategoryIconAndColor(log.category);
            return (
              <div key={log.id} className="relative group">
                {/* Kronoloji Noktası */}
                <div className={`absolute -left-7.5 sm:-left-9.5 top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-sm ${color}`}>
                  {icon}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div>
                      {/* Hayvan ismi & Link */}
                      <button
                        onClick={() => onSelectAnimal(log.animalId)}
                        className="inline-flex items-center gap-1.5 group/link text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm bg-indigo-50/70 text-indigo-700 px-2.5 py-1 rounded-lg">
                          {log.animalName}
                        </span>
                        <span className="text-slate-400 group-hover/link:text-indigo-500 text-xs flex items-center gap-0.5 font-bold">
                          bilgilerine git
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </button>

                      <p className="font-bold text-slate-800 text-xs sm:text-sm mt-2.5 leading-snug">
                        {log.title}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 self-start rounded-full uppercase border shrink-0 text-slate-600 bg-slate-55 border-slate-200">
                      {getCategoryTitle(log.category)}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                    {log.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
                    <p>Yazan: <span className="font-semibold text-slate-700">{log.userName}</span></p>
                    <p>{new Date(log.date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
