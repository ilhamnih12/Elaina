const UI = require('../lib/ui');
const os = require('os');

module.exports = {
  name: 'sistem',
  aliases: ['sys', 'vps'],
  version: '1.1.0',
  description: 'Informasi sistem host bot',
  role: 0,
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);

    const content = [
      UI.item('Platform', os.platform()),
      UI.item('Arch', os.arch()),
      UI.item('Uptime', `${hours}j ${mins}m ${secs}d`),
      UI.item('RAM', `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`),
      UI.item('CPU', os.cpus()[0].model)
    ].join('\n');

    api.sendMessage(UI.box('System Information', content), threadId);
  }
};
