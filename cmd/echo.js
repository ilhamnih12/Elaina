module.exports = {
  name: 'echo',
  aliases: ['e'],
  version: '1.0.0',
  description: 'Ulang pesan yang dikirim',
  role: 0, // Semua user bisa akses
  
  execute(api, args, threadId, userInfo) {
    if (!args || args.trim().length === 0) {
      api.sendMessage('❌ Gunakan: /echo <pesan>', threadId);
      return;
    }
    
    const response = args;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Echo terkirim');
      }
    });
  }
};
