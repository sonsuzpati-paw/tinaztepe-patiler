/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Animal, AnimalType, AnimalStatus, User } from '../types';
import { CAMPUS_LOCATIONS } from '../mockData';
import { X, Plus, Image, PlusCircle, AlertCircle } from 'lucide-react';

interface AddAnimalModalProps {
  onClose: () => void;
  onAdd: (animal: Animal) => void;
  currentUser: User;
}

// Preset cat/dog photo suggestions for fast entry
const CAT_PRESETS = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511044568932-338cba0ad801?q=80&w=600&auto=format&fit=crop'
];

const DOG_PRESETS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop'
];

export default function AddAnimalModal({ onClose, onAdd, currentUser }: AddAnimalModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AnimalType>('kedi');
  const [gender, setGender] = useState<'erkek' | 'dişi' | 'bilinmiyor'>('bilinmiyor');
  const [isNeutered, setIsNeutered] = useState(false);
  const [age, setAge] = useState<'yavru' | 'genç' | 'yetişkin' | 'yaşlı'>('yetişkin');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [locationDetails, setLocationDetails] = useState('');
  const [status, setStatus] = useState<AnimalStatus>('sağlıklı');

  // Multi-photo URLs state
  const [photoInput, setPhotoInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!photoInput.trim()) return;
    if (!photoInput.startsWith('http://') && !photoInput.startsWith('https://')) {
      setErrorMsg('Lütfen geçerli bir internet bağlantı (http/https) adresi girin.');
      return;
    }
    setPhotos([...photos, photoInput.trim()]);
    setPhotoInput('');
    setErrorMsg('');
  };

  const handleApplyPreset = (url: string) => {
    if (photos.includes(url)) return;
    setPhotos([...photos, url]);
    setErrorMsg('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Lütfen hayvanın adını giriniz.');
      return;
    }

    // Default photo if none provided
    const finalPhotos = photos.length > 0 ? photos : [
      type === 'kedi' ? CAT_PRESETS[0] : DOG_PRESETS[0]
    ];

    const newAnimal: Animal = {
      id: 'animal_' + Date.now(),
      name: name.trim(),
      type,
      gender,
      isNeutered,
      age,
      location,
      locationDetails: locationDetails.trim() || undefined,
      photos: finalPhotos,
      status,
      createdAt: new Date().toISOString(),
      responsibleUserIds: [currentUser.id] // Auto become responsible
    };

    onAdd(newAnimal);
  };

  const presets = type === 'kedi' ? CAT_PRESETS : DOG_PRESETS;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Kampüse Yeni Dost Kaydet</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lütfen bulduğunuz ve takip etmek istediğiniz pati bilgilerini doldurun.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form Scroll */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* İsim */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hayvanın İsmi *</label>
              <input
                type="text"
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Örn: Zeytin, Çomar, Şero"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Tür */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tür *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('kedi');
                    setPhotos([]); // clear incompatible presets
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    type === 'kedi'
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  🐱 Kedi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('köpek');
                    setPhotos([]);
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    type === 'köpek'
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  🐶 Köpek
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cinsiyet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cinsiyet</label>
              <select
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="bilinmiyor">Bilinmiyor</option>
                <option value="dişi">Dişi (Dişi)</option>
                <option value="erkek">Erkek (Erkek)</option>
              </select>
            </div>

            {/* Kısır Durumu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kısırlaştırılmış mı?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsNeutered(true)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    isNeutered
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Evet
                </button>
                <button
                  type="button"
                  onClick={() => setIsNeutered(false)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    !isNeutered
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Hayır / Bilinmiyor
                </button>
              </div>
            </div>

            {/* Yaş Grubu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Yaş Ölçeği</label>
              <select
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={age}
                onChange={(e) => setAge(e.target.value as any)}
              >
                <option value="yavru">Yavru (Bebek)</option>
                <option value="genç">Genç</option>
                <option value="yetişkin">Yetişkin</option>
                <option value="yaşlı">Yaşlı / Emektar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lokasyon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tınaztepe Kampüs Bölgesi *</label>
              <select
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Yakın Bina Detayları */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bilinmesi Gereken Konum Detayı</label>
              <input
                type="text"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Örn: Kantin arkası banklar, Dekanlık girişi"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
              />
            </div>
          </div>

          {/* Sağlık Durumu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mevcut Durumu *</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['sağlıklı', 'hasta', 'tedavide', 'kayıp', 'acil'] as AnimalStatus[]).map((st) => {
                const getBtnStyle = () => {
                  if (status !== st) return 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
                  switch (st) {
                    case 'sağlıklı': return 'bg-emerald-600 text-white border-emerald-600';
                    case 'hasta': return 'bg-orange-600 text-white border-orange-600';
                    case 'tedavide': return 'bg-amber-500 text-slate-950 border-amber-500';
                    case 'kayıp': return 'bg-indigo-600 text-white border-indigo-600';
                    default: return 'bg-red-600 text-white border-red-650 animate-pulse'; // acil
                  }
                };
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border capitalize transition-all cursor-pointer ${getBtnStyle()}`}
                  >
                    {st === 'acil' ? '🔥 Acil' : st === 'sağlıklı' ? '🟢 Sağlıklı' : st === 'tedavide' ? '💊 Tedavide' : st === 'hasta' ? '🩺 Hasta' : '❓ Kayıp'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fotoğraflar Ekleme */}
          <div className="space-y-3 p-4.5 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Image className="w-4 h-4 text-emerald-600" /> Fotoğraf Albümü (En Az 1 Tane)
            </h4>

            {/* Preset Seçiciler */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Hızlı Başlamak İçin Hazır {type === 'kedi' ? 'Kedi' : 'Köpek'} Resimleri:</p>
              <div className="flex gap-2 flex-wrap">
                {presets.map((pUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleApplyPreset(pUrl)}
                    className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-indigo-500 transition-all cursor-pointer shrink-0"
                  >
                    <img src={pUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-black text-xs">
                      +
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                placeholder="Özel Fotoğraf Bağlantı Adresi (URL) girin..."
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Albme Ekle
              </button>
            </div>

            {/* Eklenmiş Fotoğraflar */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-200/40">
                {photos.map((ph, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={ph} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-semibold italic">
            * Kaydı tamamladığınızda otomatik olarak bu hayvanın sorumluları arasına ve ilk bakım günlüğünü oluşturanlara ekleneceksiniz.
          </p>

          {/* Footer Save */}
          <div className="border-t border-slate-100 pt-4.5 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              Dostumuzu Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
