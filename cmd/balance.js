const econ = require('../lib/economy');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'b'],
  version: '1.0.0',
  description: 'Cek saldo uang kamu',
  role: 0, // Semua user bisa akses
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const user = econ.getUser(userId);
    const skills = user.skills || {};
    const skillsText = Object.keys(skills).length === 0 ? '—' : Object.entries(skills).map(([k,v]) => `${k}:${v}`).join(', ');
    
    const response = `💰 Saldo: $${user.balance.toLocaleString('id-ID')}\n⭐ EXP: ${user.exp || 0}\n🛠 Skills: ${skillsText}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✓ Balance message sent');
    });
  }
};
