const UI = require('../lib/ui');

module.exports = {
  name: 'restart',
  aliases: ['res'],
  version: '0.9.0-bt',
  description: 'Restart bot (khusus admin)',
  role: 2,
  category: 'Admin',
  cooldown: 0,
  
  execute(api, args, threadId, userInfo) {
    api.sendMessage(UI.success('Sedang merestart bot...'), threadId, () => {
      process.exit(1); // PM2 atau script auto-restart akan menghidupkan kembali
    });
  }
};
