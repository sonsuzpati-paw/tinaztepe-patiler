/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Animal, LogEntry, ImportantMessage, User, AnimalStatus } from './types';
import {
  INITIAL_USERS,
  CAMPUS_LOCATIONS
} from './mockData';
import ProfilePanel from './components/ProfilePanel';
import ImportantAlerts from './components/ImportantAlerts';
import RecentUpdates from './components/RecentUpdates';
import AnimalCard from './components/AnimalCard';
import AddAnimalModal from './components/AddAnimalModal';
import AnimalDetailModal from './components/AnimalDetailModal';
import { dbService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';
import {
  Heart,
  Search,
  Plus,
  Compass,
  AlertOctagon,
  Clock,
  MapPin,
  ClipboardList,
  Filter,
  CheckCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

export default function App() {
  // --- Persistent Storage State ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // default to guest (null)
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<ImportantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Search & Filters State ---
  const [activeTab, setActiveTab] = useState<'animals' | 'updates' | 'important' | 'my_responsibilities'>('animals');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- Modals Toggle State ---
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAddAnimal, setShowAddAnimal] = useState(false);

  // Load initial data from dbService (Supabase with LocalStorage fallback)
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [loadedUsers, loadedAnimals, loadedLogs, loadedAlerts] = await Promise.all([
          dbService.getUsers(),
          dbService.getAnimals(),
          dbService.getLogs(),
          dbService.getAlerts()
        ]);
        
        setUsers(loadedUsers);
        setAnimals(loadedAnimals);
        setLogs(loadedLogs);
        setAlerts(loadedAlerts);

        // Load current user session
        const savedCurrentUser = localStorage.getItem('tinaztepe_current_user');
        if (savedCurrentUser) {
          const parsed = JSON.parse(savedCurrentUser);
          const found = loadedUsers.find(u => u.id === parsed.id);
          if (found) {
            setCurrentUser(found);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null); // Guest mode
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // --- Handlers & Actions ---

  const handleUserChange = (u: User | null) => {
    setCurrentUser(u);
    if (u) {
      localStorage.setItem('tinaztepe_current_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('tinaztepe_current_user');
    }
  };

  const handleAddUser = async (u: User) => {
    try {
      await dbService.saveUser(u);
      setUsers((prev) => [...prev, u]);
    } catch (err) {
      console.error(err);
      alert('Kullanıcı eklenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await dbService.saveUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        localStorage.setItem('tinaztepe_current_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error(err);
      alert('Profil güncellenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleAddAnimal = async (newAnimal: Animal) => {
    if (!currentUser) {
      alert('Yeni pati eklemek için lütfen giriş yapın.');
      return;
    }
    try {
      await dbService.saveAnimal(newAnimal);
      setAnimals((prev) => [newAnimal, ...prev]);

      // Otomatik olarak bir ilk gözlem günlüğü oluştur
      const initialLog: LogEntry = {
        id: 'log_' + Date.now() + '_init',
        animalId: newAnimal.id,
        animalName: newAnimal.name,
        category: 'diğer',
        title: `${newAnimal.name} Kampüs Kayıt Sistemine Eklendi`,
        description: `${newAnimal.name} adlı dostumuz, ${currentUser.name} tarafından ${newAnimal.location} bölgesinde sisteme eklenmiştir. Durum: ${newAnimal.status.toUpperCase()}`,
        date: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name
      };

      await dbService.saveLog(initialLog);
      setLogs((prev) => [initialLog, ...prev]);
      setShowAddAnimal(false);
    } catch (err) {
      console.error(err);
      alert('Yeni pati eklenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleUpdateAnimal = async (updatedAnimal: Animal) => {
    try {
      await dbService.saveAnimal(updatedAnimal);
      setAnimals((prev) => prev.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a)));

      // Eğer detay modalı açıksa, o anki görüntüyü de güncelle
      if (selectedAnimal && selectedAnimal.id === updatedAnimal.id) {
        setSelectedAnimal(updatedAnimal);
      }
    } catch (err) {
      console.error(err);
      alert('Pati güncellenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    try {
      await dbService.deleteAnimal(id);
      setAnimals((prev) => prev.filter((a) => a.id !== id));
      // İlgili hayvanın tüm loglarını da temizle
      setLogs((prev) => prev.filter((l) => l.animalId !== id));
      setSelectedAnimal(null);
    } catch (err) {
      console.error(err);
      alert('Pati kaydı silinirken bir veritabanı hatası oluştu.');
    }
  };

  const handleAddLog = async (newL: LogEntry) => {
    try {
      await dbService.saveLog(newL);
      setLogs((prev) => [newL, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Günlük kaydı eklenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await dbService.deleteLog(logId);
      setLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch (err) {
      console.error(err);
      alert('Günlük kaydı silinirken bir veritabanı hatası oluştu.');
    }
  };

  const handleAddAlert = async (newAlert: ImportantMessage) => {
    try {
      await dbService.saveAlert(newAlert);
      setAlerts((prev) => [newAlert, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Duyuru eklenirken bir veritabanı hatası oluştu.');
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await dbService.deleteAlert(alertId);
      setAlerts((prev) => prev.filter((m) => m.id !== alertId));
    } catch (err) {
      console.error(err);
      alert('Duyuru silinirken bir veritabanı hatası oluştu.');
    }
  };

  const handleSelectAnimalById = (animalId: string) => {
    const found = animals.find((a) => a.id === animalId);
    if (found) {
      setSelectedAnimal(found);
    }
  };

  // --- Filtering Pipeline ---
  const filteredAnimals = animals.filter((animal) => {
    const query = searchQuery.trim().toLowerCase();

    // İsme, bölgeye ve yakın bina detaylarına göre arama yapar
    const matchesQuery =
      animal.name.toLowerCase().includes(query) ||
      animal.location.toLowerCase().includes(query) ||
      (animal.locationDetails && animal.locationDetails.toLowerCase().includes(query));

    const matchesType = typeFilter === 'all' || animal.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || animal.location === locationFilter;
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;

    return matchesQuery && matchesType && matchesLocation && matchesStatus;
  });

  // Kullanıcının kendi sorumluluğundaki hayvanlar
  const myResponsibleAnimals = currentUser
    ? animals.filter((animal) => animal.responsibleUserIds.includes(currentUser.id))
    : [];

  // --- Campus General Dashboard Stats ---
  const totalCats = animals.filter((a) => a.type === 'kedi').length;
  const totalDogs = animals.filter((a) => a.type === 'köpek').length;
  const criticalNeedCount = animals.filter((a) => a.status === 'acil' || a.status === 'hasta').length;
  const activeSorumlularCount = users.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🐾</div>
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Veritabanı Yükleniyor...</h2>
          <p className="text-xs text-slate-550 font-semibold">Tınaztepe can dostlarımızın verileri güvenli bulut sunucusundan çekiliyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans leading-normal tracking-normal pb-12">
      {/* Top Main Navigation Banner */}
      <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-indigo-900 text-white shadow-md relative overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-64 h-64 bg-white/5 rounded-full translate-y-24 -translate-x-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-3xl animate-bounce">🐾</span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight select-none">
                  DEÜ Tınaztepe Pati Takip
                </h1>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm font-semibold max-w-xl">
                Dokuz Eylül Üniversitesi Tınaztepe Kampüsü&apos;ndeki can dostlarımızın beslenme, sağlık ve sorumluluk takibinde gönüllü koordinasyon kiti.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="text-center px-1.5 border-r border-white/10 last:border-r-0">
                <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Kedi</p>
                <p className="text-lg font-black">{totalCats} 🐱</p>
              </div>
              <div className="text-center px-1.5 border-r border-white/10 last:border-r-0">
                <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Köpek</p>
                <p className="text-lg font-black">{totalDogs} 🐶</p>
              </div>
              <div className="text-center px-1.5 border-r border-white/10 last:border-r-0">
                <p className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">Hassas / Hasta</p>
                <p className="text-lg font-black text-rose-200">{criticalNeedCount} 🩹</p>
              </div>
              <div className="text-center px-1.5">
                <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Gönüllü Ekip</p>
                <p className="text-lg font-black">{activeSorumlularCount} 👥</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Mode Banner Alert */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 text-xs text-center font-bold flex items-center justify-center gap-1.5">
          <span>⚠️ Uygulama yerel deneme modunda çalışıyor. Ortak bulut veritabanını aktif etmek için lütfen Supabase API anahtarlarını girin!</span>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 items-start">
          {/* LEFT PANEL: Core Profile Switcher & Fast Admin Gate */}
          <div className="lg:col-span-1 space-y-6">
            <ProfilePanel
              currentUser={currentUser}
              onUserChange={handleUserChange}
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
            />

            {/* Quick Informative Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" /> Kampüs Yerel Destek
              </h3>
              <p className="text-xs text-indigo-100 leading-relaxed font-semibold">
                Tınaztepe kampüsümüzde yüzden fazla kedi ve köpek yaşamaktadır. Onların sağlığı, beslenmesi, aşı takipleri ve tedavileri tamamen biz gönüllülerin omuzlarındadır.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-200 font-bold">
                Lütfen her mama besleme veya kaput kontrolü uyarısını son güncellemelere ekleyin!
              </div>
            </div>
          </div>

          {/* RIGHT/CENTER MAIN TABS DASHBOARD */}
          <div className="lg:col-span-3 space-y-6">
            {/* TABS SELECTOR RAILS */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('animals')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'animals'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                📋 Sorumlu Panosu
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'updates'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                ⏱️ Son Güncellemeler
              </button>

              <button
                onClick={() => setActiveTab('important')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                  activeTab === 'important'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                🔴 Önemli
                {alerts.length > 0 && (
                  <span className="absolute top-2.5 right-2 min-w-4.5 h-4.5 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                    {alerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('my_responsibilities')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'my_responsibilities'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-4 h-4" />
                ❤️ Benim Sorumluluklarım
              </button>
            </div>

            {/* TAB CONTENTS */}

            {/* TAB 1: Animals & Cards Engine */}
            {activeTab === 'animals' && (
              <div className="space-y-6">
                {/* Search Bar and Advanced Combobox filters */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:flex-1">
                      <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        className="w-full text-xs pl-11 pr-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-1 focus:ring-slate-450 bg-slate-50/50"
                        placeholder="Hayvan ismi, yer, fakülte, kantin veya yakın bina adı ile arayın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {currentUser ? (
                      <button
                        onClick={() => setShowAddAnimal(true)}
                        className="cursor-pointer text-xs font-bold fill-white bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors w-full sm:w-auto justify-center"
                      >
                        <Plus className="w-4.5 h-4.5" />
                        Yeni Pati Girişi Yap
                      </button>
                    ) : (
                      <button
                        disabled
                        className="text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200/60 px-5 py-3 rounded-xl flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-not-allowed"
                        title="Yeni pati eklemek için lütfen giriş yapın."
                      >
                        <Plus className="w-4.5 h-4.5 text-slate-350" />
                        Pati Girişi (Giriş Yapın)
                      </button>
                    )}
                  </div>

                  {/* Advanced Filters Combobox */}
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 text-xs items-center">
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-slate-450" /> Süzgeçler:
                    </span>

                    {/* Tür filtresi */}
                    <div className="flex items-center gap-1">
                      <select
                        className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="all">Tüm Türler (Hepsi)</option>
                        <option value="kedi">Sadece Kediler 🐱</option>
                        <option value="köpek">Sadece Köpekler 🐶</option>
                      </select>
                    </div>

                    {/* Lokasyon filtresi */}
                    <div className="flex items-center gap-1">
                      <select
                        className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-slate-400 max-w-[200px] font-medium"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      >
                        <option value="all">Tüm Kampüs Bölgeleri</option>
                        {CAMPUS_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sağlık Durumu filtresi */}
                    <div className="flex items-center gap-1">
                      <select
                        className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">Tüm Sağlık Durumları</option>
                        <option value="sağlıklı">🟢 Sağlıklı</option>
                        <option value="hasta">🩺 Hasta</option>
                        <option value="tedavide">💊 Tedavide</option>
                        <option value="kayıp">❓ Kayıp</option>
                        <option value="acil">🚨 ACİL YARDIM</option>
                      </select>
                    </div>

                    {(searchQuery || typeFilter !== 'all' || locationFilter !== 'all' || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setTypeFilter('all');
                          setLocationFilter('all');
                          setStatusFilter('all');
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Filtreleri Sıfırla
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid Lists layout */}
                {filteredAnimals.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-4xl">🔍</span>
                    <h3 className="font-bold text-slate-800 text-md mt-4">Aradığınız kriterlere uygun can bulunamadı.</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Arama kelimenizi kısaltmayı deneyebilir veya yeni bir patiyi sisteme dahil edebilirsiniz!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnimals.map((animal) => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        users={users}
                        onSelect={setSelectedAnimal}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Recent Updates Timeline */}
            {activeTab === 'updates' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <RecentUpdates
                  logs={logs}
                  onSelectAnimal={(id) => {
                    handleSelectAnimalById(id);
                    // Hayvanı detaya açınca Sorumlu Panosu sekmesine geri alabilir ya da modalı direk üstüne açabilir!
                    // Biz modalı direk üstüne açıyoruz, bu harika
                  }}
                />
              </div>
            )}

            {/* TAB 3: Important Alerts Bulletin Board */}
            {activeTab === 'important' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <ImportantAlerts
                  messages={alerts}
                  currentUser={currentUser}
                  onAddMessage={handleAddAlert}
                  onDeleteMessage={handleDeleteAlert}
                />
              </div>
            )}

            {/* TAB 4: Personal Volunteer Responsibilities */}
            {activeTab === 'my_responsibilities' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-100/60 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-teal-900 flex items-center gap-1.5">
                      <Heart className="w-5 h-5 text-teal-650 fill-teal-650 animate-pulse" />
                      Sorumluluğum Altındaki Can Dostlarımız
                    </h2>
                    <p className="text-teal-750 text-xs mt-1">
                      Özel ilgi listenize eklediğiniz, beslenmesini, tedavilerini ve durumlarını saniye saniye takip etmek için sahiplendiğiniz canlar.
                    </p>
                  </div>
                  <span className="bg-teal-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                    {myResponsibleAnimals.length} Can Dost
                  </span>
                </div>

                {myResponsibleAnimals.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-4xl">❤️</span>
                    <h3 className="font-bold text-slate-800 text-md mt-4">Şu an sorumluluk listenizde hiç hayvan bulunmuyor.</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Herhangi bir kedi veya köpeğin detay kartına girerek oradaki &ldquo;Beni Sorumlular Listesine Ekle&rdquo; butonu ile takibe başlayabilirsiniz!
                    </p>
                    <button
                      onClick={() => setActiveTab('animals')}
                      className="mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl scale-95 hover:scale-100 transition-all cursor-pointer"
                    >
                      Dostları İncele
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myResponsibleAnimals.map((animal) => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        users={users}
                        onSelect={setSelectedAnimal}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODALS OVERLAYS INTERACTION --- */}

      {/* 1. Add Campus Animal Modal Overlay */}
      {showAddAnimal && (
        <AddAnimalModal
          currentUser={currentUser}
          onClose={() => setShowAddAnimal(false)}
          onAdd={handleAddAnimal}
        />
      )}

      {/* 2. Detail & Historic Journal Modal Overlay */}
      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          users={users}
          logs={logs}
          currentUser={currentUser}
          onClose={() => setSelectedAnimal(null)}
          onUpdateAnimal={handleUpdateAnimal}
          onDeleteAnimal={handleDeleteAnimal}
          onAddLog={handleAddLog}
          onDeleteLog={handleDeleteLog}
        />
      )}
    </div>
  );
}
