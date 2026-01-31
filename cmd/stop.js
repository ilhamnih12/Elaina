module.exports = {
  name: 'stop',
  aliases: ['s'],
  version: '1.0.0',
  description: 'Stop bot',
  role: 2, // Hanya admin yang bisa akses
  
  execute(api, args, threadId, userInfo) {
    const response = '🛑 Bot sedang dihentikan...';
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
        // Tunggu sebentar sebelum stop
        setTimeout(() => {
          console.log('🛑 Stopping bot...');
          process.exit(0);
        }, 500);
      }
    });
  }
};
