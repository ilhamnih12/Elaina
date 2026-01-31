module.exports = {
  name: 'info',
  aliases: ['i'],
  version: '1.0.0',
  description: 'Tampilkan informasi bot',
  role: 0, // Semua user bisa akses
  
  execute(api, message, threadId, userInfo) {
    const response = `ℹ️ Bot Facebook - Menggunakan mao-fca
Versi: 1.0.0
Status: Online 🟢`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};
