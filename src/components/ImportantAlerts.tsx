/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ImportantMessage, User } from '../types';
import { AlertCircle, AlertTriangle, Bell, Trash2, Megaphone, Plus, MessageSquare } from 'lucide-react';

interface ImportantAlertsProps {
  messages: ImportantMessage[];
  currentUser: User | null;
  onAddMessage: (msg: ImportantMessage) => void;
  onDeleteMessage: (id: string) => void;
}

export default function ImportantAlerts({ messages, currentUser, onAddMessage, onDeleteMessage }: ImportantAlertsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<'duyuru' | 'uyarı' | 'acil'>('duyuru');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newMessage: ImportantMessage = {
      id: 'alert_' + Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      userId: currentUser?.id || '',
      userName: currentUser?.name || 'Gönüllü',
      urgency
    };

    onAddMessage(newMessage);
    setTitle('');
    setContent('');
    setUrgency('duyuru');
    setShowAddForm(false);
  };

  const getUrgencyStyles = (level: 'duyuru' | 'uyarı' | 'acil') => {
    switch (level) {
      case 'acil':
        return {
          bg: 'bg-red-50 hover:bg-red-100/70 border-red-200',
          text: 'text-red-900',
          badge: 'bg-red-600 text-white',
          icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        };
      case 'uyarı':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200',
          text: 'text-amber-900',
          badge: 'bg-amber-500 text-slate-900',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        };
      default:
        return {
          bg: 'bg-blue-50 hover:bg-blue-100/70 border-blue-200',
          text: 'text-blue-900',
          badge: 'bg-blue-600 text-white',
          icon: <Bell className="w-5 h-5 text-blue-600 shrink-0" />
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-500" />
            Önemli Mesajlar & Duyurular
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Kampüs genelinde acil durum uyarısı, tedavi desteği veya genel duyurular yazabileceğiniz topluluk panosu.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              alert('Duyuru ekleyebilmek için lütfen giriş yapın!');
              return;
            }
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Geri Dön' : 'Yeni Duyuru Ekle'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-emerald-600" /> Duyuru Oluştur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Duyuru / Mesaj Başlığı *</label>
              <input
                type="text"
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Örn: Mamamız bitiyor yardım, Kedi evleri yer değişikliği"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Önem Seviyesi *</label>
              <select
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
              >
                <option value="duyuru">Duyuru / Bilgi (Mavi)</option>
                <option value="uyarı">Uyarı / Hassas Durum (Turuncu)</option>
                <option value="acil">Acil / Hayati Tehdit (Kırmızı)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ayrıntılı Mesaj İçeriği *</label>
            <textarea
              required
              rows={4}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
              placeholder="Gruptaki diğer arkadaşların bilmesini istediğiniz detayları, adresleri ve telefon numaralarını buraya açıkça yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              Mesajı Yayınla
            </button>
          </div>
        </form>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Henüz yayınlanmış önemli mesaj yok.</p>
          <p className="text-slate-400 text-xs mt-1">Gönüllüleri bilgilendirmek için ilk duyuruyu siz yazın!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const styles = getUrgencyStyles(msg.urgency);
            return (
              <div
                key={msg.id}
                className={`flex gap-4 p-5 rounded-2xl border transition-all ${styles.bg}`}
              >
                {styles.icon}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${styles.badge}`}>
                        {msg.urgency === 'acil' ? 'Hayati/Acil' : msg.urgency === 'uyarı' ? 'Uyarı' : 'Bilgi'}
                      </span>
                      <h4 className={`text-sm sm:text-base font-bold text-slate-800 ${styles.text}`}>
                        {msg.title}
                      </h4>
                    </div>

                    {currentUser?.isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
                            onDeleteMessage(msg.id);
                          }
                        }}
                        title="Duyuruyu Sil (Sadece Admin)"
                        className="text-red-600 hover:text-red-800 p-1 bg-red-105/50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 border-t border-slate-200/40 pt-2.5">
                    <p>Yazan: <span className="font-semibold text-slate-700">{msg.userName}</span></p>
                    <p>{new Date(msg.date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
