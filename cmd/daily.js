const econ = require('../lib/economy');

module.exports = {
  name: 'daily',
  aliases: ['d'],
  version: '1.0.0',
  description: 'Klaim bonus harian',
  role: 0,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const user = econ.getUser(userId);
    const now = Date.now();
    const dailyReward = 500;
    const cooldown = 24 * 60 * 60 * 1000; // 24 jam
    
    if (user.last_daily && (now - user.last_daily) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - user.last_daily)) / 1000 / 60 / 60);
      const response = `⏰ Sudah klaim daily hari ini!\nBisa klaim lagi dalam ${timeLeft} jam`;
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    const data = econ.loadEconomy();
    econ.ensureUser(userId, data);
    const userUpdate = data.users[userId];
    userUpdate.balance += dailyReward;
    userUpdate.last_daily = now;
    userUpdate.exp = (userUpdate.exp || 0) + 20;
    econ.saveEconomy(data);
    
    const newUser = userUpdate;
    const response = `🎁 Bonus harian klaim!\n💸 Dapat: $${dailyReward.toLocaleString('id-ID')}\n⭐ EXP +20\n💰 Total saldo: $${newUser.balance.toLocaleString('id-ID')}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✓ Daily message sent');
    });
  }
};
