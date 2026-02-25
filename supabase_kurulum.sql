-- Kuran Uygulaması — Supabase SQL Kurulumu
-- Dashboard → SQL Editor → New query → Çalıştır

-- Yer İşaretleri
CREATE TABLE IF NOT EXISTS yer_isaretleri (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sure_numara   INTEGER NOT NULL,
  sure_ad       TEXT NOT NULL,
  tarih         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kullanici_id, sure_numara)
);

-- Okundu
CREATE TABLE IF NOT EXISTS okundu (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sure_numara   INTEGER NOT NULL,
  sure_ad       TEXT NOT NULL,
  tarih         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kullanici_id, sure_numara)
);

-- Hatimler
CREATE TABLE IF NOT EXISTS hatimler (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baslangic             TIMESTAMPTZ DEFAULT NOW(),
  bitis                 TIMESTAMPTZ,
  tamamlandi            BOOLEAN DEFAULT FALSE,
  tamamlanan_sure_sayisi INTEGER DEFAULT 0
);

-- RLS aktif et
ALTER TABLE yer_isaretleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE okundu         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hatimler       ENABLE ROW LEVEL SECURITY;

-- Yer İşaretleri politikaları
CREATE POLICY "yer_gor"  ON yer_isaretleri FOR SELECT USING (auth.uid() = kullanici_id);
CREATE POLICY "yer_ekle" ON yer_isaretleri FOR INSERT WITH CHECK (auth.uid() = kullanici_id);
CREATE POLICY "yer_sil"  ON yer_isaretleri FOR DELETE USING (auth.uid() = kullanici_id);

-- Okundu politikaları
CREATE POLICY "ok_gor"   ON okundu FOR SELECT USING (auth.uid() = kullanici_id);
CREATE POLICY "ok_ekle"  ON okundu FOR INSERT WITH CHECK (auth.uid() = kullanici_id);
CREATE POLICY "ok_sil"   ON okundu FOR DELETE USING (auth.uid() = kullanici_id);

-- Hatim politikaları
CREATE POLICY "hatim_gor"    ON hatimler FOR SELECT USING (auth.uid() = kullanici_id);
CREATE POLICY "hatim_ekle"   ON hatimler FOR INSERT WITH CHECK (auth.uid() = kullanici_id);
CREATE POLICY "hatim_guncelle" ON hatimler FOR UPDATE USING (auth.uid() = kullanici_id);
CREATE POLICY "hatim_sil"    ON hatimler FOR DELETE USING (auth.uid() = kullanici_id);
