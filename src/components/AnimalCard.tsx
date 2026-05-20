/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Animal, User } from '../types';
import { MapPin, Heart, Shield, HelpCircle, ExternalLink, Activity } from 'lucide-react';

interface AnimalCardProps {
  key?: React.Key;
  animal: Animal;
  users: User[];
  onSelect: (animal: Animal) => void;
  currentUser: User | null;
}

export default function AnimalCard({ animal, users, onSelect, currentUser }: AnimalCardProps) {
  // Find current responsible users
  const responsibleUsers = users.filter((u) => animal.responsibleUserIds.includes(u.id));

  // Get status styles
  const getStatusStyles = (status: Animal['status']) => {
    switch (status) {
      case 'sağlıklı':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          text: 'Sağlıklı'
        };
      case 'hasta':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          dot: 'bg-orange-500',
          text: 'Hasta'
        };
      case 'tedavide':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          text: 'Tedavide'
        };
      case 'kayıp':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          text: 'Kayıp'
        };
      default: // acil
        return {
          bg: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
          dot: 'bg-red-600 animate-ping',
          text: 'ACİL YARDIM!'
        };
    }
  };

  const statusStyles = getStatusStyles(animal.status);
  const isUserResponsible = currentUser ? animal.responsibleUserIds.includes(currentUser.id) : false;

  return (
    <div
      onClick={() => onSelect(animal)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Resim Alanı */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={animal.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Üst Kedi/Köpek Cinsiyeti Rozeti */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {animal.type === 'kedi' ? '🐱 Kedi' : '🐶 Köpek'}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {animal.gender === 'erkek' ? '♂ Erkek' : animal.gender === 'dişi' ? '♀ Dişi' : '❔ Bilinmiyor'}
          </span>
        </div>

        {/* Sorumlu Olduğum */}
        {isUserResponsible && (
          <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Sorumluyum
          </div>
        )}

        {/* Alt Bölüm Karartması ve Durum */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${statusStyles.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
            {statusStyles.text}
          </span>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-amber-600 transition-colors">
              {animal.name}
            </h3>
            <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
              {animal.isNeutered ? 'Kısır' : 'Kısır Değil'}
            </span>
          </div>

          <div className="flex items-start gap-1 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <p className="font-bold text-slate-700">{animal.location}</p>
              {animal.locationDetails && (
                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[210px]" title={animal.locationDetails}>
                  {animal.locationDetails}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sorumlular Listesi & Detay Tuşu */}
        <div className="border-t border-slate-50 mt-4.5 pt-4 flex items-center justify-between gap-2 shrink-0">
          <div className="flex -space-x-2.5 overflow-hidden">
            {responsibleUsers.length > 0 ? (
              responsibleUsers.map((u) => (
                <img
                  key={u.id}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 object-cover"
                  src={u.avatar}
                  alt={u.name}
                  title={`${u.name} (Sorumlu)`}
                  referrerPolicy="no-referrer"
                />
              ))
            ) : (
              <span className="text-[10.5px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-100">
                <HelpCircle className="w-3.5 h-3.5" />
                Sorumlu Aranıyor
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Kartı Gör
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
