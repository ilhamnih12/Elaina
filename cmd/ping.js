module.exports = {
  name: 'ping',
  aliases: ['p'],
  version: '1.0.0',
  description: 'Tes bot dengan perintah ping',
  role: 0, // Semua user bisa akses
  
  execute(api, message, threadId, userInfo) {
    const response = 'Pong! 🏓';
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};
