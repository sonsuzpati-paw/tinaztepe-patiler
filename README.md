# 🐾 DEÜ Tınaztepe Pati Takip Sistemi

Dokuz Eylül Üniversitesi Tınaztepe Kampüsü'nde yaşayan dostlarımızın (kedi ve köpeklerin) beslenmesini, tedavilerini ve günlük bakımlarını koordine etmek amacıyla geliştirilmiş, **canlı Supabase veritabanı** entegrasyonuna sahip, mobil uyumlu bir **Pati Takip ve Gönüllü Dayanışma Portalı**dır.

Bu uygulama sayesinde kampüsteki yüzlerce can dostumuzun durumunu tüm gönüllüler anlık olarak görebilir, güncellemeler yapabilir ve koordineli bir şekilde çalışabilir.

---

## ✨ Uygulama ile Neler Yapılabilir?

### 1. 🐶 Pati Kaydı ve Detaylı Haritalama
* **Yeni Pati Girişi:** Kampüse yeni gelen veya takibe alınması gereken kedi/köpeklerin ismini, türünü (Kedi/Köpek), cinsiyetini ve durumunu sisteme ekleyebilirsiniz.
* **Fotoğraf Desteği:** Her pati için birden fazla fotoğraf ekleyerek tanınmalarını kolaylaştırabilirsiniz.
* **Detaylı Konum Bilgisi:** Hayvanın sıklıkla bulunduğu kampüs bölgesini (Örn: Mühendislik Fakültesi, Kütüphane, Tınaztepe Girişi) seçebilir ve yakınındaki bina adı gibi detayları girebilirsiniz.

### 2. 🩺 Ortak Günlük (Log) ve Tedavi Takibi
Her hayvanın kendi profil kartı altında, tüm gönüllülerin görebileceği ve ekleme yapabileceği bir tarihçe yer alır:
* **Hastalık Takibi:** Yaşanan sağlık sorunlarını kaydedebilirsiniz.
* **İlaç Verme:** Verilen ilaçların adını, saatini ve dozunu yazarak diğer gönüllülerin mükerrer ilaç vermesini engelleyebilirsiniz.
* **Beslenme Kaydı:** Hangi bölgenin ne zaman beslendiğini takip edebilirsiniz.
* **Davranış Notları:** Hayvanın karakteri veya o günkü ruh hali hakkında notlar düşebilirsiniz (Örn: "Bugün biraz durgun", "İnsanlara karşı çok sevecen").

### 3. 📢 Anlık Önemli Duyurular (Kritik Mesajlar)
* Kampüsteki acil durumları (Örn: *"Mühendislik önünde yaralı bir kedi var, acil klinik desteği lazım"*, *"Mamamız bitmek üzere"*) ana ekrandaki **Önemli Duyurular** sekmesinden tüm kullanıcılara anında duyurabilirsiniz.

### 4. 🔍 Gelişmiş Arama ve Filtreleme
* Yüzlerce pati arasından aradığınız dostumuzu; **hayvan ismi**, **bölge adı**, **yakın bina adı** veya **durum** (Sağlıklı, Tedavide, Kayıp vb.) yazarak anında bulabilirsiniz.
* Tek tıkla sadece **Kedi** veya sadece **Köpek** listelemeleri yapabilirsiniz.

### 5. 🔒 Güvenli Yönetici Yetkilendirmesi (Admin)
* Veri güvenliğini korumak amacıyla; kayıt silme ve mevcut bilgileri kalıcı olarak düzenleme yetkisi sadece **Yöneticilere (Admin)** verilmiştir.
* `admin_sonsuz` kullanıcısı veya şifre kodu olan **`25204`** ile giriş yapan yöneticiler silme ve düzenleme yapabilir. Diğer gönüllüler ise veri ekleme ve güncel durum bildirimi yapabilir.

---

## 📱 Uygulama Kullanım Kılavuzu

### 🚀 Telefona Kurulum ve Giriş
1. Sitenin adresini telefonunuzun tarayıcısında (Safari veya Chrome) açın.
2. Tarayıcı menüsünden **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğini seçin. Uygulama artık telefonunuzda bağımsız bir mobil uygulama gibi çalışacaktır.
3. Sağ üst köşede bulunan **Profil** alanından kendi adınızı seçerek veya yeni bir gönüllü profili oluşturarak sistemi kullanmaya başlayabilirsiniz.

### ➕ Yeni Bir Pati Kaydetme
1. Ana ekrandaki yeşil **"Pati Ekle"** butonuna basın.
2. Patinin adını, türünü (Kedi/Köpek), cinsiyetini ve durumunu seçin.
3. Sıklıkla bulunduğu kampüs konumunu seçip, altına ayırt edici bina adını yazın (Örn: *Mühendislik A Blok arkasındaki çardaklar*).
4. Hayvanın fotoğraflarını ve ayırt edici özelliklerini yazıp **"Kaydet"** deyin.

### 📝 Tedavi, Beslenme ve İlaç Günlüğü Ekleme
1. Güncelleme yapmak istediğiniz hayvanın kartına tıklayarak detay penceresini açın.
2. **"Yeni Günlük Girişi Ekle"** butonuna basın.
3. Kategoriyi seçin (İlaç Verme, Beslenme, Hastalık, Davranış vb.).
4. Yaptığınız işlemi detaylıca yazıp kaydedin. Eklediğiniz not, tarih ve isminizle birlikte hayvanın tarihçesine anında eklenecektir.

---

## 🛠️ Geliştiriciler İçin Kurulum ve Dağıtım

### Yerel Çalıştırma (Local Development)
Projeyi bilgisayarınızda çalıştırmak için:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. `.env` adında bir dosya oluşturup Supabase anahtarlarınızı girin:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
3. Yerel sunucuyu başlatın:
   ```bash
   npm run dev
   ```

### Canlıya Güncelleme Gönderme (GitHub Pages Deployment)
Kodlarda bir değişiklik yaptıktan veya güncelledikten sonra sitenizi güncellemek için terminalde şu komutu çalıştırmanız yeterlidir:
```bash
npm run deploy
```
*Bu komut projenizi otomatik olarak derleyip canlı sitenizi (`https://sonsuzpati-paw.github.io/tinaztepe-patiler/`) güncelleyecektir.*

---

🐾 *Dokuz Eylül Üniversitesi Tınaztepe Kampüsü'ndeki patili dostlarımızın yaşam kalitesini artırmak için katkıda bulunan tüm gönüllülerimize teşekkür ederiz!*
