# Facebook Bot dengan mao-fca

Bot Facebook sederhana menggunakan library `mao-fca` dengan login menggunakan appstate.

## Fitur

- ✅ Login dengan appstate (menyimpan session)
- ✅ Auto-reply pesan
- ✅ Command system (!ping, !help, !time, !info)
- ✅ Event listener untuk pesan, read receipts, dan typing indicator
- ✅ Error handling

## Instalasi

```bash
npm install
```

## Setup Appstate

### Langkah 1: Extract Appstate dari Browser

Jalankan setup wizard:
```bash
npm run setup
```

Atau ikuti langkah manual:

1. **Login ke Facebook** di browser
2. **Buka DevTools** (tekan F12)
3. **Buka tab Console**
4. **Copy & paste script ini:**

```javascript
(async () => {
  const data = document.cookie
    .split("; ")
    .map(c => {
      const [name, value] = c.split("=");
      return {
        key: name,
        value: decodeURIComponent(value),
        domain: ".facebook.com",
        path: "/",
        expirationDate: Math.floor(Date.now() / 1000) + 86400 * 365
      };
    });
  console.log(JSON.stringify(data, null, 2));
})();
```

5. **Copy hasil output**
6. **Buat file `appstate.json`** di folder project
7. **Paste output ke dalamnya**

### Langkah 2: Jalankan Bot

```bash
npm start
```

Bot akan otomatis login menggunakan appstate.json yang tersimpan.

## Menjalankan Bot

```bash
# Jalankan sekali
npm start

# Jalankan dengan nodemon (auto-reload saat ada perubahan file)
npm run dev

# Setup appstate baru
npm run setup
```

## Command yang Tersedia

- `!ping` - Test bot (respons: Pong!)
- `!help` - Tampilkan bantuan
- `!time` - Tampilkan waktu saat ini
- `!info` - Informasi bot

## Struktur File

```
.
├── bot.js                # File utama bot
├── setup-appstate.js     # Tool untuk setup appstate
├── package.json          # Dependensi project
├── appstate.json         # Session data (otomatis dibuat)
└── README.md            # Dokumentasi
```

## Fitur Bot

### 1. Auto-Reply
Setiap pesan yang masuk akan di-echo/dibalas dengan pesan yang sama.

### 2. Command System
Pengguna bisa mengirim command dengan prefix `!`:
- Contoh: `!ping` untuk menjalankan command ping

### 3. Event Listener
Bot mendengarkan:
- `message` - Pesan baru masuk
- `message_read` - Pesan telah dibaca
- `typ` - Indikator user sedang mengetik

## Customisasi

### Mengubah Behavior Bot

Edit fungsi `handleMessage()` di `bot.js` untuk mengubah respons bot.

### Menambah Command Baru

Tambahkan case baru di fungsi `handleCommand()`:

```javascript
case 'namakamu':
  response = 'Saya adalah bot!';
  break;
```

## Keamanan

⚠️ **PENTING:**
- Jangan commit `appstate.json` ke repository
- Tambahkan `appstate.json` ke `.gitignore` (sudah ada)
- Jangan bagikan appstate.json dengan orang lain
- Appstate bisa di-extract dari browser, jaga keamanan akun!

## Troubleshooting

### "Cannot convert undefined or null to object"
- Appstate.json format tidak valid
- Jalankan `npm run setup` untuk extract appstate yang benar
- Pastikan appstate fresh (baru di-extract)

### "Appstate expired"
- Logout dari Facebook dan login kembali
- Extract appstate baru dengan `npm run setup`

### "Cannot find module 'mao-fca'"
```bash
npm install
```

## Dependencies

- `mao-fca` - Facebook Chat API (Unofficial)
- `fs-extra` - File system utilities

## Notes

- Bot hanya merespons di chat pribadi (direct message)
- Untuk group chat, modifikasi `handleMessage()` sesuai kebutuhan
- mao-fca adalah unofficial Facebook API, gunakan dengan bijak
- Appstate perlu di-refresh secara berkala jika expired

---

**Dibuat dengan ❤️ menggunakan Node.js**
