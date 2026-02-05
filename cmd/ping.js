const UI = require('../lib/ui');

module.exports = {
  name: 'ping',
  aliases: [],
  version: '1.1.0',
  description: 'Cek respon bot',
  role: 0,
  cooldown: 2,
  
  execute(api, args, threadId, userInfo) {
    const start = Date.now();
    api.sendMessage('Pong! 🏓', threadId, (err, info) => {
      if (!err) {
        const end = Date.now();
        const latency = end - start;
        // Kita gunakan sendMessage tambahan karena editMessage tidak selalu tersedia di semua versi fca
        api.sendMessage(`⏱️ Latency: ${latency}ms`, threadId);
      }
    });
  }
};
