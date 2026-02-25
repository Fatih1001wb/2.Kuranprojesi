# Kuran-ı Kerim Uygulaması — Kurulum Kılavuzu

## Hızlı Başlangıç

```bash
# 1. ZIP'i aç, klasöre gir
cd quran-app

# 2. .env dosyası oluştur (Supabase bilgilerini doldur)
cp .env.example .env

# 3. Paketleri kur
npm install

# 4. Geliştirme sunucusunu başlat
npm start
```

---

## Supabase Kurulumu (5 dakika)

### 1. Proje Oluştur
1. https://supabase.com → GitHub ile ücretsiz giriş
2. **New Project** → Ad: `kuran-app` → Bölge: Europe (Frankfurt)

### 2. Veritabanı Tablolarını Kur
1. Sol menü → **SQL Editor** → New query
2. `supabase_kurulum.sql` içeriğini yapıştır → **Run**

### 3. .env Dosyasını Doldur
Settings → API sayfasından:
```
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Google ile Giriş

1. https://console.cloud.google.com → Yeni proje
2. APIs & Services → Credentials → OAuth 2.0 Client ID → Web application
3. Authorized redirect URIs:
   ```
   https://PROJE_ID.supabase.co/auth/v1/callback
   ```
4. Supabase → Authentication → Providers → **Google** → Enable → Client ID + Secret → Save

---

## GitHub ile Giriş

1. https://github.com/settings/developers → New OAuth App
2. Callback URL: `https://PROJE_ID.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → **GitHub** → Enable → Client ID + Secret → Save

---

## Kullanıcı Yönetimi

**Supabase Dashboard → Authentication → Users**

| Özellik | Nasıl yapılır |
|---------|---------------|
| Kullanıcıları görme | Authentication → Users |
| Giriş logları | Authentication → Logs |
| Kullanıcı silme | Users → ... → Delete |
| Yer işaretleri | Table Editor → yer_isaretleri |
| Okunanlar | Table Editor → okundu |

---

## Canlıya Alma (Netlify / Vercel)

```bash
npm run build
# build/ klasörünü Netlify'a sürükle
```

Environment Variables ekle:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

Supabase → Authentication → URL Configuration:
- Site URL: `https://siteadresin.netlify.app`
- Redirect URLs: `https://siteadresin.netlify.app/**`

---

## Ses Kaynakları

| Tür | Kaynak |
|-----|--------|
| Tam sure sesi | quranicaudio.com — Mishary Rashid Al-Afasy |
| Ayet bazlı ses | cdn.islamic.network — ar.alafasy |
| Kuran metni | api.alquran.cloud |
| Türkçe meal | api.alquran.cloud — tr.diyanet |
