const UI = require('../lib/ui');

module.exports = {
  name: 'stop',
  aliases: ['shutdown', 'off'],
  version: '1.1.0',
  description: 'Matikan bot secara total (khusus admin)',
  role: 2,
  cooldown: 0,
  
  execute(api, args, threadId, userInfo) {
    api.sendMessage(UI.success('Bot akan dimatikan. Sampai jumpa!'), threadId, () => {
      process.exit(0);
    });
  }
};
