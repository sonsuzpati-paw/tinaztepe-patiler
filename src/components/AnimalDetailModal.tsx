/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Animal, LogEntry, LogCategory, User, AnimalStatus } from '../types';
import { CAMPUS_LOCATIONS } from '../mockData';
import {
  X,
  MapPin,
  Heart,
  Pill,
  Activity,
  Apple,
  Stethoscope,
  MessageSquare,
  Shield,
  Trash2,
  Calendar,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Plus,
  Edit,
  Info
} from 'lucide-react';

interface AnimalDetailModalProps {
  animal: Animal;
  users: User[];
  logs: LogEntry[];
  currentUser: User;
  onClose: () => void;
  onUpdateAnimal: (updatedAnimal: Animal) => void;
  onDeleteAnimal: (animalId: string) => void;
  onAddLog: (newLog: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
}

export default function AnimalDetailModal({
  animal,
  users,
  logs,
  currentUser,
  onClose,
  onUpdateAnimal,
  onDeleteAnimal,
  onAddLog,
  onDeleteLog
}: AnimalDetailModalProps) {
  // Photo carousel index
  const [photoIndex, setPhotoIndex] = useState(0);

  // Filter logs for this animal
  const animalLogs = logs.filter((l) => l.animalId === animal.id);

  // New log entry state
  const [showLogForm, setShowLogForm] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logDesc, setLogDesc] = useState('');
  const [logCat, setLogCat] = useState<LogCategory>('beslenme');

  // Admin Master Edit Panel State
  const [showAdminEdit, setShowAdminEdit] = useState(false);
  const [editName, setEditName] = useState(animal.name);
  const [editLocation, setEditLocation] = useState(animal.location);
  const [editDetails, setEditDetails] = useState(animal.locationDetails || '');
  const [editGender, setEditGender] = useState(animal.gender);
  const [editNeutered, setEditNeutered] = useState(animal.isNeutered);
  const [editAge, setEditAge] = useState(animal.age || 'yetişkin');
  const [editStatus, setEditStatus] = useState(animal.status);

  const getCategoryDetails = (cat: LogCategory) => {
    switch (cat) {
      case 'hastalık':
        return { label: 'Hastalık Teşhisi', icon: <Stethoscope className="w-4 h-4 text-rose-600" />, bg: 'bg-rose-50 border-rose-100 text-rose-900' };
      case 'ilaç':
        return { label: 'İlaç Verme', icon: <Pill className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50 border-amber-100 text-amber-900' };
      case 'beslenme':
        return { label: 'Beslenme', icon: <Apple className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100 text-emerald-950' };
      case 'davranış':
        return { label: 'Davranış', icon: <Activity className="w-4 h-4 text-violet-600" />, bg: 'bg-violet-50 border-violet-100 text-violet-900' };
      default:
        return { label: 'Diğer', icon: <MessageSquare className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100 text-indigo-900' };
    }
  };

  const getStatusText = (st: AnimalStatus) => {
    switch (st) {
      case 'sağlıklı': return '🟢 Sağlıklı';
      case 'hasta': return '🩺 Hasta';
      case 'tedavide': return '💊 Tedavide';
      case 'kayıp': return '❓ Kayıp';
      default: return '🚨 ACİL YARDIM';
    }
  };

  // Sorumlu Kişi Bilgileri
  const responsibleUsers = users.filter((u) => animal.responsibleUserIds.includes(u.id));
  const isUserResponsible = animal.responsibleUserIds.includes(currentUser.id);

  // Toggle Responsibility
  const handleToggleResponsibility = () => {
    let updatedIds = [...animal.responsibleUserIds];
    if (isUserResponsible) {
      updatedIds = updatedIds.filter((id) => id !== currentUser.id);
    } else {
      updatedIds.push(currentUser.id);
    }

    const updatedAnimal: Animal = {
      ...animal,
      responsibleUserIds: updatedIds
    };
    onUpdateAnimal(updatedAnimal);
  };

  // Submit care log
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim() || !logDesc.trim()) return;

    const newLog: LogEntry = {
      id: 'log_' + Date.now(),
      animalId: animal.id,
      animalName: animal.name,
      category: logCat,
      title: logTitle.trim(),
      description: logDesc.trim(),
      date: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name
    };

    onAddLog(newLog);
    setLogTitle('');
    setLogDesc('');
    setLogCat('beslenme');
    setShowLogForm(false);
  };

  // Submit Admin Edit changes
  const handleAdminEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Animal = {
      ...animal,
      name: editName.trim(),
      location: editLocation,
      locationDetails: editDetails.trim() || undefined,
      gender: editGender,
      isNeutered: editNeutered,
      age: editAge,
      status: editStatus
    };
    onUpdateAnimal(updated);
    setShowAdminEdit(false);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % animal.photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + animal.photos.length) % animal.photos.length);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                {animal.name} Detaylı Takip Kartı
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">
                {animal.type === 'kedi' ? '🐱 Kedi' : '🐶 Köpek'} &bull; {getStatusText(animal.status)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser.isAdmin && (
              <button
                onClick={() => setShowAdminEdit(!showAdminEdit)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  showAdminEdit ? 'bg-indigo-65 text-indigo-700 border-indigo-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                Dost Bilgilerini Düzenle
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* main grid body layout */}
        <div className="flex-1 overflow-y-auto p-6">
          {showAdminEdit ? (
            /* ADMIN MASTER EDIT PANEL */
            <form onSubmit={handleAdminEditSubmit} className="space-y-4.5 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-4 h-4 text-indigo-600" /> Yönetimsel Özellikleri Düzenle
                </h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Admin Erişimi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dostumuzun Adı *</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durumu *</label>
                  <select
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                  >
                    <option value="sağlıklı">Sağlıklı</option>
                    <option value="hasta">Hasta</option>
                    <option value="tedavide">Tedavide</option>
                    <option value="kayıp">Kayıp</option>
                    <option value="acil">ACİL YARDIM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kampüs Bölgesi *</label>
                  <select
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konum Yakın Bina Detayları</label>
                  <input
                    type="text"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    placeholder="Kapı girişi, kantin yanı vb."
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cinsiyet</label>
                  <select
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                  >
                    <option value="bilinmiyor">Bilinmiyor</option>
                    <option value="dişi">Dişi</option>
                    <option value="erkek">Erkek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kısır Durumu</label>
                  <select
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editNeutered ? 'true' : 'false'}
                    onChange={(e) => setEditNeutered(e.target.value === 'true')}
                  >
                    <option value="true">Evet, kısırlaştırılmış</option>
                    <option value="false">Hayır, kısırlaştırılmamış / Bilinmiyor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yaş Sınıfı</label>
                  <select
                    className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value as any)}
                  >
                    <option value="yavru">Yavru (Bebek)</option>
                    <option value="genç">Genç</option>
                    <option value="yetişkin">Yetişkin</option>
                    <option value="yaşlı">Yaşlı</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`${animal.name} kaydını tamamen silmek istediğinizden emin misiniz?`)) {
                      onDeleteAnimal(animal.id);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Bu Hayvan Profilini Tamamen Sil
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminEdit(false)}
                    className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column (Photos, Metadata, Volunteers) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Photo Carousel */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center">
                  <img
                    src={animal.photos[photoIndex]}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {animal.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {photoIndex + 1} / {animal.photos.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Core characteristics */}
                <div className="bg-slate-50 p-4.5 rounded-2xl space-y-2.5 border border-slate-100 text-xs text-slate-700">
                  <div className="flex justify-between items-center border-b border-white pb-2">
                    <span className="font-bold text-slate-500">Yaş Ölçeği:</span>
                    <span className="font-bold capitalize text-slate-800">{animal.age || 'yetişkin'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2">
                    <span className="font-bold text-slate-500">Kısır Durumu:</span>
                    <span className="font-bold text-slate-800">{animal.isNeutered ? 'Evet, Kısırlaştırılmış' : 'Kısırlaştırılmamış'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2">
                    <span className="font-bold text-slate-500">Cinsiyet:</span>
                    <span className="font-bold text-slate-800 capitalize">{animal.gender}</span>
                  </div>
                  <div className="flex justify-between items-start pt-1">
                    <span className="font-bold text-slate-500 shrink-0">Ana Yaşam Alanı:</span>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-800 flex items-center gap-0.5 justify-end">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {animal.location}
                      </p>
                      {animal.locationDetails && (
                        <p className="text-[10px] text-slate-400 mt-0.5 whitespace-pre-line">{animal.locationDetails}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sorumlu Ol / Vazgeç Butonu */}
                <button
                  onClick={handleToggleResponsibility}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    isUserResponsible
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isUserResponsible ? 'fill-current' : ''}`} />
                  {isUserResponsible ? 'Bu Canın Sorumluluk Listesinden Çık' : 'Beni Sorumlular Listesine Ekle'}
                </button>

                {/* VOLUNTEER GUARDIANS CARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4.5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Sorumlu Gardiyanlar</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {responsibleUsers.length} Gönüllü
                    </span>
                  </h3>

                  {responsibleUsers.length === 0 ? (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 space-y-1.5 text-xs text-amber-800">
                      <p className="font-bold flex items-center gap-1">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        Sorumlu Kimse Yok!
                      </p>
                      <p className="text-[10.5px] leading-relaxed">
                        Bu hayvanın beslenmesi, aşıları ve günlük kontrolüyle ilgilenecek bir dosta ihtiyacı var. Sorumlu olmak için yukarıdaki butona basın.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto">
                      {responsibleUsers.map((u) => (
                        <div key={u.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover bg-slate-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 text-xs">
                            <h4 className="font-bold text-slate-800 flex items-center gap-1">
                              {u.name}
                              {u.isAdmin && (
                                <span className="bg-red-100 text-red-800 text-[9px] px-1 rounded">Admin</span>
                              )}
                            </h4>
                            <div className="text-[10.5px] text-slate-500 mt-1 space-y-0.5">
                              <p className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="truncate block max-w-[140px]" title={u.email}>{u.email}</span>
                              </p>
                              {u.phoneNumber && (
                                <p className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{u.phoneNumber}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (Care Updates Logs) */}
              <div className="lg:col-span-3 space-y-5">
                {/* CARE JOURNAL LOGS */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800">Bakım ve Gözlem Günlüğü</h3>
                      <p className="text-[10px] text-slate-400">Hayvana yapılan aşılar, tedaviler, mama gözlemleri</p>
                    </div>

                    <button
                      onClick={() => setShowLogForm(!showLogForm)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Giriş Ekle
                    </button>
                  </div>

                  {/* LOG ADD FORM */}
                  {showLogForm && (
                    <form onSubmit={handleLogSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Yeni Gözlem / Günlük Ekle
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Kategori *</label>
                          <select
                            className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                            value={logCat}
                            onChange={(e) => setLogCat(e.target.value as any)}
                          >
                            <option value="beslenme">Beslenme / Yemleme</option>
                            <option value="hastalık">Hastalık / Teşhis</option>
                            <option value="ilaç">İlaç Verme / Aşılama</option>
                            <option value="davranış">Davranış Durumu</option>
                            <option value="diğer">Diğer Konular / Notlar</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Başlık (Kısa özet) *</label>
                          <input
                            type="text"
                            required
                            className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                            placeholder="Örn: Kuduz aşısı yapıldı"
                            value={logTitle}
                            onChange={(e) => setLogTitle(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Detaylı Gözlem Metni *</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                          placeholder="Reçete detayları, gözlemlenen durumlar..."
                          value={logDesc}
                          onChange={(e) => setLogDesc(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setShowLogForm(false)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition-colors"
                        >
                          Günlüğü Ekle
                        </button>
                      </div>
                    </form>
                  )}

                  {/* JOURNAL LOG LIST */}
                  {animalLogs.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-1.5">
                      <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 text-xs font-semibold">Henüz bu can için gözlem günlüğü girilmemiş.</p>
                      <p className="text-[10px] text-slate-400 mt-1">İleride referans olması için mama ve aşı gözlemlerinizi girin!</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                      {animalLogs
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((log) => {
                          const catDet = getCategoryDetails(log.category);
                          return (
                            <div key={log.id} className="p-3.5 rounded-xl border border-slate-100/80 bg-slate-50/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${catDet.bg}`}>
                                    {catDet.icon}
                                    {catDet.label}
                                  </span>
                                  <h4 className="font-bold text-slate-850 text-xs sm:text-sm">
                                    {log.title}
                                  </h4>
                                </div>

                                {currentUser.isAdmin && (
                                  <button
                                    onClick={() => {
                                      if (confirm('Bu günlük girişini silmek istediğinizden emin misiniz?')) {
                                        onDeleteLog(log.id);
                                      }
                                    }}
                                    title="Günlüğü Sil (Sadece Admin)"
                                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                                {log.description}
                              </p>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-150 pt-2 pb-0.5">
                                <p>Yazar: <span className="font-semibold text-slate-600">{log.userName}</span></p>
                                <p className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(log.date).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
