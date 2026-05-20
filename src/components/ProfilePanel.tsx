/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Key, UserCheck, Plus, SwitchCamera, LogOut, Phone, Mail } from 'lucide-react';

interface ProfilePanelProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  users: User[];
  onAddUser: (user: User) => void;
}

export default function ProfilePanel({ currentUser, onUserChange, users, onAddUser }: ProfilePanelProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Yeni profil oluşturma state'i
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (adminPassword === '252049') {
      // Find or create admin profile
      let admin = users.find(u => u.id === 'admin_sonsuz');
      if (!admin) {
        admin = {
          id: 'admin_sonsuz',
          name: 'sonsuz (Admin)',
          email: 'sonsuz.pati@gmail.com',
          phoneNumber: '0555 123 4567',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop',
          isAdmin: true
        };
        onAddUser(admin);
      }
      onUserChange(admin);
      setSuccessMsg('sonsuz admin girişi başarıyla yapıldı!');
      setAdminPassword('');
      setIsAdminMode(false);
    } else {
      setErrorMsg('Hatalı admin şifresi! Tekrar deneyin.');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg('Lütfen isim ve e-posta alanlarını doldurun.');
      return;
    }

    // "sonsuz" ismiyle normal üye oluşturulmasını engelle (Çakışma olmasın)
    if (newName.trim().toLowerCase() === 'sonsuz') {
      setErrorMsg('Giriş yetkisi için sonsuz ismi şifre gerektirmektedir.');
      return;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: newName,
      email: newEmail,
      phoneNumber: newPhone || undefined,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(newName)}`,
      isAdmin: false
    };

    onAddUser(newUser);
    onUserChange(newUser);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowCreateForm(false);
    setSuccessMsg(`Profil başarıyla oluşturuldu: ${newUser.name}`);
  };

  return (
    <div id="profile-container" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Aktif Kullanıcı Profili</h2>
          <p className="text-xs text-slate-500">Giriş yetkisi, veri sorumluluğu ve mesaj yazma</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
          {currentUser.isAdmin ? (
            <span className="flex items-center gap-1 text-red-600">
              <Shield className="w-3.5 h-3.5" />
              Yönetici Modu
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600">
              <UserCheck className="w-3.5 h-3.5" />
              Gönüllü Üye
            </span>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex justify-between items-center transition-all">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 bg-amber-50 text-amber-800 text-xs p-3 rounded-xl flex justify-between items-center transition-all">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Aktif Kart */}
      <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100/70 mb-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-14 h-14 rounded-full border-2 border-slate-200 bg-white object-cover shadow-sm"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-md flex items-center gap-1.5">
            {currentUser.name}
            {currentUser.isAdmin && (
              <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                ADMIN
              </span>
            )}
          </h3>
          <div className="space-y-1 mt-1.5 text-xs text-slate-600">
            <p className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.email}
            </p>
            {currentUser.phoneNumber && (
              <p className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Aksiyon Butonları */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setIsAdminMode(false);
          }}
          className={`px-3 py-2 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            showCreateForm
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          Yeni Üye Ekle
        </button>

        <button
          onClick={() => {
            setIsAdminMode(!isAdminMode);
            setShowCreateForm(false);
          }}
          className={`px-3 py-2 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isAdminMode
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Yönetici Girişi
        </button>
      </div>

      {/* Yeni Profil Kaydı Paneli */}
      {showCreateForm && (
        <form onSubmit={handleCreateProfile} className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Gönüllü Kayıt Formu
          </h4>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ad Soyad *</label>
            <input
              type="text"
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              placeholder="Örn: Mehmet Can"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-posta Adresi *</label>
            <input
              type="email"
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              placeholder="Örn: mehmet@ogr.deu.edu.tr"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Telefon Numarası (Sorumlular İçin Önemli)</label>
            <input
              type="tel"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              placeholder="Örn: 0532..."
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white text-xs py-2 rounded-lg font-bold hover:bg-slate-700 cursor-pointer transition-colors"
          >
            Sisteme Giriş Yap ve Profil Oluştur
          </button>
        </form>
      )}

      {/* Admin Yetkilendirme Paneli */}
      {isAdminMode && (
        <form onSubmit={handleAdminLogin} className="mt-5 p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-3.5">
          <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" /> sonsuz Admin Onayı
          </h4>
          <div>
            <label className="block text-[11px] font-semibold text-red-900 mb-1">Admin Şifresi</label>
            <input
              type="password"
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-red-200 bg-white focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="6 haneli pin girin"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <p className="text-[10px] text-red-700 mt-1">Admin giriş kullanıcı ismi &apos;sonsuz&apos;, şifresi şifre panelinde verilendir.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-red-700 cursor-pointer transition-colors"
          >
            Şifreyi Doğrula ve Bağlan
          </button>
        </form>
      )}

      {/* Profil Havuzu / Değiştirici */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
          <SwitchCamera className="w-3.5 h-3.5" /> Gönüllü Ortam Listesi
        </h4>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {users.map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  onUserChange(u);
                  setSuccessMsg(`Kullanıcı değiştirildi: ${u.name}`);
                  setIsAdminMode(false);
                  setShowCreateForm(false);
                }}
                className={`w-full flex items-center justify-between text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-6 h-6 rounded-full object-cover bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <p className="font-semibold truncate max-w-[120px]">{u.name}</p>
                    <p className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {u.isAdmin ? 'Admin' : 'Gönüllü'}
                    </p>
                  </div>
                </div>
                {u.isAdmin && (
                  <span className={`px-1 rounded text-[9px] font-black ${isSelected ? 'bg-red-950 text-red-200' : 'bg-red-100 text-red-800'}`}>
                    ADM
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
