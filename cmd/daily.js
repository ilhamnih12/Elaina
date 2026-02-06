const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'daily',
  aliases: ['d'],
  version: '0.9.1-bt',
  description: 'Klaim bonus harian',
  role: 0,
  category: 'Economy',
  cooldown: 3,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const user = econ.getUser(userId);
    const now = Date.now();
    const dailyReward = 500;
    const cooldown = 24 * 60 * 60 * 1000; // 24 jam
    
    if (user.last_daily && (now - user.last_daily) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - user.last_daily)) / 1000 / 60 / 60);
      return api.sendMessage(UI.error(`Sudah klaim daily hari ini! Bisa klaim lagi dalam ${timeLeft} jam.`), threadId);
    }
    
    const data = econ.loadEconomy();
    econ.ensureUser(userId, data);
    const userUpdate = data.users[userId];
    userUpdate.balance += dailyReward;
    userUpdate.last_daily = now;
    userUpdate.exp = (userUpdate.exp || 0) + 20;
    econ.saveEconomy(data);
    
    const content = [
      UI.success('Bonus harian berhasil diklaim!'),
      UI.item('Dapat', `$${dailyReward.toLocaleString('id-ID')}`),
      UI.item('EXP', '+20'),
      UI.item('Total Saldo', `$${userUpdate.balance.toLocaleString('id-ID')}`)
    ].join('\n');
    
    api.sendMessage(UI.box('Daily Reward', content), threadId);
  }
};
