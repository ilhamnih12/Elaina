const UI = require('../lib/ui');

module.exports = {
  name: 'time',
  aliases: ['waktu', 'jam'],
  version: '1.1.0',
  description: 'Menampilkan waktu saat ini',
  role: 0,
  cooldown: 2,
  
  execute(api, args, threadId, userInfo) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    const content = [
      UI.item('Jam', timeStr),
      UI.item('Tanggal', dateStr),
      UI.item('Zona Waktu', 'WIB (GMT+7)')
    ].join('\n');

    api.sendMessage(UI.box('Current Time', content), threadId);
  }
};
