module.exports = {
  name: 'uid',
  aliases: ['u'],
  version: '1.0.0',
  description: 'Tampilkan user ID Anda',
  role: 0, // Semua user bisa akses
  
  execute(api, args, threadId, userInfo) {
    const response = `👤 User ID Anda: ${userInfo.userId}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};
