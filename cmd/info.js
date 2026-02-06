const UI = require('../lib/ui');

module.exports = {
  name: 'info',
  aliases: ['about'],
  version: '0.9.0-bt',
  description: 'Menampilkan informasi bot',
  role: 0,
  category: 'Info',
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const content = [
      UI.item('Nama Bot', 'Facebook Messenger Bot'),
      UI.item('Versi', '0.9.0-bt'),
      UI.item('Library', 'mao-fca'),
      UI.item('Status', 'Aktif'),
      '',
      'Bot ini dikembangkan untuk membantu manajemen grup dan hiburan.'
    ].join('\n');
    
    api.sendMessage(UI.box('Bot Information', content), threadId);
  }
};
