# 🤖 Facebook Messenger Bot (v0.9.1-bt)

Bot Facebook modern yang dibangun dengan Node.js dan library `mao-fca`. Hadir dengan sistem ekonomi terintegrasi, utilitas lengkap, game seru, dan antarmuka teks yang minimalis.

> **Status:** Beta (Minor Update 0.9.1)

## 🌟 Fitur Utama

- 💰 **Sistem Ekonomi:** Kerja, daily reward, training skill, dan transfer uang.
- 🎮 **Game Seru:** Slots, Roulette, RPS, dan lainnya untuk menambah saldo.
- 🛠️ **Utility Lengkap:** Kalkulator, konversi satuan, binary tool, dan banyak lagi.
- 📊 **Sistem Status:** Cek profil user dan statistik sistem dalam satu tempat.
- 📂 **Command Terkategori:** Navigasi bantuan yang lebih rapi dan mudah digunakan.
- ⚡ **Minimalis UI:** Menggunakan box-drawing characters untuk tampilan yang elegan di chat.

## 🚀 Instalasi & Setup

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Setup Appstate:**
   Ekstrak cookies Facebook Anda menjadi `appstate.json` dengan:
   ```bash
   npm run setup
   ```

3. **Jalankan Bot:**
   ```bash
   npm start
   ```

## 🎮 Command yang Tersedia

Gunakan prefix `/` untuk menjalankan perintah. Ketik `/help` untuk daftar lengkap.

### 🎮 Games
- `/slots` - Main mesin slot.
- `/roulette` - Taruhan warna roulette.
- `/rps` - Gunting Batu Kertas.
- `/coinbet` - Taruhan lempar koin.
- `/tebakangka` - Tebak angka 1-10.

### 📈 Economy
- `/status` - Cek profil, saldo, dan skill kamu.
- `/work` - Bekerja untuk mendapatkan uang.
- `/daily` - Klaim bonus harian.
- `/leaderboard` - Daftar user terkaya.
- `/train` - Tingkatkan skill untuk gaji lebih besar.
- `/transfer` - Kirim uang ke user lain.

### 🛠️ Utility
- `/calc` - Kalkulator matematika.
- `/dice` - Lempar dadu keberuntungan.
- `/flip` - Lempar koin (Heads/Tails).
- `/quote` - Kata-kata bijak hari ini.
- `/binary` - Encode/decode teks ke biner.
- `/password` - Generate password acak yang aman.
- `/unit` - Konversi satuan (cm, kg, suhu).

### ℹ️ Info
- `/help` - Tampilkan menu bantuan.
- `/sistem` - Info host bot, ping, dan uptime.
- `/info` - Tentang bot ini.
- `/uid` - Cek ID Facebook dan Thread.

### 🔐 Admin
- `/admin` - Kelola admin bot.
- `/restart` - Restart bot.
- `/stop` - Matikan bot.

## 🛠️ Struktur Project

```
├── cmd/                # Handler perintah bot
├── lib/                # Library inti (Economy, UI, etc.)
├── appstate.json       # Session login (Jangan dibagikan!)
├── config.json         # Konfigurasi admin
├── economy.json        # Database ekonomi (JSON)
└── bot.js              # Entry point utama
```

## ⚠️ Keamanan

- **JANGAN PERNAH** membagikan file `appstate.json` Anda. File ini berisi session login yang memungkinkan akses penuh ke akun Facebook Anda.
- Gunakan akun tumbal jika perlu untuk menghindari risiko checkpoint pada akun utama.

---
**Dibuat dengan ❤️ oleh Community**
