const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'b'],
  version: '1.1.0',
  description: 'Cek saldo uang kamu',
  role: 0,
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const user = econ.getUser(userId);
    const skills = user.skills || {};
    const skillsText = Object.keys(skills).length === 0 ? '—' : Object.entries(skills).map(([k,v]) => `${k}:${v}`).join(', ');
    
    const displayName = econ.getDisplayName(userId, userInfo.name);
    
    const content = [
      UI.item('Nama', displayName),
      UI.item('Saldo', `$${user.balance.toLocaleString('id-ID')}`),
      UI.item('EXP', user.exp || 0),
      UI.item('Skills', skillsText)
    ].join('\n');

    api.sendMessage(UI.box('User Balance', content), threadId);
  }
};
