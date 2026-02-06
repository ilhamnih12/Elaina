const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb', 'top'],
  version: '1.1.0',
  description: 'Tampilkan 10 user terkaya',
  role: 0,
  cooldown: 10,
  
  execute(api, args, threadId, userInfo) {
    const topUsers = econ.getLeaderboard(10);

    if (topUsers.length === 0) {
      return api.sendMessage(UI.error('Belum ada data user di leaderboard.'), threadId);
    }
    
    const content = topUsers.map((u, index) => {
      const name = u.name || u.fbId;
      return `${index + 1}. ${name} - $${u.balance.toLocaleString('id-ID')}`;
    }).join('\n');
    
    api.sendMessage(UI.box('Rich Leaderboard', content), threadId);
  }
};
