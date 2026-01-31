const econ = require('../lib/economy');

module.exports = {
  name: 'transfer',
  aliases: ['tf', 't'],
  version: '1.0.0',
  description: 'Transfer uang ke user lain',
  role: 0,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const argsSplit = (args || '').split(' ').filter(Boolean);
    const targetUserId = argsSplit[0];
    const amount = parseInt(argsSplit[1]);
    
    if (!targetUserId || isNaN(amount)) {
      const response = '❌ Gunakan: /transfer <user_id> <amount>\nContoh: /transfer 1234567890 500';
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    if (amount <= 0) {
      api.sendMessage('❌ Jumlah transfer harus lebih dari 0', threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    const sender = econ.getUser(userId);
    if (sender.balance < amount) {
      const response = `❌ Saldo tidak cukup! Saldo kamu: $${sender.balance.toLocaleString('id-ID')}`;
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    if (userId === targetUserId) {
      api.sendMessage('❌ Tidak bisa transfer ke diri sendiri', threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    // perform transfer
    const data = require('../lib/economy').loadEconomy();
    data.users[userId] = data.users[userId] || { balance: 1000, last_daily: 0, exp: 0, skills: {}, last_work: {} };
    data.users[targetUserId] = data.users[targetUserId] || { balance: 1000, last_daily: 0, exp: 0, skills: {}, last_work: {} };
    data.users[userId].balance -= amount;
    data.users[targetUserId].balance += amount;
    require('../lib/economy').saveEconomy(data);
    
    const response = `✅ Transfer berhasil!\n📤 Mengirim: $${amount.toLocaleString('id-ID')}\n📥 Ke: ${targetUserId}\n💰 Saldo kamu: $${data.users[userId].balance.toLocaleString('id-ID')}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✓ Transfer message sent');
    });
  }
};
