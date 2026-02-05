const UI = require('../lib/ui');

module.exports = {
  name: 'status',
  aliases: ['stats'],
  version: '1.1.0',
  description: 'Cek status koneksi bot',
  role: 0,
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const content = [
      UI.item('Koneksi', 'Terhubung'),
      UI.item('Ping', 'Stabil'),
      UI.item('Server', 'Singapura'),
      UI.item('Waktu', new Date().toLocaleString('id-ID'))
    ].join('\n');

    api.sendMessage(UI.box('Bot Status', content), threadId);
  }
};
