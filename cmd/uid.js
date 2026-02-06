const UI = require('../lib/ui');

module.exports = {
  name: 'uid',
  aliases: ['id', 'me'],
  version: '0.9.1-bt',
  description: 'Cek User ID kamu',
  role: 0,
  category: 'Info',
  cooldown: 2,
  
  execute(api, args, threadId, userInfo) {
    const content = [
      UI.item('Nama', userInfo.name || 'Tidak diketahui'),
      UI.item('FB ID', userInfo.userId),
      UI.item('Thread ID', threadId)
    ].join('\n');
    
    api.sendMessage(UI.box('User Identity', content), threadId);
  }
};
