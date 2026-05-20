/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import {
  Shield,
  Key,
  UserCheck,
  Plus,
  SwitchCamera,
  LogOut,
  Phone,
  Mail,
  Upload,
  Loader2,
  Building,
  Car,
  FileText,
  User as UserIcon,
  Edit
} from 'lucide-react';
import { dbService } from '../supabaseService';

interface ProfilePanelProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export default function ProfilePanel({
  currentUser,
  onUserChange,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: ProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newWorkedPlace, setNewWorkedPlace] = useState('');
  const [newHasVehicle, setNewHasVehicle] = useState(false);
  const [newPersonalNotes, setNewPersonalNotes] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Edit form state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editWorkedPlace, setEditWorkedPlace] = useState('');
  const [editHasVehicle, setEditHasVehicle] = useState(false);
  const [editPersonalNotes, setEditPersonalNotes] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const startEdit = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditEmail(currentUser.email);
    setEditPhone(currentUser.phoneNumber || '');
    setEditPassword(currentUser.password || '123456');
    setEditWorkedPlace(currentUser.workedPlace || '');
    setEditHasVehicle(currentUser.hasVehicle || false);
    setEditPersonalNotes(currentUser.personalNotes || '');
    setEditAvatar(currentUser.avatar);
    setIsEditMode(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: 'register' | 'edit') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const file = files[0];
      const uploadedUrl = await dbService.uploadPhoto(file, 'profile_photos');
      if (mode === 'register') {
        setNewAvatar(uploadedUrl);
      } else {
        setEditAvatar(uploadedUrl);
      }
      setSuccessMsg('Profil fotoğrafı başarıyla yüklendi!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Fotoğraf yüklenirken bir sorun oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedUserId) {
      setErrorMsg('Lütfen giriş yapılacak profili seçin.');
      return;
    }

    const foundUser = users.find((u) => u.id === selectedUserId);
    if (!foundUser) {
      setErrorMsg('Kullanıcı bulunamadı.');
      return;
    }

    // Admin login validation
    if (foundUser.id === 'admin_sonsuz') {
      if (loginPassword === '25204' || loginPassword === '252049') {
        onUserChange(foundUser);
        setSuccessMsg('sonsuz (Admin) girişi başarıyla yapıldı!');
        setLoginPassword('');
        setSelectedUserId('');
      } else {
        setErrorMsg('Hatalı admin şifresi! Tekrar deneyin.');
      }
      return;
    }

    // Normal volunteer password check
    const userPassword = foundUser.password || '123456';
    if (loginPassword === userPassword) {
      onUserChange(foundUser);
      setSuccessMsg(`Hoş geldiniz, ${foundUser.name}!`);
      setLoginPassword('');
      setSelectedUserId('');
    } else {
      setErrorMsg('Hatalı şifre! Lütfen tekrar deneyin.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setErrorMsg('Lütfen isim, e-posta ve şifre alanlarını doldurun.');
      return;
    }

    if (newName.trim().toLowerCase() === 'sonsuz') {
      setErrorMsg('sonsuz ismiyle normal üye oluşturulamaz. Admin girişini kullanın.');
      return;
    }

    const defaultAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(newName)}`;

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      phoneNumber: newPhone.trim() || undefined,
      password: newPassword.trim(),
      workedPlace: newWorkedPlace.trim() || undefined,
      hasVehicle: newHasVehicle,
      personalNotes: newPersonalNotes.trim() || undefined,
      avatar: newAvatar || defaultAvatar,
      isAdmin: false
    };

    onAddUser(newUser);
    onUserChange(newUser);

    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setNewWorkedPlace('');
    setNewHasVehicle(false);
    setNewPersonalNotes('');
    setNewAvatar('');
    setSuccessMsg(`Profil başarıyla oluşturuldu ve giriş yapıldı: ${newUser.name}`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!editName.trim() || !editEmail.trim()) {
      setErrorMsg('İsim ve E-posta alanları boş bırakılamaz.');
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      name: editName.trim(),
      email: editEmail.trim(),
      phoneNumber: editPhone.trim() || undefined,
      password: editPassword.trim() || currentUser.password,
      workedPlace: editWorkedPlace.trim() || undefined,
      hasVehicle: editHasVehicle,
      personalNotes: editPersonalNotes.trim() || undefined,
      avatar: editAvatar || currentUser.avatar
    };

    onUpdateUser(updatedUser);
    setIsEditMode(false);
    setSuccessMsg('Profiliniz başarıyla güncellendi!');
  };

  return (
    <div id="profile-container" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Profil Yönetimi</h2>
          <p className="text-xs text-slate-500">
            {currentUser ? 'Giriş yapılmış durumda' : 'Ziyaretçi Modu (Giriş Gerekli)'}
          </p>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
            {currentUser.isAdmin ? (
              <span className="flex items-center gap-1 text-red-600">
                <Shield className="w-3.5 h-3.5" />
                Yönetici
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600">
                <UserCheck className="w-3.5 h-3.5" />
                Gönüllü
              </span>
            )}
          </div>
        )}
      </div>

      {successMsg && (
        <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex justify-between items-center transition-all animate-fade-in">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 bg-amber-50 text-amber-800 text-xs p-3 rounded-xl flex justify-between items-center transition-all animate-fade-in">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {currentUser ? (
        /* LOGGED IN VIEW */
        <div className="space-y-5">
          {isEditMode ? (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleEditSubmit} className="space-y-3.5 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5" /> Profil Bilgilerini Güncelle
              </h4>

              {/* Avatar upload */}
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-150">
                <img
                  src={editAvatar || currentUser.avatar}
                  alt="avatar preview"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <input
                    type="file"
                    id="edit-avatar-upload"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, 'edit')}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="edit-avatar-upload"
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isUploading
                        ? 'bg-slate-100 text-slate-400 border-slate-150 cursor-not-allowed'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        Fotoğraf Değiştir
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: 0532..."
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Giriş Şifresi</label>
                <input
                  type="password"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  placeholder="Profil giriş şifreniz"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Çalıştığı/Okuduğu Fakülte</label>
                <input
                  type="text"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: Mühendislik Fakültesi"
                  value={editWorkedPlace}
                  onChange={(e) => setEditWorkedPlace(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="edit-has-vehicle"
                  checked={editHasVehicle}
                  onChange={(e) => setEditHasVehicle(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <label htmlFor="edit-has-vehicle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  🚗 Nakil Desteği Sağlayabilirim (Araç Sahibiyim)
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Kişisel Notlar / Kendiniz Hakkında</label>
                <textarea
                  rows={2}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  placeholder="Veterinerlik öğrencisiyim, haftasonu müsaitim vb."
                  value={editPersonalNotes}
                  onChange={(e) => setEditPersonalNotes(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="w-full bg-slate-200 text-slate-700 text-xs py-2 rounded-lg font-bold hover:bg-slate-300 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          ) : (
            /* VIEW LOGGED IN PROFILE CARD */
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100/70">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full border-2 border-slate-200 bg-white object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 truncate">
                    {currentUser.name}
                    {currentUser.isAdmin && (
                      <span className="bg-red-100 text-red-800 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        ADM
                      </span>
                    )}
                  </h3>
                  <div className="space-y-1 mt-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </p>
                    {currentUser.phoneNumber && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{currentUser.phoneNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Extra details (Worked Place, Vehicle, Personal Notes) */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <p className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    <strong>Çalıştığı/Okuduğu Yer:</strong>{' '}
                    {currentUser.workedPlace || 'Girilmemiş'}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Araç Sahipliği:</strong>{' '}
                    {currentUser.hasVehicle ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        Evet (Araç Sahibiyim)
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                        Hayır
                      </span>
                    )}
                  </span>
                </p>

                {currentUser.personalNotes && (
                  <div className="pt-2 border-t border-slate-200/50">
                    <p className="font-bold flex items-center gap-1 text-slate-600 mb-1">
                      <FileText className="w-3.5 h-3.5" /> Hakkında / Kişisel Notlar
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed italic whitespace-pre-wrap">
                      &ldquo;{currentUser.personalNotes}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={startEdit}
                  className="w-full px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Profili Düzenle
                </button>
                <button
                  onClick={() => {
                    onUserChange(null);
                    setSuccessMsg('Oturum kapatıldı. Ziyaretçi moduna geçildi.');
                  }}
                  className="w-full px-3 py-2 bg-white hover:bg-slate-50 text-red-650 border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GUEST MODE VIEW (NOT LOGGED IN) */
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl text-center space-y-2 animate-fade-in">
            <UserIcon className="w-9 h-9 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Ziyaretçi Modu</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
              Şu an giriş yapmadınız. Tüm verileri serbestçe inceleyebilirsiniz fakat hayvan eklemek/düzenlemek ve rapor girmek için oturum açmalısınız.
            </p>
          </div>

          {/* Login / Register tabs */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-150 pb-2">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              🔑 Giriş Yap
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              ✍️ Yeni Profil Kaydı
            </button>
          </div>

          {activeTab === 'login' ? (
            /* GUEST: LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Giriş Yapılacak Profil</label>
                <select
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setErrorMsg('');
                  }}
                >
                  <option value="">Profil Seçin...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.isAdmin ? 'Yönetici' : 'Gönüllü'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Şifre / Pin Kodu</label>
                <input
                  type="password"
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Giriş şifrenizi yazın..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                {selectedUserId === 'admin_sonsuz' && (
                  <p className="text-[10px] text-red-650 mt-1">sonsuz (Admin) girişi için 6 haneli pin kodunuzu girin.</p>
                )}
                {selectedUserId && selectedUserId !== 'admin_sonsuz' && (
                  <p className="text-[10px] text-slate-400 mt-1">Gönüllü şifrenizi girin (Varsayılan: <strong>123456</strong>)</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 text-white text-xs py-2 rounded-lg font-bold hover:bg-slate-700 cursor-pointer transition-colors shadow-sm"
              >
                Profile Giriş Yap
              </button>
            </form>
          ) : (
            /* GUEST: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fade-in">
              {/* Avatar Upload */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 overflow-hidden">
                  {newAvatar ? (
                    <img src={newAvatar} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-indigo-500" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="register-avatar-upload"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, 'register')}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="register-avatar-upload"
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isUploading
                        ? 'bg-slate-100 text-slate-400 border-slate-150 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 text-slate-400" />
                        Fotoğraf Seç (Galeriden)
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: Elif Can"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: elif@deu.edu.tr"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Giriş Şifresi *</label>
                <input
                  type="password"
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Giriş için kullanacağınız şifre..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: 0532..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Çalışılan/Okunan Fakülte</label>
                <input
                  type="text"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Örn: Hukuk Fakültesi"
                  value={newWorkedPlace}
                  onChange={(e) => setNewWorkedPlace(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="register-has-vehicle"
                  checked={newHasVehicle}
                  onChange={(e) => setNewHasVehicle(e.target.checked)}
                  className="rounded text-indigo-650 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor="register-has-vehicle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  🚗 Nakil Desteği Sağlayabilirim (Araç Sahibiyim)
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kişisel Notlar</label>
                <textarea
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="Hayvan bakımı ve beslemesi ile ilgili notlar..."
                  value={newPersonalNotes}
                  onChange={(e) => setNewPersonalNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 text-white text-xs py-2 rounded-lg font-bold hover:bg-slate-700 cursor-pointer transition-colors shadow-sm"
              >
                Kaydol ve Giriş Yap
              </button>
            </form>
          )}
        </div>
      )}

      {/* Gönüllüler Listesi */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <SwitchCamera className="w-3.5 h-3.5" /> Kayıtlı Gönüllüler Listesi
        </h4>
        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
          {users.map((u) => {
            const isSelected = currentUser && u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  if (isSelected) return;
                  onUserChange(null);
                  setSelectedUserId(u.id);
                  setActiveTab('login');
                  setIsEditMode(false);
                  setErrorMsg('');
                  setSuccessMsg(`Oturum açmak için ${u.name} şifresi gerekli.`);
                }}
                className={`w-full flex items-center justify-between text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
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
                    <p className={`text-[9px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {u.workedPlace || (u.isAdmin ? 'Yönetici' : 'Gönüllü')}
                    </p>
                  </div>
                </div>
                {u.isAdmin ? (
                  <span className={`px-1 rounded text-[8px] font-black ${isSelected ? 'bg-red-950 text-red-205' : 'bg-red-100 text-red-800'}`}>
                    ADM
                  </span>
                ) : (
                  u.hasVehicle && (
                    <span className="text-[10px]" title="Araç Sahibi">🚗</span>
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin: Gönüllü Yönetim Paneli */}
      {currentUser?.isAdmin && (
        <div className="mt-5 pt-5 border-t border-red-100">
          <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Yönetici – Gönüllü Yönetimi
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {users.filter(u => !u.isAdmin).map((u) => (
              <div
                key={u.id}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 bg-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate max-w-[110px]">{u.name}</p>
                    <p className="text-[9px] text-slate-400 truncate max-w-[110px]">{u.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteUser(u.id)}
                  title={`${u.name} adlı gönüllüyü sil`}
                  className="ml-2 shrink-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[9px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Sil
                </button>
              </div>
            ))}
            {users.filter(u => !u.isAdmin).length === 0 && (
              <p className="text-[10px] text-slate-400 text-center py-2">Henüz kayıtlı gönüllü yok.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
