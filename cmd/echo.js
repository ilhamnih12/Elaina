const UI = require('../lib/ui');

module.exports = {
  name: 'echo',
  aliases: ['say'],
  version: '1.1.0',
  description: 'Mengulangi pesan yang kamu kirim',
  role: 0,
  cooldown: 2,
  
  execute(api, args, threadId, userInfo) {
    if (!args) {
      return api.sendMessage(UI.error('Berikan pesan untuk diulangi!'), threadId);
    }
    api.sendMessage(args, threadId);
  }
};
