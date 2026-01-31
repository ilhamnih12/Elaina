module.exports = {
  name: 'restart',
  aliases: ['rs'],
  version: '1.0.0',
  description: 'Restart bot',
  role: 2, // Hanya admin yang bisa akses
  
  execute(api, args, threadId, userInfo) {
    const response = '🔄 Bot sedang di-restart...';
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
        // Tunggu sebentar sebelum restart
        setTimeout(() => {
          console.log('🔄 Restarting bot...');
          process.exit(1);
        }, 500);
      }
    });
  }
};
