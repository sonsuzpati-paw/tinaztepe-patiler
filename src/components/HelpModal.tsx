/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[88vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-indigo-800 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Nasıl Kullanılır?</h2>
              <p className="text-emerald-100 text-xs font-semibold">DEÜ Tınaztepe Pati Takip – Kullanım Kılavuzu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 text-sm text-slate-700">

          {/* Giriş */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-emerald-800 font-semibold text-xs leading-relaxed">
              🐾 Bu uygulama, DEÜ Tınaztepe Kampüsü'ndeki kedi ve köpeklerin beslenme, sağlık durumu ve bakım takibini gönüllüler arasında koordineli yürütmek için tasarlanmıştır.
            </p>
          </div>

          {/* 1. Giriş */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">1</span>
              Giriş Yapma ve Profil Yönetimi
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">🔑 <span>Sol panelde <strong>"Giriş Yap"</strong> sekmesini açın, listeden profilinizi seçin ve şifrenizi girin.</span></li>
              <li className="flex items-start gap-2">✍️ <span>İlk kez kullanıyorsanız <strong>"Yeni Profil Kaydı"</strong> sekmesinden kendinize hesap oluşturun.</span></li>
              <li className="flex items-start gap-2">🔒 <span>Varsayılan şifre <strong>123456</strong>'dır. Güvenliğiniz için profil düzenleme kısmından değiştirin.</span></li>
              <li className="flex items-start gap-2">💾 <span>Giriş yapıldıktan sonra oturum <strong>tarayıcıda kaydedilir</strong> – her seferinde tekrar şifre girmeniz gerekmez.</span></li>
              <li className="flex items-start gap-2">📸 <span>Profil fotoğrafınızı <strong>galeriden seçerek</strong> yükleyebilirsiniz.</span></li>
              <li className="flex items-start gap-2">🚗 <span>Profilinizde çalıştığınız yer, telefon, araç sahipliği ve kişisel notlarınızı girebilirsiniz.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 2. Hayvan Takibi */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">2</span>
              Hayvan Kartları ve Sorumlu Panosu
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">📋 <span><strong>"Sorumlu Panosu"</strong> sekmesinde kampüsteki tüm kedi ve köpekleri görebilirsiniz.</span></li>
              <li className="flex items-start gap-2">🔍 <span>Hayvan adı, konum veya bina adıyla <strong>arama yapabilirsiniz</strong>.</span></li>
              <li className="flex items-start gap-2">🎛️ <span>Tür (kedi/köpek), bölge ve sağlık durumuna göre <strong>filtreleme yapabilirsiniz</strong>.</span></li>
              <li className="flex items-start gap-2">🐱 <span>Bir hayvan kartına tıklayarak <strong>detay sayfasına</strong> geçin – tüm geçmiş kayıtları ve fotoğrafları görebilirsiniz.</span></li>
              <li className="flex items-start gap-2">➕ <span>Giriş yaptıysanız <strong>"Yeni Pati Girişi Yap"</strong> butonu ile yeni bir hayvanı sisteme ekleyebilirsiniz.</span></li>
              <li className="flex items-start gap-2">🖼️ <span>Hayvan fotoğrafını <strong>galeriden yükleyebilir</strong> veya internet bağlantısından URL yapıştırabilirsiniz.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 3. Günlük Kayıtlar */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">3</span>
              Gözlem ve Günlük Kayıtları
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">📝 <span>Hayvanın detay sayfasından <strong>yeni gözlem kaydı</strong> ekleyebilirsiniz: beslenme, hastalık, ilaç, davranış vb.</span></li>
              <li className="flex items-start gap-2">📅 <span>Tüm gözlemler tarih sırasıyla listelenir – <strong>geçmiş sağlık takibi</strong> böylece kolay olur.</span></li>
              <li className="flex items-start gap-2">🗑️ <span>Yalnızca <strong>kendi eklediğiniz</strong> kayıtları silebilirsiniz (Yönetici tüm kayıtları silebilir).</span></li>
              <li className="flex items-start gap-2">⏱️ <span><strong>"Son Güncellemeler"</strong> sekmesinden tüm gönüllülerin son aktivitelerini zaman sırasıyla görebilirsiniz.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 4. Sorumluluk */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">4</span>
              Sorumluluk Listesi
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">❤️ <span>Hayvanın detay sayfasında <strong>"Sorumlu Ol"</strong> butonuna basarak o hayvanın takibini üstlenebilirsiniz.</span></li>
              <li className="flex items-start gap-2">📌 <span><strong>"Benim Sorumluluklarım"</strong> sekmesinde yalnızca sorumluluğunuzdaki hayvanları görürsünüz.</span></li>
              <li className="flex items-start gap-2">👥 <span>Bir hayvanın <strong>birden fazla sorumlusu</strong> olabilir – ekip koordinasyonu bu şekilde sağlanır.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 5. Önemli Duyurular */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">5</span>
              Önemli Duyurular
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">🔴 <span><strong>"Önemli"</strong> sekmesinden acil durumlar ve genel duyurular paylaşılır.</span></li>
              <li className="flex items-start gap-2">🚨 <span>Duyurular <strong>3 seviyede</strong> oluşturulabilir: Duyuru, Uyarı, Acil.</span></li>
              <li className="flex items-start gap-2">📢 <span>Giriş yapan her gönüllü duyuru oluşturabilir; yalnızca kendi duyurularını silebilir.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 6. Admin */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">🛡️</span>
              Yönetici (Admin) Yetkiler
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">🔐 <span>Admin girişi için profil listesinden <strong>sonsuz</strong> hesabını seçin ve pin kodunuzu girin.</span></li>
              <li className="flex items-start gap-2">👤 <span>Admin, sol paneldeki <strong>"Gönüllü Yönetimi"</strong> bölümünden kayıtlı gönüllüleri silebilir.</span></li>
              <li className="flex items-start gap-2">🗑️ <span>Admin, tüm hayvan kayıtlarını, gözlem günlüklerini ve duyuruları silebilir.</span></li>
              <li className="flex items-start gap-2">✏️ <span>Admin, herhangi bir hayvanın bilgilerini düzenleyebilir ve sağlık durumunu güncelleyebilir.</span></li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 7. İpuçları */}
          <section>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-slate-900 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-black shrink-0">💡</span>
              Faydalı İpuçları
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed pl-1">
              <li className="flex items-start gap-2">🌐 <span>Uygulama <strong>çevrimdışı modda</strong> da çalışır – veriler tarayıcı hafızasına kaydedilir, ancak diğer kullanıcılarla senkronize olmaz.</span></li>
              <li className="flex items-start gap-2">📱 <span>Mobil uyumludur – telefonunuzun tarayıcısından da rahatça kullanabilirsiniz.</span></li>
              <li className="flex items-start gap-2">🔄 <span>Veriyi diğer gönüllülerle <strong>gerçek zamanlı</strong> paylaşmak için Supabase bağlantısı kurulu olmalıdır.</span></li>
              <li className="flex items-start gap-2">🐾 <span>Her mama verdiğinizde, her ilaç uyguladığınızda <strong>kayıt eklemeyi unutmayın</strong> – bu takip çok önemli!</span></li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0 bg-slate-50/60">
          <p className="text-[10px] text-slate-400 font-semibold">Sorularınız için gönüllü ekip koordinatörüne ulaşabilirsiniz.</p>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer transition-colors"
          >
            Anladım, Kapat ✓
          </button>
        </div>
      </div>
    </div>
  );
}
