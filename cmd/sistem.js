const UI = require('../lib/ui');
const os = require('os');

module.exports = {
  name: 'sistem',
  aliases: ['sys', 'vps', 'ping'],
  version: '0.9.1-bt',
  description: 'Informasi sistem dan koneksi bot',
  role: 0,
  category: 'Info',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);

    const start = Date.now();
    api.sendMessage('Checking status...', threadId, (err, info) => {
      const end = Date.now();
      const latency = end - start;

      const content = [
        '━━━ KONEKSI ━━━',
        UI.item('Ping', `${latency}ms`),
        UI.item('Status', 'Aktif'),
        UI.item('Waktu', new Date().toLocaleString('id-ID')),
        '',
        '━━━ SISTEM ━━━',
        UI.item('Platform', os.platform()),
        UI.item('Arch', os.arch()),
        UI.item('Uptime', `${hours}j ${mins}m ${secs}d`),
        UI.item('RAM', `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`),
        UI.item('CPU', os.cpus()[0].model.trim())
      ].join('\n');

      api.sendMessage(UI.box('System Information', content), threadId);
    });
  }
};
