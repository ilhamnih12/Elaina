const econ = require('../lib/economy');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb', 'rank'],
  version: '1.0.0',
  description: 'Lihat ranking top 10 terkaya',
  role: 0,
  
  execute(api, args, threadId, userInfo) {
    const users = econ.getLeaderboard(10);
    if (!users || users.length === 0) {
      api.sendMessage('❌ Belum ada data ekonomi', threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    let response = '🏆 Top 10 Terkaya\n━━━━━━━━━━━━━━━━━\n';
    users.forEach((user, index) => {
      response += `${index + 1}. ID: ${user.id}\n   💰 $${user.balance.toLocaleString('id-ID')}\n`;
    });
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✓ Leaderboard message sent');
    });
  }
};
