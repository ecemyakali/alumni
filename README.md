# 🎓 Alumni Tracking System (Mezun Takip Sistemi)

Modern, güvenilir ve ölçeklenebilir bir **Mezun Takip ve İletişim Sistemi** (Alumni Tracking System). Bu platform, mezunların kariyer gelişimlerini takip etmeyi, mezunlar ve kurumlar arasındaki iletişimi güçlendirmeyi ve mezun istatistiklerini raporlamayı hedefler.

---

## 🚀 Proje Hakkında

Bu proje, kurumların mezunları ile sürdürülebilir bağlar kurabilmesini, mezunların sektör ve iş bilgilerini güncel tutabilmesini ve kurum içi kariyer/ağ fırsatlarının yönetilmesini sağlayan bir web platformudur.

### 🌟 Temel Özellikler
- **Mezun Profil Yönetimi**: Kişisel bilgiler, eğitim geçmişi, mevcut iş ve pozisyon detayları.
- **Arama ve Filtreleme**: Bölüm, mezuniyet yılı, şirket, unvan ve şehir bazlı gelişmiş arama.
- **İletişim & Ağ Oluşturma**: Mezunlar ve öğrenci/öğretim görevlileri arasında köprü oluşturma.
- **Raporlama & İstatistikler**: Sektörel istihdam analizi ve mezun istatistikleri.
- **Yetkilendirme & Güvenlik**: Rol bazlı erişim kontrolü (Öğrenci, Mezun, Yönetici/Admin) ve güvenli kimlik doğrulama.

---

## 🛠️ Teknolojiler & Araçlar

Proje modern backend ve konteyner teknolojileri temel alınarak geliştirilmektedir:

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | Hızlı, asenkron ve modüler RESTful API mimarisi |
| **Veritabanı** | **PostgreSQL** | Güçlü, ilişkisel ve ACID uyumlu veri tabanı |
| **Konteynerleştirme** | **Docker & Docker Compose** | İzole geliştirme ortamı ve kolay dağıtım |
| **Sürüm Kontrolü** | **Git & GitHub** | Kod yönetimi, iş birliği ve versiyonlama |

---

## 📁 Proje Dizin Yapısı (Öngörülen)

```text
alumni/
├── docker/                 # Dockerfile ve ortam konfigürasyonları
│   └── Dockerfile
├── src/                    # Node.js backend kaynak kodları
│   ├── config/             # Veritabanı ve ortam konfigürasyonları
│   ├── controllers/        # İstek yönetimi (Request handlers)
│   ├── models/             # PostgreSQL veri modelleri / şemalar
│   ├── routes/             # API rotaları / endpointler
│   ├── services/           # İş mantığı (Business logic)
│   ├── middlewares/        # Hata yönetimi, auth filtreleri vb.
│   └── app.js              # Uygulama giriş noktası
├── .env.example            # Örnek ortam değişkenleri
├── .gitignore              # Git tarafından yoksayılacak dosyalar
├── docker-compose.yml      # Node.js + PostgreSQL konteyner orkestrasyonu
├── package.json            # Node.js bağımlılıkları ve scriptler
└── README.md               # Proje dokümantasyonu
```

---

## ⚙️ Kurulum ve Başlangıç

### 📋 Ön Koşullar
Sistemi yerel ortamınızda çalıştırmadan önce aşağıdaki araçların kurulu olduğundan emin olun:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir) & npm
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/) (Docker kullanılmadığı senaryolarda)

---

### 📥 1. Depoyu Klonlama

```bash
git clone https://github.com/ecemyakali/alumni.git
cd alumni
```

---

### 🐳 2. Docker ile Hızlı Başlatma (Önerilen)

Projeyi PostgreSQL ve Node.js servisleriyle birlikte tek komutla ayağa kaldırmak için:

```bash
# Servisleri arka planda başlat
docker compose up -d

# Logları izle
docker compose logs -f
```

---

### 💻 3. Manuel Yerel Geliştirme Ortamı

Eğer backend uygulamasını doğrudan ana makinenizde çalıştırmak isterseniz:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Ortam Değişkenlerini Tanımlayın:**
   `.env.example` dosyasını `.env` olarak kopyalayın ve PostgreSQL bağlantı bilgilerinizi girin:
   ```bash
   cp .env.example .env
   ```

   Örnek `.env` içeriği:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=alumni_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Uygulamayı Başlatın:**
   ```bash
   # Geliştirici modu (hot-reload)
   npm run dev

   # veya normal çalıştırma
   npm start
   ```

---

## 🗺️ Geliştirme Yol Haritası (Roadmap)

- [ ] Temel proje altyapısının kurulması (Express.js / Node.js)
- [ ] Docker ve Docker Compose konfigürasyonlarının oluşturulması
- [ ] PostgreSQL veritabanı şemasının tasarlanması ve migrasyonların yazılması
- [ ] Kimlik doğrulama (JWT / Auth) ve rol bazlı yetkilendirme modülü
- [ ] Mezun profil yönetimi CRUD API uç noktaları
- [ ] Arama ve filtreleme servisleri
- [ ] Testlerin (Unit / Integration) eklenmesi
- [ ] CI/CD iş akışlarının (GitHub Actions) tanımlanması

---

## 🤝 Katkıda Bulunma

1. Bu depoyu Fork'layın
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Yeni özellik eklendi'`)
4. Dalınıza push yapın (`git push origin feature/yeni-ozellik`)
5. Bir Pull Request (PR) açın

---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.
