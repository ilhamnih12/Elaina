const UI = require('../lib/ui');

module.exports = {
  name: 'echo',
  aliases: ['say'],
  version: '0.9.0-bt',
  description: 'Mengulangi pesan yang kamu kirim',
  role: 0,
  category: 'Utility',
  cooldown: 2,
  
  execute(api, args, threadId, userInfo) {
    if (!args) {
      return api.sendMessage(UI.error('Berikan pesan untuk diulangi!'), threadId);
    }
    api.sendMessage(args, threadId);
  }
};
