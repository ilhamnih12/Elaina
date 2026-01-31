module.exports = {
  name: 'time',
  aliases: ['tm'],
  version: '1.0.0',
  description: 'Tampilkan waktu saat ini',
  role: 0, // Semua user bisa akses
  
  execute(api, message, threadId, userInfo) {
    const response = `🕐 Waktu saat ini: ${new Date().toLocaleString('id-ID')}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};
